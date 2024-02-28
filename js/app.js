let account, abbrvAccount, error, permissions, eeArray, eeBasics, chain;
let composable, accountIsBlocked, moderator, verificationResponse, perms, composableCheck, accountIsBlockedCheck, moderatorCheck, verificationResponseCheck;
// arbitrum and polygon not yet supported
let chainIds = [1, 11155111, 10, 8453, 42161, 137];
let chainNames = ["mainnet", "sepolia", "optimism", "base", "arbitrum", "polygon"];
let chainExplorerBaseUrls = ["https://etherscan.io/address/", "https://sepolia.etherscan.io/address/", "https://optimistic.etherscan.io/address/", "https://basescan.org/address/", "https://arbiscan.io/address/", "https://polygonscan.com/address/"];
let chainScan;
var url_string = window.location.href;
let rawAccount = "";
const hexPat = /^0[xX]{1}[a-fA-F0-9]{40}$/;
const currentUrl = new URL(window.location.href);
const siteBase = currentUrl.origin + currentUrl.pathname;
const BLONKS_CONTRACT = "0x5bB2333Ee8C9818D4bd898a17f597Ec6F5710Fd6";

const nullAddress = "0x0000000000000000000000000000000000000000";

//! Edit & view toggle

const edit_btn = document.querySelector("[data-toggle-edit]");
const view_btn = document.querySelector("[data-toggle-view]");

const module_view_arr = document.querySelectorAll("[data-module-view]");
const module_edit_arr = document.querySelectorAll("[data-module-edit]");

const searchInput = document.querySelector("[data-search-input]");
const searchButton = document.querySelector("[data-search-submit]");
const mainContent = document.querySelector("[data-main]");

const chainContent = document.querySelectorAll("[text-content-chain]");
const contractLink = document.querySelector("[contract-link]");

const accountNameElements = document.querySelectorAll("[data-account-name]");
const accountStatusElement = document.querySelectorAll("[data-content-account-status]");
// const accountEditStatusElement = document.querySelector("[data-content-account-edit-status]");

const accountComposableElementTrue = document.querySelector("[data-composable=true]");
const accountComposableElementFalse = document.querySelector("[data-composable=false]");
const accountEditComposableElementTrue = document.querySelector("[data-edit-composable=true]");
const accountEditComposableElementFalse = document.querySelector("[data-edit-composable=false]");

const accountBlockedElement = document.querySelector("[data-view-section=blocked]");
const accountEditBlockedElement = document.querySelector("[data-edit-section=blocked]");
const accountModeratorElement = document.querySelector("[data-view-section=moderator]");
const accountEditModeratorElement = document.querySelector("[data-edit-section=moderator]");
const accountVerificationElement = document.querySelector("[data-content=verification]");

const basicData = document.querySelector("[data-module=basic]");
const pfpImage = document.querySelector("[data-edit-image]");
const pfpId = document.querySelector("[data-content=pfp-id]");
const pfpContract = document.querySelector("[data-content=pfp-contract]");
const pfpVerified = document.querySelector("[data-content=pfp-verification]");
const pfpActualOwner = document.querySelector("[data-content=pfp-actual-owner]");
const blonksInfo = document.querySelector("[data-content=blonks-info]");

const alias = document.querySelector("[data-content=alias]");
const detail = document.querySelector("[data-content=detail]");

const social = document.querySelector("[data-content=social]");
const website = document.querySelector("[data-content=website]");
const gallery = document.querySelector("[data-content=gallery]");

const tagModule = document.querySelector("[data-module=tags]");
const tagsContainer = document.querySelector("[data-content=tags]");

const badgesModule = document.querySelector("[data-module=badges]");
const badgesContainer = document.querySelector("[data-content=badges]");

const linksModule = document.querySelector("[data-module=links]");
const linksContainer = document.querySelector("[data-content=links]");

const associatedModule = document.querySelector("[data-module=associated]");
const associatedContainer = document.querySelector("[data-content=associated]");

const respectModule = document.querySelector("[data-module=respect]");
const respectedHeading = document.querySelector("[text-content=respected-heading]");
const respectingHeading = document.querySelector("[text-content=respecting-heading]");
const respectReceivingContainer = document.querySelector("[data-content-list=receiving]");
const respectGivingContainer = document.querySelector("[data-content-list=giving]");

const notesModule = document.querySelector("[data-module=notes]");
const notesContainer = document.querySelector("[data-content=notes]");

const customModule = document.querySelector("[data-module=custom]");
const customContainer = document.querySelector("[data-content=custom]");

const pingModule = document.querySelector("[data-module=ping]");
const pingContainer = document.querySelector("[data-content=ping]");

// Function to validate Ethereum address
function isValidEthereumAddress(address) {
  return address.match(hexPat);
}

// Function to toggle visibility based on Ethereum address validity
function mainIsVisible(isValid) {
  console.log("Toggling visibility based on address validity..." + isValid);
    if (isValid) {
      mainContent.classList.remove("hidden");
      view_btn.classList.remove("hidden");
    } else {
      mainContent.classList.add("hidden");
    }
}

function abbreviateAndUpdate(account) {
  abbrvAccount = `${account.slice(0, 4)}-${account.slice(-4)}`;
  accountNameElements.forEach((element) => {
    element.textContent = abbrvAccount; 
  });
}

if (url_string.includes("account")) {
  var url = new URL(url_string);
  const isValid = isValidEthereumAddress(url.searchParams.get("account"));
  if (isValid) {
    account = url.searchParams.get("account");
    console.log("Account accepted from URL parameter: " + account);
    abbreviateAndUpdate(account);
    mainIsVisible(true);
    // _queryContract(account);
  }
}

// Attach event listener to search button for Ethereum address validation and feedback
if (searchButton) {
  searchButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the form from submitting
    const isValid = isValidEthereumAddress(searchInput.value);
    if (isValid) {
      account = searchInput.value;
      abbreviateAndUpdate(account);
      _queryContract(account);
      mainIsVisible(true);
    } else {
      // Notify the user if the Ethereum address is invalid
      alert("Please enter a valid Ethereum address, 0x...");
      mainIsVisible(false);
    }
  });
}

