import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// ── 타입 ──────────────────────────────────────────────────────────────────

interface McpCandidate {
  token: string
  cssVar: string
  value: string
}

interface McpDiffItem {
  category: string
  status: 'pass' | 'fail' | 'warn' | 'skip'
  comparisonMode: 'token' | 'value'
  mcpCandidates: McpCandidate[]
  domToken?: string
  domValue: string
  matchedToken?: string
  figmaValue?: string
  delta?: number
  note?: string
}

type ReportData = Record<string, McpDiffItem[]>

interface ComponentStat {
  qaId: string
  group: string
  fail: number
  warn: number
  pass: number
  skip: number
  items: McpDiffItem[]
}

interface CommonPattern {
  category: string
  domToken: string
  figmaToken: string
  figmaValue: string
  domValue: string
  count: number
  affectedIds: string[]
}

// ── 그룹 분류 ──────────────────────────────────────────────────────────────

function getGroup(qaId: string): string {
  if (qaId.startsWith('btn-icon')) return 'ButtonIconOnly'
  if (qaId.startsWith('btn-')) return 'Button'
  if (qaId.startsWith('input-')) return 'Input'
  if (qaId.startsWith('lnb')) return 'LNB'
  if (qaId.startsWith('modal')) return 'Modal'
  return 'Other'
}

const GROUP_ORDER = ['Button', 'ButtonIconOnly', 'Input', 'LNB', 'Modal', 'Other']

// ── 데이터 처리 ────────────────────────────────────────────────────────────

function processData(raw: ReportData) {
  const components: ComponentStat[] = Object.entries(raw).map(([qaId, items]) => {
    const fail = items.filter(i => i.status === 'fail').length
    const warn = items.filter(i => i.status === 'warn').length
    const pass = items.filter(i => i.status === 'pass').length
    const skip = items.filter(i => i.status === 'skip').length
    return { qaId, group: getGroup(qaId), fail, warn, pass, skip, items }
  })

  // 공통 이슈 패턴 탐지
  const patternMap = new Map<string, CommonPattern>()
  for (const { qaId, items } of components) {
    for (const item of items) {
      if (item.status !== 'fail') continue
      const figmaToken = item.mcpCandidates?.[0]?.cssVar
      const figmaValue = item.mcpCandidates?.[0]?.value ?? ''
      if (!figmaToken || !item.domToken) continue
      if (item.domToken === figmaToken) continue

      const key = `${item.category}|${item.domToken}|${figmaToken}`
      const existing = patternMap.get(key)
      if (existing) {
        existing.count++
        existing.affectedIds.push(qaId)
      } else {
        patternMap.set(key, {
          category: item.category,
          domToken: item.domToken,
          figmaToken,
          figmaValue,
          domValue: item.domValue,
          count: 1,
          affectedIds: [qaId],
        })
      }
    }
  }

  const commonPatterns = [...patternMap.values()]
    .filter(p => p.count >= 3)
    .sort((a, b) => b.count - a.count)

  // 전체 통계
  const totalFail = components.reduce((s, c) => s + c.fail, 0)
  const totalWarn = components.reduce((s, c) => s + c.warn, 0)
  const totalPass = components.reduce((s, c) => s + c.pass, 0)
  const totalSkip = components.reduce((s, c) => s + c.skip, 0)

  // 그룹별 통계
  const groupStats = new Map<string, { fail: number; warn: number; pass: number; skip: number; ids: string[] }>()
  for (const c of components) {
    const gs = groupStats.get(c.group) ?? { fail: 0, warn: 0, pass: 0, skip: 0, ids: [] }
    gs.fail += c.fail
    gs.warn += c.warn
    gs.pass += c.pass
    gs.skip += c.skip
    gs.ids.push(c.qaId)
    groupStats.set(c.group, gs)
  }

  return { components, commonPatterns, totalFail, totalWarn, totalPass, totalSkip, groupStats }
}

// ── HTML 헬퍼 ──────────────────────────────────────────────────────────────

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function colorDot(hex: string): string {
  if (!hex.startsWith('#')) return ''
  return `<span class="cdot" style="background:${esc(hex)}"></span>`
}

