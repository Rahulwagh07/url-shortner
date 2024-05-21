import React, { useState, useEffect } from 'react';
import { apiConnector } from '../../../../services/apiConnector';
import { manageUrlEndpoints } from '../../../../services/apis';
import { useSelector } from 'react-redux';
import Spinner from '../../../common/Spinner';
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import EditModal from './EditModal';
import { FRONTEND_URL } from '../../../../utils/helper';
import { formatDate } from '../../../../utils/FormatDate';
import { ACCOUNT_TYPE } from '../../../../utils/constants';
import ShowCounts from './ShowCounts';
import toast from 'react-hot-toast';
import { GoArrowDown } from "react-icons/go";

const BASE_URL = FRONTEND_URL;

const {
    GET_ALL_URLS_API,
    DELETE_URL_API,
    DELETE_BULK_URLS_API,
    SUSPEND_URL_API,
    ACTIVATE_URL_API,
} = manageUrlEndpoints

const UrlList = ({tempUrlActiveDays, goldUrlActiveDays, silverUrlActiveDays, platinumUrlActiveDays}) => {
  const [urls, setUrls] = useState([]);
  const [selectedUrls, setSelectedUrls] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterText, setFilterText] = useState('');
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedUrlEdit, setSelectedUrlEdit] = useState();
  const [showCountryViews, setShowCountryViews] = useState(null);
  const [countryViewsData, setCountryViewsData] = useState([]);
  const [selectedUrlId, setSelectedUrlId] = useState();
  const [arrowPositionName, setArrowPositionName] = useState(false)
  const [arrowPositionCreatedDate, setArrowPositionCreatedDate] = useState(false)
  const [arrowPositionVisit, setArrowPositionVisit] = useState(false)
  const [arrowPositionExpiryDate, setArrowPositionExpiryDate] = useState(false)
  const [arrowPositionVisitors, setArrowPositionVisitors] = useState(false)
  const [showCountModalState, setShowCountModalState] = useState(false);

  const [sortCriteria, setSortCriteria] = useState('urlName');
  useEffect(() => {
    fetchUrls();
  }, []);

  const handleShowCountryViews = (urlId, countryViewsData) => {
    setShowCountModalState(true)
    setCountryViewsData(countryViewsData || []);
    setShowCountryViews(urlId === showCountryViews ? null : urlId);
    setSelectedUrlId(urlId)
  };

  const handleShowVisitors = (urlId, countryViewsData) => {
    setShowCountModalState(false)
    setCountryViewsData(countryViewsData || []);
    setShowCountryViews(urlId === showCountryViews ? null : urlId);
    setSelectedUrlId(urlId)
  };

  const fetchUrls = async () => {
    setLoading(true)
    try {
      const response = await apiConnector("GET", GET_ALL_URLS_API, null, {
        Authorization: `Bearer ${token}`,
      });
      setUrls(response.data.data);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
    setLoading(false)
  };

  const handleSelect = (urlId) => {
    setSelectedUrls((prevSelectedUrls) =>
      prevSelectedUrls.includes(urlId)
        ? prevSelectedUrls.filter((id) => id !== urlId)
        : [...prevSelectedUrls, urlId]
    );
  };

  const handleSelectAll = () => {
    const allUrlIds = urls.map((url) => url.id);
    setSelectedUrls(selectedUrls.length === allUrlIds.length ? [] : allUrlIds);
  };

  const handleSortChange = () => {
    setArrowPositionName(!arrowPositionName);
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
    setSortCriteria('urlName');
  };
  
  const handleCreatedDateSort = () => {
    setArrowPositionCreatedDate(!arrowPositionCreatedDate);
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
    setSortCriteria('createdAt');
  };

  const handleExpiryDateSort = () => {
    setArrowPositionExpiryDate(!arrowPositionExpiryDate);
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
    setSortCriteria('expirationDate');
  };

  const handleClicksSort = () => {
    setArrowPositionVisit(!arrowPositionVisit);
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
    setSortCriteria('totalClicks');
  };
  const handleVisitorsSort = () => {
    setArrowPositionVisitors(!arrowPositionVisitors);
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
    setSortCriteria('visitors');
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const handleEdit = (url) => {
    setSelectedUrlEdit(url)
    setEditModal(true)
    
  };

  const handleSuspend = async () => {
    try {
    const res =   await apiConnector("PUT", `${SUSPEND_URL_API}`, { urlIds: selectedUrls }, {
        Authorization: `Bearer ${token}`,
    });
    if(res.data.success){
      toast.success("Url suspended");
      setUrls((prevUrls) => 
        prevUrls.map((url) =>
          selectedUrls.includes(url.id) ? { ...url, status: 'suspended' } : url
        )
        );
        setSelectedUrls([]); 
    }
    } catch (error) {
      toast.error("Failed to suspend url")
      console.error('Error suspending URL:', error);
    }
  };

  const handleActivate = async () => {
    try {
    const res = await apiConnector("PUT", `${ACTIVATE_URL_API}`, { urlIds: selectedUrls }, {
        Authorization: `Bearer ${token}`,
    });
      if(res.data.success){
        toast.success("Url Activated");
        setUrls((prevUrls) => 
          prevUrls.map((url) =>
            selectedUrls.includes(url.id) ? { ...url, status: 'active' } : url
          )
          );
          setSelectedUrls([]); 
      }
    } catch (error) {
      toast.error("Failed to activate url")
      console.error('Error suspending URL:', error);
    }
  };

  // const handleDelete = async (urlId) => {
  //   try {
  //     const res = await apiConnector("DELETE", `${DELETE_URL_API}/${urlId}`, null, {
  //       Authorization: `Bearer ${token}`,
  //   });
  //   if(res.data.success){
  //     toast.success("Url Deleted");
  //     setUrls((prevUrls) => prevUrls.filter((url) => url.id !== urlId));
  //   }
  //   } catch (error) {
  //     toast.error("Failed to delete url")
  //     console.error('Error deleting URL:', error);
  //   }
  // };

  const handleBulkDelete = async () => {
    try {
      const res = await apiConnector("DELETE", DELETE_BULK_URLS_API, { urlIds: selectedUrls }, {
        Authorization: `Bearer ${token}`,
      });
      if (res.data.success) {
        toast.success("Selected urls deleted");
        setUrls((prevUrls) => prevUrls.filter((url) => !selectedUrls.includes(url.id)));
        setSelectedUrls([]);
      }
    } catch (error) {
      toast.error("Failed to delete urls");
      console.error('Error deleting URLs:', error);
    }
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
    } else if (sortCriteria === 'expirationDate') {
      const dateA = new Date(a.expirationDate);
      const dateB = new Date(b.expirationDate);
      if (dateA < dateB) return sortOrder === 'asc' ? -1 : 1;
      if (dateA > dateB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    }
    else if (sortCriteria === 'totalClicks') {
      const clicksA = a.visits.length > 0 ? a.visits[0].totalClicks : 0;
      const clicksB = b.visits.length > 0 ? b.visits[0].totalClicks : 0;
      if (clicksA < clicksB) return sortOrder === 'asc' ? -1 : 1;
      if (clicksA > clicksB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    }
    else if (sortCriteria === 'visitors') {
      const clicksA = a.visits.length > 0 ? a.visits[0].visitor.length : 0;
      const clicksB = b.visits.length > 0 ? b.visits[0].visitor.length : 0;
      if (clicksA < clicksB) return sortOrder === 'asc' ? -1 : 1;
      if (clicksA > clicksB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    }
    return 0;
  });
 
  return (
    <div className="mx-auto py-8 overflow-x-hidden">
    { loading ? <div className='flex items-center justify-center mt-4'><Spinner/></div> :
      <>
      <div className="mb-4 flex xs:flex-col xs:items-start gap-2  justify-between items-center">
        <input
          type="text"
          placeholder="Filter by name"
          value={filterText}
          onChange={handleFilterChange}
          className="shadow appearance-none z-10 border rounded xs:w-[80vw] lg:w-[450px] py-1.5 px-3 ml-1
           text-black leading-tight border-gray-300 focus:outline-none focus:shadow-outline"
        />
        <div className="flex items-start gap-3 font-[475]">
        <button
          onClick={handleSelectAll}
          className="border border-gray-300 bg-white flex gap-2
               py-1.5 px-4 rounded-md hover:bg-gray-200"
        >
          {selectedUrls.length === urls.length ? 'Deselect All' : 'Select All'}
        </button>
        <button
          onClick={handleBulkDelete}
          disabled={selectedUrls.length === 0}
          className={`border border-red-300 flex gap-2 bg-gray-100
              py-1.5 px-4 rounded-md
            ${ selectedUrls.length === 0 ? 'cursor-not-allowed' : 'bg-white hover:bg-gray-200'
          }`}
         >
          Delete
        </button>
        <button
          onClick={handleSuspend}
          disabled={selectedUrls.length === 0}
          className={`border border-slate-300 flex gap-2 bg-gray-100
              py-1.5 px-4 rounded-md
            ${ selectedUrls.length === 0 ? 'cursor-not-allowed' : 'bg-white hover:bg-gray-200'
          }`}
         >
          Suspend
        </button>
        <button
          onClick={handleActivate}
          disabled={selectedUrls.length === 0}
          className={`border border-green-300 flex gap-2 bg-gray-100
              py-1.5 px-4 rounded-md
            ${ selectedUrls.length === 0 ? 'cursor-not-allowed' : 'bg-white hover:bg-gray-200'
          }`}
         >
          Acitivate
        </button>
        </div>
      </div>
      {
        sortedUrls.length > 0 ? 
        <table className="table-auto bg-white text-sm">
        <thead className='text-slate-800 rounded-md border border-gray-300'>
          <tr className="bg-gray-50">
            <th className="pl-1 py-1.5">Select</th>
            <th className="px-4 py-1.5 cursor-pointer"
               onClick={handleSortChange}> 
              <div className='flex gap-1 items-center justify-center '>
                <span>Name</span>
              {
                arrowPositionName ?  <GoArrowDown className='rotate-180'/> : <GoArrowDown/>
              }
              </div>
            </th>
            <th className="px-2  py-1.5">Base URL</th>
            <th className="px-2  py-1.5">Shortened URL</th>
            {
              user?.accountType === ACCOUNT_TYPE.ADMIN ? (
                <th className="px-3  py-1.5">Creator</th>
              ) : (
                <th className="px-3 py-1.5">Description</th>
              )
            }
            <th className="px-4 py-1.5 cursor-pointer"
               onClick={handleCreatedDateSort}> 
              <div className='flex gap-1 items-center justify-center '>
                <span>Created</span>
              {
                arrowPositionCreatedDate ?  <GoArrowDown className='rotate-180'/> : <GoArrowDown/>
              }
              </div>
            </th>
            <th className="px-4 py-1.5 cursor-pointer"
               onClick={handleExpiryDateSort}> 
              <div className='flex gap-1 items-center justify-center '>
                <span>Expiry</span>
              {
                arrowPositionExpiryDate ?  <GoArrowDown className='rotate-180'/> : <GoArrowDown/>
              }
              </div>
            </th>
            <th className="px-4 py-1.5 cursor-pointer"
               onClick={handleClicksSort}> 
              <div className='flex gap-1 items-center justify-center '>
                <span>Visits</span>
              {
                arrowPositionVisit ?  <GoArrowDown className='rotate-180'/> : <GoArrowDown/>
              }
              </div>
            </th>
            <th className="px-4 py-1.5 cursor-pointer"
               onClick={handleVisitorsSort}> 
              <div className='flex gap-1 items-center justify-center '>
                <span>Visitors</span>
              {
                arrowPositionVisitors ?  <GoArrowDown className='rotate-180'/> : <GoArrowDown/>
              }
              </div>
            </th>
            <th className="px-2 py-1.5">Status</th>
            <th className="px-2 py-1.5">Edit</th>
          </tr>
        </thead>
        <tbody className='rounded-md border border-gray-300'>
         <>
         {sortedUrls.map((url) => (
            <tr key={url.id}>
              <td className="pl-4 py-1.5 border">
                <input
                  type="checkbox"
                  checked={selectedUrls.includes(url.id)}
                  onChange={() => handleSelect(url.id)}
                  className="form-checkbox h-3 w-3 cursor-pointer text-blue-500"
                />
              </td>
              <td className="px-2 py-1.5 border">{url.urlName}</td>
              <td className="px-2 py-1.5 border">{url.baseUrl}</td>
              <td className="px-2 py-1.5 border">{BASE_URL + "/" + url.shortUrl}</td>
              {
              user?.accountType === ACCOUNT_TYPE.ADMIN ? (
                <td className="px-2 py-1.5 border">{url.creator.firstName} {url.creator.lastName}</td>
              ) : (
                <td className="px-2 py-1.5 max-w-xs border">
                <div
                  className="truncate overflow-hidden hover:overflow-visible 
                  hover:whitespace-normal relative"
                  title={url.description}
                >
                  {url.description.slice(0, 8)}...
                  <div className="absolute left-0 top-full mt-2 bg-red-400 
                  text-white-25 px-4 py-1.5 rounded-md opacity-0 invisible 
                  group-hover:visible group-hover:opacity-100 transition duration-100 z-10">
                    {url.description}
                  </div>
                </div>
              </td>
              )
             }
              <td className="px-2 py-1.5 border">{formatDate(url.createdAt)}</td>
              <td className="px-2 py-1.5 border">{formatDate(url.expirationDate)}</td>
              <td className="px-2 py-1.5 cursor-pointer border text-center" onClick={() => handleShowCountryViews(url.id, url.visits[0]?.country || [])}>
                {url.visits.length > 0 ? url.visits[0].totalClicks : 0}
              </td>
              <td className="px-2 py-1.5 cursor-pointer border text-center" onClick={() => handleShowVisitors(url.id, url.visits[0]?.country || [])}>
                {url.visits.length > 0 ? url.visits[0].visitor.length : 0}
              </td>
              <td className="px-4 py-1.5 border">
                <span className="px-2 py-1 rounded-md text-xs flex items-center justify-center bg-white border border-gray-300">
                  <span className={`rounded-full w-[5px] mt-1 h-[5px] mr-1 ${url.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                   <span>{url.status}</span>
                </span>
              </td>
              <td className="px-2 py-1.5 border">
              <MdEdit size={16} className="text-blue-500 cursor-pointer" 
                onClick={() => handleEdit(url)}/>
            </td>
            </tr>
            ))}
         </>
        </tbody>
      </table> : 
      <div className='flex items-center justify-center bg-white shadow-md rounded-md p-6 
       border border-gray-300'>
        <h3 className='font-semibold text-black text-lg'>No Urls found</h3>
      </div>
      }
      </>
    }
        {editModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50
        bg-black  bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
         <div className='md:w-5/12'>
         <EditModal 
         setEditModal={setEditModal} 
         url={selectedUrlEdit} 
         tempUrlActiveDays={tempUrlActiveDays}
         goldUrlActiveDays={goldUrlActiveDays}
         silverUrlActiveDays={silverUrlActiveDays}
         platinumUrlActiveDays={platinumUrlActiveDays}
         />
         </div>
        </div>
      )}

      {showCountryViews === selectedUrlId && (
        <ShowCounts
        modalState={showCountModalState}
        countryViewsData={countryViewsData} 
        setShowCountryViews={setShowCountryViews} />
      )}
    </div>
);
};
export default UrlList;