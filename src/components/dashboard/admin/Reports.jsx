// src/components/dashboard/admin/Reports.jsx
import React, { useState } from 'react';
import { useAdminReport } from '../../../hooks/admin/useAdminReport';

const Reports = () => {
  const {
    loading,
    generateSalesReport,
    generateVendorReport,
    generateProductReport,
    generateUserReport,
    generateCommissionReport,
    getTemplates
  } = useAdminReport();

  const [reportType, setReportType] = useState('sales');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState('json');
  const [filters, setFilters] = useState({});
  const [reportData, setReportData] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const handleGenerateReport = async () => {
    const params = {
      startDate,
      endDate,
      format,
      ...filters
    };

    let response;
    switch (reportType) {
      case 'sales':
        response = await generateSalesReport(params);
        break;
      case 'vendor':
        response = await generateVendorReport(params);
        break;
      case 'product':
        response = await generateProductReport(params);
        break;
      case 'user':
        response = await generateUserReport(params);
        break;
      case 'commission':
        response = await generateCommissionReport(params);
        break;
      default:
        return;
    }

    if (response && response.success) {
      setReportData(response.data);
      setShowReport(true);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="sales">Sales Report</option>
            <option value="vendor">Vendor Report</option>
            <option value="product">Product Report</option>
            <option value="user">User Report</option>
            <option value="commission">Commission Report</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="json">JSON</option>
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerateReport}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Report'}
      </button>

      {showReport && reportData && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(reportData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Reports;