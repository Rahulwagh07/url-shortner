//This code is for the report geneartion- 
//In which the csv file is not saved 

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiConnector } from '../../../services/apiConnector';
import { reportsEndpoints } from '../../../services/apis';
import { setReportGenerated } from '../../../slices/reportSlice';  

const {
  GENERATE_REPORT_API,
} = reportsEndpoints;

const Reports = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const reportGenerated = useSelector((state) => state.report.reportGenerated);  
  const [reportUrl, setReportUrl] = useState('');
  const maxRecords = 9;

  useEffect(() => {
    const isReportGenerated = localStorage.getItem('reportGenerated');
    if (isReportGenerated === 'true') {
      setReportGenerated(true);
    }
  }, []);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const response = await apiConnector("GET", GENERATE_REPORT_API, {
        responseType: 'blob',
      },
      {
        Authorization: `Bearer ${token}`,
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setReportUrl(url);

      dispatch(setReportGenerated(true));
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    const link = document.createElement('a');
    link.href = reportUrl;
    link.setAttribute('download', 'report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(reportUrl);
    dispatch(setReportGenerated(false));  
    setReportUrl('');
  };

  return (
    <div className="flex flex-col items-center justify-center mt-14">
      {!reportGenerated ? (  
        <p className="text-lg font-bold mb-4 text-center">
          Click the button below to start your report generation.
        </p>
      ) : null}
      {!reportGenerated ? (
        <button 
          onClick={handleGenerateReport}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {loading ? (
            <div className='flex items-center justify-center'> 
              <span>Generating report...</span>
            </div>
          ) : (
            "Generate report"
          )}
        </button>
      ) : (
        <div className="text-center">
          <p className="text-lg font-bold mb-4">Your report is generated!</p>
          <button onClick={handleDownloadReport} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Download Report
          </button>
        </div>
      )}
    </div>
  );
};

export default Reports;
