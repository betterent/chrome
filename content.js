// Select the banner and its image container
const banner = document.getElementsByClassName("visuel_ent_um")[0];
const bannerImg = banner.children[0];

// Create a button and input field on the webpage
const bannerDiv = document.createElement("div");
const bannerInput = document.createElement("input");
const bannerButton = document.createElement("button");

bannerDiv.classList.add("my_ent_banner_div");
bannerInput.classList.add("my_ent_banner_input");
bannerButton.classList.add("my_ent_banner_button");

bannerInput.type = "text";
bannerInput.placeholder = "Image URL";
bannerButton.textContent = "Reset";

// Set parent div position to relative
banner.style.position = "relative";

// Append the button and input to the body
bannerDiv.appendChild(bannerInput);
bannerDiv.appendChild(bannerButton);
banner.appendChild(bannerDiv);

// Function to update the banner
function updateBanner() {
  const newImageUrl = bannerInput.value;
  bannerInput.value = "";
  bannerButton.textContent = "Reset";

  // Save the new URL to Chrome storage
  chrome.storage.sync.set({ newImageUrl: newImageUrl }, function () {
    // Force change banner image URL

    // Send a message to the background script to update the redirect rule
    chrome.runtime.sendMessage(
      { action: "updateRedirect", url: newImageUrl },
      function (response) {
        console.log(response.status);
        banner.children[0].src = response.imageUrl;
      }
    );
  });
}

// Add event listener to the button
bannerButton.addEventListener("click", updateBanner);

bannerInput.addEventListener("input", function () {
  if (bannerInput.value == "") {
    bannerButton.textContent = "Reset";
  } else {
    bannerButton.textContent = "Update";
  }
});

// Add event listener for enter key
bannerInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    updateBanner();
  }
});
