//This is for the guest user to short the long url

import React, { useState } from 'react';
import { apiConnector } from '../../services/apiConnector';
import { guestEndPoints } from '../../services/apis';
import { toast } from 'react-hot-toast';
import { MdContentCopy } from "react-icons/md";
import { FaLink } from "react-icons/fa6";
import Spinner from '../common/Spinner';
import { SiTplink } from "react-icons/si";

const {
     CREATE_TEMP_SHORT_URL_API,
  } = guestEndPoints

const ShortenUrlForm = () => {
  const [baseUrl, setBaseUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await apiConnector('POST', CREATE_TEMP_SHORT_URL_API,  { baseUrl });
      if(response.data.success){
        setShortUrl(response.data.shortUrl);
        setBaseUrl("")
      }
      if(response.data.invalidUrl){
        
        toast.error("Url is not valid")
      } 
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error("Failed to create a short URL..")
    }
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Copied")
  };

  return (
    <div className="p-8 pb-16 mx-auto z-10 bg-white border border-gray-300 flex flex-col gap-3 sm:w-11/12 xs:w-full  md:w-10/12 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-4"> 
      <span><FaLink size={24} className='text-green-400'/></span>
      <span className='text-lg text-black'>Shorten a long URL</span>
      </h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type="text"s
          placeholder="Enter a long link here"
          className="block w-full px-2 rounded-md border-0 py-3 text-gray-900 
            shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
            focus:ring-2 focus:ring-inset focus:ring-indigo-300 sm:text-sm sm:leading-6"
          required
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
        />
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-blue-500 px-2
          py-3 text-sm font-semibold leading-6 text-white shadow-sm
            hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 
            focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          {loading ? <Spinner/> : <span>Shorten Url</span>}
        </button>
      </form>
      {shortUrl && (
        <div className="mt-4 flex flex-col gap-4">
        <div className='flex items-center gap-2'> 
          <span className='text-red-500'><SiTplink/></span> 
          <h3 className='text-semibold'>Shorted Url</h3>
        </div>
        <div> <a href={shortUrl} target='_blank' 
               className="w-full border border-slate-400 py-2 px-3 
               rounded-md text-green-400">{shortUrl}
               </a>
          <button className="py-2 px-4 rounded-md" onClick={handleCopy}>
            <MdContentCopy />
          </button>
        </div>
        </div>
      )}
    </div>
  );
};

export default ShortenUrlForm;
