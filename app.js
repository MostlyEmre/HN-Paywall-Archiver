const axios = require("axios").default;

// Import Paywall List
const { paywallArray, testFunction } = require("./paywallList");
const date = new Date();
const styledDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
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
    console.log(`[${styledDate}] -> Latest Post: [${latestHNPost}]`);
    const url = await getPostDetails(data);

    for (let i = latestHNPost + 1; i <= data; i++) {
      const url = await getPostDetails(i);
      // console.log(i);
    }
    console.log(`[${styledDate}] -> [!${response.status}], (${latestHNPost}) -> [${data}], [${url}]`);
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
        console.log(`[${styledDate}] -> ${postID} -> URL is Paywalled: ${data.url}`);
        addPaywallToArchive(data.id, data.url);
      } else {
        console.log(`[${styledDate}] -> ${postID} -> URL is NOT paywalled: ${data.url}`);
      }
    } else {
      if (data.url === "") {
        console.log(`[${styledDate}] -> ${postID} -> Good Post, bad URL. [${data.url}]`);
      } else {
        console.log(`[${styledDate}] -> ${postID} -> Bad Post type. [${data.type}]`);
      }
    }
  } else if (data === null) {
    console.log(`[${styledDate}] -> ${postID} -> Data is null.`);
  } else {
    console.log(`[${styledDate}] -> ${postID} -> Something's wrong. [${data}].`);
  }

  // data !== null
  // !data.url.includes("https://news.ycombinator.com/submitted?id=")
  // data.url

  // if (goodPostTypes.includes(data.type) && data.url && data.url !== "") {
  //   console.log(`This is a ${data.type}, url is ${data.url}`);
  //   return data.url;
  // }
  // return "Not relevant";
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
    console.log(`[${styledDate}] -> ${fullData.id} -> Post type is good. [${fullData.type}]`);
  }
};

const addPaywallToArchive = (postID, postURL) => {
  console.log(`[${styledDate}] -> ${postID} -> Adding paywalled URL to archive.today... [${postURL}]`);
};

module.exports = {
  getNewPosts,
  latestHNPost,
};
