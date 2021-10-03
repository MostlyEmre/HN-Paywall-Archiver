require("dotenv").config();
const axios = require("axios").default;
const puppeteer = require("puppeteer");
const dayjs = require("dayjs");
const firebase = require("firebase");
require("firebase/auth");

let email = process.env.EMAIL;
let password = process.env.PASS;

// import firestore connection
const { db } = require("./firestore");

// Import Paywall List
const { paywallArray } = require("./paywallList");

const logTime = () => {
  return dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss SSS");
};

let latestHNPost;

const goodPostTypes = ["story"];

async function getStarted() {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;

      // fetch latest HN posts
      setInterval(() => {
        getNewPosts();
      }, 5000);
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
}

// GETS NEW POSTS FROM FIREBASE HN API
// CHECKS IF THE DATA IS VALID
const getNewPosts = async () => {
  try {
    const response = await axios(`https://hacker-news.firebaseio.com/v0/maxitem.json?print=pretty`);
    const data = await response.data;

    if (response.status === 200 && data !== latestHNPost && data !== null) {
      console.log(`[${logTime()}] -> Latest Post: [${latestHNPost}]`);

      for (let i = latestHNPost + 1; i <= data; i++) {
        const url = await getPostDetails(i);
      }
      console.log(`[${logTime()}] -> [!${response.status}], (${latestHNPost}) -> [${data}]`);
      latestHNPost = data;
    }
  } catch (err) {
    console.log(`[${logTime()}] -> ERROR!`, err);
  }
};

// ONCE THE DATA IS VERIFIED, GETS POST DETAILS
const getPostDetails = async (postID) => {
  const response = await axios(`https://hacker-news.firebaseio.com/v0/item/${postID}.json?print=pretty`);
  const data = response.data;
  if (data !== null) {
    evaluateData(data);

    if (goodPostTypes.includes(data.type) && data.url) {
      let isPaywall = evaluateURL(data.url);
      if (isPaywall === true) {
        console.log(`[${logTime()}] -> ${postID} -> URL is Paywalled (${convertURL(data.url)}) => ${data.url}`);
        addPaywallToArchive(data.id, data.url, data);
        addPoint(data, true);
      } else {
        console.log(`[${logTime()}] -> ${postID} -> URL is NOT paywalled (${convertURL(data.url)}) => ${data.url}`);
        addPoint(data, false);
      }
    } else {
      if (data.url === "") {
        console.log(`[${logTime()}] -> ${postID} -> Good Post, bad URL. [${data.url}]`);
      } else {
        // console.log(`[${logTime()}] -> ${postID} -> The post doesn't have a URL. [${data.type}]`);
      }
    }
  } else if (data === null) {
    // console.log(`[${logTime()}] -> ${postID} -> Data is null.`);
  } else {
    console.log(`[${logTime()}] -> ${postID} -> Something's wrong. [${data}].`);
  }
};

const evaluateURL = (url) => {
  // check url if it exists in paywallList
  let validURL = convertURL(url);
  for (let i = 0; i < paywallArray.length; i++) {
    const paywalledURL = paywallArray[i];
    if (validURL.includes(paywalledURL)) {
      console.log(`${validURL} is paywall-matched with ${paywalledURL}`);
      return true;
    }
  }
};

const convertURL = (url) => {
  let rawURL = new URL(url);
  let urlHostName = rawURL.hostname.replace("www.", "").replace("https://", "").replace("http://", "");

  return urlHostName;
};

const evaluateData = (fullData) => {
  if (goodPostTypes.includes(fullData.type)) {
    console.log(fullData);
  }
};

const addPaywallToArchive = async (postID, postURL, wholeData) => {
  console.log(`[${logTime()}] -> ${postID} -> Adding paywalled URL to archive.today... [${postURL}]`);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://archive.today/?run=1&url=${postURL}`, {
    waitUntil: "networkidle2",
    // Remove the timeout
    timeout: 0,
  });

  // #DIVALREADY exists if the link is previously archived.
  // If it doesn't exists, `img src="https://archive.ph/loading.gif"` is the loading tab.

  await page.waitForTimeout(3000).then(() => {
    if (page.url().includes("/wip/")) {
      console.log(`[${logTime()}] -> ${postID} -> The page is currently being archived at [${page.url()}] -> [${postURL}]`);
      setTimeout(() => {
        console.log(`[${logTime()}] -> ${postID} -> Waiting 10 seconds to add the URL for ${page.url()} -> [${postURL}]`);
        // RECORD TO FIRESTORE
        addRecord(wholeData, page.url(), false);
      }, 10000);
    } else {
      setTimeout(() => {
        console.log(`[${logTime()}] -> ${postID} -> Waiting 10 seconds to add the URL for ${page.url()} -> [${postURL}]`);

        console.log(`[${logTime()}] -> ${postID} -> Already archived? See: ${page.url()} -> [${postURL}]`);
        // RECORD TO FIRESTORE
        addRecord(wholeData, page.url(), true);
      }, 10000);
    }
  });

  await browser.close();
};