if (url_string.includes("chain")) {
  var url = new URL(url_string);
  const chainInput = url.searchParams.get("chain");
  if (chainNames.includes(chainInput)) {
    console.log("Chain accepted from URL parameter: " + chainInput);
    chainIndex = chainIds.indexOf(chainInput);
    if (chainIndex > -1) {
      chain = chainNames[chainIndex];
      chainScan = chainExplorerBaseUrls[chainIndex];
      chainContent.forEach((element) => {
        element.textContent = `(${chain})`;
      });
      contractLink.href = chainScan + EE_ADDRESS + "#code";
      _queryContract(account);
    }
  }
} else {
  // currentChainId is aynsc, so we need to wait for it to be set before we can use it
  setTimeout(() => {
    chainIndex = chainIds.indexOf(currentChainId);
    if (chainIndex > -1) {
      chain = chainNames[chainIndex];
      chainScan = chainExplorerBaseUrls[chainIndex];
      console.log("Chain detected: " + chain);
      chainContent.forEach((element) => {
        element.textContent = `(${chain})`;
      });
      contractLink.href = chainScan + EE_ADDRESS + "#code";
      if (account) {
        _queryContract(account);
      }
    } else {
      console.log("Chain not detected, defaulting to mainnet");
      chain = "mainnet";
      chainScan = chainExplorerBaseUrls[0];
      contractLink.href = chainScan + EE_ADDRESS + "#code";
      console.log(account);
      _queryContract(account);
    }
  }, 500);
}

