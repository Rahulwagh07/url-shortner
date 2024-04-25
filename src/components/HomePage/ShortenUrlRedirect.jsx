import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiConnector } from '../../services/apiConnector';
import { guestEndPoints } from '../../services/apis';
import { toast } from "react-hot-toast"
import Spinner from '../common/Spinner';

const { GET_TEMP_SHORT_URL_API, } = guestEndPoints

export default function ShortUrlRedirect() {
  const { shortUrl } = useParams();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');

  const redirect = async () => {
    setLoading(true);
    try {
      const response = await apiConnector("GET", `${GET_TEMP_SHORT_URL_API}/${shortUrl}`);
      if (response.data.success) {
        setUrl(response.data.baseUrl);
      }
    } catch (error) {
      toast.error("Enter a valid url");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shortUrl) {
      redirect();
    }
  }, [shortUrl]);

  return (
    <>
    <nav className='h-[40px] bg-gray-500'>Panel</nav>
      {loading ? (
        <div className='flex items-center justify-center'><Spinner/></div>
      ) : url ? (
        <div className='flex'>
        <iframe src={url} title="iframe" className='w-full h-[800px]' allowFullScreen></iframe>
        <div className='w-[320px] bg-blue-150'></div>
        </div>
      ) : (
        <p>Enter a valid url</p>
      )}
    </>
  );
}