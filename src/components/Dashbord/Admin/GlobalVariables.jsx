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

  useEffect(() => {
    fetchGlobalVariables();
  }, []);

  const fetchGlobalVariables = async () => {
    setLoading(true)
    try {
      const response = await apiConnector("GET", GET_GLOBAL_VARIABLE_API, null, {
        Authorization: `Bearer ${token}`,
      });
      const data = response.data.data;
      setBlockedDomains(data?.blockedDomains);
      setBlockedWords(data?.blockedWords);
      const filteredData = Object.keys(data)
        .filter(key => key !== 'id' && key !== 'blockedDomains' && key !== 'blockedWords'
          && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt')
        .reduce((obj, key) => {
          obj[key] = data[key];
          return obj;
        }, {});
      setGlobalVariables(filteredData);
      setOriginalGlobalVariables(filteredData);
    } catch (error) {
      toast.error("Failed to fetch the global variable");
      console.error('Error fetching global variables:', error);
    }
    setLoading(false)
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setGlobalVariables(prevState => ({
      ...prevState,
      [name]: newValue
    }));
  };

  const handleUpdateGlobalVariables = async () => {
    setLoading(true)
    try {
      const updatedValuesArray = Object.values(globalVariables);
      const originalValuesArray = Object.values(originalGlobalVariables);
      // Compare the updated values with the original
      const valuesChanged = updatedValuesArray.some((value, index) => value !== originalValuesArray[index]);
      if (valuesChanged) {
        const response = await apiConnector("PUT", UPDATE_GLOBAL_VARIABLE_API, globalVariables, {
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
    setLoading(false)
  };

  return (
    <div className='flex flex-col'>
    {globalVariables ? (
      <div className='flex flex-col'>
      <div className='bg-white border border-gray-300 shadow-sm rounded-md p-6'>
      <h2 className="text-lg font-semibold mb-2 text-sky-400">Global Variables</h2>
      <div className='grid grid-cols-2 xs:grid-cols-1 xs:place-content-center mx-auto'>
            {Object.entries(globalVariables).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <label className="block text-sm font-medium leading-6 text-gray-900 mt-2 uppercase">{key}</label>
                {typeof value === 'boolean' ?
                  <input
                    type="checkbox"
                    name={key}
                    checked={value}
                    onChange={handleChange}
                    className="form-checkbox"
                  />
                  :
                  <input
                    type="number"
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="block w-[200px] rounded-md border-0 py-1.5 text-gray-900
                 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                }
              </div>
            ))}
          </div>
          <div className='text-center mt-2'>
          <button
            onClick={handleUpdateGlobalVariables}
            className="bg-blue-500 hover:bg-blue-400  text-white 
              font-bold py-1 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
          >
          {loading ? <div className='flex items-center justify-center'><Spinner/></div> : "Update global variables"}
          </button>
          </div>
      </div> 
        <BlockedFields
          blockedDomains={blockedDomains} blockedWords={blockedWords}
          setBlockedDomains={setBlockedDomains} setBlockedWords={setBlockedWords}
        />
      </div>
    ) : (
      <div className='flex items-center justify-center'><Spinner/></div>
    )}
    </div>
  );
}

export default GlobalVariables;