async function _queryContract(account) {
  if (account == currentAccount) {
    edit_btn.classList.remove("hidden");
    // module_edit_arr.forEach((element) => {
    //   element.classList.remove("hidden");
    // });
  } else {
    if (!edit_btn.classList.contains("hidden")) {
      edit_btn.classList.add("hidden");
    }
  }
  console.log("Querying contract for account: " + account);
  // check if account matches the hex pattern
  if (account) {
    console.log("Checking account permissions for " + account + " on " + chain + "...");
    try {
      if (chain == "mainnet") {
        permissions = await EE_Contract_Alchemy.methods.permissions(account).call({}, function (err, res) {
          if (err) {
            console.log(err);
            return;
          }
        });
      } else if (chain == "sepolia") {
        permissions = await EE_Contract_Alchemy_Sepolia.methods.permissions(account).call({}, function (err, res) {
          if (err) {
            console.log(err);
            return;
          }
        });
      } 
      
      /// add other chains here

      ({ composable, accountIsBlocked, moderator, verificationResponse } = permissions);
      console.log("Permissions retrieved: ", permissions);
      let accountStatus = "";
      if (composable) {
        accountComposableElementTrue.style.display = "block";
        accountComposableElementFalse.style.display = "hidden";
        accountEditComposableElementTrue.style.display = "block";
        accountEditComposableElementFalse.style.display = "hidden";
        accountStatus += "Account is composable. ";
      } else {
        accountComposableElementTrue.style.display = "hidden";
        accountComposableElementFalse.style.display = "block";
        accountEditComposableElementTrue.style.display = "hidden";
        accountEditComposableElementFalse.style.display = "block";
        accountStatus += "Account is not composable (may not have set up an EtherEthos profile). ";
      }
      if (accountIsBlocked) {
        accountBlockedElement.style.display = "block";
        accountEditBlockedElement.style.display = "block";
        accountStatus += "Account is blocked! ";
      }
      if (moderator) {
        accountModeratorElement.style.display = "block";
        accountEditModeratorElement.style.display = "block";
        accountStatus += "Account is not a moderator.";
      }
      if (verificationResponse.length > 0) {
        accountVerificationElement.textContent = verificationResponse;
      } else {
        accountVerificationElement.textContent = "[nothing set]";
      }
      console.log(accountStatus);
      // accountStatusElement.textContent = accountStatus;
      // accountEditStatusElement.textContent = accountStatus;
      accountStatusElement.forEach((element) => {
        element.textContent = accountStatus; 
      });
    } catch (errorMessage) {
      error = true;
    }
    if (composable) {
      console.log("Attempting to retrieve account...");
      try {
        if (chain == "mainnet") {
          eeArray = await EE_Contract_Alchemy.methods.assembleAccountData(account).call({}, function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          });
        } else if (chain == "sepolia") {
          eeArray = await EE_Contract_Alchemy_Sepolia.methods.assembleAccountData(account).call({}, function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          });
        }

        /// add other chains here

      } catch (errorMessage) {
        error = true;
      }
    }
    if (error) {
      console.log("No Account Was Retrived");
    } else {
      console.log("Account Retrieved");
      if (composable) {
        console.log(eeArray);
        basicData.style.display = "block";

        // PFP DATA
        if (eeArray[0][6] != nullAddress) {
          pfpContract.textContent = eeArray[0][6];
          pfpContract.href = `${siteBase}?account=${eeArray[0][6]}`;
          let tokenId = parseInt(eeArray[0][7]);
          if (typeof tokenId === 'number') {
            console.log("Token ID: ", tokenId);
            pfpId.textContent = tokenId;
            
            const EE_NFTContract_Alchemy = new web3Main.eth.Contract(NFT_ABI, eeArray[0][6]);
            const EE_NFTContract_Alchemy_Sepolia = new web3Sepolia.eth.Contract(NFT_ABI, eeArray[0][6]);
            // add other chains here?

            let pfpOwner;

            // add delegation check at some point to see if the account is "allowed" to use the pfp
            try {
              if (chain == "mainnet") {
                pfpOwner = await EE_NFTContract_Alchemy.methods.ownerOf(tokenId).call({}, function (err, res) {
                  if (err) {
                    console.log(`PFP Ownership Verification ${err} Is the collection on the correct network?`);
                    return;
                  }
                });
              } else if (chain == "sepolia") {
                pfpOwner = await EE_NFTContract_Alchemy_Sepolia.methods.ownerOf(tokenId).call({}, function (err, res) {
                  if (err) {
                    console.log(`PFP Ownership Verification ${err} Is the collection on the correct network?`);
                    return;
                  }
                });
              }
              console.log("PFP Owner: ", pfpOwner);

              /// add other chains here

            } catch (errorMessage) {
              error = true;
            }
            if (!error) {
              if (pfpOwner == account) {
                pfpVerified.textContent = "✔️ PFP Ownership Verified";
                console.log("PFP Ownership Verified");
              } else {
                pfpVerified.textContent = "✖️ PFP Not Owned by Account. The Verified Owner: ";
                console.log("PFP Ownership Not Verified. Actual Owner: ", pfpOwner);
                pfpActualOwner.style.display = "block";
                pfpActualOwner.textContent = pfpOwner;
              }
            } else {
              pfpVerified.textContent = "[Error connecting to contract - using BLONKS as placeholder]";
            }
            try {
              if (chain == "mainnet") {
                tokenURI = await EE_NFTContract_Alchemy.methods.tokenURI(tokenId).call({}, function (err, res) {
                  if (err) {
                    console.log(`TokenURI Error: ${err} Is the collection on the correct network?`);
                    return;
                  }
                });
              } else if (chain == "sepolia") {
                tokenURI = await EE_NFTContract_Alchemy_Sepolia.methods.tokenURI(tokenId).call({}, function (err, res) {
                  if (err) {
                    console.log(`TokenURI Error: ${err} Is the collection on the correct network?`);
                    return;
                  }
                });
              }

              /// add other chains here

            } catch (errorMessage) {
              error = true;
            }
            if (!error) {
              console.log("TokenURI: ", tokenURI);

              // Function to check the string and parse the image value
              async function parseTokenURI(tokenURI) {
                let imageData = "";

                // Check if tokenURI is base64 JSON
                if (tokenURI.startsWith("data:")) {
                  const base64String = tokenURI.split(",")[1];
                  const decodedJson = atob(base64String); // Decode base64
                  const json = JSON.parse(decodedJson); // Parse JSON string
                  imageData = json.image; // Access the image key
                } else {
                  // Assuming it's a web address, fetch the JSON data
                  const response = await fetch(tokenURI);
                  const json = await response.json();
                  imageData = json.image; // Access the image key
                }
                return imageData;
              }

              parseTokenURI(tokenURI)
                .then((imageData) => {
                  console.log("Image Data:", imageData);
                  const pfpcontainer = document.querySelector("#pfpContainer");
                  if (!pfpcontainer) {
                    console.error("Container not found");
                    return;
                  }
                  if (imageData.startsWith("<?xml") || imageData.startsWith("<svg")) {
                    pfpcontainer.innerHTML = imageData;
                  } else if (imageData.startsWith("data:image")) {
                    // For base64 images, use an <img> tag
                    const img = document.createElement("img");
                    img.src = imageData;
                    pfpcontainer.innerHTML = ""; // Clear the container
                    pfpcontainer.appendChild(img);
                  } else if (imageData.startsWith("http")) {
                    // For image URLs, use an <img> tag
                    const img = document.createElement("img");
                    img.src = imageData;
                    pfpcontainer.innerHTML = ""; // Clear the container
                    pfpcontainer.appendChild(img);
                  } else {
                    console.error("Unsupported image data format");
                  }
                })
                .catch((error) => {
                  console.error("Error parsing tokenURI:", error);
                });
            } else {
              console.log("GENERATING RANDOM BLONKS AS PLACEHOLDER");
              showBONKSPlaceholder();
            }
          } else {
            pfpId.textContent = "[nothing set - using random BLONKS as placeholder]";
            showBONKSPlaceholder();
          }
        } else {
          pfpContract.textContent = "[nothing set - using BLONKS as placeholder]";
          pfpId.textContent = "[nothing set - using random BLONKS as placeholder]";
          showBONKSPlaceholder();
        }

        // Alias & Detail
        alias.textContent = eeArray[0][0];
        detail.textContent = eeArray[0][1];

        // Social, Website, Gallery
        social.textContent = eeArray[0][2];
        social.setAttribute("href", eeArray[0][2]);
        website.textContent = eeArray[0][3];
        website.setAttribute("href", eeArray[0][3]);
        gallery.textContent = eeArray[0][4];
        gallery.setAttribute("href", eeArray[0][4]);

        // Tags
        let tagsPresent = false;
        for (let i = 0; i < eeArray[6].length; i++) {
          if (eeArray[6][i].length > 0) {
            tagsPresent = true;
            break;
          }
        }
        if (tagsPresent) {
          tagModule.style.display = "block";
          tagsContainer.textContent = "";
          for (let i = 0; i < eeArray[6].length; i++) {
            if (eeArray[6][i].length > 0) {
              const listItem = document.createElement("li");
              listItem.className = "tag-item mr-2";
              const codeElement = document.createElement("code");
              codeElement.className = "h-9";
              codeElement.setAttribute("data-content", "tag");
              codeElement.textContent = eeArray[6][i];
              listItem.appendChild(codeElement);
              tagsContainer.appendChild(listItem);
            }
          }
        } else {
          tagModule.style.display = "none";
        }

        // Badges
        let badgesPresent = false;
        for (let i = 0; i < eeArray[7].length; i += 2) {
          if (eeArray[7][i].length > 0) {
            badgesPresent = true;
            break;
          }
        }
        if (badgesPresent) {
          badgesModule.style.display = "block";
          // badgesContainer.textContent = "";
          for (let i = 0; i < eeArray[7].length; i += 2) {
            if (eeArray[7][i].length > 0) {
              const badgeItem = document.createElement("li");
              badgeItem.className = "mb-2 flex items-center before:mr-4 before:h-2 before:w-2 before:rounded-full before:bg-main";
              const codeElement = document.createElement("code");
              codeElement.className = "mr-2 h-9";
              codeElement.setAttribute("data-content", "badge");
              codeElement.textContent = eeArray[7][i + 1];
              badgeItem.appendChild(codeElement);
              const badgeSenderAtag = document.createElement("a");
              badgeSenderAtag.setAttribute("href", `${siteBase}?account=${eeArray[7][i]}`);
              const badgeSender = document.createElement("code");
              badgeSender.className = "ml-2 mr-2 h-9 bg-blue underline";
              badgeSender.textContent = eeArray[7][i];
              badgeSenderAtag.appendChild(badgeSender);
              badgeItem.appendChild(badgeSenderAtag);
              const iconDiv = document.createElement("div");
              iconDiv.className = "ml-4 flex";
              const etherscanAtag = document.createElement("a");
              etherscanAtag.className = "mr-2 lg:mr-4";
              etherscanAtag.setAttribute("href", chainScan + eeArray[7][i]);
              etherscanAtag.setAttribute("target", "_blank");
              const etherscanImage = document.createElement("img");
              etherscanImage.className = "h-5 w-5";
              etherscanImage.setAttribute("src", "./svg/etherscan.svg");
              etherscanImage.setAttribute("alt", "etherscan logo");
              etherscanAtag.appendChild(etherscanImage);
              iconDiv.appendChild(etherscanAtag);
              badgeItem.appendChild(iconDiv);
              badgesContainer.appendChild(badgeItem);
            }
          }
        } else {
          badgesModule.style.display = "none";
        }

        // Additional Links
        let linksPresent = false;
        for (let i = 0; i < eeArray[1].length; i += 2) {
          if (eeArray[1][i].length > 0) {
            linksPresent = true;
            break;
          }
        }
        if (linksPresent) {
          linksModule.style.display = "block";
          linksContainer.textContent = "";
          for (let i = 0; i < eeArray[1].length; i += 2) {
            if (eeArray[1][i].length > 0) {
              const listItem = document.createElement("li");
              listItem.className = "mb-2 flex items-center before:mr-4 before:h-2 before:w-2 before:rounded-full before:bg-main";
              const linkDetail = document.createElement("code");
              linkDetail.className = "mr-2 h-9";
              linkDetail.textContent = eeArray[1][i + 1];
              listItem.appendChild(linkDetail);
              const linkAtag = document.createElement("a");
              linkAtag.setAttribute("href", eeArray[1][i]);
              const linkName = document.createElement("code");
              linkName.className = "ml-2 mr-2 h-9 underline";
              linkName.textContent = eeArray[1][i];
              linkAtag.appendChild(linkName);
              listItem.appendChild(linkAtag);
              linksContainer.appendChild(listItem);
            }
          }
        } else {
          linksModule.style.display = "none";
        }

        // Associated Accounts
        let associatedPresent = false;
        for (let i = 0; i < eeArray[2].length; i += 2) {
          if (eeArray[2][i].length > 0) {
            associatedPresent = true;
            break;
          }
        }
        if (associatedPresent) {
          associatedModule.style.display = "block";
          associatedContainer.textContent = "";
          for (let i = 0; i < eeArray[2].length; i += 2) {
            if (eeArray[2][i].length > 0) {
              const listItem = document.createElement("li");
              listItem.className = "mb-2 flex items-center before:mr-4 before:h-2 before:w-2 before:rounded-full before:bg-main";
              const associatedDetail = document.createElement("code");
              associatedDetail.className = "mr-2 h-9";
              associatedDetail.textContent = eeArray[2][i + 1];
              listItem.appendChild(associatedDetail);
              const associatedAtag = document.createElement("a");
              associatedAtag.setAttribute("href", `${siteBase}?account=${eeArray[2][i]}`);
              const associatedName = document.createElement("code");
              associatedName.className = "ml-2 mr-2 h-9 bg-blue underline";
              associatedName.textContent = eeArray[2][i];
              associatedAtag.appendChild(associatedName);
              listItem.appendChild(associatedAtag);
              const iconDiv = document.createElement("div");
              iconDiv.className = "ml-4 flex";
              const etherscanAtag = document.createElement("a");
              etherscanAtag.className = "mr-2 lg:mr-4";
              etherscanAtag.setAttribute("href", chainScan + eeArray[2][i]);
              etherscanAtag.setAttribute("target", "_blank");
              const etherscanImage = document.createElement("img");
              etherscanImage.className = "h-5 w-5";
              etherscanImage.setAttribute("src", "./svg/etherscan.svg");
              etherscanImage.setAttribute("alt", "etherscan logo");
              etherscanAtag.appendChild(etherscanImage);
              const etherethosAtag = document.createElement("a");
              // etherethosAtag.setAttribute("href", "#");
              // const etherethosImage = document.createElement("img");
              // etherethosImage.className = "h-5 w-5";
              // etherethosImage.setAttribute("src", "./svg/etherethos.svg");
              // etherethosImage.setAttribute("alt", "etherethos logo");
              // etherethosAtag.appendChild(etherethosImage);
              iconDiv.appendChild(etherscanAtag);
              // iconDiv.appendChild(etherethosAtag);
              listItem.appendChild(iconDiv);
              associatedContainer.appendChild(listItem);
            }
          }
        } else {
          associatedModule.style.display = "none";
        }

        // Respect
        let respectPresent = false;
        for (let i = 0; i < eeArray[3].length; i++) {
          if (eeArray[3][i].length > 0) {
            respectPresent = true;
            respectedHeading.style.display = "block";
            break;
          }
        }
        for (let i = 0; i < eeArray[4].length; i++) {
          if (eeArray[4][i].length > 0) {
            respectPresent = true;
            respectingHeading.style.display = "block";
            break;
          }
        }
        if (respectPresent) {
          respectModule.style.display = "block";
          respectReceivingContainer.textContent = "";
          for (let i = 0; i < eeArray[3].length; i++) {
            if (eeArray[3][i].length > 0) {
              const listItem = document.createElement("li");
              listItem.className = "mb-2 flex items-center before:mr-4 before:h-2 before:w-2 before:rounded-full before:bg-main";
              const respectingReceivingAccountAtag = document.createElement("a");
              respectingReceivingAccountAtag.className = "underline";
              respectingReceivingAccountAtag.setAttribute("href", `${siteBase}?account=${eeArray[3][i]}`);
              const respectReceivingAccount = document.createElement("code");
              respectReceivingAccount.className = "ml-2 mr-2 h-9 bg-blue underline";
              respectReceivingAccount.textContent = eeArray[3][i];
              respectingReceivingAccountAtag.appendChild(respectReceivingAccount);
              listItem.appendChild(respectingReceivingAccountAtag);
              const iconDiv = document.createElement("div");
              iconDiv.className = "ml-4 flex";
              const etherscanAtag = document.createElement("a");
              etherscanAtag.className = "mr-2 lg:mr-4";
              etherscanAtag.setAttribute("href", chainScan + eeArray[3][i]);
              etherscanAtag.setAttribute("target", "_blank");
              const etherscanImage = document.createElement("img");
              etherscanImage.className = "h-5 w-5";
              etherscanImage.setAttribute("src", "./svg/etherscan.svg");
              etherscanImage.setAttribute("alt", "etherscan logo");
              etherscanAtag.appendChild(etherscanImage);
              iconDiv.appendChild(etherscanAtag);
              // const etherethosAtag = document.createElement("a");
              // etherethosAtag.setAttribute("href", "#");
              // const etherethosImage = document.createElement("img");
              // etherethosImage.className = "h-5 w-5";
              // etherethosImage.setAttribute("src", "./svg/etherethos.svg");
              // etherethosImage.setAttribute("alt", "etherethos logo");
              // etherethosAtag.appendChild(etherethosImage);
              // iconDiv.appendChild(etherethosAtag);
              listItem.appendChild(iconDiv);
              respectReceivingContainer.appendChild(listItem);
            }
          }

          respectGivingContainer.textContent = "";
          for (let i = 0; i < eeArray[4].length; i++) {
            if (eeArray[4][i].length > 0) {
              const listItem = document.createElement("li");
              listItem.className = "mb-2 flex items-center before:mr-4 before:h-2 before:w-2 before:rounded-full before:bg-main";
              const respectGivingAccountAtag = document.createElement("a");
              respectGivingAccountAtag.className = "underline";
              respectGivingAccountAtag.setAttribute("href", `${siteBase}?account=${eeArray[4][i]}`);
              const respectGivingAccount = document.createElement("code");
              respectGivingAccount.className = "ml-2 mr-2 h-9 bg-blue underline";
              respectGivingAccount.textContent = eeArray[4][i];
              respectGivingAccountAtag.appendChild(respectGivingAccount);
              listItem.appendChild(respectGivingAccountAtag);
              const iconDiv = document.createElement("div");
              iconDiv.className = "ml-4 flex";
              const etherscanAtag = document.createElement("a");
              etherscanAtag.className = "mr-2 lg:mr-4";
              etherscanAtag.setAttribute("href", chainScan + eeArray[4][i]);
              etherscanAtag.setAttribute("target", "_blank");
              const etherscanImage = document.createElement("img");
              etherscanImage.className = "h-5 w-5";
              etherscanImage.setAttribute("src", "./svg/etherscan.svg");
              etherscanImage.setAttribute("alt", "etherscan logo");
              etherscanAtag.appendChild(etherscanImage);
              // const etherethosAtag = document.createElement("a");
              // etherethosAtag.setAttribute("href", "#");
              // const etherethosImage = document.createElement("img");
              // etherethosImage.className = "h-5 w-5";
              // etherethosImage.setAttribute("src", "./svg/etherethos.svg");
              // etherethosImage.setAttribute("alt", "etherethos logo");
              // etherethosAtag.appendChild(etherethosImage);
              iconDiv.appendChild(etherscanAtag);
              // iconDiv.appendChild(etherethosAtag);
              listItem.appendChild(iconDiv);
              respectGivingContainer.appendChild(listItem);
            }
          }
        } else {
          respectModule.style.display = "none";
        }

        // NOTES
        let notesPresent = false;
        for (let i = 0; i < eeArray[5].length; i += 2) {
          if (eeArray[5][i].length > 0) {
            notesPresent = true;
            break;
          }
        }
        if (notesPresent) {
          notesModule.style.display = "block";
          notesContainer.textContent = "";
          for (let i = 0; i < eeArray[5].length; i += 2) {
            if (eeArray[5][i].length > 0) {
              const listItem = document.createElement("li");
              listItem.className = "mb-2 flex flex-col items-start lg:flex-row";
              const noteDiv = document.createElement("div");
              noteDiv.className = "mb-2 flex items-center before:mr-4 before:h-2 before:w-2 before:rounded-full before:bg-main";
              const noteDetail = document.createElement("code");
              noteDetail.className = "mr-2 h-9";
              noteDetail.textContent = eeArray[5][i + 1];
              noteDiv.appendChild(noteDetail);
              listItem.appendChild(noteDiv);
              centeringDiv = document.createElement("div");
              centeringDiv.className = "flex items-center";
              const noteSenderAtag = document.createElement("a");
              noteSenderAtag.setAttribute("href", chainScan + eeArray[5][i]);
              const noteSender = document.createElement("code");
              noteSender.className = "ml-2 mr-2 h-9 bg-blue underline";
              noteSender.textContent = eeArray[5][i];
              noteSenderAtag.appendChild(noteSender);
              iconDiv = document.createElement("div");
              iconDiv.className = "ml-4 flex";
              etherscanAtag = document.createElement("a");
              etherscanAtag.className = "mr-2 lg:mr-4";
              etherscanAtag.setAttribute("href", chainScan + eeArray[5][i]);
              etherscanAtag.setAttribute("target", "_blank");
              etherscanImage = document.createElement("img");
              etherscanImage.className = "h-5 w-5";
              etherscanImage.setAttribute("src", "./svg/etherscan.svg");
              etherscanImage.setAttribute("alt", "etherscan logo");
              etherscanAtag.appendChild(etherscanImage);
              // etherethosAtag = document.createElement("a");
              // etherethosAtag.setAttribute("href", "#");
              // etherethosImage = document.createElement("img");
              // etherethosImage.className = "h-5 w-5";
              // etherethosImage.setAttribute("src", "./svg/etherethos.svg");
              // etherethosImage.setAttribute("alt", "etherethos logo");
              // etherethosAtag.appendChild(etherethosImage);
              iconDiv.appendChild(etherscanAtag);
              // iconDiv.appendChild(etherethosAtag);
              centeringDiv.appendChild(noteSenderAtag);
              centeringDiv.appendChild(iconDiv);
              listItem.appendChild(centeringDiv);
              notesContainer.appendChild(listItem);
            }
          }
        } else {
          notesModule.style.display = "none";
        }

        // CUSTOM FIELD
        let customPresent = false;
        if (eeArray[8].length > 0) {
          customPresent = true;
        }
        if (customPresent) {
          customModule.style.display = "block";
          customContainer.textContent = eeArray[8];
        } else {
          customModule.style.display = "none";
        }

        // PING
        pingModule.style.display = "block";
        pingContainer.textContent = eeArray[0][8];
      }
    }
    // mainIsVisible(true);
  }
}

