const axios = require("axios").default;
const puppeteer = require("puppeteer");

// Import Paywall List
const { paywallArray, testFunction } = require("./paywallList");
// const date = Date.now();
// const styledDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
let latestHNPost;

const badPostTypes = ["job", "comment", "poll", "pollopt"];
const noURLTypes = ["poll", "pollopt", "comment", "job"];
const goodPostTypes = ["story"];
const postsArray = [];
// fetch latest HN post

setInterval(() => {
  getNewPosts();
}, 5000);

const getNewPosts = async () => {
  const response = await axios(`https://hacker-news.firebaseio.com/v0/maxitem.json?print=pretty`);
  const data = await response.data;

  if (response.status === 200 && data !== latestHNPost && data !== null) {
    console.log(`[${Date.now()}] -> Latest Post: [${latestHNPost}]`);
    // const url = await getPostDetails(data);

    for (let i = latestHNPost + 1; i <= data; i++) {
      const url = await getPostDetails(i);
      // console.log(i);
    }
    console.log(`[${Date.now()}] -> [!${response.status}], (${latestHNPost}) -> [${data}]`);
    latestHNPost = data;
  }
};

const getPostDetails = async (postID) => {
  const response = await axios(`https://hacker-news.firebaseio.com/v0/item/${postID}.json?print=pretty`);
  const data = response.data;
  if (data !== null) {
    evaluateData(data);
    // console.log(data.type);
    // console.log(data);
    if (goodPostTypes.includes(data.type) && data.url) {
      let isPaywall = evaluateURL(data.url);
      if (isPaywall === true) {
        console.log(`[${Date.now()}] -> ${postID} -> URL is Paywalled: ${data.url}`);
        addPaywallToArchive(data.id, data.url);
      } else {
        console.log(`[${Date.now()}] -> ${postID} -> URL is NOT paywalled: ${data.url}`);
      }
    } else {
      if (data.url === "") {
        console.log(`[${Date.now()}] -> ${postID} -> Good Post, bad URL. [${data.url}]`);
      } else {
        console.log(`[${Date.now()}] -> ${postID} -> Post is irrelevant because it is a [${data.type}]`);
      }
    }
  } else if (data === null) {
    console.log(`[${Date.now()}] -> ${postID} -> Data is null.`);
  } else {
    console.log(`[${Date.now()}] -> ${postID} -> Something's wrong. [${data}].`);
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
    console.log(`[${Date.now()}] -> ${fullData.id} -> Post type is good. [${fullData.type}]`);
  }
};

const addPaywallToArchive = async (postID, postURL) => {
  console.log(`[${Date.now()}] -> ${postID} -> Adding paywalled URL to archive.today... [${postURL}]`);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://archive.today/?run=1&url=${postURL}`);
  // other actions...
  await page.waitForNavigation({
    waitUntil: "networkidle0",
  });
  await page.screenshot({ path: `buddy-screenshot${Math.random() * 100}.png` });
  console.log(`[${Date.now()}] -> ${postID} -> is archived... [${postURL}]`);
  await browser.close();
};

module.exports = {
  getNewPosts,
  latestHNPost,
};
