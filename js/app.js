let account, abbrvAccount, error, eeArray, eeBasics;
let composable, accountIsBlocked, moderator, verificationResponse, perms, composableCheck, accountIsBlockedCheck, moderatorCheck, verificationResponseCheck;
var url_string = window.location.href;
let rawAccount = "";
const hexPat = /^0[xX]{1}[a-fA-F0-9]{40}$/;
const currentUrl = new URL(window.location.href);
const siteBase = currentUrl.origin + currentUrl.pathname;

const nullAddress = "0x0000000000000000000000000000000000000000";

//! Edit & view toggler

const edit_btn = document.querySelector("[data-toggle-edit]");
const view_btn = document.querySelector("[data-toggle-view]");

const module_view_arr = document.querySelectorAll("[data-module-view]");
const module_edit_arr = document.querySelectorAll("[data-module-edit]");

const searchInput = document.querySelector("[data-search-input]");
const searchButton = document.querySelector("[data-search-submit]");
const mainContent = document.querySelector("[data-main]");

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
    let permissions = await EE_Contract_Alchemy.methods.permissions(account).call({}, function (err, res) {
      if (err) {
        console.log(err);
        return;
      }
    });
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
      eeArray = await EE_Contract_Alchemy.methods.assembleAccountData(account).call({}, function (err, res) {
        if (err) {
          console.log(err);
          return;
        }
      });
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
          if (tokenId > -1 && tokenId == tokenId % 1) {
            pfpId.textContent = tokenId;
            const EE_NFTContract_Alchemy = new web3.eth.Contract(NFT_ABI, eeArray[0][6]);
            let pfpOwner;
            try {
              pfpOwner = await EE_NFTContract_Alchemy.methods.ownerOf(tokenId).call({}, function (err, res) {
                if (err) {
                  console.log(`PFP Ownership Verification ${err} Is the collection on the correct network?`);
                  return;
                }
              });
            } catch (errorMessage) {
              error = true;
            }
            if (!error && pfpOwner == account) {
              pfpVerified.textContent = "✔️ PFP Ownership Verified";
              // document.getElementById("pfp-verified").innerHTML = `(✔️ Ownership Verified)`;
              console.log("PFP Ownership Verified");
            } else {
              pfpVerified.textContent = "✖️ PFP Ownership Not Verified";
              // document.getElementById("pfp-verified").innerHTML = `(✖️ Ownership Not Verified)`;
              console.log("PFP Ownership Not Verified");
            }

            try {
              tokenURI = await EE_NFTContract_Alchemy.methods.tokenURI(tokenId).call({}, function (err, res) {
                if (err) {
                  console.log(`TokenURI Error: ${err} Is the collection on the correct network?`);
                  return;
                }
              });
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
                  } else if (imageData.startsWith('data:image')) {
                    // For base64 images, use an <img> tag
                    const img = document.createElement('img');
                    img.src = imageData;
                    pfpcontainer.innerHTML = ''; // Clear the container
                    pfpcontainer.appendChild(img);
                  } else if (imageData.startsWith('http')) {
                    // For image URLs, use an <img> tag
                    const img = document.createElement('img');
                    img.src = imageData;
                    pfpcontainer.innerHTML = ''; // Clear the container
                    pfpcontainer.appendChild(img);
                  } else {
                    console.error('Unsupported image data format');
                  }
                })
                .catch((error) => {
                  console.error("Error parsing tokenURI:", error);
                });
            } else {
              // show a BLONKS placeholder
            }
          } else {
            pfpId.textContent = "[nothing set]";
          }
        } else {
          pfpContract.textContent = "[nothing set]";
          pfpId.textContent = "[nothing set]";
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
              listItem.className = "mb-2 flex items-center before:mr-4 before:h-2 before:w-2 before:rounded-full before:bg-main";
              const codeElement = document.createElement("code");
              codeElement.className = "mr-2 h-9";
              codeElement.setAttribute("data-content", "badge");
              codeElement.textContent = eeArray[7][i];
              listItem.appendChild(codeElement);
              const badgeSenderAtag = document.createElement("a");
              badgeSenderAtag.setAttribute("href", `${siteBase}?account=${eeArray[7][i + 1]}`);
              const badgeSender = document.createElement("code");
              badgeSender.className = "ml-2 mr-2 h-9 bg-blue underline";
              badgeSender.textContent = eeArray[7][i + 1];
              badgeSenderAtag.appendChild(badgeSender);
              listItem.appendChild(badgeSenderAtag);
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
              badgesContainer.appendChild(listItem);
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















        // document.getElementById("alias").innerHTML = `<code>${eeArray[0][0]}</code>`;
        // document.getElementById("account-detail").innerHTML = `<code>${eeArray[0][1]}</code>`;
        // document.getElementById("social").innerHTML = `<code><a href="${eeArray[0][2]}" target="_blank">${eeArray[0][2]}</a></code>`;
        // document.getElementById("website").innerHTML = `<code><a href="${eeArray[0][3]}" target="_blank">${eeArray[0][3]}</a></code>`;
        // document.getElementById("gallery").innerHTML = `<code><a href="${eeArray[0][4]}" target="_blank">${eeArray[0][4]}</a></code>`;
        // if (0 <= eeArray[0][5] < 3) {
        //   document.getElementById("link-priority").innerHTML = `<code>${eeArray[0][5]}</code>`;
        // }
        // if (eeArray[0][6] != "0x0000000000000000000000000000000000000000") {
        //   document.getElementById("pfp-contract").innerHTML = `<code>${_etherEthos(eeArray[0][6])}</code>`;
        //   document.getElementById("pfp-id").innerHTML = `<code>${eeArray[0][7]}</code>`;

        //   let pfpContract = new web3.eth.Contract(NFT_ABI, eeArray[0][6]);
        //   let pfpOwner;
        //   try {
        //     pfpOwner = await pfpContract.methods.ownerOf(parseInt(eeArray[0][7])).call({}, function (err, res) {
        //       if (err) {
        //         console.log(`PFP Ownership Verification ${err} Is the collection on the correct network?`);
        //         return;
        //       }
        //     });
        //   } catch (errorMessage) {
        //     error = true;
        //   }
        //   if (!error && pfpOwner == account) {
        //     document.getElementById("pfp-verified").innerHTML = `(✔️ Ownership Verified)`;
        //   } else {
        //     document.getElementById("pfp-verified").innerHTML = `(✖️ Ownership Not Verified)`;
        //   }
        // }

    //     let pfpImage = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#222222" /><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="50">?</text></svg>`;

    //     // Get PFP Image from tokenURI and replace pfpImage //
    //     document.getElementById("pfp-display").innerHTML = pfpImage;

    //     document.getElementById("basic-data").style.display = "block";

    //     // Tags
    //     let tagString = "";
    //     for (let i = 0; i < eeArray[6].length; i++) {
    //       tagString += `<code>${eeArray[6][i]}</code>  `;
    //     }
    //     document.getElementById("tags").innerHTML = `${tagString}`;
    //     document.getElementById("tags-group").style.display = "block";

    //     //Links
    //     if (eeArray[1].length > 0) {
    //       let links = "<ul>";
    //       for (let i = 0; i < eeArray[1].length / 2 + 1; i += 2) {
    //         links = links + `<li><code>${eeArray[1][i + 1]}</code> : <code><a href="${eeArray[1][i]}" target="_blank">${eeArray[1][i]}</a></code></li>`;
    //       }
    //       links = links + "</ul>";
    //       document.getElementById("links").innerHTML = links;
    //       document.getElementById("links-and-accounts-display").style.display = "block";
    //     }

    //     if (eeArray[2].length > 0) {
    //       let EOAs = "<ul>";
    //       for (let i = 0; i < eeArray[2].length / 2 + 1; i += 2) {
    //         EOAs = EOAs + `<li><code>${eeArray[2][i + 1]}</code> : <code>${_etherEthos(eeArray[2][i])}</code> ${_etherscan(eeArray[2][i])}</li>`;
    //       }
    //       EOAs = EOAs + "</ul>";
    //       document.getElementById("associated-accounts").innerHTML = EOAs;
    //       document.getElementById("links-and-accounts-display").style.display = "block";
    //     }

    //     // Respecters
    //     document.getElementById("respecters-heading").innerHTML = `Account is Respected by ${eeArray[3].length} Accounts:`;
    //     if (eeArray[3].length > 0) {
    //       let respecters = "<ul>";
    //       for (let i = 0; i < eeArray[3].length; i++) {
    //         respecters = respecters + `<li><code>${_etherEthos(eeArray[3][i])}</code> ${_etherscan(eeArray[3][i])}</li>`;
    //       }
    //       respecters = respecters + "</ul>";
    //       document.getElementById("respecters").innerHTML = respecters;
    //       document.getElementById("respect-display").style.display = "block";
    //     }

    //     // Respecting
    //     document.getElementById("respecting-heading").innerHTML = `Account Respects ${eeArray[4].length} Accounts:`;
    //     if (eeArray[4].length > 0) {
    //       let respecting = "<ul>";
    //       for (let i = 0; i < eeArray[4].length; i++) {
    //         respecting = respecting + `<li><code>${_etherEthos(eeArray[4][i])}</code> ${_etherscan(eeArray[4][i])}</li>`;
    //       }
    //       respecting = respecting + "</ul>";
    //       document.getElementById("respecting").innerHTML = respecting;
    //       document.getElementById("respect-display").style.display = "block";
    //     }

    //     // Notes
    //     if (eeArray[5].length > 0) {
    //       let notesStr = "";
    //       for (let i = 0; i < eeArray[5].length / 2 + 1; i += 2) {
    //         notesStr = notesStr + `<li><code>${eeArray[5][i + 1]}</code> - <code><em>${_etherEthos(eeArray[5][i])}</em></code> ${_etherscan(eeArray[5][i])}</li>`;
    //       }
    //       if (notesStr.length > 0) {
    //         notesStr = "<ul>" + notesStr + "</ul>";
    //         document.getElementById("notes").innerHTML = notesStr;
    //         document.getElementById("notes-display").style.display = "block";
    //       }
    //     }

    //     // Badges
    //     if (eeArray[7].length > 0) {
    //       let badges = "<ul>";
    //       for (let i = 0; i < eeArray[7].length / 2 + 1; i = i + 2) {
    //         badges = badges + `<li><code>${eeArray[7][i + 1]}</code> - <code>${_etherEthos(eeArray[7][i])}</code> ${_etherscan(eeArray[7][i])}</li>`;
    //       }
    //       badges = badges + "</ul>";
    //       document.getElementById("badges").innerHTML = badges;
    //       document.getElementById("badges-display").style.display = "block";
    //     }

    //     //Custom
    //     document.getElementById("custom").innerHTML = `<code>${eeArray[8]}</code>`;
    //     document.getElementById("custom-display").style.display = "block";

    //     // raw data
    //     let raw_data = "";
    //     let data_legend = "";
    //     for (let i = 0; i < eeArray.length; i++) {
    //       let innerLength = eeArray[i].length;
    //       for (let j = 0; j < innerLength; j++) {
    //         if (i == 0) {
    //           data_legend = data_legend + `[${i}][${j}] ${dataLegend[i][j]}<br>`;
    //         } else if (i == 1) {
    //           if (j % 2 == 0) {
    //             data_legend = data_legend + `[${i}][${j}] #${[Math.floor(j / 2)]} ${dataLegend[i][0]}<br>`;
    //           } else {
    //             data_legend = data_legend + `[${i}][${j}] #${[Math.floor(j / 2)]} ${dataLegend[i][1]}<br>`;
    //           }
    //         } else if (i == 2) {
    //           if (j % 2 == 0) {
    //             data_legend = data_legend + `[${i}][${j}] #${[Math.floor(j / 2)]} ${dataLegend[i][0]}<br>`;
    //           } else {
    //             data_legend = data_legend + `[${i}][${j}] #${[Math.floor(j / 2)]} ${dataLegend[i][1]}<br>`;
    //           }
    //         } else if (i == 3) {
    //           data_legend = data_legend + `[${i}][${j}] #${j} ${dataLegend[i][0]}<br>`;
    //         } else if (i == 4) {
    //           data_legend = data_legend + `[${i}][${j}] #${j} ${dataLegend[i][0]}<br>`;
    //         } else if (i == 5) {
    //           if (j % 2 == 0) {
    //             data_legend = data_legend + `[${i}][${j}] #${[Math.floor(j / 2)]} ${dataLegend[i][0]}<br>`;
    //           } else {
    //             data_legend = data_legend + `[${i}][${j}] #${[Math.floor(j / 2)]} ${dataLegend[i][1]}<br>`;
    //           }
    //         } else if (i == 6) {
    //           data_legend = data_legend + `[${i}][${j}] #${j} tag<br>`;
    //         } else if (i == 7) {
    //           if (j % 2 == 0) {
    //             data_legend = data_legend + `[${i}][${j}] #${[Math.floor(j / 2)]} ${dataLegend[i][0]}<br>`;
    //           } else {
    //             data_legend = data_legend + `[${i}][${j}] #${[Math.floor(j / 2)]} ${dataLegend[i][1]}<br>`;
    //           }
    //         } else if (i == 8) {
    //           data_legend = data_legend + `[${i}][${j}] #${j} ${dataLegend[i][0]}<br>`;
    //         }
    //         raw_data = raw_data + `[${i}][${j}] ${eeArray[i][j]}<br>`;
    //       }
    //     }

    //     document.getElementById("raw-data").innerHTML = raw_data;
    //     document.getElementById("data-legend").innerHTML = data_legend;
    //     document.getElementById("raw-data-display").style.display = "block";
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
}


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
