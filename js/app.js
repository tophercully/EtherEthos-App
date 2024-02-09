let account, abbrvAccount, error, permissions, eeArray, eeBasics;
let composable, accountIsBlocked, moderator, verificationResponse, perms, composableCheck, accountIsBlockedCheck, moderatorCheck, verificationResponseCheck;
let chainOptions = ["mainnet", "sepolia", "optimism", "base"];
var url_string = window.location.href;
let rawAccount = "";
const hexPat = /^0[xX]{1}[a-fA-F0-9]{40}$/;
const currentUrl = new URL(window.location.href);
const siteBase = currentUrl.origin + currentUrl.pathname;
const BLONKS_CONTRACT = "0x5bB2333Ee8C9818D4bd898a17f597Ec6F5710Fd6";

const nullAddress = "0x0000000000000000000000000000000000000000";

//! Edit & view toggler

const edit_btn = document.querySelector("[data-toggle-edit]");
const view_btn = document.querySelector("[data-toggle-view]");

const module_view_arr = document.querySelectorAll("[data-module-view]");
const module_edit_arr = document.querySelectorAll("[data-module-edit]");

const searchInput = document.querySelector("[data-search-input]");
const searchButton = document.querySelector("[data-search-submit]");
const mainContent = document.querySelector("[data-main]");

const chainContent = document.querySelector("[text-content-chain]");

const accountNameElements = document.querySelectorAll("[data-account-name]");
const accountStatusElement = document.querySelector("[data-content-account-status]");

const accountComposableElementTrue = document.querySelector("[data-composable=true]");
const accountComposableElementFalse = document.querySelector("[data-composable=false]");
const accountBlockedElement = document.querySelector("[data-view-section=blocked]");
const accountModeratorElement = document.querySelector("[data-view-section=moderator]");
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
function toggleVisibilityBasedOnAddress(isValid) {
  console.log("Toggling visibility based on address validity..." + isValid);
    if (isValid) {
      mainContent.classList.remove("hidden");
      view_btn.classList.remove("hidden");
      if (account == currentAccount) {
        edit_btn.classList.remove("hidden");
      } else {
        if (!edit_btn.classList.contains("hidden")) {
          edit_btn.classList.add("hidden");
        }
      }
    } else {
      mainContent.classList.add("hidden");
    }
}

function abbreviateAndUpdate(account) {
  abbrvAccount = `${account.slice(0, 6)}...${account.slice(-4)}`;
  accountNameElements.forEach((element) => {
    element.textContent = abbrvAccount; 
  });
}

if (url_string.includes("chain")) {
  var url = new URL(url_string);
  const chainInput = url.searchParams.get("chain");
  if (chainOptions.includes(chainInput)) {
    console.log("Chain accepted from URL parameter: " + chainInput);
    chain = chainInput;
  }
}

chainContent.textContent = `(${chain})`;

if (url_string.includes("account")) {
  var url = new URL(url_string);
  const isValid = isValidEthereumAddress(url.searchParams.get("account"));
  if (isValid) {
    account = url.searchParams.get("account");
    console.log("Account accepted from URL parameter: " + account);
    abbreviateAndUpdate(account);
    _queryContract(account);
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
    } else {
      // Notify the user if the Ethereum address is invalid
      alert("Please enter a valid Ethereum address, 0x...");
      toggleVisibilityBasedOnAddress(false);
    }
  });
}