// removes /wip/ from archive.today wip url. returns final archive url.
// const wipRemover = (wipURL) => {
//   return wipURL.replace("/wip/", "/");
// };

// Firestore Interactions
// ADD POINT (FIRESTORE)
const addPoint = (wholeData, isPaywalled) => {
  let url = convertURL(wholeData.url);

  if (isPaywalled) {
    console.log(`[${logTime()}] -> [Firestore] Adding 1 point to: [${url}]`);

    // UPDATE OR CREATE RECORD STAT
    addRecordStat(wholeData.url);

    // Add point in general Paywalled

    console.log(`[${logTime()}] -> [Firestore] Adding 1 point to PAYWALLED`);
    // ADD POINT TO PAYWALLED
    let currentValue = 0;
    db.collection("paywallStats")
      .doc("paywalled")
      .get()
      .then((doc) => {
        let paywalledRef = db.collection("paywallStats").doc("paywalled");
        currentValue = doc.data().total;
        paywalledRef.update({
          total: currentValue + 1,
        });
        console.log(`[${logTime()}] -> [Firestore] Added 1 point to PAYWALLED`);
      })
      .catch((error) => {
        console.log(`[${logTime()}] -> [Firestore] Error getting document while adding Point:`, error);
      });
  } else {
    console.log(`[${logTime()}] -> [Firestore] Adding 1 point to NOT PAYWALLED`);
    //
    let currentValue = 0;
    db.collection("paywallStats")
      .doc("notPaywalled")
      .get()
      .then((doc) => {
        let notPaywalledRef = db.collection("paywallStats").doc("notPaywalled");
        currentValue = doc.data().total;
        notPaywalledRef.update({
          total: currentValue + 1,
        });
        console.log(`[${logTime()}] -> [Firestore] Added 1 point to NOT PAYWALLED`);
      })
      .catch((error) => {
        console.log(`[${logTime()}] -> [Firestore] Error getting document while adding a point:`, error);
      });
  }
};

// ADD RECORD (FIRESTORE)
const addRecord = (wholeData, archiveURL, alreadyArchived) => {
  // add record
  let newRecord = {
    archiveURL: archiveURL,
    alreadyArchived: alreadyArchived,
    archivedTime: Date.now(),
    postID: wholeData.id,
    postTime: wholeData.time,
    postTitle: wholeData.title,
    postUser: wholeData.by,
    url: wholeData.url,
  };
  // let currentValue = 0;
  let convertedURL = convertURL(wholeData.url);

  // add record to firestore
  db.collection("records")
    .doc()
    .set(newRecord)
    .then(() => {
      console.log(`[${logTime()}] -> [Firestore] [addRecord] Record is successfully added. (${convertedURL})`);
    })
    .catch((error) => {
      console.error(`[${logTime()}] -> [Firestore] [addRecord] Error recording the record. (${convertedURL})`, error);
    });
};

const addRecordStat = (url) => {
  let currentValue = 0;
  let convertedURL = convertURL(url);
  console.log(convertedURL);
  db.collection("paywallStats")
    .doc(convertedURL)
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log(doc.data());
        currentValue = doc.data().total;
        console.log(`[${logTime()}] -> [Firestore] [addRecordStat] (${convertedURL}) already exists with [Total = ${currentValue}]`);
        let newValue = currentValue + 1;
        db.collection("paywallStats")
          .doc(convertedURL)
          .update({
            total: newValue,
          })
          .then(() => {
            console.log(`[${logTime()}] -> [Firestore] [addRecordStat] Updated the record stat total. (${convertedURL}) Total: ${currentValue + 1}`);
          });
      } else {
        // doc.data() will be undefined in this case
        db.collection("paywallStats")
          .doc(convertedURL)
          .set({
            name: convertedURL,
            total: 1,
          })
          .then(() => {
            console.log(`[${logTime()}] -> [Firestore] [addRecordStat] Added the record stat. (${convertedURL})`);
          })
          .catch((error) => {
            console.log(`[${logTime()}] -> [Firestore] [addRecordStat] [else] Error creating the record stat. (${convertedURL})`, error);
          });
      }
    })
    .catch((error) => {
      console.log(`[${logTime()}] -> [Firestore] [addRecordStat] Error creating the record stat. (${convertedURL})`, error);
    });
};

// TODO: addUserStat

module.exports = {
  getNewPosts,
  latestHNPost,
  getStarted,
};
