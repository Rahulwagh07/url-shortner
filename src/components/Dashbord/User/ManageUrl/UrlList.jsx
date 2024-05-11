import React, { useState, useEffect } from 'react';
import { apiConnector } from '../../../../services/apiConnector';
import { manageUrlEndpoints } from '../../../../services/apis';
import { useSelector } from 'react-redux';
import Spinner from '../../../common/Spinner';
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import EditModal from './EditModal';
import { FRONTEND_URL } from '../../../../utils/helper';

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
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedUrlEdit, setSelectedUrlEdit] = useState();

  useEffect(() => {
    fetchUrls();
  }, []);

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
      await apiConnector("PUT", `${SUSPEND_URL_API}/${urlId}`, null, {
        Authorization: `Bearer ${token}`,
    });
      fetchUrls();
    } catch (error) {
      console.error('Error suspending URL:', error);
    }
  };

  const handleActivate = async (urlId) => {
    try {
      await apiConnector("PUT", `${ACTIVATE_URL_API}/${urlId}`, null, {
        Authorization: `Bearer ${token}`,
    });
      fetchUrls();
    } catch (error) {
      console.error('Error suspending URL:', error);
    }
  };

  const handleDelete = async (urlId) => {
    try {
       await apiConnector("DELETE", `${DELETE_URL_API}/${urlId}`, null, {
        Authorization: `Bearer ${token}`,
    });
      fetchUrls();
    } catch (error) {
      console.error('Error deleting URL:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await apiConnector("DELETE", DELETE_BULK_URLS_API, { urlIds: selectedUrls }, {
        Authorization: `Bearer ${token}`,
      });
      setSelectedUrls([]);
      fetchUrls();
    } catch (error) {
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
    <div className="container mx-auto py-8">
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Filter URLs by name"
          value={filterText}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded-md 
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSortChange}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Sort by Name
        </button>
        <button
          onClick={handleSelectAll}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          {selectedUrls.length === urls.length ? 'Deselect All' : 'Select All'}
        </button>
        <button
          onClick={handleBulkDelete}
          disabled={selectedUrls.length === 0}
          className={`px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 ${
            selectedUrls.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Delete Selected
        </button>
      </div>
      <table className="w-full table-auto">
        <thead className='text-sky-400'>
          <tr className="bg-gray-200">
            <th className="pl-4 py-2">Select</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Base URL</th>
            <th className="px-4 py-2">Shortened URL</th>
            <th className="px-4 py-2">Description</th>
            {/* <th className="px-4 py-2">Visits</th> */}
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
         { loading ? <div className='flex items-center justify-center mt-4'><Spinner/></div> : <>
         {sortedUrls.map((url) => (
            <tr key={url.id} className="border-b">
              <td className="pl-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedUrls.includes(url.id)}
                  onChange={() => handleSelect(url.id)}
                  className="form-checkbox h-4 w-4 text-blue-500"
                />
              </td>
              <td className="px-4 py-2">{url.urlName}</td>
              <td className="px-4 py-2">{url.baseUrl}</td>
              <td className="px-4 py-2">{BASE_URL + "/" + url.shortUrl}</td>
              <td className="px-4 py-2 max-w-xs">
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
              {/* <td className="px-4 py-2">
                <a
                  href="#"
                  onClick={() => handleVisitDetails(url.id)}
                  className="text-blue-500 hover:underline"
                >
                  {url.visits}
                </a>
              </td> */}
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    url.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {url.status}
                </span>
              </td>
              <td className="px-4 py-2">
                <div className=' flex items-center justify-center gap-2'><button
                    onClick={() => url.status === 'suspended' ? handleActivate(url.id) : handleSuspend(url.id)}
                    className={`px-2 py-1 text-white rounded-md ${
                        url.status === 'suspended'
                        ? 'bg-yellow-500 hover:bg-yellow-600'
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
         </>}
        </tbody>
        </table>
        {editModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
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
    </div>
);
};
export default UrlList;