import React, { useState } from 'react';
import { apiConnector } from '../../services/apiConnector';
import { guestEndPoints } from '../../services/apis';
import { toast } from 'react-hot-toast';
import { MdContentCopy } from "react-icons/md";

const {
     CREATE_TEMP_SHORT_URL_API,
  } = guestEndPoints

const ShortenUrlForm = () => {
  const [baseUrl, setBaseUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating..")
    try {
      const response = await apiConnector('POST', CREATE_TEMP_SHORT_URL_API,  { baseUrl });
      if(response.data.success){
        setShortUrl(response.data.shortUrl);
        toast.success("ShortUrl Created")
        toast.dismiss(toastId)
        setBaseUrl("")
      }
      if(response.data.invalidUrl){
        toast.dismiss(toastId)
        toast.error("Url is not valid")
      }
    } catch (error) {
      toast.dismiss(toastId)
      toast.error("Failed to create a short URL..")
    }
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Copied")
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Shorten URL</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Long URL"
          className="w-full p-2 mb-4 border rounded-md"
          required
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-150 text-white-25 py-2 px-4 rounded-md"
        >
          Shorten URL
        </button>
      </form>
      {shortUrl && (
        <div className="mt-4 flex items-center space-x-2">
          <a href={shortUrl} target='_blank' className="text-blue-200 font-medium">{shortUrl}</a>
          <button
            className="py-2 px-4 rounded-md"
            onClick={handleCopy}
          >
            <MdContentCopy/>
          </button>
        </div>
      )}
    </div>
  );
};

export default ShortenUrlForm;
