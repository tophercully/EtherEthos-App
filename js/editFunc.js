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


const pushFieldToContract = async (func, arguments) => {
    // let chainContract 
    // if(chain == sepolia){
        // chainContract = EE_Contract_Alchemy_Sepolia
    // } else {
        
    try {
        await EE_Contract_Alchemy_Sepolia.methods.setAlias(currentAccount, 'chrisssssss').call(
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
        await EE_Contract_Alchemy_Sepolia.methods.setAlias(currentAccount, 'chrisssssss').call(
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