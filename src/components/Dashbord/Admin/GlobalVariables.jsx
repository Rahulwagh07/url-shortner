import React, { useState, useEffect } from 'react';
import { apiConnector } from '../../../services/apiConnector';
import { globalVariablesEndpoints } from "../../../services/apis";
import { useSelector } from 'react-redux';
import { toast } from "react-hot-toast";
import BlockedFields from './BlockedFields';
import Spinner from '../../common/Spinner';

const {
    GET_GLOBAL_VARIABLE_API,
    UPDATE_GLOBAL_VARIABLE_API,
} = globalVariablesEndpoints;

function GlobalVariables() {
  const { token } = useSelector((state) => state.auth);
  const [globalVariables, setGlobalVariables] = useState(null);
  const [originalGlobalVariables, setOriginalGlobalVariables] = useState(null);
  const [blockedDomains, setBlockedDomains] = useState(null);
  const [blockedWords, setBlockedWords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [upLoading, setUpLoading] = useState(false);

  useEffect(() => {
    fetchGlobalVariables();
  }, []);

  const fetchGlobalVariables = async () => {
    setLoading(true);
    try {
      const response = await apiConnector("GET", GET_GLOBAL_VARIABLE_API, null, {
        Authorization: `Bearer ${token}`,
      });
      const data = response.data.data;
      setBlockedDomains(data?.blockedDomains);
      setBlockedWords(data?.blockedWords);
      setGlobalVariables(data);
      setOriginalGlobalVariables(data);
    } catch (error) {
      toast.error("Failed to fetch the global variables");
      console.error('Error fetching global variables:', error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : Number(value);
    setGlobalVariables(prevState => ({
      ...prevState,
      [name]: newValue
    }));
  };

  const handleUpdateGlobalVariables = async () => {
    setUpLoading(true);
    try {
      const updatedValuesArray = Object.values(globalVariables);
      const originalValuesArray = Object.values(originalGlobalVariables);
      const valuesChanged = updatedValuesArray.some((value, index) => value !== originalValuesArray[index]);
      if (valuesChanged) {
        await apiConnector("PUT", UPDATE_GLOBAL_VARIABLE_API, globalVariables, {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        });
        toast.success("Global Variables updated");
      } else {
        toast.success("You have not changed any value");
      }
    } catch (error) {
      console.error('Error updating global variables:', error);
    }
    setUpLoading(false);
  };

 
  return (
    <div className='flex flex-col'>
    {
      loading ? <div className='flex items-center justify-center'><Spinner/></div> :
      (
        <div className='flex flex-col'>
        <div className='bg-white border border-gray-300 shadow-sm rounded-md p-6 flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8'>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h3 className="text-center text-xl mb-2 font-bold leading-9 tracking-tight text-gray-900">
          Global Variables
        </h3>
      </div>
      <div className='"mt-6 sm:mx-auto sm:w-full sm:max-w-sm'> 
      <form className="space-y-6">
            <div className='lg:flex lg:gap-2'>
            <div>
            <label className="block text-sm font-medium text-gray-900">
            Temp Url ActiveDays
            </label>
            <input
                type="number"
                name="tempUrlActiveDays"
                value={globalVariables?.tempUrlActiveDays || 0}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 
              shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
              focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-900">
            Silver Active Days
            </label>
            <input
                type="number"
                name="silverUrlActiveDays"
                value={globalVariables?.silverUrlActiveDays || 0}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 
              shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
              focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            </div>
            </div>
            <div className='lg:flex lg:gap-2'>
            <div>
            <label className="block text-sm font-medium text-gray-900">
            Gold Active Days
            </label>
            <input
                type="number"
                name="goldUrlActiveDays"
                value={globalVariables?.goldUrlActiveDays || 0}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 
              shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
              focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-900">
            Platinum Active Days
            </label>
            <input
                type="number"
                name="platinumUrlActiveDays"
                value={globalVariables?.platinumUrlActiveDays || 0}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 
              shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
              focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            </div>
            </div>
          <div className='lg:flex lg:gap-2'>
          <div>
            <label className="block text-sm font-medium text-gray-900">
            Report Expiration Days
            </label>
            <input
                type="number"
                name="reportExpirationDays"
                value={globalVariables?.reportExpirationDays || 0}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 
              shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
              focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-900">
            Max Report Records
            </label>
            <input
                type="number"
                name="maxReportRecords"
                value={globalVariables?.maxReportRecords || 0}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 
              shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
              focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            </div>
          </div>
            <div className='flex gap-2 items-center'>
            <input
                type="checkbox"
                name="generateReportDisabled"
                checked={globalVariables?.generateReportDisabled || false}
                onChange={handleChange}
                className="form-checkbox w-5 h-5 rounded-md cursor-pointer"
              />
            <label className="block text-sm font-medium text-gray-900">
            Generate Report Disabled
            </label>
            </div>
            <div className='flex gap-2 items-center'>
            <input
                type="checkbox"
                name="generatedReportDisabled"
                checked={globalVariables?.generatedReportDisabled || false}
                onChange={handleChange}
                className="form-checkbox w-5 h-5 rounded-md cursor-pointer"
              />
            <label className="block text-sm font-medium text-gray-900">
            Generated Report Disabled
            </label>
            </div>
            
            <div className='flex gap-2 items-center'>
            <input
                type="checkbox"
                name="pauseGeneratedReportDisabled"
                checked={globalVariables?.pauseGeneratedReportDisabled || false}
                onChange={handleChange}
                className="form-checkbox w-5 h-5 rounded-md cursor-pointer"
              />
            <label className="block text-sm font-medium text-gray-900">
            Pause Generated Report Disabled
            </label>
            </div>
          </form>
          <div className='text-center mt-3'>
            <button
              onClick={handleUpdateGlobalVariables}
              className="bg-blue-500 hover:bg-blue-400 text-white 
                font-bold w-full py-1.5 px-4 border-blue-700 hover:border-blue-500 rounded"
            >
              {upLoading ? <div className='flex items-center justify-center'><Spinner/></div> : "Update"}
            </button>
          </div>
      </div>
        </div> 
      {
        globalVariables && 
        <BlockedFields
          blockedDomains={blockedDomains} blockedWords={blockedWords}
          setBlockedDomains={setBlockedDomains} setBlockedWords={setBlockedWords}
        />
      }
      </div>
      )
    }
    </div>
  );
}

export default GlobalVariables;
