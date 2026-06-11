import { useState } from 'react';
import { Button } from '../components/Button';
import { Modal, ModalFooter, ModalSurface } from '../components/Modal';
import type { ModalSize } from '../components/Modal';

const SIZES: ModalSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

// 더미 footer Checkbox/Link — 기존 Checkbox 컴포넌트 미구현이라 시각 placeholder
function DummyCheckbox({ label }: { label: string }) {
  return (
    <label className="inline-flex items-center gap-2xs body-md-regular text-(--sys-text-neutral-normal-default) cursor-pointer">
      <span
        aria-hidden="true"
        className="inline-block size-[16px] rounded-xs border border-(--sys-stroke-neutral-subtle-default) bg-(--sys-bg-neutral-faint-default)"
      />
      {label}
    </label>
  );
}

function DummyOptionLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="bg-transparent border-0 cursor-pointer body-md-regular text-(--office-text-brand-normal-default) hover:text-(--office-text-brand-strong-default) underline underline-offset-2"
    >
      {label}
    </button>
  );
}

function FooterMatrixCard({
  qaId,
  title,
  layout,
  leftCheckbox,
  leftOptionLink,
  secondaryButton,
}: {
  qaId: string;
  title: string;
  layout: 'spaceBetween' | 'centered';
  leftCheckbox: boolean;
  leftOptionLink: boolean;
  secondaryButton: boolean;
}) {
  return (
    <div className="flex flex-col gap-xs">
      <span className="font-mono text-[11px] text-(--sys-text-neutral-subtle-default)">
        {qaId}
      </span>
      <ModalSurface
        size="md"
        title={title}
        supportingText="Layout · Boolean 조합 매트릭스 검수용 카드"
        showCloseButton={true}
        qaId={qaId}
        footer={
          <ModalFooter
            layout={layout}
            qaId={`${qaId}-footer`}
            leftCheckbox={leftCheckbox ? <DummyCheckbox label="다시 보지 않기" /> : undefined}
            leftOptionLink={leftOptionLink ? <DummyOptionLink label="자세히 보기" /> : undefined}
            secondaryButton={
              secondaryButton ? (
                <Button label="취소" role="Neutral" btnStyle="Outline" size="md" />
              ) : undefined
            }
            primaryButton={<Button label="확인" role="Brand" btnStyle="Solid" size="md" />}
          />
        }
      >
        <p className="body-md-regular text-(--sys-text-neutral-normal-default)">
          본문 슬롯 — Form Field 인스턴스가 들어가는 영역.
        </p>
      </ModalSurface>
    </div>
  );
}

function ShellMatrixCard({
  size,
  hasSupporting,
  hasClose,
}: {
  size: ModalSize;
  hasSupporting: boolean;
  hasClose: boolean;
}) {
  const qaId = `modal-shell-${size}-${hasSupporting ? 'sup' : 'nosup'}-${hasClose ? 'close' : 'noclose'}`;
  return (
    <div className="flex flex-col gap-xs">
      <span className="font-mono text-[11px] text-(--sys-text-neutral-subtle-default)">
        {qaId}
      </span>
      <ModalSurface
        size={size}
        title={`Modal · Size=${size}`}
        supportingText={hasSupporting ? '보조 안내문 — Has Supporting Text=true' : undefined}
        showCloseButton={hasClose}
        qaId={qaId}
        footer={
          <ModalFooter
            layout="spaceBetween"
            qaId={`${qaId}-footer`}
            primaryButton={<Button label="확인" role="Brand" btnStyle="Solid" size="md" />}
            secondaryButton={<Button label="취소" role="Neutral" btnStyle="Outline" size="md" />}
          />
        }
      >
        <p className="body-md-regular text-(--sys-text-neutral-normal-default)">
          본문 슬롯 — 사용처에서 Form Field 등 swap.
        </p>
      </ModalSurface>
    </div>
  );
}