function tokenLabel(cssVar: string, value: string): string {
  const isHex = value.startsWith('#')
  const dot = isHex ? colorDot(value) : ''
  return `${dot}<code>${esc(cssVar)}</code>`
}

// ── 카드 렌더링 ────────────────────────────────────────────────────────────

function renderDiffItem(item: McpDiffItem): string {
  const dotClass = { pass: 'dot-pass', fail: 'dot-fail', warn: 'dot-warn', skip: 'dot-skip' }[item.status]

  if (item.status === 'pass') {
    const tokenName = item.matchedToken ?? item.domToken ?? item.domValue
    return `
      <div class="diff-row">
        <span class="sdot ${dotClass}"></span>
        <div class="diff-body">
          <span class="cat">${esc(item.category)}</span>
          <span class="diff-pass">${esc(tokenName)} ✓</span>
        </div>
      </div>`
  }

  if (item.status === 'skip') {
    return `
      <div class="diff-row">
        <span class="sdot ${dotClass}"></span>
        <div class="diff-body">
          <span class="cat">${esc(item.category)}</span>
          <span class="diff-skip">${esc(item.note ?? 'skip')}</span>
        </div>
      </div>`
  }

  // fail / warn
  const figmaCandidate = item.mcpCandidates?.[0]
  let figmaLine = ''
  let domLine = ''

  if (item.comparisonMode === 'token' && figmaCandidate && item.domToken) {
    figmaLine = `<span class="lbl">Figma</span> ${tokenLabel(figmaCandidate.cssVar, figmaCandidate.value)}`
    domLine   = `<span class="lbl">DOM</span> <code>${esc(item.domToken)}</code>`
  } else if (figmaCandidate) {
    const figVal = item.figmaValue ?? figmaCandidate.value
    const domVal = item.domValue
    const deltaStr = item.delta != null ? ` (Δ${item.delta > 0 ? '+' : ''}${item.delta})` : ''
    figmaLine = `<span class="lbl">Figma</span> <code>${esc(String(figVal))}</code>`
    domLine   = `<span class="lbl">DOM</span> <code>${esc(String(domVal))}${esc(deltaStr)}</code>`
  } else {
    domLine = `<code>${esc(item.domValue)}</code>`
    if (item.note) figmaLine = `<span class="diff-skip">${esc(item.note)}</span>`
  }

  return `
    <div class="diff-row">
      <span class="sdot ${dotClass}"></span>
      <div class="diff-body">
        <span class="cat">${esc(item.category)}</span>
        <div class="diff-tokens">
          <div class="t-figma">${figmaLine}</div>
          <div class="t-dom">${domLine}</div>
        </div>
      </div>
    </div>`
}

