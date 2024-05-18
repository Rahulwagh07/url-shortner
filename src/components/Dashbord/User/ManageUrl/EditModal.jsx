import React, { useState } from 'react';
import { apiConnector } from '../../../../services/apiConnector';
import { manageUrlEndpoints } from '../../../../services/apis';
import { toast } from 'react-hot-toast';
import { FaLink } from "react-icons/fa6";
import Spinner from '../../../common/Spinner';
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
    <div className="p-8 pb-16 z-10 bg-white shadow-lg border border-gray-300 mx-auto flex flex-col 
      gap-3 sm:w-11/12 xs:w-full md:w-10/12 rounded-md ">
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
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 
            shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
            focus:ring-2 focus:ring-inset focus:ring-indigo-300 sm:text-sm sm:leading-6"
          required
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
        />
       <div className='w-full relative'>
        <input
          type="text"
          placeholder="url name (optional)"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 
            shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
            focus:ring-2 focus:ring-inset focus:ring-indigo-300 sm:text-sm sm:leading-6"
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
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 
            shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
            focus:ring-2 focus:ring-inset focus:ring-indigo-300 sm:text-sm sm:leading-6"
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
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 
            shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
            focus:ring-2 focus:ring-inset focus:ring-indigo-300 sm:text-sm sm:leading-6"
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
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 
            shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
            focus:ring-2 focus:ring-inset focus:ring-indigo-300 sm:text-sm sm:leading-6"
            required
            >
            <option value="" disabled hidden>Select Tier</option>
            <option value="temp">Temporary: Link active for {tempUrlActiveDays} days</option>
            <option value="silver">Silver: Link active for {silverUrlActiveDays} days</option>
            <option value="gold">Gold: Link active for {goldUrlActiveDays} days</option>
            <option value="platinum">Platinum: Link active for {platinumUrlActiveDays} days</option>
        </select>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-blue-600 px-3 
              py-1.5 text-sm font-semibold leading-6 text-white shadow-sm
               hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 
               focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {loading ? <Spinner /> : <span>Update</span>}
        </button>
      </form>
    </div>
  );
};

export default EditModal;