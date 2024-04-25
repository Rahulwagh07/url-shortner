import React, { useState } from 'react';
import { apiConnector } from '../../services/apiConnector';
import { urlEndPoints } from '../../services/apis';
import { toast } from 'react-hot-toast';
import { MdContentCopy } from "react-icons/md";
import { FaLink } from "react-icons/fa6";
import Spinner from '../common/Spinner';
import { useSelector } from 'react-redux';

const { CREATE_SHORT_URL_API } = urlEndPoints;

const CreateUrlForm = () => {
  const { token } = useSelector((state) => state.auth)
  const [baseUrl, setBaseUrl] = useState('');
  const [urlName, setUrlName] = useState('');
  const [description, setDescription] = useState('');
  const [customCharacters, setCustomCharacters] = useState('');
  const [tier, setTier] = useState('silver');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiConnector('POST', CREATE_SHORT_URL_API, {
        baseUrl,
        urlName,
        description,
        customCharacters,
        tier,
      });
      if (response.data.success) {
        setShortUrl(response.data.shortUrl);
        setBaseUrl("");
        setUrlName("");
        setDescription("");
        setCustomCharacters("");
        setTier("silver");
      }
      if (response.data.invalidUrl) {
        toast.error("Url is not valid");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to create a short URL..");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Copied");
  };

  return (
    <div className="p-8 pb-16 mx-auto flex flex-col gap-3 sm:w-11/12 xs:w-full md:w-10/12 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-4">
        <span><FaLink size={24} className='text-green-400' /></span>
        <span className='text-lg text-black'>Shorten a long URL</span>
      </h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type="text"
          placeholder="Enter a long link here"
          className="px-2 py-3 mb-4 border border-indigo-300 rounded-md"
          required
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter a URL name (optional)"
          className="px-2 py-3 mb-4 border border-indigo-300 rounded-md"
          value={urlName}
          onChange={(e) => setUrlName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter a description (optional)"
          className="px-2 py-3 mb-4 border border-indigo-300 rounded-md"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter custom characters (optional)"
          className="px-2 py-3 mb-4 border border-indigo-300 rounded-md"
          value={customCharacters}
          onChange={(e) => setCustomCharacters(e.target.value)}
        />
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          className="px-2 py-3 mb-4 border border-indigo-300 rounded-md"
        >
          <option value="silver">Silver</option>
          <option value="gold">Gold</option>
          <option value="platinum">Platinum</option>
        </select>
        <button
          type="submit"
          className="bg-blue-150 px-2 py-3 flex items-center justify-center text-white-25 rounded-md"
        >
          {loading ? <Spinner /> : <span>Shorten Url</span>}
        </button>
      </form>
      {shortUrl && (
        <div className="mt-4 flex items-center space-x-2">
          <a href={shortUrl} target='_blank' className="w-full p-2 text-blue-800">{shortUrl}</a>
          <button className="py-2 px-4 rounded-md" onClick={handleCopy}>
            <MdContentCopy />
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateUrlForm;