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
    <div className='container mx-auto w-full mt-8 bg-white border border-gray-300 shadow-sm rounded-md p-6 xs:p-2'>
      <h2 className="text-2xl font-semibold mb-4 text-sky-400">Create Category</h2>
      <form onSubmit={handleSubmit}
      className='flex gap-3 xs:flex-col'>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1" htmlFor="name">
            Name:
          </label>
          <input
            id="name"
            type="text"
            placeholder='Enter category name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-[200px] xs:w-[80vw] rounded-md border-0 py-1.5 text-gray-900
            shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
            focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
            placeholder='Enter shortcode'
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
            className="block w-[200px] xs:w-[80vw] rounded-md border-0 py-1.5 text-gray-900
            shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
            focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            required
          />
        </div>
        <div className='flex justify-center items-center mt-2'>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-400 text-white 
              font-bold py-1 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
          {loading ? <Spinner /> : "Create Category"}
        </button>
        </div>
      </form>
    </div>
  );
}

export default Category;
