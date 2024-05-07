import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiConnector } from '../../services/apiConnector';
import { guestEndPoints } from '../../services/apis';
import { toast } from "react-hot-toast"
import Spinner from '../common/Spinner';
// import AdComponent from '../common/AdComponent';

const { GET_TEMP_SHORT_URL_API, } = guestEndPoints;

export default function ShortUrlRedirect() {
  const { shortUrl } = useParams();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [iframeCompatible, setIframeCompatible] = useState(true);

  const redirect = async () => {
    setLoading(true);
    try {
      const response = await apiConnector("GET", `${GET_TEMP_SHORT_URL_API}/${shortUrl}`);
      if (response.data.success) {
        setUrl(response.data.baseUrl);
      }
    } catch (error) {
      toast.error("Not a valid url");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shortUrl) {
      redirect();
    }
  }, [shortUrl]);

  useEffect(() => {
    if (url) {
      const xhr = new XMLHttpRequest();
      xhr.open('HEAD', url);
      xhr.onload = () => {
        if (xhr.status === 200) {
          setIframeCompatible(true);
        } else {
          setIframeCompatible(false);
        }
      };
      xhr.onerror = () => {
        setIframeCompatible(false);
      };
      xhr.send();
    }
  }, [url]);

  return (
    <>
    <nav className='h-[40px] bg-blue-500'>Panel</nav>
    {loading ? (
      <div className='flex items-center justify-center mt-20'><Spinner/></div>
    ) : (
      <div className='bg-gray-100'>
        {/* <div className='md:w-7/12 lg:w-5/12 flex items-center justify-center mx-auto'><AdComponent/></div> */}
         {iframeCompatible ? (
          <iframe src={url} title="iframe" className='w-full h-[800px] '  allowFullScreen></iframe>
        ) : (
           <div className='flex flex-col items-center gap-4 justify-center'>
           <h3 className='text-lg text-slate-500 font-semibold'>Url is not campatible to load in iframe</h3>
           <h4 className='text-lg text-slate-500 font-semibold'>Go to original url</h4>
           <a href={url} target='_blank' className='py-2 px-3 bg-blue-150 rounded-md text-white-25'>{url}</a>
           </div>
        )}
      </div>
    )}
  </>
  );
}
