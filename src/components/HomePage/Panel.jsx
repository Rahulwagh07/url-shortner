import React, { useEffect, useState } from 'react'
import { panelOptionsEndpoints } from '../../services/apis'
import { useSelector } from 'react-redux';
import { apiConnector } from '../../services/apiConnector';
import { BACKEND_URL } from '../../utils/helper';
import { toast } from "react-hot-toast"

const BASE_URL = BACKEND_URL;
const{
  GET_PANEL_OPTIONS_API
} = panelOptionsEndpoints;

function Panel() {
  const { token } = useSelector((state) => state.auth);
  const [panelOptions, setPanelOptions] = useState([]);
  const [loading, setLoading] = useState(false);
   
  const fetchPanelOptions = async () => {
    setLoading(true)
    try {
      const response = await apiConnector("GET", GET_PANEL_OPTIONS_API, null, { Authorization: `Bearer ${token}` });
      setPanelOptions(response.data);
    } catch (error) {
      toast.error("Failed to fetch panel options");
      console.error('Error fetching panel options:', error);
    }
    setLoading(false)
  };

  useEffect(() => {
    fetchPanelOptions();
  }, []);
  return (
    <>
    {
      loading ? <div className='h-[40px] bg-blue-500'></div> : 
      <ul className='flex justify-end  lg:mr-2 gap-2 h-[40px] bg-blue-500'>
        {panelOptions.map(option => (
          <a href={option.redirectionUrl} target='_blank' key={option.id} 
          className="flex my-1 text-white text-xs gap-2
           items-center rounded-md cursor-pointer">
          <img src={`${BASE_URL}${option.optionIcon}`} className='aspect-square ml-1 w-[15px] rounded-full object-cover'
          />
            <span className='mr-4'>{option.optionName}</span>
          </a>
        ))}
      </ul>
    }
    
    </>
  )
}

export default Panel