import React, { useState } from 'react';
import { categoryEndpoints } from '../../../services/apis';
import { apiConnector } from '../../../services/apiConnector';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Spinner from '../../common/Spinner';

const { CREATE_CATEGORY_API } = categoryEndpoints;

function Category() {
  const [name, setName] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiConnector('POST', CREATE_CATEGORY_API, { name, shortCode }, {
        Authorization: `Bearer ${token}`,
      });
      if (response.data.success) {
        toast.success('Category created');
        setShortCode('');
        setName('');
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
    setLoading(false);
  };

  return (
    <div className='container mx-auto w-full mt-8'>
      <h2 className="text-2xl font-bold mb-4 text-sky-400">Create Category</h2>
      <form onSubmit={handleSubmit}
      className='flex gap-1'>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1" htmlFor="name">
            Name:
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-400"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1" htmlFor="shortCode">
            Short Code:
          </label>
          <input
            id="shortCode"
            type="text"
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-400"
            required
          />
        </div>
        <div className='flex justify-center items-center mt-2'>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md focus:outline-none"
        >
          {loading ? <Spinner /> : "Create Category"}
        </button>
        </div>
      </form>
    </div>
  );
}

export default Category;
