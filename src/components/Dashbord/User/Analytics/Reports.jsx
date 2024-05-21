import React, { useState, useEffect } from 'react';
import { apiConnector } from '../../../../services/apiConnector';
import { manageUrlEndpoints, reportsEndpoints } from '../../../../services/apis';
import { useSelector } from 'react-redux';
import Spinner from '../../../common/Spinner';
import { FRONTEND_URL } from '../../../../utils/helper';
import { formatDate } from '../../../../utils/FormatDate';
import { ACCOUNT_TYPE } from '../../../../utils/constants';
import { BACKEND_URL } from '../../../../utils/helper';
import { RxDownload } from "react-icons/rx";
import { GoArrowDown } from "react-icons/go";
import ShowCounts from '../ManageUrl/ShowCounts';

const BASE_URL = FRONTEND_URL;

const {
  GET_ALL_URLS_API,
} = manageUrlEndpoints

const {
  INIT_REPORT_GENERATION_API,
  GET_REPORT_API,
} = reportsEndpoints;


function Reports({ onSelectedRecordsChange }) {
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
  const [arrowPositionName, setArrowPositionName] = useState(false)
  const [arrowPositionDate, setArrowPositionDate] = useState(false)
  const [arrowPositionVisit, setArrowPositionVisit] = useState(false)
  const [sortCriteria, setSortCriteria] = useState('urlName');
  const [showCountryViews, setShowCountryViews] = useState(null);
  const [countryViewsData, setCountryViewsData] = useState([]);
  const [selectedUrlId, setSelectedUrlId] = useState();

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
  const handleShowCountryViews = (urlId, countryViewsData) => {
    setCountryViewsData(countryViewsData || []);
    setShowCountryViews(urlId === showCountryViews ? null : urlId);
    setSelectedUrlId(urlId)
  };
  // const handleSelect = (urlId) => {
  //   setSelectedUrls((prevSelectedUrls) =>
  //     prevSelectedUrls.includes(urlId)
  //       ? prevSelectedUrls.filter((id) => id !== urlId)
  //       : [...prevSelectedUrls, urlId]
  //   );
  // };
  const handleSelect = (urlId) => {
    const updatedSelectedUrls = selectedUrls.includes(urlId)
      ? selectedUrls.filter((id) => id !== urlId)
      : [...selectedUrls, urlId];
    setSelectedUrls(updatedSelectedUrls);
    onSelectedRecordsChange(updatedSelectedUrls);  
  };

  const handleSortChange = () => {
    setArrowPositionName(!arrowPositionName);
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
    setSortCriteria('urlName');
  };

  const handleDateSort = () => {
    setArrowPositionDate(!arrowPositionDate);
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
    setSortCriteria('createdAt');
  };

  const handleClicksSort = () => {
    setArrowPositionVisit(!arrowPositionVisit);
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
    setSortCriteria('totalClicks');
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const filteredUrls = urls.filter((url) =>
    url.urlName.toLowerCase().includes(filterText.toLowerCase())
  );

  const sortedUrls = filteredUrls.sort((a, b) => {
    if (sortCriteria === 'urlName') {
      const nameA = a.urlName.toLowerCase();
      const nameB = b.urlName.toLowerCase();
      if (nameA < nameB) return sortOrder === 'asc' ? -1 : 1;
      if (nameA > nameB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    } else if (sortCriteria === 'createdAt') {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      if (dateA < dateB) return sortOrder === 'asc' ? -1 : 1;
      if (dateA > dateB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    } else if (sortCriteria === 'totalClicks') {
      const clicksA = a.visits.length > 0 ? a.visits[0].totalClicks : 0;
      const clicksB = b.visits.length > 0 ? b.visits[0].totalClicks : 0;
      if (clicksA < clicksB) return sortOrder === 'asc' ? -1 : 1;
      if (clicksA > clicksB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    }
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
        <div className="mb-4 flex gap-2 justify-between items-center">
          <input
            type="text"
            placeholder="Filter URLs by name"
            value={filterText}
            onChange={handleFilterChange}
            className="shadow appearance-none border rounded lg:w-[450px] py-1.5 px-3
            text-black leading-tight border-gray-300 focus:outline-none focus:shadow-outline"
          />
          <div className="flex items-start gap-3">
            {globalVariables?.generateReportDisabled && (
              <div className="bg-slate-500 hover:bg-slate-400 flex gap-2 text-white 
               py-1 px-4 rounded">
                Report Generation is disabled for now
              </div>
            ) }
            <div>
            {reportGenerated ?  (
              <a
                href={`${BACKEND_URL}${report?.reportUrl}`}
                download
                className="bg-green-500 flex items-center justify-center gap-2 hover:bg-green-400 text-white 
                 py-1 px-4 rounded"
              >
              <span> Report is ready</span> <RxDownload className=''/>
              </a>
            ) : 
                <div>
                {selectedUrls.length > 0 && 
              <button
              onClick={handleInitReportGeneration}
              disabled={generatingReport}
              className="bg-green-500 flex items-center justify-center gap-2 hover:bg-green-400 text-white 
                 py-1 px-4 rounded"
            >
              {generatingReport ? 'Generating Report...' : `${selectedUrls.length < maxRecords ? "Download Now" : "Generate Report"}`}
            </button>}
                </div>
              }
              </div>
          </div>
        </div>
        <table className="table-auto text-sm bg-white">
          <thead className="text-slate-800">
            <tr className="bg-gray-gray-50">
              <th className="pl-4 py-0.5">Select</th>
              <th className="px-4 py-0.5 cursor-pointer"
               onClick={handleSortChange}> 
              <div className='flex gap-1 items-center justify-center '>
                <span>Name</span>
              {
                arrowPositionName ?  <GoArrowDown className='rotate-180'/> : <GoArrowDown/>
              }
              </div>
              </th>
              <th className="px-4 py-0.5">Base URL</th>
              <th className="px-4 py-0.5">Short URL</th>
              {user?.accountType === ACCOUNT_TYPE.ADMIN ? (
                <th className="px-4 py-0.5">Creator</th>
              ) : (
                <th className="px-4 py-0.5">Description</th>
              )}
              <th className="px-4 py-0.5 cursor-pointer"
               onClick={handleDateSort}> 
              <div className='flex gap-1 items-center justify-center '>
                <span>Created Date</span>
              {
                arrowPositionDate ?  <GoArrowDown className='rotate-180'/> : <GoArrowDown/>
              }
              </div>
              </th>
              <th className="px-4 py-0.5 cursor-pointer"
               onClick={handleClicksSort}> 
              <div className='flex gap-1 items-center justify-center '>
                <span>Visits</span>
              {
                arrowPositionVisit ?  <GoArrowDown className='rotate-180'/> : <GoArrowDown/>
              }
              </div>
              </th>
              <th className="px-4 py-0.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedUrls.map((url) => (
              <tr key={url.id}>
                <td className="pl-4 py-1.5 border">
                  <input
                    type="checkbox"
                    checked={selectedUrls.includes(url.id)}
                    onChange={() => handleSelect(url.id)}
                    disabled={(selectedUrls.length >= maxRecords && !selectedUrls.includes(url.id))
                            || globalVariables?.generateReportDisabled}
                    className={`form-checkbox h-3 w-3 text-blue-500 ${
                      (selectedUrls.length >= maxRecords && !selectedUrls.includes(url.id) 
                      || globalVariables?.generateReportDisabled) ? '' : 'cursor-pointer'
                    }`}
                  />
                </td>
                <td className="px-4 py-1.5 border">{url.urlName}</td>
                <td className="px-4 py-1.5 border">{url.baseUrl}</td>
                <td className="px-4 py-1.5 border">{BASE_URL + "/" + url.shortUrl}</td>
                {user?.accountType === ACCOUNT_TYPE.ADMIN ? (
                  <td className="px-4 py-1.5 border">{url.creator.firstName} {url.creator.lastName}</td>
                ) : (
                  <td className="px-4 py-1.5 max-w-xs border">
                    <div
                      className="truncate overflow-hidden hover:overflow-visible hover:whitespace-normal relative"
                      title={url.description}
                    >
                      {url.description.slice(0, 8)}...
                      <div className="absolute left-0 top-full mt-2 bg-red-400 text-white px-4 py-1.5 rounded-md opacity-0 invisible group-hover:visible group-hover:opacity-100 transition duration-100 z-10">
                        {url.description}
                      </div>
                    </div>
                  </td>
                )}
                <td className="px-4 py-1.5 border">{formatDate(url.createdAt)}</td>
                <td className="px-4 py-1.5 border cursor-pointer text-center" onClick={() => handleShowCountryViews(url.id, url.visits[0]?.country || [])}>
                {url.visits.length > 0 ? url.visits[0].totalClicks : 0}
              </td>
              <td className="px-4 py-1.5 border">
                <span className="px-2 py-1 rounded-md text-xs flex items-center justify-center bg-white border border-gray-300">
                  <span className={`rounded-full w-[5px] mt-1 h-[5px] mr-1 ${url.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                   <span>{url.status}</span>
                </span>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {showCountryViews === selectedUrlId && (
        <ShowCounts
        countryViewsData={countryViewsData} 
        setShowCountryViews={setShowCountryViews} />
      )}
  </div>
  
  );
};
export default Reports;