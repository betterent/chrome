const fallbackImageUrl =
  "https://www.umontpellier.fr/wp-content/uploads/2023/12/web-universite-1920x350-1-aspect-ratio-1920-350.jpg.webp";

// Function to update the redirect rule dynamically based on the given URL
function updateRedirectRule(newImageUrl) {
  // Remove any existing rules and add a new rule
  chrome.declarativeNetRequest.updateDynamicRules(
    {
      removeRuleIds: [1], // Remove the old rule with ID 1
      addRules: [
        {
          id: 1,
          priority: 1,
          action: {
            type: "redirect",
            redirect: {
              url: newImageUrl,
            },
          },
          condition: {
            urlFilter:
              "https://ent.umontpellier.fr/ProlongationENT-home/images/visuel_ent.jpg",
            resourceTypes: ["image"],
          },
        },
      ],
    },
    () => {
      console.log("Redirect rule updated to:", newImageUrl);
    }
  );
}

// On extension load, check if the user has saved a custom image URL
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get("newImageUrl", function (data) {
    const newImageUrl = data.newImageUrl || fallbackImageUrl; // Fallback if not set
    updateRedirectRule(newImageUrl); // Apply the rule with the saved (or default) image
  });
});

// Also listen for browser startup or extension reload
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.sync.get("newImageUrl", function (data) {
    const newImageUrl = data.newImageUrl || fallbackImageUrl;
    updateRedirectRule(newImageUrl);
  });
});

// Listen for messages from the content script to update the rule
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "updateRedirect") {
    const newImageUrl = message.url || fallbackImageUrl;
    updateRedirectRule(newImageUrl); // Apply the new image URL rule

    // Save the new URL to Chrome's storage
    chrome.storage.sync.set({ newImageUrl: newImageUrl }, function () {
      console.log("New image URL saved:", newImageUrl);
      sendResponse({
        status: "Rule updated and URL saved",
        imageUrl: newImageUrl,
      });
    });

    // Return true to indicate we are sending an asynchronous response
    return true;
  }
});
