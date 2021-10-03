// @ts-nocheck
import { useEffect, useState } from "react";
import db from "../firebase";
import { v4 as uuidv4 } from "uuid";

export const Stats = () => {
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState([]);

  // const getSites = () => {

  // };

  useEffect(() => {
    console.log("Getting sites");
    setSites([]);

    const getData = async () => {
      let mediumTotal = 0;

      db.collection("paywallStats")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.id.includes("medium.com")) {
              mediumTotal = mediumTotal + doc.data().total;
            } else if (doc.data().name === "Not Paywalled" || doc.data().total < 10 || doc.data().name === "Paywalled") {
            } else {
              setSites((sites) => [...sites, doc.data()]);
            }
          });

          setSites((sites) => [
            ...sites,
            {
              name: "medium.com",
              total: mediumTotal,
            },
          ]);
        });
    };
    console.log(`adding sites to sorted site`);

    getData();
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div>
        <p>Loading</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="h2">Most Shared Paywalls</h2>
      {sites
        .sort((first, second) => {
          return first.total > second.total ? -1 : 1;
        })
        .map((site) => (
          <div key={uuidv4()} className="inline-block ">
            <a href={`https://${site.name}`} target="_blank" rel="noopener noreferrer">
              <p className="animation px-4 py-3 border-2 shadow hover:shadow-lg cursor-pointer font-bold text-lg bg-gray-100 text-gray-900 rounded-xl mb-4 mr-4">
                {site.name} <span className="ml-1 bg-gray-300 p-2 text-gray-900 rounded-lg">{site.total}</span>
              </p>
            </a>
          </div>
        ))}
    </div>
  );
};
