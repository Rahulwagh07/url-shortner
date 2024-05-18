import React, { useState, useEffect, useRef } from 'react';
import { apiConnector } from '../../../services/apiConnector';
import { panelOptionsEndpoints } from "../../../services/apis";
import { FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { toast } from "react-hot-toast";
import AddPanel from './AddPanel';
import Category from './Category';
import { BACKEND_URL } from '../../../utils/helper';

const BASE_URL = BACKEND_URL;

const { GET_PANEL_OPTIONS_API, DELETE_PANEL_OPTIONS_API } = panelOptionsEndpoints;

function PanelOptions() {
  const { token } = useSelector((state) => state.auth);
  const [panelOptions, setPanelOptions] = useState([]);
   
  const fetchPanelOptions = async () => {
    try {
      const response = await apiConnector("GET", GET_PANEL_OPTIONS_API, null, { Authorization: `Bearer ${token}` });
      setPanelOptions(response.data);
    } catch (error) {
      toast.error("Failed to fetch panel options");
      console.error('Error fetching panel options:', error);
    }
  };

  useEffect(() => {
    fetchPanelOptions();
  }, []);

  const handleDeletePanelOption = async (id) => {
    try {
      await apiConnector("DELETE", `${DELETE_PANEL_OPTIONS_API}/${id}`, null, { Authorization: `Bearer ${token}` });
      setPanelOptions(panelOptions.filter(option => option.id !== id));
      toast.success("Panel option deleted successfully");
    } catch (error) {
      toast.error("Failed to delete panel option");
      console.error('Error deleting panel option:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 ">
    <AddPanel />
    <div className='bg-white  mt-8 border border-gray-300 shadow-sm rounded-md p-6'>
    <h2 className="text-2xl text-sky-400 font-semibold mt-2 mb-2">Panel Options</h2>
      <ul>
        {panelOptions.map(option => (
          <li key={option.id} className="flex xs:flex-col xs:items-start justify-between border-b py-2">
            <span className='mr-4'>{option.optionName}</span>
            <span className='mr-16 text-blue-150 font-semibold'>{option.redirectionUrl}</span>
            <a href={`${BASE_URL}${option.optionIcon}`} className='text-blue-500'>See image</a>
            <button onClick={() => handleDeletePanelOption(option.id)} className="text-red-500 hover:text-red-600">
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
      <Category />
    </div>
  );
}

export default PanelOptions;
