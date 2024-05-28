import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiConnector } from '../../services/apiConnector';
import { guestEndPoints } from '../../services/apis';
import { toast } from "react-hot-toast";
import Spinner from '../common/Spinner';
import Cookies from 'js-cookie';
import Panel from './Panel';

const { GET_TEMP_SHORT_URL_API,TRACK_VISITOR_DATA_API } = guestEndPoints;

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
        setLoading(false);
        let uniqueVisitorId = Cookies.get('uniqueVisitorId');
        if (!uniqueVisitorId) {
          uniqueVisitorId = await generateUniqueVisitorId();
          Cookies.set('uniqueVisitorId', uniqueVisitorId, { expires: 365 }); 
        }
        try {
          await apiConnector("POST", TRACK_VISITOR_DATA_API, {
            url: response.data.baseUrl,
            uniqueVisitorId,
          });
        } catch (error) {
          console.error('Error recording visit:', error);
        }
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
  }, []);

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

  const generateUniqueVisitorId = async () => {
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const hardwareConcurrency = navigator.hardwareConcurrency;
    const screenWidth = screen.width;
    const screenHeight = screen.height;
    const pixelRatio = window.devicePixelRatio;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const fingerprint = `${userAgent}|${language}|${hardwareConcurrency}|${screenWidth}x${screenHeight}|${pixelRatio}|${timezone}`;

    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(fingerprint));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
  };

  return (
    <>
      <Panel/>
      {loading ? (
        <div className='flex items-center justify-center mt-20'>
          <Spinner />
        </div>
      ) : (
        <div className=''>
          {/* <div className='md:w-7/12 lg:w-5/12 flex items-center justify-center mx-auto'><AdComponent/></div> */}
          {iframeCompatible ? (
            <iframe src={url} title="iframe" className='w-full min-h-screen' allowFullScreen></iframe>
          ) : (
          <div className='flex items-center justify-center mt-20'>
          <div className='flex flex-col items-center gap-4 justify-center bg-white shadow-lg border border-gray-300 p-8'>
              <h3 className='text-lg text-gray-700 font-semibold'>Url is not compatible to load in iframe</h3>
              <h4 className='text-lg text-gray-700 font-semibold'>Go to original url</h4>
              <a href={url} target='_blank' rel="noreferrer" className='py-2 px-3 bg-blue-150 rounded-md text-white'>
                {url}
              </a>
            </div>
          </div>
          )}
        </div>
      )}
    </>
  );
}
