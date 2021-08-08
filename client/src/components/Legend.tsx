import React from "react";

export const Legend = () => {
  return (
    <div className="border-8 border-dashed m-auto border-gray-100 text-lg rounded-xl p-4 ">
      <h3 className="text-3xl font-extrabold mb-2">Legend</h3>
      <div className="inline-block mr-4">
        <p className="inline-block">
          <span className="bg-yellow-500 inline-block w-3 h-3 rounded-full"></span> Archiving
        </p>
      </div>
      <div className="inline-block mr-4">
        <p className="inline-block ">
          <span className="bg-green-500 inline-block w-3 h-3 rounded-full"></span> Archived
        </p>
      </div>
      <div className="inline-block mr-4">
        <p className="inline-block ">
          <span className="bg-blue-500 inline-block w-3 h-3 rounded-full"></span> Already Archived
        </p>
      </div>
    </div>
  );
};