if (edit_btn && view_btn && module_view_arr && module_edit_arr) {
  // if edit mode is in the url then toggle edit mode
  if (window.location.href.includes("edit")) {
    toggleClasses(document.body, ["edit"], []);
    toggleClasses(edit_btn, ["text-secondary", "bg-main"], ["text-main", "bg-orange"]);
    toggleClasses(view_btn, ["text-main", "bg-orange"], ["text-secondary", "bg-main"]);

    console.log(module_view_arr);
    for (let i = 0; i < module_view_arr.length; i++) {
      console.log(module_view_arr[i]);
      toggleClasses(module_view_arr[i], ["hidden", "lg:hidden"], []);
      toggleClasses(module_edit_arr[i], [], ["hidden", "lg:hidden"]);
    }
  }

  // Toggle edit mode in tailwind
  function toggleClasses(element, classesToAdd, classesToRemove) {
    classesToRemove.forEach((cls) => element.classList.remove(cls));
    classesToAdd.forEach((cls) => element.classList.add(cls));
  }

  edit_btn.addEventListener("click", () => {
    toggleClasses(document.body, ["edit"], []);
    toggleClasses(edit_btn, ["text-secondary", "bg-main"], ["text-main", "bg-orange"]);
    toggleClasses(view_btn, ["text-main", "bg-orange"], ["text-secondary", "bg-main"]);

    for (let i = 0; i < module_view_arr.length; i++) {
      toggleClasses(module_view_arr[i], ["hidden", "lg:hidden"], []);
      toggleClasses(module_edit_arr[i], [], ["hidden", "lg:hidden"]);
    }

    //autopopulate form info when available
    if(eeArray) {
      console.log('eeArray populated, prefilling form')
      //basic info
      const editAlias = document.querySelectorAll('[data-edit-field="alias"]')[0]
      const editDetail = document.querySelectorAll('[data-edit-field="detail"]')[0]
      const editSocial = document.querySelectorAll('[data-edit-field="social"]')[0]
      const editWebsite = document.querySelectorAll('[data-edit-field="website"]')[0]
      const editGallery = document.querySelectorAll('[data-edit-field="gallery"]')[0]
      const editPFPToken = document.querySelectorAll('[data-edit-field="pfp-id"]')[0]
      const editPFPAddress = document.querySelectorAll('[data-edit-field="pfp-address"]')[0]
      
      editAlias.value = eeArray[0][0]
      editDetail.value = eeArray[0][1]
      editSocial.value = eeArray[0][2]
      editWebsite.value = eeArray[0][3]
      editGallery.value = eeArray[0][4]
      editPFPToken.value = eeArray[0][5]
      editPFPAddress.value = eeArray[0][6]
      
      //verification field
      const editVerification = document.querySelectorAll('[data-edit-field="user-verification"]')[0]
      if(verificationResponse) {
        editVerification.value = verificationResponse
      }
      
      //tags info
      //handled dynamically
      const allTags = eeArray[6]
      if(allTags) {
        const tagsEditParent = document.querySelectorAll('[data-edit-field="tags"]')[0]
        function createTagInput(tagsContainer, index, defaultInput) {
          //create the li
          var thisTag = document.createElement("li")
          thisTag.setAttribute('class', 'my-2 flex items-center before:mr-4 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-main')
          thisTag.setAttribute('data-edit-item', '')
          //create input
          var thisInput = document.createElement('input')
          thisInput.setAttribute('type', 'text')
          thisInput.setAttribute('placeholder', 'Tag Name')
          thisInput.setAttribute('class', 'mr-4 max-h-10 rounded-md border border-main px-3 py-3 text-md lg:w-1/3')
          thisInput.setAttribute('data-field-edit', 'tag')
          thisTag.appendChild(thisInput)
          //create write button
          var thisWrite = document.createElement('button')
          thisWrite.setAttribute('class', 'mx-2 h-7 w-7 rounded-full bg-main p-0')
          thisWrite.setAttribute('data-write', '')
          var writeImg = document.createElement('img')
          writeImg.setAttribute('class', 'm-auto h-3/5 w-3/5 object-contain')
          writeImg.setAttribute('src', './svg/write.svg')
          writeImg.setAttribute('alt', 'Wallet Logo')
          thisWrite.appendChild(writeImg)
          thisTag.appendChild(thisWrite)
          //create delete button
          var thisDelete = document.createElement('button')
          thisDelete.setAttribute('class', 'mx-2 h-7 w-7 rounded-full bg-main p-0')
          thisDelete.setAttribute('data-delete', '')
          var deleteImg = document.createElement('img')
          deleteImg.setAttribute('class', 'm-auto h-3/5 w-3/5 object-contain')
          deleteImg.setAttribute('src', './svg/delete.svg')
          deleteImg.setAttribute('alt', 'Wallet Logo')
          thisDelete.appendChild(deleteImg)
          thisTag.appendChild(thisDelete)
          //attach li to list

          //prepopulate if available
          console.log(tagsContainer)
          tagsContainer.appendChild(thisTag)
          if(defaultInput) {
            thisInput.value = defaultInput
          }

          thisWrite.addEventListener('click', ()=> {
            console.log('updating tag')
            if(defaultInput) {
              updateTagToContract(index, thisInput.value)
            } else {
              pushTagToContract(thisInput.value)
            }
          })
        }
        //populate all existing
        for(let i = 0; i < allTags.length; i++) {
          var tag = allTags[i]
          createTagInput(tagsEditParent, i, tag)
        }
        //create an empty field for additional accounts
        createTagInput(tagsEditParent)
      }

      //badges info
      //handled dynamically
      const allBadges = eeArray[7]
      if(allBadges) {
        const badgesEditParent = document.querySelectorAll('[data-edit-field="badges"]')[0]
        function createTagInput(BadgesContainer, defaultName, defaultAddress) {
          //create the li
          var thisBadge = document.createElement("li")
          thisBadge.setAttribute('class', 'my-2 flex items-center before:mr-4 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-main')
          thisBadge.setAttribute('data-edit-item', '')
          //create input1
          var inputName = document.createElement('input')
          inputName.setAttribute('type', 'text')
          inputName.setAttribute('placeholder', 'Badge Name')
          inputName.setAttribute('class', 'max-h-10 w-28 rounded-md border border-main px-3 py-3 text-md lg:w-1/3')
          thisBadge.appendChild(inputName)
          //create span with ':' divider
          var thisBadgeSpan = document.createElement('span')
          thisBadgeSpan.setAttribute('class', 'mx-2')
          thisBadgeSpan.innerHTML = ':'
          thisBadge.appendChild(thisBadgeSpan)
          //create input1
          var inputAddress = document.createElement('input')
          inputAddress.setAttribute('type', 'text')
          inputAddress.setAttribute('placeholder', 'Receiving Address')
          inputAddress.setAttribute('class', 'mr-4 max-h-10 w-28 rounded-md border border-main px-3 py-3 text-md lg:w-1/3')
          thisBadge.appendChild(inputAddress)
          //create write button
          var thisWrite = document.createElement('button')
          thisWrite.setAttribute('class', 'mx-2 h-7 w-7 rounded-full bg-main p-0')
          var writeImg = document.createElement('img')
          writeImg.setAttribute('class', 'm-auto h-3/5 w-3/5 object-contain')
          writeImg.setAttribute('src', './svg/write.svg')
          writeImg.setAttribute('alt', 'Wallet Logo')
          thisWrite.appendChild(writeImg)
          thisBadge.appendChild(thisWrite)
          //create delete button
          var thisDelete = document.createElement('button')
          thisDelete.setAttribute('class', 'mx-2 h-7 w-7 rounded-full bg-main p-0')
          var deleteImg = document.createElement('img')
          deleteImg.setAttribute('class', 'm-auto h-3/5 w-3/5 object-contain')
          deleteImg.setAttribute('src', './svg/delete.svg')
          deleteImg.setAttribute('alt', 'Wallet Logo')
          thisDelete.appendChild(deleteImg)
          thisBadge.appendChild(thisDelete)
          //attach li to list
          BadgesContainer.appendChild(thisBadge)
          if(defaultAddress || defaultName) {
            inputName.value = defaultName
            inputAddress.value = defaultAddress
          }
        }
        //populate all existing
        for(let i = 0; i < allBadges.length; i++) {
          var badgeAddress = allBadges[i]
          var badgeDesc
          createTagInput(badgesEditParent, badge)
        }
        //create an empty field for additional accounts
        createTagInput(badgesEditParent)
      }


      //Associated accounts info
      //handled dynamically
      const EOAs = eeArray[2]
      console.log(EOAs.length)
      if(EOAs.length/2 > 0) {
        const EOAEditParent = document.querySelectorAll('[data-edit-field="associated"]')[0]
        function createEAOInput(EOAContainer, index, defaultDesc, defaultAddress) {
          indexTuple = index * 2 //should target this address in the doubled array

          //create the li
          var thisEOA = document.createElement("li")
          thisEOA.setAttribute('class', 'my-2 flex items-center before:mr-4 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-main')
          thisEOA.setAttribute('data-edit-item', '')
          //create input1
          var inputDesc = document.createElement('input')
          inputDesc.setAttribute('type', 'text')
          inputDesc.setAttribute('placeholder', 'Description')
          inputDesc.setAttribute('class', 'max-h-10 w-28 rounded-md border border-main px-3 py-3 text-md lg:w-1/3')
          inputDesc.setAttribute('data-field-edit', 'associated-desc')
          thisEOA.appendChild(inputDesc)
          //create span with ':' divider
          var thisEOASpan = document.createElement('span')
          thisEOASpan.setAttribute('class', 'mx-2')
          thisEOASpan.innerHTML = ':'
          thisEOA.appendChild(thisEOASpan)
          //create input1
          var inputAddress = document.createElement('input')
          inputAddress.setAttribute('type', 'text')
          inputAddress.setAttribute('placeholder', 'Address')
          inputAddress.setAttribute('class', 'mr-4 max-h-10 w-28 rounded-md border border-main px-3 py-3 text-md lg:w-1/3')
          inputAddress.setAttribute('data-field-edit', 'associated-address')
          thisEOA.appendChild(inputAddress)
          //create write button
          var thisWrite = document.createElement('button')
          thisWrite.setAttribute('class', 'mx-2 h-7 w-7 rounded-full bg-main p-0')
          thisWrite.setAttribute('data-write', '')
          var writeImg = document.createElement('img')
          writeImg.setAttribute('class', 'm-auto h-3/5 w-3/5 object-contain')
          writeImg.setAttribute('src', './svg/write.svg')
          writeImg.setAttribute('alt', 'Wallet Logo')
          thisWrite.appendChild(writeImg)
          thisEOA.appendChild(thisWrite)
          //create delete button
          var thisDelete = document.createElement('button')
          thisDelete.setAttribute('class', 'mx-2 h-7 w-7 rounded-full bg-main p-0')
          thisDelete.setAttribute('data-delete', '')
          var deleteImg = document.createElement('img')
          deleteImg.setAttribute('class', 'm-auto h-3/5 w-3/5 object-contain')
          deleteImg.setAttribute('src', './svg/delete.svg')
          deleteImg.setAttribute('alt', 'Wallet Logo')
          thisDelete.appendChild(deleteImg)
          thisEOA.appendChild(thisDelete)
          //attach li to list
          EOAContainer.appendChild(thisEOA)
          if(defaultAddress || defaultDesc) {
            inputDesc.value = defaultDesc
            inputAddress.value = defaultAddress
          }

          thisWrite.addEventListener('click', () => {
            console.log(inputDesc.value, ':', inputAddress.value, 'was written to index[', indexTuple, 'and', (indexTuple+1) + ']')
            if(defaultAddress || defaultDesc) {
              //exists, needs to update
              console.log('updating '+ indexTuple)
              updateEOAToContract(index, inputAddress.value, inputDesc.value)
            } else {
              //doesn't exist yet, needs a new entry
              console.log('sent new entry to tuple index', indexTuple)
              pushEOAToContract(inputAddress.value, inputDesc.value)
            }
          })
          thisDelete.addEventListener('click', () => {
            console.log('deleting index[', indexTuple, 'and', (indexTuple+1) + ']')
            inputAddress.value = ' '
            inputDesc.value = ' '
            if(defaultAddress || defaultDesc) {
              deleteEOAFromContract(index)
            }
          })
        }
        //populate all existing
        for(let i = 0; i < EOAs.length/2; i++) {
          var EOA = EOAs[i*2]
          var EOADesc = EOAs[(i*2)+1]
          createEAOInput(EOAEditParent, i, EOADesc, EOA)
        }
        //create an empty field for additional accounts
        createEAOInput(EOAEditParent, EOAs.length)
      }

      //respect info
      //handled dynamically
      const allRespects = eeArray[6]
      if(allRespects) {
        const respectsEditParent = document.querySelectorAll('[data-edit-field="respect"]')[0]
        console.log('container', respectsEditParent)
        function createTagInput(respectsContainer, index, defaultInput) {
          //create the li
          var thisRespect = document.createElement("li")
          thisRespect.setAttribute('class', 'my-2 flex items-center before:mr-4 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-main')
          thisRespect.setAttribute('data-edit-item', '')
          //create input
          var thisInput = document.createElement('input')
          thisInput.setAttribute('type', 'text')
          thisInput.setAttribute('placeholder', 'Account to respect')
          thisInput.setAttribute('class', 'mr-4 max-h-10 rounded-md border border-main px-3 py-3 text-md lg:w-1/3')
          thisInput.setAttribute('data-field-edit', 'tag')
          thisRespect.appendChild(thisInput)
          //create write button
          var thisWrite = document.createElement('button')
          thisWrite.setAttribute('class', 'mx-2 h-7 w-7 rounded-full bg-main p-0')
          thisWrite.setAttribute('data-write', '')
          var writeImg = document.createElement('img')
          writeImg.setAttribute('class', 'm-auto h-3/5 w-3/5 object-contain')
          writeImg.setAttribute('src', './svg/write.svg')
          writeImg.setAttribute('alt', 'Wallet Logo')
          thisWrite.appendChild(writeImg)
          thisRespect.appendChild(thisWrite)
          //create delete button
          var thisDelete = document.createElement('button')
          thisDelete.setAttribute('class', 'mx-2 h-7 w-7 rounded-full bg-main p-0')
          thisDelete.setAttribute('data-delete', '')
          var deleteImg = document.createElement('img')
          deleteImg.setAttribute('class', 'm-auto h-3/5 w-3/5 object-contain')
          deleteImg.setAttribute('src', './svg/delete.svg')
          deleteImg.setAttribute('alt', 'Wallet Logo')
          thisDelete.appendChild(deleteImg)
          thisRespect.appendChild(thisDelete)
          //attach li to list

          //prepopulate if available
          console.log(respectsContainer)
          respectsContainer.appendChild(thisRespect)
          if(defaultInput) {
            thisInput.value = defaultInput
          }

          thisWrite.addEventListener('click', ()=> {
            console.log('updating tag')
            if(defaultInput) {
              updateTagToContract(index, thisInput.value)
            } else {
              pushTagToContract(thisInput.value)
            }
          })
        }
        //populate all existing
        for(let i = 0; i < allRespects.length; i++) {
          var respect = allRespects[i]
          createTagInput(respectsEditParent, i, tag)
        }
        //create an empty field for additional accounts
        createTagInput(respectsEditParent)
      }
    } else {
      console.log('no eeArray, failed to prefill form')
    }
  });

  view_btn.addEventListener("click", () => {
    toggleClasses(document.body, ["edit"], []);
    toggleClasses(edit_btn, ["text-main", "bg-orange"], ["text-secondary", "bg-main"]);
    toggleClasses(view_btn, ["text-secondary", "bg-main"], ["text-main", "bg-orange"]);

    for (let i = 0; i < module_edit_arr.length; i++) {
      toggleClasses(module_edit_arr[i], ["hidden", "lg:hidden"], []);
      toggleClasses(module_view_arr[i], [], ["hidden", "lg:hidden"]);
    }
  });

  //! Add new field to a module

  const tag_module = document.querySelector('[data-module="tags"]');
  // query the data-add-field inside the tags module
  let add_field_btn_arr = document.querySelectorAll("[data-add-field]");
  let remove_field_btn_arr = document.querySelectorAll("[data-delete]");
  let min_field_num = 1;

  addField();

  function addField() {
    add_field_btn_arr.forEach((btn) => {
      btn.addEventListener("click", () => {
        // get the parent data-module
        const parent_module = btn.closest("[data-module]");

        // query the data-field inside the tags module
        const field = parent_module.querySelector("[data-module-edit-field]");
        const fieldset = parent_module.querySelector("[data-module-fieldset]");

        // create a new field but without the value and do not clone it
        const new_field = field.cloneNode(true);
        // clear the value of the new field
        console.log(new_field);
        new_field.value = "";

        // append the new field to the tags module
        fieldset.appendChild(new_field);
        // update the remove_field_btn
      });
    });
  }
}

