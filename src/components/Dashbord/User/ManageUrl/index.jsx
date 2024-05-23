import React, { useEffect, useState } from 'react';
import CreateUrlForm from '../../../HomePage/CreateUrlForm';
import { apiConnector } from '../../../../services/apiConnector';
import { globalVariablesEndpoints } from '../../../../services/apis';
import { useSelector } from 'react-redux';
import UrlList from './UrlList';
import { ACCOUNT_TYPE } from '../../../../utils/constants';
import Spinner from '../../../common/Spinner';
import { FaLink } from "react-icons/fa6";

const { GET_GLOBAL_VARIABLE_API } = globalVariablesEndpoints;

function ManageUrl() {
  const [isOpen, setIsOpen] = useState(false);
  const [globalVariables, setGlobalVariables] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);

  const openModal = () => {
    setIsOpen(!isOpen);
  };

  const fetchGlobalVariables = async () => {
    setLoading(true);
    try {
      const response = await apiConnector("GET", GET_GLOBAL_VARIABLE_API, null, {
        Authorization: `Bearer ${token}`,
      });
      const data = response.data.data;
      setGlobalVariables(data);
    } catch (error) {
      console.error('Error fetching global variables:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalVariables();
  }, []);

  return (
  <>
    {loading ? (
      <div className='flex items-center justify-center'>
        <Spinner />
      </div>
    ) : (
      <div className='w-11/12 bg-gray-100 mx-auto px-4 lg:px-16 py-10 overflow-x-auto min-h-screen h-auto border-gray-200'>
      <div className='flex flex-col  w-full'>
        {user?.accountType === ACCOUNT_TYPE.USER && (
          <div className='text-start'>
            <button
              onClick={openModal}
              className='text-white bg-gradient-to-r flex gap-2 items-center justify-center from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300
               dark:focus:ring-blue-800 font-normal rounded-md text-lg px-3 py-1.5'
            >
            <span> Create New</span> <FaLink/>
            </button>
          </div>
        )}
        {globalVariables && (
          <UrlList
            tempUrlActiveDays={globalVariables.tempUrlActiveDays}
            goldUrlActiveDays={globalVariables.goldUrlActiveDays}
            silverUrlActiveDays={globalVariables.silverUrlActiveDays}
            platinumUrlActiveDays={globalVariables.platinumUrlActiveDays}
          />
        )}
        {isOpen && (
          <div className="fixed inset-0  hs-overlay flex items-center justify-center z-50
          bg-black  bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
            <div className='md:w-5/12 xs:w-11/12'>
              <CreateUrlForm
                setIsOpen={setIsOpen}
                tempUrlActiveDays={globalVariables.tempUrlActiveDays}
                goldUrlActiveDays={globalVariables.goldUrlActiveDays}
                silverUrlActiveDays={globalVariables.silverUrlActiveDays}
                platinumUrlActiveDays={globalVariables.platinumUrlActiveDays}
              />
            </div>
          </div>
        )}
      </div>
      </div>
    )}
  </>
  );
}

export default ManageUrl;
