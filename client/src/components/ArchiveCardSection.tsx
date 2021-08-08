import { ArchiveCard } from "./ArchiveCard";
import { useState, useEffect } from "react";
import db from "../firebase";
import { v4 as uuidv4 } from "uuid";

interface IRecordState {
  records: {
    alreadyArchived: boolean;
    archiveURL: string;
    archivedTime: number;
    postID: number;
    postTime: number;
    postTitle: string;
    postUser: string;
    url: string;
  }[];
}

export const ArchiveCardSection = () => {
  const [records, setRecords] = useState<IRecordState["records"]>([]);

  useEffect(() => {
    console.log(`useEffect ran!`);

    setRecords([]);

    db.collection("records")
      .orderBy("archivedTime", "desc")
      .limit(6)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          setRecords((records: any) => [...records, doc.data()]);
          console.log(doc.id, " => ", doc.data());
        });
      });
  }, []);
  return (
    <div>
      <h2 className="text-3xl font-extrabold my-10">Latest Archived Posts</h2>
      <div className="">
        {records.map((record) => (
          <ArchiveCard key={uuidv4()} record={record} />
        ))}
      </div>
    </div>
  );
};