async function showBONKSPlaceholder() {
  const pfpcontainer = document.querySelector("#pfpContainer");
  let BLONKSsvg;
  error = false;
  if (!pfpcontainer) {
    console.error("Container not found");
    return;
  }
  const BLONKS_Alchemy = new web3Main.eth.Contract(BLONKS_ABI, BLONKS_CONTRACT);
  // let renderer = 0;
  let renderer = Math.floor(Math.random() * 4);
  let randTokenId = Math.floor(Math.random() * 4444);
  let rendererStrings = ["BLONKS", "DarkBLONKS", "PepeBLONKS", "BLOOPS"];
  try {
    // BLONKSsvg = await BLONKS_Alchemy.methods.RANDOM_RENDER_SVG(renderer).call({}, function (err, res) {
    BLONKSsvg = await BLONKS_Alchemy.methods.PREVIEW_SHAPESHIFTER_SVG(randTokenId, account, renderer).call({}, function (err, res) {
      if (err) {
        console.log(`BLONKS RENDER Error: ${err} Is the collection on the correct network?`);
        return;
      }
    });
  } catch (errorMessage) {
    error = true;
  }
  if (!error) {
    pfpcontainer.innerHTML = BLONKSsvg;
    blonksInfo.style.display = "block";
    blonksInfo.textContent = `Showing BLONKS #${randTokenId}, using the '${rendererStrings[renderer]}' EVM renderer, appearing as if it was owned by this account. (Learn more at BLONKS.xyz)`;
  }
}
  // async function updateSampleSVGs() {
  //   // Wiping any previous previewed SVG
  //   document.getElementById("svgPlaceholder").innerHTML = "";
  //   // Getting random renders
  //   let BLONKsvg = await uriContractAlchemy.methods.RANDOM_RENDER_SVG(0).call();
  //   let DarkBLONKsvg = await uriContractAlchemy.methods.RANDOM_RENDER_SVG(1).call();
  //   let PepeBLONKsvg = await uriContractAlchemy.methods.RANDOM_RENDER_SVG(2).call();
  //   let BLOOPsvg = await uriContractAlchemy.methods.RANDOM_RENDER_SVG(3).call();
  //   document.getElementById("BLONK-live").innerHTML = BLONKsvg;
  //   document.getElementById("DarkBLONK-live").innerHTML = DarkBLONKsvg;
  //   document.getElementById("PepeBLONK-live").innerHTML = PepeBLONKsvg;
  //   document.getElementById("BLOOP-live").innerHTML = BLOOPsvg;
  // }

// function searchButton() {
//   var submittedAccount = document.getElementById("submitted-account").value;
//   if (submittedAccount.match(hexPat)) {
//     searchAccount = submittedAccount;
//     console.log("Account Address Accepted: " + searchAccount);
//     window.location.replace(`${siteBase}?account=${searchAccount}`);
//   } else {
//     console.log("No Valid Account Address Provided");
//   }
// }

// function _etherscan(address) {
//   return `<a href="https://goerli.etherscan.io/address/${address}" target="_blank">Etherscan</a>`;
// }

// function _etherEthos(address) {
//   return `<a href="${siteBase}?account=${address}">${address}</a>`;
// }


// const dataLegend = [["alias", "account_detail", "social", "website", "gallery", "link_priority", "pfp_contract", "pfp_id"], ["link", "link_detail"], ["EOA", "EOA_detail"], ["respecter account"], ["respecting account"], ["note", "note_detail"], ["tag"], ["badge", "badge_detail"], ["custom"]];
