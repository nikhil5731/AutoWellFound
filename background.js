chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (
    message.action === "showScrollMessage" ||
    message.action === "hideScrollMessage"
  ) {
    chrome.runtime.sendMessage(message);
  }

  if (message.action === "updateAppliedJobs") {
    chrome.runtime.sendMessage(message);
  }
});
