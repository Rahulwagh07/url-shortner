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
      console.log("GLOBAL VAR api res", response);
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
      <div className='flex flex-col'>
        {user?.accountType === ACCOUNT_TYPE.USER && (
          <div className='text-start'>
            <button
              onClick={openModal}
              className='text-white bg-gradient-to-r flex gap-2 items-center justify-center from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300
               dark:focus:ring-blue-800 font-semibold rounded-lg text-lg px-5 py-2.5'
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
          <div className="fixed inset-0  hs-overlay flex items-center justify-center z-50">
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
    )}
  </>
  );
}

export default ManageUrl;
