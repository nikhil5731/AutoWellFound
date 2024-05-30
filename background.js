var jobLinks; // Global variable to store job links

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveJobLinks") {
    console.log(message.jobLinks);
    sendResponse({ status: "success" });
  } else if (message.action === "getJobLinks") {
    sendResponse({ jobLinks: jobLinks });
  } else if (message.action === "resetJobLinks") {
    // jobLinks = [];
    sendResponse({ status: "reseted" });
  }

  return true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (
    message.action === "showScrollMessage" ||
    message.action === "hideScrollMessage"
  ) {
    chrome.runtime.sendMessage(message);
  } else if (message.action === "updateAppliedJobsInExtensionHTML") {
    chrome.runtime.sendMessage(message);
  } else if (message.action === "completedApplying") {
    chrome.runtime.sendMessage(message);
  }
});
