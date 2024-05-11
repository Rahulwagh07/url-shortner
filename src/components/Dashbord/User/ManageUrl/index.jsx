import React, { useEffect, useState } from 'react';
import CreateUrlForm from '../../../HomePage/CreateUrlForm';
import { apiConnector } from '../../../../services/apiConnector';
import { globalVariablesEndpoints } from '../../../../services/apis';
import { useSelector } from 'react-redux';
import UrlList from './UrlList';

const {
  GET_GLOBAL_VARIABLE_API,
} = globalVariablesEndpoints;
 
function ManageUrl() {
  const [isOpen, setIsOpen] = useState(false)
  const [globalVariables, setGlobalVariables] = useState()
  const { token } = useSelector((state) => state.auth)
   
  const openModal = () => {
    setIsOpen(!isOpen);
  };

  const fetchGlobalVariables = async () => {
    try {
        const response = await apiConnector("GET", GET_GLOBAL_VARIABLE_API, null, {
            Authorization: `Bearer ${token}`,
        });
        const data = response.data.data
        setGlobalVariables(data)
        console.log("DATA", data)
    } catch (error) {
        console.error('Error fetching global variables:', error);
    }
 };
 useEffect(() => {
  fetchGlobalVariables()
 }, []);
  return (
    <div className='flex flex-col'>
      <div className='text-start'>
      <button
        onClick={openModal}
        className="border rounded-md text-white bg-black px-6 py-1"
      >
        Short Url
      </button>
      </div>
      <UrlList/>
      
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
         <div className='md:w-5/12'>

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
  );
}

export default ManageUrl;