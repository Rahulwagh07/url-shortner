import React, { useState, useEffect } from 'react';
import { apiConnector } from '../../../../services/apiConnector';
import { manageUrlEndpoints, reportsEndpoints } from '../../../../services/apis';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../../common/Spinner';
import { FRONTEND_URL } from '../../../../utils/helper';
import { formatDate } from '../../../../utils/FormatDate';
import { ACCOUNT_TYPE } from '../../../../utils/constants';
import { BACKEND_URL } from '../../../../utils/helper';

const BASE_URL = FRONTEND_URL;

const {
  GET_ALL_URLS_API,
} = manageUrlEndpoints

const {
  INIT_REPORT_GENERATION_API,
  GET_REPORT_API,
} = reportsEndpoints;


const Reports = () => {
  const [urls, setUrls] = useState([]);
  const [selectedUrls, setSelectedUrls] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterText, setFilterText] = useState('');
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null)
  const [globalVariables, setGlobalVariables] = useState(null)
  const [maxRecords, setMaxrecords] = useState(0);
  const [reportGenerated, setReportGenerated] = useState(false)
  const [generatingReport, setReportGenerating] = useState(false)

  useEffect(() => {
    fetchReport();
    fetchUrls();
  }, []);
  
  const fetchReport = async () => {
    try {
      const res = await apiConnector("GET", GET_REPORT_API, null, {
        Authorization: `Bearer ${token}`,
      });
      if(res.data.success){
        console.log("Report api res", res)
        setGlobalVariables(res.data.globalVariables);
        if(res.data.report?.reportGenerated){
          setReportGenerated(true)
        }
        setReport(res.data.report);
        setMaxrecords(res.data.globalVariables.maxReportRecords);
      }
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
  };

  const fetchUrls = async () => {
    setLoading(true);
    try {
      const response = await apiConnector("GET", GET_ALL_URLS_API, null, {
        Authorization: `Bearer ${token}`,
      });
      setUrls(response.data.data);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
    setLoading(false);
  };

  const handleInitReportGeneration = async () => {
    try {
      const res = await apiConnector('POST', INIT_REPORT_GENERATION_API, { urlIds: selectedUrls }, { Authorization: `Bearer ${token}` });
      if(res.data.success){
        setReportGenerating(true)
      }
    } catch (error) {
      console.error('Error initiating report generation:', error);
    } finally {
    }
  };

  const handleSelect = (urlId) => {
    setSelectedUrls((prevSelectedUrls) =>
      prevSelectedUrls.includes(urlId)
        ? prevSelectedUrls.filter((id) => id !== urlId)
        : [...prevSelectedUrls, urlId]
    );
  };

  const handleSortChange = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const filteredUrls = urls.filter((url) =>
    url.urlName.toLowerCase().includes(filterText.toLowerCase())
  );

  const sortedUrls = filteredUrls.sort((a, b) => {
    const nameA = a.urlName.toLowerCase();
    const nameB = b.urlName.toLowerCase();
    if (nameA < nameB) return sortOrder === 'asc' ? -1 : 1;
    if (nameA > nameB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div>
    {loading ? (
      <div className="flex items-center justify-center mt-4">
        <Spinner />
      </div>
    ) : (
      <div className="mx-auto flex flex-col justify-center">
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Filter URLs by name"
            value={filterText}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex flex-wrap gap-2 sm:flex-nowrap">
            <button
              onClick={handleSortChange}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Sort by Name
            </button>
            {globalVariables?.generateReportDisabled && (
              <div className="px-4 py-2 bg-blue-500 text-white rounded-md">
                Report Generation is disabled for now
              </div>
            ) }
            <div>
            {reportGenerated ?  (
              <a
                href={`${BACKEND_URL}${report?.reportUrl}`}
                download
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Report is ready..Download
              </a>
            ) : 
                <div>
                {selectedUrls.length > 0 && 
              <button
              onClick={handleInitReportGeneration}
              disabled={generatingReport}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {generatingReport ? 'Generating Report...' : `${selectedUrls.length < maxRecords ? "Download Now" : "Generate Report"}`}
            </button>}
                </div>
              }
              </div>
          </div>
        </div>
        <table className="table-auto">
          <thead className="text-sky-400">
            <tr className="bg-gray-200">
              <th className="pl-4 py-2">Select</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Base URL</th>
              <th className="px-4 py-2">Shortened URL</th>
              {user?.accountType === ACCOUNT_TYPE.ADMIN ? (
                <th className="px-4 py-2">Creator</th>
              ) : (
                <th className="px-4 py-2">Description</th>
              )}
              <th className="px-4 py-2">Created Date</th>
              <th className="px-4 py-2">Visits</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedUrls.map((url) => (
              <tr key={url.id}>
                <td className="pl-4 py-2 border">
                  <input
                    type="checkbox"
                    checked={selectedUrls.includes(url.id)}
                    onChange={() => handleSelect(url.id)}
                    disabled={(selectedUrls.length >= maxRecords && !selectedUrls.includes(url.id))
                            || globalVariables?.generateReportDisabled}
                    className={`form-checkbox h-4 w-4 text-blue-500 ${
                      (selectedUrls.length >= maxRecords && !selectedUrls.includes(url.id) 
                      || globalVariables?.generateReportDisabled) ? '' : 'cursor-pointer'
                    }`}
                  />
                </td>
                <td className="px-4 py-2 border">{url.urlName}</td>
                <td className="px-4 py-2 border">{url.baseUrl}</td>
                <td className="px-4 py-2 border">{BASE_URL + "/" + url.shortUrl}</td>
                {user?.accountType === ACCOUNT_TYPE.ADMIN ? (
                  <td className="px-4 py-2 border">{url.creator.firstName} {url.creator.lastName}</td>
                ) : (
                  <td className="px-4 py-2 max-w-xs border">
                    <div
                      className="truncate overflow-hidden hover:overflow-visible hover:whitespace-normal relative"
                      title={url.description}
                    >
                      {url.description.slice(0, 8)}...
                      <div className="absolute left-0 top-full mt-2 bg-red-400 text-white px-4 py-2 rounded-md opacity-0 invisible group-hover:visible group-hover:opacity-100 transition duration-100 z-10">
                        {url.description}
                      </div>
                    </div>
                  </td>
                )}
                <td className="px-4 py-2 border">{formatDate(url.createdAt)}</td>
                <td className="px-4 py-2 cursor-pointer border" onClick={() => handleShowCountryViews(url.id, url.visits[0]?.country || [])}>
                  {url.visits.length > 0 ? url.visits[0].totalClicks : 0}
                </td>
                <td className="px-4 py-2 border">
                  <span className={`px-2 py-1 text-white rounded-full text-xs font-semibold ${url.status === 'active' ? 'bg-green-400' : 'bg-red-400'}`}>
                    {url.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
  
  );
};
export default Reports;