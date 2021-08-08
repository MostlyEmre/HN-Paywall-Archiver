import React from "react";
import { HiExternalLink } from "react-icons/hi";

interface IRecordProps {
  record: {
    alreadyArchived: boolean;
    archiveURL: string;
    archivedTime: number;
    postID: number;
    postTime: number;
    postTitle: string;
    postUser: string;
    url: string;
  };
}

export const ArchiveCard: React.FC<IRecordProps> = ({ record }) => {
  return (
    <div className="shadow border-gray-500 bg-gray-50 rounded-xl px-6 py-4 inline-block mr-4 my-4">
      <div className="inline-block m-2">
        <h1 className="text-gray-900 font-extrabold text-2xl inline-block">
          {record.postTitle}
          <div className="bg-green-500 inline-block w-4 h-4 rounded-full ml-2"></div>
          {/* <HiExternalLink /> */}
        </h1>
      </div>

      <div>
        <p className="bg-gray-200 text-gray-700 text-lg inline-block rounded-xl px-4 py-2  m-1">{record.postUser}</p>
        <p className="bg-gray-200 text-gray-700 text-lg inline-block rounded-xl px-4 py-2  m-1">medium.com</p>
        <p className="bg-gray-200 text-gray-700 text-lg inline-block rounded-xl px-4 py-2  m-1">archive.ph/a8dc</p>
      </div>
    </div>
  );
};
