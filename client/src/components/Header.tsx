import { useState, useEffect } from "react";
import db from "../firebase";
export const Header = () => {
  const [totalPaywalled, setTotalPaywalled] = useState(0);
  const [totalNotPaywalled, setTotalNotPaywalled] = useState(0);

  useEffect(() => {
    console.log(`useEffect ran!`);

    db.collection("paywallStats")
      .doc("paywalled")
      .get()
      .then((doc) => {
        if (doc.exists) {
          let docData = doc?.data();
          setTotalPaywalled(docData?.total);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

    db.collection("paywallStats")
      .doc("notPaywalled")
      .get()
      .then((doc) => {
        if (doc.exists) {
          let docData = doc?.data();
          setTotalNotPaywalled(docData?.total);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, []);

  const percentageOfPaywall = (paywalled: number, notpaywalled: number) => {
    let totalPosts = paywalled + notpaywalled;
    return (paywalled / totalPosts) * 100;
  };

  return (
    <div className="text-lg">
      <h1 className="text-4xl font-extrabold mt-14 mb-10">HN Paywall Archiver</h1>
      <p className="my-6">
        <a className="link" href="https://en.wikipedia.org/wiki/Hacker_News" target="_blank" rel="noopener noreferrer">
          Hacker News
        </a>{" "}
        paywall archiver checks every new link submission on{" "}
        <a className="link" href="https://news.ycombinator.com/" target="_blank" rel="noopener noreferrer">
          news.ycombinator.com
        </a>{" "}
        for paywalls. After detecting a paywall, it submits the link to{" "}
        <a className="link" href="https://archive.today" target="_blank" rel="noopener noreferrer">
          archive.today
        </a>{" "}
        for archiving. And archiving removes paywalls. 🧠
      </p>

      <p>
        At least <span className="font-bold">{percentageOfPaywall(totalPaywalled, totalNotPaywalled).toFixed(2)}%</span> of all* HN link submissions are paywalled. HN Paywall Archive has scanned{" "}
        <span className="font-bold">{totalPaywalled + totalNotPaywalled}</span> links until now. <span className="font-bold">{totalPaywalled}</span> links were paywalled.
      </p>
    </div>
  );
};