function renderCard(comp: ComponentStat): string {
  const hasFail = comp.fail > 0 || comp.warn > 0
  const cardClass = hasFail ? 'card has-fail' : 'card all-pass'

  const badgeFail = comp.fail > 0 ? `<span class="badge b-fail">🔴 fail ${comp.fail}</span>` : ''
  const badgeWarn = comp.warn > 0 ? `<span class="badge b-warn">🟡 warn ${comp.warn}</span>` : ''
  const badgePass = !hasFail ? `<span class="badge b-pass">✅ ALL PASS</span>` :
    (comp.pass > 0 ? `<span class="badge b-pass">pass ${comp.pass}</span>` : '')
  const badgeSkip = comp.skip > 0 ? `<span class="badge b-skip">skip ${comp.skip}</span>` : ''

  // fail/warn 먼저, pass는 묶어서, skip은 마지막
  const failItems = comp.items.filter(i => i.status === 'fail' || i.status === 'warn')
  const passItems = comp.items.filter(i => i.status === 'pass')
  const skipItems = comp.items.filter(i => i.status === 'skip')

  const passTokens = passItems.map(i => i.matchedToken ?? i.domToken ?? i.category).join(', ')
  const passRow = passItems.length > 0 ? `
    <div class="diff-row">
      <span class="sdot dot-pass"></span>
      <div class="diff-body">
        <span class="cat pass-cats">${esc(passTokens)}</span>
        <span class="diff-pass">✓</span>
      </div>
    </div>` : ''

  const skipRow = skipItems.length > 0 ? `
    <div class="diff-row">
      <span class="sdot dot-skip"></span>
      <div class="diff-body">
        <span class="diff-skip">${skipItems.length}개 속성 skip</span>
      </div>
    </div>` : ''

  const devStatusKey = `dev:${comp.qaId}`
  const storageInit = `initDevStatus('${esc(comp.qaId)}')`

  return `
  <div class="${esc(cardClass)}"
       data-qa="${esc(comp.qaId)}"
       data-group="${esc(comp.group)}"
       data-fail="${comp.fail + comp.warn}"
       data-dev="open">
    <div class="card-head">
      <div class="card-id">${esc(comp.qaId)}</div>
      <div class="card-badges">${badgeFail}${badgeWarn}${badgePass}${badgeSkip}</div>
    </div>
    <div class="card-body">
      ${failItems.map(renderDiffItem).join('')}
      ${passRow}
      ${skipRow}
    </div>
    <div class="card-foot">
      <span class="dev-label">개발 상태</span>
      <select class="dev-select" id="dev-${esc(comp.qaId)}" onchange="saveDevStatus('${esc(comp.qaId)}', this)">
        <option value="open">🔴 Open</option>
        <option value="inprogress">🟡 In Progress</option>
        <option value="fixed">✅ Fixed</option>
      </select>
    </div>
  </div>`
}

// ── 공통 이슈 카드 ─────────────────────────────────────────────────────────

function renderCommonCard(p: CommonPattern): string {
  const isHex = p.figmaValue.startsWith('#')
  const domIsHex = p.domValue.startsWith('#')

  const figmaDot = isHex ? colorDot(p.figmaValue) : ''
  const domDot   = domIsHex ? colorDot(p.domValue) : ''

  const chips = p.affectedIds.slice(0, 6).map(id => `<span class="chip">${esc(id)}</span>`).join('')
  const more  = p.affectedIds.length > 6 ? `<span class="chip chip-more">+${p.affectedIds.length - 6}</span>` : ''

  return `
  <div class="common-card">
    <div class="cc-head">
      <span class="cc-cat">${esc(p.category)}</span>
      <span class="cc-count">${p.count}개 영향</span>
    </div>
    <div class="token-diff">
      <div class="tk-block">
        <div class="tk-src">Figma (기대값)</div>
        <div class="tk-val t-figma">${figmaDot}<code>${esc(p.figmaToken)}</code></div>
      </div>
      <div class="tk-block">
        <div class="tk-src">DOM (실제값)</div>
        <div class="tk-val t-dom">${domDot}<code>${esc(p.domToken)}</code></div>
      </div>
    </div>
    <div class="cc-affected">${chips}${more}</div>
  </div>`
}

// ── 전체 HTML 생성 ────────────────────────────────────────────────────────

