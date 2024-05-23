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
    <div className="w-11/12 bg-gray-100 mx-auto px-4 lg:px-16 py-10 overflow-x-auto min-h-screen h-auto border-gray-200">
      <div className="mb-4 flex justify-between items-center flex-wrap sm:flex-nowrap">
        <input
          type="text"
          placeholder="search by name email"
          value={filterText}
          onChange={handleFilterChange}
          className="shadow appearance-none z-10 border rounded xs:w-[80vw] lg:w-[450px] py-1.5 px-3 ml-1
           text-black leading-tight border-gray-300 focus:outline-none focus:shadow-outline"
        />
        <div className="flex gap-2 xs:grid xs:grid-cols-2 xs:mt-2">
          <button
            onClick={handleSelectAll}
            className="border border-gray-300 bg-white flex gap-2
               py-1.5 px-4 rounded-md hover:bg-gray-200"
            >
            {selectedUsers.length === filteredUsers.length
              ? 'Deselect All'
              : 'Select All'}
          </button>
          <button
            onClick={handleSuspendUsers}
            disabled={selectedUsers.length === 0}
            className={`border border-slate-300 flex gap-2 bg-gray-100
              py-1.5 px-4 rounded-md
            ${ selectedUsers.length === 0 ? 'cursor-not-allowed' : 'bg-white hover:bg-gray-200'
            }`}
          >
            Suspend
          </button>
          <button
            onClick={handleActivateUsers}
            disabled={selectedUsers.length === 0}
            className={`border border-green-300 flex gap-2 bg-gray-100
              py-1.5 px-4 rounded-md
            ${ selectedUsers.length === 0 ? 'cursor-not-allowed' : 'bg-white hover:bg-gray-200'
            }`}
          >
            Activate
          </button>
          <button
            onClick={handleDeleteUsers}
            disabled={selectedUsers.length === 0}
            className={`border border-red-300 flex gap-2 bg-gray-100
              py-1.5 px-4 rounded-md
            ${ selectedUsers.length === 0 ? 'cursor-not-allowed' : 'bg-white hover:bg-gray-200'
            }`}
            >
            Delete Users
          </button>
        </div>
      </div>
      <table className="bg-white w-full text-sm table-auto">
        <thead className='text-slate-800 rounded-md border border-gray-300'>
          <tr className="bg-gray-50">
            <th className="pl-1 py-1.5">Select</th>
            <th className="px-4 py-1.5">Username</th>
            <th className="px-4 py-1.5">Email</th>
            <th className="px-4 py-1.5">Created At</th>
            <th className="px-4 py-1.5">Status</th>
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
                  className="form-checkbox h-3 w-3 text-blue-500"
                />
              </td>
              <td className="border px-4 py-2">
                {user.firstName} {user.lastName}
              </td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">
                {formatDate(user.createdAt)}
              </td>
              <td className="px-4 py-2 flex items-center justify-center border-b border-r">
                <span className="px-2 py-1 rounded-md text-xs flex items-center justify-center bg-white border border-gray-300">
                  <span className={`rounded-full w-[5px] mt-1 h-[5px] mr-1 ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                   <span>{user.status}</span>
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
