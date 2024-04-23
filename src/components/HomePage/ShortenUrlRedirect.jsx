 import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiConnector } from '../../services/apiConnector';
import { guestEndPoints } from '../../services/apis';
const {
    GET_TEMP_SHORT_URL_API,
} = guestEndPoints

export default function ShortUrlRedirect() {
  const { shortUrl } = useParams();
  const redirect = async() => {
    try{
        const response = await apiConnector("GET", `${GET_TEMP_SHORT_URL_API}/${shortUrl}`)
        if(response.data.success){
            window.location.replace(response.data.baseUrl);
        }
    } catch(error){
        console.log("Error in redirecting to baseurl")
    }
  };

  useEffect(() => {
    if (shortUrl) {
      redirect();
    }
  }, [ shortUrl ]);

  return (
    <div>
      <h2>
        Redirecting...
      </h2>
    </div>
  );
}