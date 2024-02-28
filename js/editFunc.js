function handleEditField(event) {
    const editField = event.target.getAttribute('data-edit-field');
    const inputValue = event.target.value;
    
    //temp function
    console.log(`Edit field: ${editField}, Input: ${inputValue}`);
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
            target: inputField,
        });
    });
    //replace field with anything NOT NULL
    deleteButton.addEventListener('click', (event) => {
        inputField.value = ' '
    });
});


const pushSingleFieldToContract = async (func, argument) => {
    // let chainContract 
    // if(chain == sepolia){
        // chainContract = EE_Contract_Alchemy_Sepolia
    // } else {
        
    try {
        await EE_Contract_User.methods[func](currentAccount, argument).send(
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

const pushAliasToContract = async () => {
    try {
        await EE_Contract_User.methods.setAlias(currentAccount, 'chrisssssss').send(
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
const pushEOAToContract = async (address, desc) => {
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
const updateEOAToContract = async (index, address, desc) => {
    try {
        console.log('update function running')
        await EE_Contract_User.methods.pushAssociatedAccount(currentAccount, index, address, desc).send(
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
const deleteEOAFromContract = async (index) => {
    
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