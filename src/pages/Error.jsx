import React from 'react';
import { Link } from 'react-router-dom';

function Error() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h2 className="text-2xl font-semibold mt-4">Something went wrong</h2>
        <p className="text-gray-600 mt-2 mb-4">
          We can't seem to find the page you're looking for.
        </p>
        <Link to={'/'}
        className='py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md '>
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default Error;
