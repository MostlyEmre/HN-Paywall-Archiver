import { useState, useEffect } from "react";
import db from "../firebase";
export const Header = () => {
  const [totalPaywalled, setTotalPaywalled] = useState(0);
  const [totalNotPaywalled, setTotalNotPaywalled] = useState(0);

  useEffect(() => {
    console.log(`useEffect ran!`);

    db.collection("paywallStats")
      .doc("paywalled")
      .onSnapshot((doc) => {
        let docData = doc?.data();
        setTotalPaywalled(docData?.total);
      });
    db.collection("paywallStats")
      .doc("notPaywalled")
      .onSnapshot((doc) => {
        let docData = doc?.data();
        setTotalNotPaywalled(docData?.total);
      });
  }, []);

  const percentageOfPaywall = (paywalled: number, notpaywalled: number) => {
    let totalPosts = paywalled + notpaywalled;
    return (paywalled / totalPosts) * 100;
  };

  return (
    <div className="text-lg">
      <h1 className="text-4xl font-extrabold my-6">HN Paywall Archiver</h1>
      <p className="my-6">
        Hacker News paywall archiver checks every new link submission on <span>news.ycombinator.com</span> for paywalls. After detecting a paywall, it submits the link to <span>archive.today</span>{" "}
        for archiving.
      </p>

      <p>
        At least <span className="font-bold">{percentageOfPaywall(totalPaywalled, totalNotPaywalled).toFixed(2)}%</span> of all HN link submissions are paywalled.
      </p>
    </div>
  );
};
