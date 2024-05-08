import React, { useState } from 'react';
import { apiConnector } from '../../../services/apiConnector';
import { manageUrlEndpoints } from '../../../services/apis';
import { toast } from 'react-hot-toast';
import { FaLink } from "react-icons/fa6";
import Spinner from '../../common/Spinner';
import { useSelector } from 'react-redux';
import { IoMdClose } from "react-icons/io";

const {
    EDIT_URL_API,
} = manageUrlEndpoints

const EditModal = ({url, setEditModal, tempUrlActiveDays, goldUrlActiveDays, silverUrlActiveDays, platinumUrlActiveDays}) => {
  const { token } = useSelector((state) => state.auth)
  const [baseUrl, setBaseUrl] = useState(url.baseUrl);
  const [urlName, setUrlName] = useState(url.urlName);
  const [description, setDescription] = useState(url.description);
  const [customCharacters, setCustomCharacters] = useState(url.shortUrl);
  const [tier, setTier] = useState('');
  const [loading, setLoading] = useState(false);
  const urlId = url.id;
  console.log("urlId", urlId)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiConnector('PUT', `${EDIT_URL_API}/${urlId}`, {
        baseUrl,
        urlName,
        description,
        customCharacters,
        tier,
        }, 
        {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        }
      );
      const { isBlockedWord, isDomainBlocked, customCharAlreadyExist, isValidUrl } = response.data;
      console.log( isBlockedWord, isDomainBlocked, customCharAlreadyExist, isValidUrl )
      if (response.data.success) {
        toast.success("Url Updated")
        setEditModal(false);
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
      toast.error("Failed to update a short URL..");
    }
  };

  return (
    <div className="p-8 pb-16 bg-gray-100 mx-auto flex flex-col 
      gap-3 sm:w-11/12 xs:w-full md:w-10/12 rounded-md shadow-md">
      <h2 className="text-lg relative font-semibold mb-4 flex items-center gap-4">
        <span><FaLink size={24} className='text-green-400' /></span>
        <span className='text-lg text-black'>Update Your URl</span>
        <IoMdClose onClick={() => setEditModal(false)} size={24} 
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
         {description?.length > 0 && (
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
          {loading ? <Spinner /> : <span>Update</span>}
        </button>
      </form>
    </div>
  );
};

export default EditModal;