async function _queryContract(account) {
  console.log("Checking account permissions...");
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
      accountStatus += "Account is composable. ";
    } else {
      accountComposableElementTrue.style.display = "hidden";
      accountComposableElementFalse.style.display = "block";
      accountStatus += "Account is not composable (may not have set up an EtherEthos profile). ";
    }
    if (accountIsBlocked) {
      accountBlockedElement.style.display = "block";
      accountStatus += "Account is blocked! ";
    }
    if (moderator) {
      accountModeratorElement.style.display = "block";
      accountStatus += "Account is not a moderator.";
    }
    if (verificationResponse.length > 0) {
      accountVerificationElement.textContent = verificationResponse;
    } else {
      accountVerificationElement.textContent = "[nothing set]";
    }
    console.log(accountStatus);
    accountStatusElement.textContent = accountStatus;
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
            etherscanAtag.setAttribute("href", "#");
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
            linkAtag.setAttribute("href", "#");
            const linkName = document.createElement("code");
            linkName.className = "ml-2 mr-2 h-9 bg-blue underline";
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
            etherscanAtag.setAttribute("href", "#");
            const etherscanImage = document.createElement("img");
            etherscanImage.className = "h-5 w-5";
            etherscanImage.setAttribute("src", "./svg/etherscan.svg");
            etherscanImage.setAttribute("alt", "etherscan logo");
            etherscanAtag.appendChild(etherscanImage);
            const etherethosAtag = document.createElement("a");
            etherethosAtag.setAttribute("href", "#");
            const etherethosImage = document.createElement("img");
            etherethosImage.className = "h-5 w-5";
            etherethosImage.setAttribute("src", "./svg/etherethos.svg");
            etherethosImage.setAttribute("alt", "etherethos logo");
            etherethosAtag.appendChild(etherethosImage);
            iconDiv.appendChild(etherscanAtag);
            iconDiv.appendChild(etherethosAtag);
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
            etherscanAtag.setAttribute("href", "#");
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
            etherscanAtag.setAttribute("href", "#");
            const etherscanImage = document.createElement("img");
            etherscanImage.className = "h-5 w-5";
            etherscanImage.setAttribute("src", "./svg/etherscan.svg");
            etherscanImage.setAttribute("alt", "etherscan logo");
            etherscanAtag.appendChild(etherscanImage);
            const etherethosAtag = document.createElement("a");
            etherethosAtag.setAttribute("href", "#");
            const etherethosImage = document.createElement("img");
            etherethosImage.className = "h-5 w-5";
            etherethosImage.setAttribute("src", "./svg/etherethos.svg");
            etherethosImage.setAttribute("alt", "etherethos logo");
            etherethosAtag.appendChild(etherethosImage);
            iconDiv.appendChild(etherscanAtag);
            iconDiv.appendChild(etherethosAtag);
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
            noteSenderAtag.setAttribute("href", "#");
            const noteSender = document.createElement("code");
            noteSender.className = "ml-2 mr-2 h-9 bg-blue underline";
            noteSender.textContent = eeArray[5][i];
            noteSenderAtag.appendChild(noteSender);
            iconDiv = document.createElement("div");
            iconDiv.className = "ml-4 flex";
            etherscanAtag = document.createElement("a");
            etherscanAtag.className = "mr-2 lg:mr-4";
            etherscanAtag.setAttribute("href", "#");
            etherscanImage = document.createElement("img");
            etherscanImage.className = "h-5 w-5";
            etherscanImage.setAttribute("src", "./svg/etherscan.svg");
            etherscanImage.setAttribute("alt", "etherscan logo");
            etherscanAtag.appendChild(etherscanImage);
            etherethosAtag = document.createElement("a");
            etherethosAtag.setAttribute("href", "#");
            etherethosImage = document.createElement("img");
            etherethosImage.className = "h-5 w-5";
            etherethosImage.setAttribute("src", "./svg/etherethos.svg");
            etherethosImage.setAttribute("alt", "etherethos logo");
            etherethosAtag.appendChild(etherethosImage);
            iconDiv.appendChild(etherscanAtag);
            iconDiv.appendChild(etherethosAtag);
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
  toggleVisibilityBasedOnAddress(true);
}

if (edit_btn && view_btn && module_view_arr && module_edit_arr) {
  // if edit mode is in the url then toggle edit mode
  if (window.location.href.includes("edit")) {
    toggleClasses(document.body, ["edit"], []);
    toggleClasses(edit_btn, ["text-secondary", "bg-main"], ["text-main", "bg-orange"]);
    toggleClasses(view_btn, ["text-main", "bg-orange"], ["text-secondary", "bg-main"]);

    for (let i = 0; i < module_view_arr.length; i++) {
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
