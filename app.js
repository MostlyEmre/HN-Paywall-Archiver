const axios = require("axios").default;
const puppeteer = require("puppeteer");
const dayjs = require("dayjs");

// Import Paywall List
const { paywallArray } = require("./paywallList");

const logTime = () => {
  return dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss SSS");
};

let latestHNPost;

const goodPostTypes = ["story"];

// fetch latest HN posts

setInterval(() => {
  getNewPosts();
}, 5000);

const getNewPosts = async () => {
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
};

const getPostDetails = async (postID) => {
  const response = await axios(`https://hacker-news.firebaseio.com/v0/item/${postID}.json?print=pretty`);
  const data = response.data;
  if (data !== null) {
    evaluateData(data);

    if (goodPostTypes.includes(data.type) && data.url) {
      let isPaywall = evaluateURL(data.url);
      if (isPaywall === true) {
        console.log(`[${logTime()}] -> ${postID} -> URL is Paywalled: ${data.url}`);
        addPaywallToArchive(data.id, data.url);
      } else {
        console.log(`[${logTime()}] -> ${postID} -> URL is NOT paywalled: ${data.url}`);
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

const addPaywallToArchive = async (postID, postURL) => {
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
    } else {
      console.log(`[${logTime()}] -> ${postID} -> Already archived? See: ${page.url()} -> [${postURL}]`);
    }
  });

  await browser.close();
};

module.exports = {
  getNewPosts,
  latestHNPost,
};
