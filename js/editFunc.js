function handleEditField(event) {
    const editField = event.target.getAttribute('data-edit-field');
    const inputValue = event.target.value;
    
    //temp function
    console.log(`Edit field: ${editField}, Input: ${inputValue}`);
    if(editField == 'alias') {
        pushAliasToContract(inputValue)
    } else if(editField == 'detail') {
        setDetailToContract(inputValue)
    } else if(editField == 'social') {
        setSocialToContract(inputValue)
    } else if(editField == 'website') {
        setWebsiteToContract(inputValue)
    } else if(editField == 'gallery') {
        setGalleryToContract(inputValue)
    } else if(editField == 'pfp-id' || editField == 'pfp-address') {
        var idInput = document.querySelectorAll('[data-edit-field="pfp-id"]')
        var addressInput = document.querySelectorAll('[data-edit-field="pfp-address"]')
        console.log(idInput[0].value, addressInput[0].value)
        setPFPToContract(addressInput[0].value, idInput[0].value)
    }
}

function handleDeleteField(event) {
    const editField = event.target.getAttribute('data-edit-field');
    console.log(`Delete field: ${editField}`);
    if(editField == 'alias') {
        pushAliasToContract(' ')
    } else if(editField == 'detail') {
        setDetailToContract(' ')
    } else if(editField == 'social') {
        setSocialToContract(' ')
    } else if(editField == 'website') {
        setWebsiteToContract(' ')
    } else if(editField == 'gallery') {
        setGalleryToContract(' ')
    } else if(editField == 'pfp-id' || editField == 'pfp-address') {
        var idInput = document.querySelectorAll('[data-edit-field="pfp-id"]')
        var addressInput = document.querySelectorAll('[data-edit-field="pfp-address"]')
        console.log(idInput[0].value, addressInput[0].value)
        setPFPToContract(0x0000000000000000000000000000000000000000, 0)
    }

}


//get submit buttons to manipuulate
const elementsWithDataWrite = document.querySelectorAll('[data-write]');
//add event listener to each submit
elementsWithDataWrite.forEach(element => {
    //assuming the input is always previous sibling
    const elementParent = element.parentElement;
    const inputField = element.previousElementSibling;
    // const inputFields = element.getElementsByTagName('INPUT');
    const deleteButton = element.nextElementSibling;
    element.addEventListener('click', (event) => {
        handleEditField({
            target: inputField
        });


    });
    //replace field with anything NOT NULL
    deleteButton.addEventListener('click', () => {
        handleDeleteField({
            target: inputField
        });
    });
});

const pushAliasToContract = async (value) => {
    try {
        await EE_Contract_User.methods.setAlias(currentAccount, value).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}
const setDetailToContract = async (value) => {
    try {
        await EE_Contract_User.methods.setDetail(currentAccount, value).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}
const setSocialToContract = async (value) => {
    try {
        await EE_Contract_User.methods.setSocial(currentAccount, value).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}
const setWebsiteToContract = async (value) => {
    try {
        await EE_Contract_User.methods.setWebsite(currentAccount, value).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}
const setGalleryToContract = async (value) => {
    try {
        await EE_Contract_User.methods.setGallery(currentAccount, value).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}
const setPFPToContract = async (pfpAddress, pfpID) => {
    try {
        await EE_Contract_User.methods.setPFP(currentAccount, pfpAddress, pfpID).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}



//TAGS
const pushTagToContract = async (value) => {
    try {
        await EE_Contract_User.methods.pushTag(currentAccount, value).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}
const updateTagToContract = async (index, value) => {
    try {
        await EE_Contract_User.methods.pushTag(currentAccount, index, value).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}
const deleteTagToContract = async (index) => {
    try {
        await EE_Contract_User.methods.deleteTag(currentAccount, index).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}

//ASSOCIATED ADDRESSES
const pushAssociatedAccountToContract = async (address, desc) => {
    try {
        await EE_Contract_User.methods.pushAssociatedAccount(currentAccount, address, desc).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}
const updateAssociatedAccountToContract = async (index, address, desc) => {
    try {
        await EE_Contract_User.methods.updateAssociatedAccount(currentAccount, index, address, desc).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}
const deleteAssociatedAccountToContract = async (index) => {
    
    try {
        await EE_Contract_User.methods.deleteAssociatedAccount(currentAccount, index).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}

//BADGES
const bulkGrantBadgeToContract = async (index, addressesArray, name) => {
    console.log(addressesArray)
    try {
        await EE_Contract_User.methods.bulkGrantBadge(currentAccount, addressesArray, name).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}
const deleteBadgeToContract = async (index) => {
    
    try {
        await EE_Contract_User.methods.deleteBadge(currentAccount, index).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}

//CUSTOM DATA
const setCustomDataToContract = async (customData) => {
    
    try {
        await EE_Contract_User.methods.setCustomData(currentAccount, customData).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}

//RESPECT
const giveRespectToContract = async (otherAccount) => {
    
    try {
        await EE_Contract_User.methods.giveRespect(currentAccount, otherAccount).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}
const revokeRespectToContract = async (otherAccount) => {
    
    try {
        await EE_Contract_User.methods.revokeRespect(currentAccount, otherAccount).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}

//NOTES
const setNoteToContract = async (otherAccount, noteContent) => {
    
    try {
        await EE_Contract_User.methods.setNote(currentAccount, otherAccount, noteContent).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}
const deleteWrittenNoteToContract = async (otherAccount) => {
    
    try {
        await EE_Contract_User.methods.deleteWrittenNote(currentAccount, otherAccount).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}
const deleteReceivedNoteToContract = async (otherAccount) => {
    
    try {
        await EE_Contract_User.methods.deleteReceivedNote(currentAccount, otherAccount).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}

//ADDITIONAL LINKS
const pushAdditionalLinkToContract = async (name, link) => {
    
    try {
        await EE_Contract_User.methods.pushAdditionalLink(currentAccount, link, name).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}
const updateAdditionalLinkToContract = async (index, name, link) => {
    
    try {
        await EE_Contract_User.methods.updateAdditionalLink(currentAccount, index, link, name).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}
const deleteAdditionalLinkToContract = async (index) => {
    
    try {
        await EE_Contract_User.methods.deleteAdditionalLink(currentAccount, index).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}

//PING
const pingToContract = async () => {
    try {
        await EE_Contract_User.methods.ping(currentAccount).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}

//COMPOSABLE
const toggleComposableToContract = async () => {
    try {
        await EE_Contract_User.methods.toggleComposable(currentAccount).send(
          {
            from: currentAccount
          },
          function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
    } catch (errorMessage) {
        error = true;
    }
}
