import React from 'react';

function Error() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h1 className="text-5xl font-bold text-red-600">Oops!</h1>
        <h2 className="text-2xl font-semibold mt-4">Something went wrong</h2>
        <p className="text-gray-600 mt-2">
          We can't seem to find the page you're looking for.
        </p>
      </div>
    </div>
  );
}

export default Error;
