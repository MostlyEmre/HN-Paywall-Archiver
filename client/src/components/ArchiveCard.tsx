import React from "react";

export const ArchiveCard = () => {
  return (
    <div className="shadow hover:shadow-md border-gray-500 bg-gray-50 rounded-xl px-6 py-4 inline-block m-4">
      <div className="inline-block m-2">
        <h1 className="text-gray-900 font-extrabold text-3xl">This is a HN Post Title</h1>
      </div>
      <div className="bg-green-500 inline-block w-4 h-4 rounded-full ml-2"></div>
      <div>
        <p className="bg-gray-200 text-gray-700 inline-block rounded-xl px-4 py-2  m-1">f5uck</p>
        <p className="bg-gray-200 text-gray-700 inline-block rounded-xl px-4 py-2  m-1">medium.com</p>
        <p className="bg-gray-200 text-gray-700 inline-block rounded-xl px-4 py-2  m-1">archive.ph/a8dc</p>
      </div>
    </div>
  );
};