export default function ModalQAPage() {
  const [portalOpen, setPortalOpen] = useState(false);

  return (
    <div
      style={{
        background: '#f9fafb',
        minHeight: '100vh',
        padding: '40px 48px',
        fontFamily: 'Pretendard, sans-serif',
      }}
    >
      {/* 헤더 */}
      <section style={{ maxWidth: 1280, marginBottom: 40 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>
          Modal QA — Figma node 311:958 / 312:994 / 846:1041
        </h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>
          docs/components/modal.md v1.6 · Surface 카테고리 · Size 1축 + _Footer PSC 매트릭스
        </p>
        <div style={{ marginTop: 16 }}>
          <Button
            label={portalOpen ? '모달 열림 (Portal 검증)' : 'Portal 모달 열기 (Backdrop · ESC · scroll lock 검증)'}
            role="Brand"
            btnStyle="Outline"
            size="md"
            onClick={() => setPortalOpen(true)}
          />
        </div>
      </section>

      {/* Portal 검증용 실제 Modal */}
      <Modal
        open={portalOpen}
        onClose={() => setPortalOpen(false)}
        size="md"
        title="Portal · Backdrop 검증"
        supportingText="ESC 키 / Backdrop 클릭 / 닫기 버튼으로 닫을 수 있어야 합니다."
        qaId="modal-portal-md"
        footer={
          <ModalFooter
            layout="spaceBetween"
            qaId="modal-portal-md-footer"
            secondaryButton={
              <Button label="취소" role="Neutral" btnStyle="Outline" size="md" onClick={() => setPortalOpen(false)} />
            }
            primaryButton={
              <Button label="확인" role="Brand" btnStyle="Solid" size="md" onClick={() => setPortalOpen(false)} />
            }
          />
        }
      >
        <p className="body-md-regular text-(--sys-text-neutral-normal-default)">
          body의 overflow가 hidden 처리되어 페이지 스크롤이 잠겨야 합니다.
        </p>
      </Modal>

      {/* Shell 매트릭스 */}
      <section style={{ marginBottom: 64 }}>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#6b7280',
            marginBottom: 16,
            letterSpacing: 1,
          }}
        >
          MODAL SHELL — Size 6 × Supporting Text on/off × Close Button on/off
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {SIZES.map((size) => (
            <div key={size} style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
              {([true, false] as const).map((hasSupporting) =>
                ([true, false] as const).map((hasClose) => (
                  <ShellMatrixCard
                    key={`${size}-${hasSupporting}-${hasClose}`}
                    size={size}
                    hasSupporting={hasSupporting}
                    hasClose={hasClose}
                  />
                )),
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer 매트릭스 */}
      <section>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#6b7280',
            marginBottom: 16,
            letterSpacing: 1,
          }}
        >
          MODAL FOOTER — Layout 2 × Boolean 매트릭스 (Centered는 LC/LOL 무효 — modal.md §3-3)
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Space Between · 2³ = 8 조합 */}
          {([true, false] as const).map((lc) =>
            ([true, false] as const).map((lol) =>
              ([true, false] as const).map((sb) => (
                <FooterMatrixCard
                  key={`sb-${lc}-${lol}-${sb}`}
                  qaId={`modal-footer-spacebetween-${lc ? 'lc' : 'nolc'}-${lol ? 'lol' : 'nolol'}-${sb ? 'sb' : 'nosb'}`}
                  title={`SpaceBetween · LC=${lc} · LOL=${lol} · SB=${sb}`}
                  layout="spaceBetween"
                  leftCheckbox={lc}
                  leftOptionLink={lol}
                  secondaryButton={sb}
                />
              )),
            ),
          )}

          {/* Centered · SecondaryButton on/off만 의미 있음 = 2 조합 */}
          {([true, false] as const).map((sb) => (
            <FooterMatrixCard
              key={`centered-${sb}`}
              qaId={`modal-footer-centered-sb-${sb ? 'sb' : 'nosb'}`}
              title={`Centered · SB=${sb}`}
              layout="centered"
              leftCheckbox={false}
              leftOptionLink={false}
              secondaryButton={sb}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
