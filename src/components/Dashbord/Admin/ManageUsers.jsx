import React, { useState, useEffect } from 'react';
import { apiConnector } from '../../../services/apiConnector';
import { manageUserEndpoints } from '../../../services/apis';
import { useSelector } from 'react-redux';
import { formatDate } from '../../../utils/FormatDate';
import Spinner from '../../common/Spinner';

const {
  GET_ALL_USERS_API,
  SUSPEND_USERS_API,
  ACTIVATE_USERS_API,
  DELETE_USERS_API,
} = manageUserEndpoints;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(filterText.toLowerCase()) ||
          user.lastName.toLowerCase().includes(filterText.toLowerCase()) ||
          user.email.toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [users, filterText]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiConnector('GET', GET_ALL_USERS_API, null, {
        Authorization: `Bearer ${token}`,
      });
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const handleSuspendUsers = async () => {
    try {
      await apiConnector('PUT', SUSPEND_USERS_API, 
      { userIds: selectedUsers }, {
        Authorization: `Bearer ${token}`,
      });
      fetchUsers();  
      setSelectedUsers([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleActivateUsers = async () => {
    try {
      await apiConnector('PUT', ACTIVATE_USERS_API, 
        { userIds: selectedUsers }, 
      {
        Authorization: `Bearer ${token}`,
      });
      fetchUsers();  
      setSelectedUsers([]);  
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUsers = async () => {
    try {
      await apiConnector('DELETE', DELETE_USERS_API, 
        { userIds: selectedUsers }, 
      {
        Authorization: `Bearer ${token}`,
      });
      fetchUsers();  
      setSelectedUsers([]);  
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-4 flex justify-between items-center flex-wrap sm:flex-nowrap">
        <input
          type="text"
          placeholder="search by name email"
          value={filterText}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded-md 
          focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto mb-2 sm:mb-0"
        />
        <div className="flex flex-wrap sm:flex-nowrap">
          <button
            onClick={handleSelectAll}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold 
            py-2 px-4 rounded mr-2 mb-2 sm:mb-0"
          >
            {selectedUsers.length === filteredUsers.length
              ? 'Deselect All'
              : 'Select All'}
          </button>
          <button
            onClick={handleSuspendUsers}
            disabled={selectedUsers.length === 0}
            className="bg-red-500 hover:bg-red-700 text-white font-bold 
            py-2 px-4 rounded mr-2 disabled:opacity-50 disabled:cursor-not-allowed mb-2 sm:mb-0"
          >
            Suspend Users
          </button>
          <button
            onClick={handleActivateUsers}
            disabled={selectedUsers.length === 0}
            className="bg-green-500 hover:bg-green-700 text-white 
             font-bold py-2 px-4 rounded mr-2 disabled:opacity-50 disabled:cursor-not-allowed mb-2 sm:mb-0"
          >
            Activate Users
          </button>
          <button
            onClick={handleDeleteUsers}
            disabled={selectedUsers.length === 0}
            className="bg-red-700 hover:bg-red-900 text-white 
             font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed mb-2 sm:mb-0"
          >
            Delete Users
          </button>
        </div>
      </div>
      <table className="w-full table-auto">
        <thead className='text-sky-400'>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Select</th>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        {
          loading ? <div className='flex items-center justify-center'><Spinner/></div> : 
          <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleSelectUser(user.id)}
                  className="form-checkbox"
                />
              </td>
              <td className="border px-4 py-2">
                {user.firstName} {user.lastName}
              </td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">
                {formatDate(user.createdAt)}
              </td>
              <td className="border px-4 py-2">
               <span className={`px-2 py-1 text-white rounded-md ${
                  user.status === 'suspended'
                  ? 'bg-red-400'
                  : 'bg-green-400'
               }`}>
              {user.status}
               </span>
              </td>
            </tr>
          ))}
        </tbody>
        }
      </table>
    </div>
  );
};

export default ManageUsers;
