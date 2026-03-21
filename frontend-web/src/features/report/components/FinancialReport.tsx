import React from 'react';

interface ReportData {
  totalRevenue?: number;
  totalExpense?: number;
  netProfit?: number;
  revenueList?: { name: string; date: string; amount: number }[];
  expenseList?: { name: string; date: string; amount: number }[];
}

interface FinancialReportProps {
  data: ReportData;
  periodLabel?: string;
}

const FinancialReport: React.FC<FinancialReportProps> = ({ data, periodLabel }) => {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      maxWidth: 900,
      margin: '40px auto',
      padding: 40,
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h2 style={{ color: '#1a3fa6', fontWeight: 900, fontSize: 32, margin: 0 }}>Financial Atelier</h2>
          <div style={{ color: '#888', fontWeight: 500, fontSize: 14, marginBottom: 8 }}>WEALTH MANAGEMENT & ADVISORY</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Monthly Financial Statement</div>
          <div style={{ color: '#888', fontSize: 14 }}>Period ending {periodLabel || 'March 2026'}</div>
          <div style={{
            fontSize: 12, color: '#888', border: '1px solid #eee', borderRadius: 8, padding: '2px 10px', marginTop: 8, display: 'inline-block'
          }}>CONFIDENTIAL DOCUMENT</div>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
        <div style={{
          flex: 1, background: '#1a3fa6', color: '#fff', borderRadius: 12, padding: 24, textAlign: 'center'
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>NET PROFIT</div>
          <div style={{ fontSize: 36, fontWeight: 900 }}>{data.netProfit?.toLocaleString() || 0}</div>
          <div style={{ fontSize: 14, opacity: 0.8 }}>USD • Finalized Balance</div>
        </div>
        <div style={{
          flex: 1, background: '#f6fef7', color: '#1a7f3c', borderRadius: 12, padding: 24, textAlign: 'center', border: '1px solid #e0f2e9'
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>TOTAL REVENUE</div>
          <div style={{ fontSize: 36, fontWeight: 900 }}>{data.totalRevenue?.toLocaleString() || 0}</div>
          <div style={{ fontSize: 14, color: '#1a7f3c', opacity: 0.8 }}>↑ 12% GROWTH VS FEB</div>
        </div>
        <div style={{
          flex: 1, background: '#fff6f6', color: '#d32f2f', borderRadius: 12, padding: 24, textAlign: 'center', border: '1px solid #f5dada'
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>TOTAL EXPENSES</div>
          <div style={{ fontSize: 36, fontWeight: 900 }}>{data.totalExpense?.toLocaleString() || 0}</div>
          <div style={{ fontSize: 14, color: '#d32f2f', opacity: 0.8 }}>A STABLE OPERATING COST</div>
        </div>
      </div>

      {/* Details Tables */}
      <div style={{ display: 'flex', gap: 32 }}>
        {/* Revenue Table */}
        <div style={{ flex: 1 }}>
          <div style={{ color: '#1a3fa6', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Revenue Details</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
            <thead>
              <tr style={{ background: '#f6f8fa' }}>
                <th style={{ textAlign: 'left', padding: 8, fontWeight: 700 }}>NAME</th>
                <th style={{ textAlign: 'left', padding: 8, fontWeight: 700 }}>DATE</th>
                <th style={{ textAlign: 'right', padding: 8, fontWeight: 700 }}>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {data.revenueList && data.revenueList.length > 0 ? data.revenueList.map((r, i) => (
                <tr key={i}>
                  <td style={{ padding: 8 }}>{r.name}</td>
                  <td style={{ padding: 8 }}>{r.date?.slice(0, 10)}</td>
                  <td style={{ padding: 8, textAlign: 'right', fontWeight: 700 }}>{r.amount?.toLocaleString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} style={{ padding: 8, textAlign: 'center', color: '#aaa' }}>No revenue data</td>
                </tr>
              )}
              <tr>
                <td colSpan={2} style={{ padding: 8, fontWeight: 700 }}>Total Revenue</td>
                <td style={{ padding: 8, textAlign: 'right', fontWeight: 900, color: '#1a3fa6' }}>
                  {data.totalRevenue?.toLocaleString() || 0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Expense Table */}
        <div style={{ flex: 1 }}>
          <div style={{ color: '#d32f2f', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Expense Details</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
            <thead>
              <tr style={{ background: '#f6f8fa' }}>
                <th style={{ textAlign: 'left', padding: 8, fontWeight: 700 }}>NAME</th>
                <th style={{ textAlign: 'left', padding: 8, fontWeight: 700 }}>DATE</th>
                <th style={{ textAlign: 'right', padding: 8, fontWeight: 700 }}>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {data.expenseList && data.expenseList.length > 0 ? data.expenseList.map((e, i) => (
                <tr key={i}>
                  <td style={{ padding: 8 }}>{e.name}</td>
                  <td style={{ padding: 8 }}>{e.date?.slice(0, 10)}</td>
                  <td style={{ padding: 8, textAlign: 'right', fontWeight: 700, color: '#d32f2f' }}>
                    ({e.amount?.toLocaleString()})
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} style={{ padding: 8, textAlign: 'center', color: '#aaa' }}>No expense data</td>
                </tr>
              )}
              <tr>
                <td colSpan={2} style={{ padding: 8, fontWeight: 700 }}>Total Expense</td>
                <td style={{ padding: 8, textAlign: 'right', fontWeight: 900, color: '#d32f2f' }}>
                  {data.totalExpense?.toLocaleString() || 0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 40, color: '#888', fontSize: 12 }}>
        <div style={{ marginBottom: 16 }}>
          THE FIGURES PROVIDED IN THIS MONTHLY FINANCIAL STATEMENT HAVE ONLY BEEN COMPUTED IN AN ORGANIZATIONAL BASIS. THIS DOCUMENT SERVES AS A PRELIMINARY PREVIEW FOR REVIEW AND QUALITY CHECKING.
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 32 }}>
          <div>
            <div style={{ borderTop: '1px solid #aaa', width: 180, marginBottom: 4 }} />
            <div>Electronic Signature</div>
            <div style={{ fontWeight: 700 }}>Financial Controller</div>
            <div>ID FA-2026-0321-98</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReport;
