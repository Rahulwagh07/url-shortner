import React, { useState } from 'react';
import { apiConnector } from '../../services/apiConnector';
import { urlEndPoints } from '../../services/apis';
import { toast } from 'react-hot-toast';
import { MdContentCopy } from "react-icons/md";
import { FaLink } from "react-icons/fa6";
import Spinner from '../common/Spinner';
import { useSelector } from 'react-redux';
import { IoMdClose } from "react-icons/io";
import { SiTplink } from "react-icons/si";

const { CREATE_SHORT_URL_API } = urlEndPoints;

const CreateUrlForm = ({ setIsOpen, tempUrlActiveDays, goldUrlActiveDays, silverUrlActiveDays, platinumUrlActiveDays }) => {
  const { token } = useSelector((state) => state.auth);
  const [baseUrl, setBaseUrl] = useState('');
  const [urlName, setUrlName] = useState('');
  const [description, setDescription] = useState('');
  const [customCharacters, setCustomCharacters] = useState('');
  const [tier, setTier] = useState('');
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
      },
      {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      });
      const { isBlockedWord, isDomainBlocked, customCharAlreadyExist, isValidUrl } = response.data;
      console.log(isBlockedWord, isDomainBlocked, customCharAlreadyExist, isValidUrl);
      if (response.data.success) {
        setShortUrl(response.data.shortUrl);
        setBaseUrl("");
        setUrlName("");
        setDescription("");
        setTier("");
        setLoading(false);
        return;
      }
      if (isBlockedWord) {
        toast.error("Custom characters contain blocked words.");
        setLoading(false);
        return;
      } 
      if (isDomainBlocked) {
        toast.error("Source URL is blocked.");
        setLoading(false);
        return;
      } 
      if (customCharAlreadyExist) {
        toast.error("Custom characters are already taken.");
        setLoading(false);
        return;
      }
      if (isValidUrl) {
        toast.error("URL is not valid");
        setLoading(false);
        return;
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
    <div className="p-8 pb-16 bg-gray-100 mx-auto flex flex-col 
      gap-3 sm:w-11/12 xs:w-full md:w-10/12 rounded-md shadow-md">
      <h2 className="text-lg relative font-semibold mb-4 flex items-center gap-4">
        <span><FaLink size={24} className='text-green-400' /></span>
        <span className='text-lg text-black'>Shorten a long URL</span>
        <IoMdClose onClick={() => setIsOpen(false)} size={24} 
          className='absolute cursor-pointer right-2 top-1'/>
      </h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type="text"
          placeholder="Enter a long link here"
          className="px-2 py-2 border border-green-500 rounded-md"
          required
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
        />
        <div className='w-full relative'>
          <input
            type="text"
            placeholder="url name (optional)"
            className="px-2 py-2 w-full border border-green-500 rounded-md 
              focus:outline-none focus:border-blue-500"
            value={urlName}
            onChange={(e) => setUrlName(e.target.value)}
            maxLength={15}
          />
          {urlName.length > 0 && (
            <span className="absolute top-0 right-1 text-xs"> {urlName.length}/15</span>
          )}
        </div>

        <div className='w-full relative'>
          <input
            type="text"
            placeholder="custom characters (optional)"
            className={`px-2 py-2 w-full border border-green-500 rounded-md`}
            value={customCharacters}
            onChange={(e) => setCustomCharacters(e.target.value)}
            minLength={5}
            maxLength={16}
          />
          {customCharacters.length > 0 && (
            <span className="absolute top-0 right-1 text-xs">{customCharacters.length}/16</span>
          )}
        </div>

        <div className='w-full relative'>
          <input
            type="text"
            placeholder="description (optional)"
            className="px-2 py-2 border w-full border-green-500 rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={250}
          />
          {description.length > 0 && (
            <span className="absolute top-0 right-1 text-xs"> {description.length}/250</span>
          )}
        </div>
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          className="px-2 py-2 border border-green-500 rounded-md"
          required
        >
          <option value="" disabled hidden>Select Tier</option>
          <option value="temp">Temporary: {tempUrlActiveDays}days</option>
          <option value="silver">Silver: {silverUrlActiveDays}days</option>
          <option value="gold">Gold: {goldUrlActiveDays}days</option>
          <option value="platinum">Platinum: {platinumUrlActiveDays}days</option>
        </select>
        <button
          type="submit"
          className="bg-blue-150 px-2 py-2 flex items-center justify-center text-white rounded-md"
        >
          {loading ? <Spinner /> : <span>Shorten Url</span>}
        </button>
      </form>
      {shortUrl && (
        <div className="mt-4 flex flex-col gap-4">
          <div className='flex items-center gap-2'> 
            <span className='text-red-500'><SiTplink/></span> 
            <h3 className='text-semibold'>Shorted Url</h3>
          </div>
          <div>
            <a href={shortUrl} target='_blank' 
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

export default CreateUrlForm;
