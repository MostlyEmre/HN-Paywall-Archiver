import React from "react";

export const Legend = () => {
  return (
    <div className="shadow text-lg text-gray-500 px-4 pt-4 pb-2 bg-gray-50 rounded-xl m-4 inline-block">
      <p className="mx-2 mb-2 font-extrabold text-3xl text-gray-400">Legend</p>
      <div className="m-2 inline-block">
        <div className="bg-yellow-500 inline-block w-4 h-4 rounded-full"></div>

        <p className="inline-block ml-2">Archiving</p>
      </div>
      <div className="m-2 inline-block">
        <div className="bg-green-500 inline-block w-4 h-4 rounded-full"></div>

        <p className="inline-block ml-2">Archived</p>
      </div>
      <div className="m-2 inline-block">
        <div className="bg-blue-500 inline-block w-4 h-4 rounded-full"></div>

        <p className="inline-block ml-2">Already Archived</p>
      </div>
    </div>
  );
};
