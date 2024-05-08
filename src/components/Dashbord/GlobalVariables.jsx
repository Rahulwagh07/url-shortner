import React, { useState, useEffect } from 'react';
import { apiConnector } from '../../services/apiConnector';
import { globalVariablesEndpoints } from "../../services/apis";
import { useSelector } from 'react-redux';
import { toast } from "react-hot-toast";
import BlockedFields from './BlockedFields';

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

  useEffect(() => {
    fetchGlobalVariables();
  }, []);

  const fetchGlobalVariables = async () => {
    try {
      const response = await apiConnector("GET", GET_GLOBAL_VARIABLE_API, null, {
        Authorization: `Bearer ${token}`,
      });
      const data = response.data.data;
      setBlockedDomains(data?.blockedDomains);
      setBlockedWords(data?.blockedWords);
      // Filter out _id, spam words, and blocked domain
      const filteredData = Object.keys(data)
        .filter(key => key !== '_id' && key !== 'blockedDomains' && key !== 'blockedWords'
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
  };

  return (
    <div className='flex flex-col'>
      {globalVariables ? (
        <div className='flex flex-col'>
          <div className='grid grid-cols-2'>
            {Object.entries(globalVariables).map(([key, value]) => (
              <div key={key} className="flex items-center mb-2">
                <label className="mr-2">{key}:</label>
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
                    className="border border-gray-300 rounded-md px-2 py-1 ml-2"
                  />
                }
              </div>
            ))}
          </div>
          <button
            onClick={handleUpdateGlobalVariables}
            className="bg-black text-white rounded-md px-4 py-2"
          >
            Update
          </button>
          <BlockedFields
            blockedDomains={blockedDomains} blockedWords={blockedWords}
            setBlockedDomains={setBlockedDomains} setBlockedWords={setBlockedWords}
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default GlobalVariables;
