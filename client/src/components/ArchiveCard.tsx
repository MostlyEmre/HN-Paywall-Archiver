import React from "react";

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
  const convertURL = (url: string) => {
    let rawURL = new URL(url);
    let urlHostName = rawURL.hostname.replace("www.", "").replace("https://", "").replace("http://", "");

    return urlHostName;
  };

  return (
    <div className="shadow border-gray-200 border-8 bg-gray-50 rounded-xl px-6 py-4  mr-4 my-4">
      <div className="inline-block m-2">
        <h1 className="text-gray-900 font-extrabold text-2xl inline-block">
          <a href={`https://news.ycombinator.com/item?id=${record.postID}`} target="_blank" rel="noopener noreferrer">
            {record.postTitle}
          </a>
          {record.alreadyArchived ? <div className="bg-blue-500 inline-block w-4 h-4 rounded-full ml-2"></div> : null}
          {record.archiveURL.includes("wip") && Date.now() - record.archivedTime < 180000 ? <div className="bg-yellow-500 inline-block w-4 h-4 rounded-full ml-2"></div> : null}
          {Date.now() - record.archivedTime >= 180000 && !record.alreadyArchived ? <div className="bg-green-500 inline-block w-4 h-4 rounded-full ml-2"></div> : null}
        </h1>
      </div>

      <div>
        <p className="bg-gray-200 text-gray-700 text-lg inline-block rounded-xl px-4 py-2  m-1">
          <a href={`https://news.ycombinator.com/user?id=${record.postUser}`} target="_blank" rel="noopener noreferrer">
            {record.postUser}
          </a>
        </p>
        <p className="bg-gray-200 text-gray-700 text-lg inline-block rounded-xl px-4 py-2  m-1">
          <a href={record.url} target="_blank" rel="noopener noreferrer">
            {convertURL(record.url)}
          </a>
        </p>
        <p className="bg-gray-200 text-gray-700 text-lg inline-block rounded-xl px-4 py-2  m-1">
          <a href={record.archiveURL} target="_blank" rel="noopener noreferrer">
            Read Archive
          </a>
        </p>
      </div>
    </div>
  );
};
