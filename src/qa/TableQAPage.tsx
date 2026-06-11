import { Table } from '../components/Table';
import { Button } from '../components/Button';

// ─── "나의 예약 목록" 피그마 시안 대응 ───────────────────────────────────────

export default function TableQAPage() {
  return (
    <div style={{ padding: 40, background: '#fff', minHeight: '100vh', maxWidth: 960, margin: '0 auto' }}>
      <h2 className="heading-lg-semibold text-(--sys-text-neutral-normal-default)" style={{ marginBottom: 32 }}>
        나의 예약 목록
      </h2>

      {/* ── 예약 목록 (Empty 상태) ── */}
      <section style={{ marginBottom: 48 }}>
        <h3 className="heading-sm-semibold text-(--sys-text-neutral-normal-default)" style={{ marginBottom: 16 }}>
          예약 목록
        </h3>

        <Table qaId="tbl-table-empty">
          <thead>
            <Table.HeaderRow qaId="tbl-header-row">
              <Table.Cell qaId="tbl-cell-header-md-center" mode="header" align="center" style={{ width: '15%' }}>분류</Table.Cell>
              <Table.Cell qaId="tbl-cell-header-md-left" mode="header" align="center" style={{ width: '30%' }}>자원명</Table.Cell>
              <Table.Cell mode="header" align="center" style={{ width: '35%' }}>예약 시간</Table.Cell>
              <Table.Cell mode="header" align="center" isLast style={{ width: '20%' }}>상태</Table.Cell>
            </Table.HeaderRow>
          </thead>
          <tbody>
            <Table.TableMessage qaId="tbl-message-empty" state="empty" />
          </tbody>
        </Table>
      </section>

      {/* ── 대기 목록 (Empty 상태) ── */}
      <section style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <h3 className="heading-sm-semibold text-(--sys-text-neutral-normal-default)">
            대기 목록
          </h3>
          <span className="caption-md-regular text-(--sys-text-alert-normal-default)">
            * 대기 목록은 7일 후 자동 삭제됩니다.
          </span>
        </div>

        <Table>
          <thead>
            <Table.HeaderRow>
              <Table.Cell mode="header" align="center" style={{ width: '15%' }}>분류</Table.Cell>
              <Table.Cell mode="header" align="center" style={{ width: '30%' }}>자원명</Table.Cell>
              <Table.Cell mode="header" align="center" style={{ width: '35%' }}>예약 시간</Table.Cell>
              <Table.Cell mode="header" align="center" isLast style={{ width: '20%' }}>상태</Table.Cell>
            </Table.HeaderRow>
          </thead>
          <tbody>
            <Table.TableMessage state="empty" />
          </tbody>
        </Table>
      </section>

      {/* ── 예약 목록 (데이터 있는 상태) ── */}
      <section style={{ marginBottom: 48 }}>
        <h3 className="heading-sm-semibold text-(--sys-text-neutral-normal-default)" style={{ marginBottom: 16 }}>
          예약 목록
        </h3>

        <Table qaId="tbl-table-loaded">
          <thead>
            <Table.HeaderRow>
              <Table.Cell mode="header" align="center" style={{ width: '15%' }}>분류</Table.Cell>
              <Table.Cell mode="header" align="center" style={{ width: '30%' }}>자원명</Table.Cell>
              <Table.Cell mode="header" align="center" style={{ width: '35%' }}>예약 시간</Table.Cell>
              <Table.Cell mode="header" align="center" isLast style={{ width: '20%' }}>상태</Table.Cell>
            </Table.HeaderRow>
          </thead>
          <tbody>
            <Table.Row qaId="tbl-row-enabled">
              <Table.Cell qaId="tbl-cell-data-md-left" align="left">과천 6층 회의실</Table.Cell>
              <Table.Cell align="left">605S</Table.Cell>
              <Table.Cell qaId="tbl-cell-data-md-center" align="center">2026-04-29 18:00 ~ 2026-04-02 19:00</Table.Cell>
              <Table.Cell qaId="tbl-cell-data-md-right" align="center" isLast>
                <span style={{ display: 'inline-flex', gap: 6 }}>
                  <Button label="상세보기" role="Brand" btnStyle="Outline" size="xs" />
                  <Button label="삭제" role="Destructive" btnStyle="Solid" size="xs" />
                </span>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell align="left">사내콘도</Table.Cell>
              <Table.Cell align="left">롯데속초(345호)</Table.Cell>
              <Table.Cell align="center">2026-06-05 ~ 2026-06-06</Table.Cell>
              <Table.Cell align="center" isLast>
                <span style={{ display: 'inline-flex', gap: 6 }}>
                  <Button label="상세보기" role="Brand" btnStyle="Outline" size="xs" />
                  <Button label="삭제" role="Destructive" btnStyle="Solid" size="xs" />
                </span>
              </Table.Cell>
            </Table.Row>
          </tbody>
        </Table>
      </section>

      {/* ── 대기 목록 (데이터 있는 상태) ── */}
      <section style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <h3 className="heading-sm-semibold text-(--sys-text-neutral-normal-default)">
            대기 목록
          </h3>
          <span className="caption-md-regular text-(--sys-text-alert-normal-default)">
            * 대기 목록은 7일 후 자동 삭제됩니다.
          </span>
        </div>

        <Table>
          <thead>
            <Table.HeaderRow>
              <Table.Cell mode="header" align="center" style={{ width: '15%' }}>분류</Table.Cell>
              <Table.Cell mode="header" align="center" style={{ width: '30%' }}>자원명</Table.Cell>
              <Table.Cell mode="header" align="center" style={{ width: '35%' }}>예약 시간</Table.Cell>
              <Table.Cell mode="header" align="center" isLast style={{ width: '20%' }}>상태</Table.Cell>
            </Table.HeaderRow>
          </thead>
          <tbody>
            <Table.Row>
              <Table.Cell align="left">테스트기기</Table.Cell>
              <Table.Cell align="left">아이폰6</Table.Cell>
              <Table.Cell align="center">2026-05-08 ~ 2026-05-09</Table.Cell>
              <Table.Cell align="center" isLast>
                <span style={{ display: 'inline-flex', gap: 6 }}>
                  <Button label="상세보기" role="Brand" btnStyle="Outline" size="xs" />
                  <Button label="삭제" role="Destructive" btnStyle="Solid" size="xs" />
                </span>
              </Table.Cell>
            </Table.Row>
          </tbody>
        </Table>
      </section>
    </div>
  );
}