function generateHtml(
  raw: ReportData,
  reportPath: string,
): string {
  const { components, commonPatterns, totalFail, totalWarn, totalPass, totalSkip, groupStats } =
    processData(raw)

  const totalProps = totalFail + totalWarn + totalPass + totalSkip
  const runDate = new Date().toISOString().slice(0, 10)
  const relPath = path.relative(ROOT, reportPath)

  // 사이드바 아이템
  const sidebarItems = GROUP_ORDER.filter(g => groupStats.has(g)).map(g => {
    const gs = groupStats.get(g)!
    const badgeClass = gs.fail + gs.warn > 0 ? 'sbadge' : 'sbadge zero'
    const count = gs.fail + gs.warn
    const countStr = count > 0 ? `${count} fail` : '✓'
    return `
    <div class="sitem" onclick="filterGroup('${esc(g)}')" data-group="${esc(g)}">
      <span class="sname">${esc(g)}</span>
      <span class="${badgeClass}">${countStr}</span>
    </div>`
  }).join('')

  // 컴포넌트 섹션
  const sections = GROUP_ORDER.filter(g => groupStats.has(g)).map(g => {
    const gs = groupStats.get(g)!
    const groupComponents = components.filter(c => c.group === g)
    const cards = groupComponents.map(renderCard).join('')
    const failBadge = gs.fail + gs.warn > 0
      ? `<span class="mini-badge b-fail">fail ${gs.fail + gs.warn}</span>` : ''
    const passBadge = `<span class="mini-badge b-pass">pass ${gs.pass}</span>`
    const skipBadge = gs.skip > 0 ? `<span class="mini-badge b-skip">skip ${gs.skip}</span>` : ''

    return `
  <section class="comp-section" id="sec-${esc(g)}" data-group="${esc(g)}">
    <div class="sec-head">
      <span class="sec-name">${esc(g)}</span>
      <div class="sec-stats">${failBadge}${passBadge}${skipBadge}</div>
    </div>
    <div class="cards-grid">${cards}</div>
  </section>`
  }).join('')

  // 공통 이슈 섹션
  const commonSection = commonPatterns.length > 0 ? `
  <section class="comp-section" id="sec-common">
    <div class="sec-head">
      <span class="sec-name">🔗 공통 이슈</span>
      <span class="sec-sub">동일 토큰 불일치 3건 이상 · ${commonPatterns.length}개 패턴</span>
    </div>
    <div class="common-grid">
      ${commonPatterns.map(renderCommonCard).join('')}
    </div>
  </section>` : ''

  const groupFilterBtns = GROUP_ORDER.filter(g => groupStats.has(g)).map(g =>
    `<button class="fbtn" onclick="filterGroup('${esc(g)}')" data-gf="${esc(g)}">${esc(g)}</button>`
  ).join('')

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Hiworks DS · QA Report · ${runDate}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,'Pretendard',sans-serif;background:#f5f5f7;color:#1d1d1f;font-size:13px;line-height:1.4}

/* ── 헤더 ── */
.hdr{background:#fff;border-bottom:1px solid #e5e5e7;padding:16px 24px;position:sticky;top:0;z-index:100}
.hdr-row{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px}
.hdr-title{font-size:15px;font-weight:700}
.hdr-meta{font-size:11px;color:#8a8a8e;margin-top:2px}
.hdr-date{font-size:11px;color:#8a8a8e;white-space:nowrap}
.stats{display:flex;gap:8px;flex-wrap:wrap}
.sc{display:flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600}
.sc-fail{background:#fff1f0;color:#cf1322}
.sc-warn{background:#fffbe6;color:#d46b08}
.sc-pass{background:#f6ffed;color:#389e0d}
.sc-skip{background:#f5f5f5;color:#8a8a8e}
.sc-total{background:#eef2ff;color:#3730a3}

/* ── 필터 바 ── */
.fbar{background:#fff;border-bottom:1px solid #e5e5e7;padding:8px 24px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;position:sticky;top:73px;z-index:99}
.flabel{font-size:11px;color:#8a8a8e;margin-right:2px}
.fbtn{padding:3px 11px;border-radius:14px;border:1px solid #d9d9d9;background:#fff;font-size:12px;cursor:pointer;color:#555;transition:all .15s}
.fbtn:hover{border-color:#1677ff;color:#1677ff}
.fbtn.on{background:#1677ff;border-color:#1677ff;color:#fff}
.fsep{width:1px;height:14px;background:#e5e5e7;margin:0 2px}

/* ── 레이아웃 ── */
.layout{display:grid;grid-template-columns:188px 1fr;min-height:calc(100vh - 120px)}

/* ── 사이드바 ── */
.sidebar{background:#fff;border-right:1px solid #e5e5e7;padding:12px 0;position:sticky;top:120px;height:calc(100vh - 120px);overflow-y:auto}
.sgroup{padding:2px 0}
.sgroup-title{padding:6px 14px 3px;font-size:10px;font-weight:700;color:#8a8a8e;letter-spacing:.06em;text-transform:uppercase}
.sitem{display:flex;align-items:center;justify-content:space-between;padding:5px 14px;cursor:pointer;transition:background .1s}
.sitem:hover{background:#f5f5f7}
.sitem.on{background:#e8f0fe}
.sname{font-size:12px;color:#333}
.sitem.on .sname{color:#1677ff;font-weight:600}
.sbadge{font-size:10px;font-weight:700;padding:1px 6px;border-radius:10px;background:#fff1f0;color:#cf1322}
.sbadge.zero{background:#f6ffed;color:#389e0d}
.common-link{display:block;padding:5px 14px;cursor:pointer;font-size:12px;color:#8a8a8e;transition:background .1s}
.common-link:hover{background:#f5f5f7;color:#1677ff}

/* ── 메인 ── */
.main{padding:18px 22px;overflow-y:auto}

/* ── 섹션 ── */
.comp-section{margin-bottom:28px}
.sec-head{display:flex;align-items:center;gap:10px;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #e5e5e7}
.sec-name{font-size:14px;font-weight:700}
.sec-sub{font-size:12px;color:#8a8a8e}
.sec-stats{display:flex;gap:6px}
.mini-badge{font-size:11px;padding:2px 8px;border-radius:10px}

/* ── 공통 이슈 ── */
.common-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px}
.common-card{background:#fff;border:1px solid #ffe58f;border-radius:8px;padding:10px 12px}
.cc-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.cc-cat{font-size:11px;font-weight:700;color:#d46b08;text-transform:uppercase;letter-spacing:.04em}
.cc-count{font-size:11px;color:#8a8a8e;background:#f5f5f5;padding:1px 7px;border-radius:10px}
.token-diff{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.tk-block{background:#fafafa;border-radius:4px;padding:5px 8px}
.tk-src{font-size:10px;font-weight:700;color:#8a8a8e;margin-bottom:3px}
.tk-val{font-size:10px}
.tk-val code{font-family:'SF Mono',monospace;word-break:break-all}
.tk-val.t-figma code{color:#cf1322}
.tk-val.t-dom   code{color:#389e0d}
.cc-affected{margin-top:7px;line-height:1.8}
.chip{display:inline-block;background:#f0f0f0;border-radius:3px;padding:1px 5px;margin:1px 2px 1px 0;font-family:'SF Mono',monospace;font-size:10px}
.chip-more{background:#e8f0fe;color:#1677ff}
.cdot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:3px;vertical-align:middle;border:1px solid rgba(0,0,0,.12)}

/* ── 카드 그리드 ── */
.cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px}
.card{background:#fff;border:1px solid #e5e5e7;border-radius:8px;overflow:hidden;transition:box-shadow .15s}
.card:hover{box-shadow:0 2px 8px rgba(0,0,0,.1)}
.card.has-fail{border-color:#ffa39e}
.card.all-pass{opacity:.6}
.card.hidden{display:none}

/* ── 카드 내부 ── */
.card-head{padding:9px 12px 7px;display:flex;align-items:flex-start;justify-content:space-between;border-bottom:1px solid #f0f0f0}
.card-id{font-size:11px;font-weight:700;font-family:'SF Mono',monospace;color:#333;word-break:break-all;flex:1;margin-right:6px}
.card-badges{display:flex;gap:3px;flex-wrap:wrap;justify-content:flex-end;flex-shrink:0}
.badge{font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;white-space:nowrap}
.b-fail{background:#fff1f0;color:#cf1322;border:1px solid #ffa39e}
.b-warn{background:#fffbe6;color:#d46b08;border:1px solid #ffe58f}
.b-pass{background:#f6ffed;color:#389e0d;border:1px solid #b7eb8f}
.b-skip{background:#f5f5f5;color:#8a8a8e;border:1px solid #d9d9d9}

.card-body{padding:6px 12px 8px}
.diff-row{display:flex;align-items:flex-start;gap:6px;padding:3px 0;border-bottom:1px solid #f9f9f9}
.diff-row:last-child{border-bottom:none}
.sdot{flex-shrink:0;width:7px;height:7px;border-radius:50%;margin-top:4px}
.dot-fail{background:#cf1322}
.dot-warn{background:#faad14}
.dot-pass{background:#52c41a}
.dot-skip{background:#d9d9d9}
.diff-body{flex:1;min-width:0}
.cat{font-size:10px;font-weight:700;color:#8a8a8e;text-transform:uppercase;letter-spacing:.04em;margin-right:4px}
.pass-cats{font-size:10px;color:#8a8a8e;font-weight:400}
.diff-pass{font-size:10px;color:#389e0d}
.diff-skip{font-size:10px;color:#8a8a8e}
.diff-tokens{margin-top:2px}
.diff-tokens .t-figma,.diff-tokens .t-dom{font-size:10px;line-height:1.6}
.diff-tokens .lbl{font-weight:700;margin-right:3px;color:#8a8a8e}
.diff-tokens .t-figma code{color:#cf1322;font-family:'SF Mono',monospace;font-size:10px}
.diff-tokens .t-dom   code{color:#389e0d;font-family:'SF Mono',monospace;font-size:10px}

.card-foot{padding:6px 12px 8px;background:#fafafa;border-top:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between}
.dev-label{font-size:10px;color:#8a8a8e}
.dev-select{font-size:11px;border:1px solid #d9d9d9;border-radius:4px;padding:2px 6px;background:#fff;color:#333;cursor:pointer}

/* ── 빈 상태 ── */
.empty-msg{text-align:center;padding:40px;color:#8a8a8e;font-size:13px;grid-column:1/-1}
</style>
</head>
<body>

<div class="hdr">
  <div class="hdr-row">
    <div>
      <div class="hdr-title">Hiworks DS · QA Report</div>
      <div class="hdr-meta">소스: ${esc(relPath)} · Figma vs Browser 토큰 비교</div>
    </div>
    <div class="hdr-date">실행일: ${runDate} · 컴포넌트 ${components.length}개</div>
  </div>
  <div class="stats">
    ${totalFail > 0 ? `<div class="sc sc-fail">🔴 fail ${totalFail}</div>` : ''}
    ${totalWarn > 0 ? `<div class="sc sc-warn">🟡 warn ${totalWarn}</div>` : ''}
    <div class="sc sc-pass">✅ pass ${totalPass}</div>
    <div class="sc sc-skip">— skip ${totalSkip}</div>
    <div class="sc sc-total">속성 ${totalProps}개</div>
  </div>
</div>

<div class="fbar">
  <span class="flabel">심각도</span>
  <button class="fbtn on" onclick="filterSeverity('all')" data-sf="all">전체</button>
  <button class="fbtn" onclick="filterSeverity('fail')" data-sf="fail">🔴 Fail만</button>
  <button class="fbtn" onclick="filterSeverity('pass')" data-sf="pass">✅ Pass만</button>
  <div class="fsep"></div>
  <span class="flabel">컴포넌트</span>
  <button class="fbtn on" onclick="filterGroup('all')" data-gf="all">전체</button>
  ${groupFilterBtns}
  <div class="fsep"></div>
  <span class="flabel">개발 상태</span>
  <button class="fbtn" onclick="filterDev('open')" data-df="open">🔴 Open</button>
  <button class="fbtn" onclick="filterDev('inprogress')" data-df="inprogress">🟡 In Progress</button>
  <button class="fbtn" onclick="filterDev('fixed')" data-df="fixed">✅ Fixed</button>
</div>

<div class="layout">
  <nav class="sidebar">
    <div class="sgroup">
      <div class="sgroup-title">컴포넌트</div>
      ${sidebarItems}
    </div>
    ${commonPatterns.length > 0 ? `
    <div class="sgroup">
      <div class="sgroup-title">공통</div>
      <div class="common-link" onclick="document.getElementById('sec-common')?.scrollIntoView({behavior:'smooth'})">
        🔗 공통 이슈 ${commonPatterns.length}개
      </div>
    </div>` : ''}
  </nav>

  <main class="main" id="main">
    ${commonSection}
    ${sections}
  </main>
</div>

<script>
// ── 개발 상태 localStorage ───────────────────────────────────────────────
const STORE_KEY = 'qa-dev-status';
function loadAll() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch { return {}; }
}
function saveDevStatus(qaId, sel) {
  const all = loadAll();
  all[qaId] = sel.value;
  localStorage.setItem(STORE_KEY, JSON.stringify(all));
  const card = sel.closest('.card');
  if (card) card.dataset.dev = sel.value;
  applyFilters();
}
function initDevStatus(qaId) {
  const all = loadAll();
  const val = all[qaId] || 'open';
  const sel = document.getElementById('dev-' + qaId);
  if (sel) {
    sel.value = val;
    const card = sel.closest('.card');
    if (card) card.dataset.dev = val;
  }
}
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card').forEach(card => {
    const qaId = card.dataset.qa;
    if (qaId) initDevStatus(qaId);
  });
  applyFilters();
});

// ── 필터 ────────────────────────────────────────────────────────────────
let curSev = 'all', curGroup = 'all', curDev = '';

function filterSeverity(v) {
  curSev = v;
  document.querySelectorAll('[data-sf]').forEach(b => b.classList.toggle('on', b.dataset.sf === v));
  applyFilters();
}
function filterGroup(v) {
  curGroup = v;
  document.querySelectorAll('[data-gf]').forEach(b => b.classList.toggle('on', b.dataset.gf === v));
  document.querySelectorAll('.sitem').forEach(i => i.classList.toggle('on', i.dataset.group === v));
  // 섹션 표시/숨김
  document.querySelectorAll('.comp-section[data-group]').forEach(sec => {
    sec.style.display = (v === 'all' || sec.dataset.group === v) ? '' : 'none';
  });
  if (v !== 'all') {
    const sec = document.getElementById('sec-' + v);
    if (sec) sec.scrollIntoView({behavior:'smooth', block:'start'});
  }
  applyFilters();
}
function filterDev(v) {
  curDev = (curDev === v) ? '' : v; // 토글
  document.querySelectorAll('[data-df]').forEach(b => b.classList.toggle('on', b.dataset.df === curDev));
  applyFilters();
}
function applyFilters() {
  document.querySelectorAll('.card').forEach(card => {
    const failCount = parseInt(card.dataset.fail || '0');
    const group = card.dataset.group || '';
    const dev   = card.dataset.dev   || 'open';

    const sevOk  = curSev === 'all' || (curSev === 'fail' ? failCount > 0 : failCount === 0);
    const groupOk = curGroup === 'all' || group === curGroup;
    const devOk   = !curDev  || dev === curDev;

    card.classList.toggle('hidden', !(sevOk && groupOk && devOk));
  });
  // 섹션 빈 상태 메시지
  document.querySelectorAll('.cards-grid').forEach(grid => {
    let existingEmpty = grid.querySelector('.empty-msg');
    const visible = [...grid.querySelectorAll('.card:not(.hidden)')].length;
    if (visible === 0 && !existingEmpty) {
      const msg = document.createElement('div');
      msg.className = 'empty-msg';
      msg.textContent = '표시할 카드가 없습니다.';
      grid.appendChild(msg);
    } else if (visible > 0 && existingEmpty) {
      existingEmpty.remove();
    }
  });
}
</script>
</body>
</html>`
}

// ── 메인 ─────────────────────────────────────────────────────────────────

const inputPath  = path.join(ROOT, 'tests', 'dom-qa-mcp-report.json')
const outputPath = path.join(ROOT, 'docs', 'qa', 'qa-report.html')

if (!fs.existsSync(inputPath)) {
  console.error(`❌ 리포트 JSON을 찾을 수 없습니다: ${inputPath}`)
  console.error('   pnpm test:dom-qa-mcp 를 먼저 실행하세요.')
  process.exit(1)
}

console.log('📊 QA 리포트 생성 중...')
const raw: ReportData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'))
const html = generateHtml(raw, inputPath)

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, html, 'utf-8')

const kb = (fs.statSync(outputPath).size / 1024).toFixed(1)
console.log(`✅ 생성 완료: ${path.relative(ROOT, outputPath)} (${kb} KB)`)
