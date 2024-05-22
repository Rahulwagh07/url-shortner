import React, { useState } from 'react';
import { apiConnector } from '../../../services/apiConnector';
import { panelOptionsEndpoints } from '../../../services/apis';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Spinner from '../../common/Spinner';

const { ADD_PANEL_OPTIONS_API } = panelOptionsEndpoints;

function AddPanel() {
  const { token } = useSelector((state) => state.auth);
  const [newOptionName, setNewOptionName] = useState('');
  const [newRedirectionUrl, setNewRedirectionUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      previewFile(file);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('optionName', newOptionName);
      formData.append('redirectionUrl', newRedirectionUrl);
      formData.append('optionIcon', imageFile);

      const response = await apiConnector('POST', ADD_PANEL_OPTIONS_API, formData, {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      });

      toast.success('Panel option added successfully');
      setNewOptionName('');
      setNewRedirectionUrl('');
      setImageFile(null);
      setPreviewSource(null);
    } catch (error) {
      toast.error(`Failed to add panel option: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white border border-gray-300 shadow-sm rounded-md p-6 xs:p-2">
      <h2 className="text-2xl text-sky-400 font-semibold mb-4">Add Panel Option</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 lg:flex-row flex-col">
        <div>
        <label className="block text-sm font-medium leading-6 text-gray-900 mt-2">Name</label>
        <input
          type="text"
          value={newOptionName}
          onChange={(e) => setNewOptionName(e.target.value)}
          placeholder="Option Name"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900
            shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
            focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          required
        />
        </div>
        <div>
        <label className="block text-sm font-medium leading-6 text-gray-900 mt-2">Url</label>
        <input
          type="text"
          value={newRedirectionUrl}
          onChange={(e) => setNewRedirectionUrl(e.target.value)}
          placeholder="Redirection URL"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900
            shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
            focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          required
        />
        </div>
        <div>
        <label className="block text-sm font-medium leading-6 text-gray-900 mt-2">Icon</label>
        <div className="flex w-full items-center px-4 py-1 rounded-md border ring-1 ring-inset ring-gray-300 font-semibold">
          <div className="flex items-center gap-x-2">
            {previewSource && (
              <img src={previewSource} alt="img" className="aspect-square w-[78px] rounded-full object-cover" />
            )}
          <div className="flex gap-1 items-center">
              <div className="flex flex-row gap-3 w-full">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/png, image/gif, image/jpeg"
                  required
                />
                <button
                  onClick={() => document.querySelector('input[type="file"]').click()}
                  disabled={loading}
                  className="cursor-pointer rounded-md bg-gray-700 px-5 py-0.5 font-semibold text-gray-50"
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
        <div className="flex items-center justify-center">
          <button type="submit" disabled={loading}
           className="bg-blue-500 mt-8 hover:bg-blue-600 text-white 
              font-bold py-1 px-4 rounded">
            {loading ? <Spinner /> : 'Add Panel'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPanel;
