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

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleShowCountryViews = (urlId, countryViewsData) => {
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
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const handleEdit = (url) => {
    setSelectedUrlEdit(url)
    setEditModal(true)
    
  };

  const handleSuspend = async (urlId) => {
    try {
    const res =   await apiConnector("PUT", `${SUSPEND_URL_API}/${urlId}`, null, {
        Authorization: `Bearer ${token}`,
    });
    if(res.data.success){
      toast.success("Url suspended");
      setUrls((prevUrls) =>
        prevUrls.map((url) =>
          url.id === urlId ? { ...url, status: 'suspended' } : url
        )
      );
    }
    } catch (error) {
      toast.error("Failed to suspend url")
      console.error('Error suspending URL:', error);
    }
  };

  const handleActivate = async (urlId) => {
    try {
    const res = await apiConnector("PUT", `${ACTIVATE_URL_API}/${urlId}`, null, {
        Authorization: `Bearer ${token}`,
    });
      if(res.data.success){
        toast.success("Url Activated");
        setUrls((prevUrls) =>
          prevUrls.map((url) =>
            url.id === urlId ? { ...url, status: 'active' } : url
          )
        );
      }
    } catch (error) {
      toast.error("Failed to activate url")
      console.error('Error suspending URL:', error);
    }
  };

  const handleDelete = async (urlId) => {
    try {
      const res = await apiConnector("DELETE", `${DELETE_URL_API}/${urlId}`, null, {
        Authorization: `Bearer ${token}`,
    });
    if(res.data.success){
      toast.success("Url Deleted");
      setUrls((prevUrls) => prevUrls.filter((url) => url.id !== urlId));
    }
    } catch (error) {
      toast.error("Failed to delete url")
      console.error('Error deleting URL:', error);
    }
  };

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
    const nameA = a.urlName.toLowerCase();
    const nameB = b.urlName.toLowerCase();
    if (nameA < nameB) return sortOrder === 'asc' ? -1 : 1;
    if (nameA > nameB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
 
  return (
    <div className="mx-auto py-8 overflow-x-hidden">
    { loading ? <div className='flex items-center justify-center mt-4'><Spinner/></div> :
      <>
      <div className="mb-4 flex xs:flex-col xs:items-start gap-2 mx-4 justify-between items-center">
        <input
          type="text"
          placeholder="Filter by name"
          value={filterText}
          onChange={handleFilterChange}
          className="shadow appearance-none border rounded xs:w-[80vw] lg:w-[450px] py-2 px-3
           text-gray-700 leading-tight border-gray-300 focus:outline-none focus:shadow-outline"
        />
        <div className="flex items-start gap-3">
        <button
          onClick={handleSortChange}
          className="bg-blue-500 hover:bg-blue-400 flex gap-2 text-white 
              font-bold py-1 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        >
          Sort by Name
        </button>
        <button
          onClick={handleSelectAll}
          className="bg-slate-500 hover:bg-slate-400 flex gap-2 text-white 
              font-bold py-1 px-4 border-b-4 border-slate-700 hover:border-slate-500 rounded"
        >
          {selectedUrls.length === urls.length ? 'Deselect All' : 'Select All'}
        </button>
        <button
          onClick={handleBulkDelete}
          disabled={selectedUrls.length === 0}
          className={`bg-red-500 hover:bg-red-400 flex gap-2 text-white 
              font-bold py-1 px-4 border-b-4 border-red-700 hover:border-red-500 rounded
            ${ selectedUrls.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
         >
          Delete Selected
        </button>
        </div>
      </div>
      {
        sortedUrls.length > 0 ? 
        <table className="table-auto">
        <thead className='text-sky-400 rounded-lg'>
          <tr className="bg-gray-200">
            <th className="pl-1 py-2">Select</th>
            <th className="px-2 py-2">Name</th>
            <th className="px-2 py-2">Base URL</th>
            <th className="px-2 py-2">Shortened URL</th>
            {
              user?.accountType === ACCOUNT_TYPE.ADMIN ? (
                <th className="px-3 py-2">Creator</th>
              ) : (
                <th className="px-3 py-2">Description</th>
              )
            }
            <th className="px-2 py-2">Created Date</th>
            <th className="px-2 py-2">Expiray Date</th>
            <th className="px-2 py-2">Visits</th>
            <th className="px-2 py-2">Status</th>
            <th className="px-2 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
         <>
         {sortedUrls.map((url) => (
            <tr key={url.id}>
              <td className="pl-4 py-2 border">
                <input
                  type="checkbox"
                  checked={selectedUrls.includes(url.id)}
                  onChange={() => handleSelect(url.id)}
                  className="form-checkbox h-4 w-4 text-blue-500"
                />
              </td>
              <td className="px-2 py-2 border">{url.urlName}</td>
              <td className="px-2 py-2 border">{url.baseUrl}</td>
              <td className="px-2 py-2 border">{BASE_URL + "/" + url.shortUrl}</td>
              {
              user?.accountType === ACCOUNT_TYPE.ADMIN ? (
                <td className="px-2 py-2 border">{url.creator.firstName} {url.creator.lastName}</td>
              ) : (
                <td className="px-2 py-2 max-w-xs border">
                <div
                  className="truncate overflow-hidden hover:overflow-visible 
                  hover:whitespace-normal relative"
                  title={url.description}
                >
                  {url.description.slice(0, 8)}...
                  <div className="absolute left-0 top-full mt-2 bg-red-400 
                  text-white-25 px-4 py-2 rounded-md opacity-0 invisible 
                  group-hover:visible group-hover:opacity-100 transition duration-100 z-10">
                    {url.description}
                  </div>
                </div>
              </td>
              )
             }
              <td className="px-2 py-2 border">{formatDate(url.createdAt)}</td>
              <td className="px-2 py-2 border">{formatDate(url.expirationDate)}</td>
              <td className="px-2 py-2 cursor-pointer border" onClick={() => handleShowCountryViews(url.id, url.visits[0]?.country || [])}>
                {url.visits.length > 0 ? url.visits[0].totalClicks : 0}
              </td>
              <td className="px-2 py-2 border">
                <span
                  className={`px-2 py-1 text-white rounded-full text-xs font-semibold ${
                    url.status === 'active'
                      ? 'bg-green-400'
                      : 'bg-red-400'
                  }`}
                >
                  {url.status}
                </span>
              </td>
              <td className="px-2 py-2 border">
                <div className=' flex items-center justify-center gap-2'>
                <button
                    onClick={() => url.status === 'suspended' ? handleActivate(url.id) : handleSuspend(url.id)}
                    className={`px-2 py-1 text-white rounded-md ${
                        url.status === 'suspended'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-400'
                    }`}
                    >
                    {url.status === 'suspended' ? 'Activate' : 'Suspend'}
                </button>
                <RiDeleteBin6Line className='text-red-400 cursor-pointer' 
                size={20} onClick={() => handleDelete(url.id)}/>
                <MdEdit size={20} className="text-blue-400 cursor-pointer" 
                onClick={() => handleEdit(url)}/></div>
            </td>
            </tr>
            ))}
         </>
        </tbody>
      </table> : 
      <div className='flex items-center justify-center bg-white shadow-md rounded-md p-6 
       border border-gray-400'>
        <h3 className='font-semibold text-gray-600 text-lg'>No Urls found</h3>
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
        countryViewsData={countryViewsData} 
        setShowCountryViews={setShowCountryViews} />
      )}
    </div>
);
};
export default UrlList;