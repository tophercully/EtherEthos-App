function prepopulate(profileArray, verificationData, accountPermission, chainScan) {


    
    //depopulate in case of previous account info remaining
    document.querySelectorAll('[data-edit-field="alias"]')[0].innerHTML = ""
    document.querySelectorAll('[data-edit-field="detail"]')[0].innerHTML = ""
    document.getElementById('edit-profile-links').innerHTML = ''
    document.querySelectorAll('[data-edit-field="pfp-id"]')[0].innerHTML = ""
    document.querySelectorAll('[data-edit-field="pfp-address"]')[0].innerHTML = ""
    document.querySelectorAll('[data-edit-field="user-verification"]')[0].innerHTML = ""
    document.querySelectorAll('[data-edit-field="notes"]')[0].innerHTML = ""
    document.querySelectorAll('[data-edit-field="respect"]')[0].innerHTML = ""
    document.querySelectorAll('[data-edit-field="links"]')[0].innerHTML = ""
    document.querySelectorAll('[data-edit-field="associated"]')[0].innerHTML = ""
    document.querySelectorAll('[data-edit-field="custom-data"]')[0].innerHTML = ""
    //autopopulate form info when available
    if(verificationData != null) {
        //verification info prepopulate
        const editVerification = document.querySelectorAll('[data-edit-field="user-verification"]')[0]
        if(verificationData) {
          editVerification.value = verificationData
        }
    }
    //populate from eeArray
    if(profileArray) {
        console.log('profileArray populated, prefilling form')
        //basic info prepopulate
        const editAlias = document.querySelectorAll('[data-edit-field="alias"]')[0]
        const editDetail = document.querySelectorAll('[data-edit-field="detail"]')[0]
        const editPFPToken = document.querySelectorAll('[data-edit-field="pfp-id"]')[0]
        const editPFPAddress = document.querySelectorAll('[data-edit-field="pfp-address"]')[0]
        
        editAlias.value = profileArray[0][0]
        editDetail.value = profileArray[0][1]
        editPFPToken.value = profileArray[0][5]
        editPFPAddress.value = profileArray[0][6]

        //prep object for basics
        allBasics = {
            alias: editAlias,
            detail: editDetail,
        }
        
        
        //profile links info prepopulate 
        const editProfileLinkContainer = document.getElementById('edit-profile-links')
        const profileLinks = profileArray[0].slice(2, 5)
        const priorityIndex = profileArray[0][5]
        //generate fields
        function createProfileLinkInput(container, index) {
            //create the li
            var thisLink = document.createElement("div")
            thisLink.setAttribute('class', 'mb-2 flex justify-evenly items-center')
            thisLink.setAttribute('data-edit-item', '')
            //create name
            var thisNameContainer = document.createElement('div')
            thisNameContainer.setAttribute('class', "w-1/2 h-full")
            var names = ['Social:', 'Website:', 'Gallery:']
            var thisName = document.createElement('h5')
            thisName.setAttribute('class', 'mb-2 w-52 basics')
            thisName.innerHTML = names[index]
            thisNameContainer.appendChild(thisName)
            thisLink.appendChild(thisNameContainer)

            //create input
            var thisInput = document.createElement('input')
            thisInput.setAttribute('type', 'text')
            thisInput.setAttribute('placeholder', 'Link')
            thisInput.setAttribute('class', 'mr-4 w-full max-h-10 rounded-md border border-main px-3 py-3 text-md')
            thisLink.appendChild(thisInput)

            //add inputs to main data form
            if(index == 0) {
                allBasics.social = thisInput
            } else if(index == 1) {
                allBasics.website = thisInput
            } else if(index == 2) {
                allBasics.gallery = thisInput
            }

            //create write button
            var thisWrite = document.createElement('button')
            thisWrite.setAttribute('class', 'mx-2 h-7 aspect-square rounded-full bg-main p-0')
            thisWrite.setAttribute('data-write', '')
            var writeImg = document.createElement('img')
            writeImg.setAttribute('class', 'm-auto h-3/5 w-3/5 object-contain')
            writeImg.setAttribute('src', './svg/write.svg')
            writeImg.setAttribute('alt', 'Wallet Logo')
            thisWrite.appendChild(writeImg)
            thisLink.appendChild(thisWrite)

            thisWrite.addEventListener('click', ()=>{
                //transform link to check for http/https
                var linkValue = thisInput.value
                var prefix = 'http://'
                var prefixB = 'https://'
                if (!thisInput.value.includes(prefix) && !thisInput.value.includes(prefixB)) {
                    var linkValue = 'https://' + thisInput.value
                }
                console.log(linkValue)
                if(index == 0) {

                    setSocialToContract(linkValue)
                } else if(index == 1) {
                    
                    setWebsiteToContract(linkValue)
                } else if(index == 2) {

                    setGalleryToContract(linkValue)
                }
            })
            //create delete button
            if(profileLinks[index]) {

                var thisDelete = document.createElement('button')
                thisDelete.setAttribute('class', 'mx-2 h-7 aspect-square rounded-full bg-main p-0')
                var deleteImg = document.createElement('img')
                deleteImg.setAttribute('class', 'm-auto h-3/5 w-3/5 object-contain')
                deleteImg.setAttribute('src', './svg/delete.svg')
                deleteImg.setAttribute('alt', 'Wallet Logo')
                thisDelete.appendChild(deleteImg)
                thisLink.appendChild(thisDelete)
                
                thisDelete.addEventListener('click', ()=>{
                    if(index == 0) {
                        setSocialToContract(' ')
                    } else if(index == 1) {
                        setWebsiteToContract(' ')
                    } else if(index == 2) {
                        setGalleryToContract(' ')
                    }
                })
            }

            if(index == priorityIndex) {
                //show is already favorite
                var thisIsFave = document.createElement('button')
                thisIsFave.setAttribute('class', 'mx-2 h-7 aspect-square rounded-full p-0')
                var isFaveImg = document.createElement('img')
                isFaveImg.setAttribute('class', 'm-auto h-3/5 w-3/5 object-contain')
                isFaveImg.setAttribute('src', './svg/star-full.svg')
                isFaveImg.setAttribute('alt', 'Wallet Logo')
                thisIsFave.appendChild(isFaveImg)
                thisLink.appendChild(thisIsFave)
            } else {
                //create favorite button
                var thisFave = document.createElement('button')
                thisFave.setAttribute('class', 'mx-2 h-7 w-7 rounded-full p-0')
                var faveImg = document.createElement('img')
                faveImg.setAttribute('class', 'm-auto h-full w-full object-contain')
                faveImg.setAttribute('src', './svg/star-empty.svg')
                faveImg.setAttribute('alt', 'Wallet Logo')
                thisFave.appendChild(faveImg)
                thisLink.appendChild(thisFave)
                
                thisFave.addEventListener('click', () => {
                    setPriorityLinkToContract(index)
                })
            }
            //fill the fields
            thisInput.value = profileLinks[index]


            //attach to container
            container.appendChild(thisLink)
            
        }

        for(let i = 0; i < profileLinks.length; i++) {
            createProfileLinkInput(editProfileLinkContainer, i)
        }



        //button to submit all main data
        const submitAll = document.getElementById('submit-all')
        submitAll.addEventListener('click', ()=> {
            console.log('submitting all basics')
            setMainBasicsToContract(allBasics.alias.value, allBasics.detail.value, allBasics.social.value, allBasics.website.value, allBasics.gallery.value)
        })
        const basicTitles = document.getElementsByClassName('basics')
        submitAll.addEventListener('mouseover', () => {
            allBasics.alias.style.transition = "500ms ease-out"
            allBasics.detail.style.transition = "500ms ease-out"
            allBasics.social.style.transition = "500ms ease-out"
            allBasics.website.style.transition = "500ms ease-out"
            allBasics.gallery.style.transition = "500ms ease-out"
            allBasics.alias.style.filter = "invert(100%)"
            allBasics.detail.style.filter = "invert(100%)"
            allBasics.social.style.filter = "invert(100%)"
            allBasics.website.style.filter = "invert(100%)"
            allBasics.gallery.style.filter = "invert(100%)"
            for(let i = 0; i < basicTitles.length; i++) {
                basicTitles[i].style.transition = "250ms ease-out"
                basicTitles[i].style.fontWeight = "800"
            }

            
        })
        submitAll.addEventListener('mouseout', () => {
            allBasics.alias.style.transition = "500ms ease-out"
            allBasics.detail.style.transition = "500ms ease-out"
            allBasics.social.style.transition = "500ms ease-out"
            allBasics.website.style.transition = "500ms ease-out"
            allBasics.gallery.style.transition = "500ms ease-out"
            allBasics.alias.style.filter = "invert(0%)"
            allBasics.detail.style.filter = "invert(0%)"
            allBasics.social.style.filter = "invert(0%)"
            allBasics.website.style.filter = "invert(0%)"
            allBasics.gallery.style.filter = "invert(0%)"
            for(let i = 0; i < basicTitles.length; i++) {
                basicTitles[i].style.transition = "500ms ease-out"
                basicTitles[i].style.fontWeight = ""
            }
        })




        //tags info prepopulate
        //handled dynamically
        const allTags = profileArray[7]
        if(allTags) {
          const tagsEditParent = document.querySelectorAll('[data-edit-field="tags"]')[0]
          function createTagInput(tagsContainer, index, defaultInput) {
            //create the li
            var thisTag = document.createElement("li")
            thisTag.setAttribute('class', 'mb-2 flex items-center before:mr-4 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-main')
            thisTag.setAttribute('data-edit-item', '')
            
            if(!defaultInput) {
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

                thisWrite.addEventListener('click', ()=> {
                    console.log('creating tag')
                    pushTagToContract(thisInput.value)
                  })
            }
            //create delete button
            if(defaultInput) {
                var thisInput = document.createElement('code')
                thisInput.setAttribute('class', 'mr-2 h-9 bg-blue')
                thisInput.innerHTML = defaultInput
                thisTag.appendChild(thisInput)
                var thisDelete = document.createElement('button')
                thisDelete.setAttribute('class', 'mx-2 h-7 w-7 rounded-full bg-main p-0')
                thisDelete.setAttribute('data-delete', '')
                var deleteImg = document.createElement('img')
                deleteImg.setAttribute('class', 'm-auto h-3/5 w-3/5 object-contain')
                deleteImg.setAttribute('src', './svg/delete.svg')
                deleteImg.setAttribute('alt', 'Wallet Logo')
                thisDelete.appendChild(deleteImg)
                thisTag.appendChild(thisDelete)

                thisDelete.addEventListener('click', ()=> {
                    console.log('deleting tag ' + defaultInput)
                    deleteTagToContract(index)
                })
            }

            //attach li to list
  
            //prepopulate if available
            tagsContainer.appendChild(thisTag)
            if(defaultInput) {
              thisInput.value = defaultInput
            }
  
            
            
          }
          //populate all existing
          for(let i = 0; i < allTags.length; i++) {
            var tag = allTags[i]
            createTagInput(tagsEditParent, i, tag)
          }
          //create an empty field for additional accounts
          createTagInput(tagsEditParent)
        }
        

        //additional links info prepopulate
        //handled dynamically
        const allLinks = profileArray[1]
        if(allLinks) {
          const linksEditParent = document.querySelectorAll('[data-edit-field="links"]')[0]
          function createLinkInput(linksContainer, index, defaultName, defaultURL) {
            indexTuple = index * 2 //should target this address in the 1d doubled array [1a, 1b, 2a, 2b]
            //'index' is for the array of tuples [[1a, 1b], [2a, 2b]]

            //create the li
            var thisLink = document.createElement("li")
            thisLink.setAttribute('class', 'mb-2 flex items-center before:mr-4 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-main')
            thisLink.setAttribute('data-edit-item', '')
            //create input1
            var inputName = document.createElement('input')
            inputName.setAttribute('type', 'text')
            inputName.setAttribute('placeholder', 'Description')
            inputName.setAttribute('class', 'max-h-10 w-28 rounded-md border border-main px-3 py-3 text-md lg:w-1/3')
            thisLink.appendChild(inputName)
            //create span with ':' divider
            var thisBadgeSpan = document.createElement('span')
            thisBadgeSpan.setAttribute('class', 'mx-2')
            thisBadgeSpan.innerHTML = ':'
            thisLink.appendChild(thisBadgeSpan)
            //create input1
            var inputURL = document.createElement('input')
            inputURL.setAttribute('type', 'text')
            inputURL.setAttribute('placeholder', 'Link')
            inputURL.setAttribute('class', 'mr-4 max-h-10 w-28 rounded-md border border-main px-3 py-3 text-md lg:w-1/3')
            thisLink.appendChild(inputURL)
            //create write button
            var thisWrite = document.createElement('button')
            thisWrite.setAttribute('class', 'mx-2 h-7 w-7 rounded-full bg-main p-0')
            var writeImg = document.createElement('img')
            writeImg.setAttribute('class', 'm-auto h-3/5 w-3/5 object-contain')
            writeImg.setAttribute('src', './svg/write.svg')
            writeImg.setAttribute('alt', 'Wallet Logo')
            thisWrite.appendChild(writeImg)
            thisLink.appendChild(thisWrite)
            //create delete button
            if(defaultName || defaultURL) {

                var thisDelete = document.createElement('button')
                thisDelete.setAttribute('class', 'mx-2 h-7 w-7 rounded-full bg-main p-0')
                var deleteImg = document.createElement('img')
                deleteImg.setAttribute('class', 'm-auto h-3/5 w-3/5 object-contain')
                deleteImg.setAttribute('src', './svg/delete.svg')
                deleteImg.setAttribute('alt', 'Wallet Logo')
                thisDelete.appendChild(deleteImg)
                thisLink.appendChild(thisDelete)

                thisDelete.addEventListener('click', () => {
                    //delete existing entry
                    console.log('deleting link at tuple 2d index ' + index)
                    
                    deleteAdditionalLinkToContract(index)
                    
                })
            }

            

            //attach li to list
            linksContainer.appendChild(thisLink)
            //populate
            if(defaultURL || defaultName) {
              inputName.value = defaultName
              inputURL.value = defaultURL
            }

            thisWrite.addEventListener('click', () => {
                //check for http/https
                var linkValue = inputURL.value
                var prefix = 'http://'
                var prefixB = 'https://'
                if (!inputURL.value.includes(prefix) && !inputURL.value.includes(prefixB)) {
                    var linkValue = 'https://' + inputURL.value
                }
                console.log(linkValue)
                
                if(defaultURL || defaultName) {
                    //update existing entry
                    console.log('updating link at tuple 2d index ' + index)
                    updateAdditionalLinkToContract(index, inputName.value, linkValue)
                } else {
                    //create new entry
                    console.log('pushing new link')
                    pushAdditionalLinkToContract(inputName.value, linkValue)
                }
            })

            
          }
          //populate all existing
          for(let i = 0; i < allLinks.length; i++) {
            var linkURL = allLinks[i*2]
            var linkDesc = allLinks[(i*2)+1]
            createLinkInput(linksEditParent, i, linkDesc, linkURL)
          }
          //create an empty field for additional accounts
          createLinkInput(linksEditParent, (allLinks.length/2))
        }
  
  
        //Associated accounts info prepopulate
        //handled dynamically
        const EOAs = profileArray[2]
        const EOAEditParent = document.querySelectorAll('[data-edit-field="associated"]')[0]
        function createEAOInput(EOAContainer, index, defaultDesc, defaultAddress) {
        indexTuple = index * 2 //should target this address in the doubled array [1a, 1b, 2a, 2b]
        //'index' is for the array of tuples [[1a, 1b], [2a, 2b]]

        //create the li
        var thisEOA = document.createElement("li")
        thisEOA.setAttribute('class', 'mb-2 flex items-center before:mr-4 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-main')
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

        if(defaultAddress || defaultDesc) {
            const copyButton = document.createElement('button')
            copyButton.className = "mr-2 lg:mr-4";
            copyButton.addEventListener('click', ()=>{
                var toCopy = defaultAddress
                navigator.clipboard.writeText(toCopy);
            })
            const copyImage = document.createElement("img");
            copyImage.className = "h-5 w-5";
            copyImage.setAttribute("src", "./svg/copy.svg");
            copyImage.setAttribute("alt", "copy icon");
            copyButton.appendChild(copyImage);
            thisEOA.appendChild(copyButton)
        }
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
        if(defaultAddress || defaultDesc) {

            var thisDelete = document.createElement('button')
            thisDelete.setAttribute('class', 'mx-2 h-7 w-7 rounded-full bg-main p-0')
            thisDelete.setAttribute('data-delete', '')
            var deleteImg = document.createElement('img')
            deleteImg.setAttribute('class', 'm-auto h-3/5 w-3/5 object-contain')
            deleteImg.setAttribute('src', './svg/delete.svg')
            deleteImg.setAttribute('alt', 'Wallet Logo')
            thisDelete.appendChild(deleteImg)
            thisEOA.appendChild(thisDelete)

            thisDelete.addEventListener('click', () => {
                console.log('deleting index[', indexTuple, 'and', (indexTuple+1) + ']')
                inputAddress.value = ' '
                inputDesc.value = ' '
                if(defaultAddress || defaultDesc) {
                deleteAssociatedAccountToContract(index)
                }
            })

            
        }
        
        //attach li to list
        EOAContainer.appendChild(thisEOA)

        //populate
        if(defaultAddress || defaultDesc) {
            inputDesc.value = defaultDesc
            inputAddress.value = defaultAddress
        }

        thisWrite.addEventListener('click', () => {
            console.log(inputDesc.value, ':', inputAddress.value, 'was written to index[', indexTuple, 'and', (indexTuple+1) + ']')
            if(defaultAddress || defaultDesc) {
            //exists, needs to update
            console.log('updating '+ indexTuple)
            updateAssociatedAccountToContract(index, inputAddress.value, inputDesc.value)
            } else {
            //doesn't exist yet, needs a new entry
            console.log('sent new entry to tuple index', indexTuple)
            pushAssociatedAccountToContract(inputAddress.value, inputDesc.value)
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
    


        //Notes Sent info prepopulate
        //handled dynamically
        const notes = profileArray[6]
        const notesEditParent = document.querySelectorAll('[data-edit-field="notes"]')[0]
        const notesViewParent = document.querySelectorAll('[data-view-field="notes"]')[0]
        
        function createNoteInput(notesContainer, index, defaultDesc, defaultAddress) {
            indexTuple = index * 2 //should target this address in the doubled array [1a, 1b, 2a, 2b]
            //'index' is for the array of tuples [[1a, 1b], [2a, 2b]]
            
            //create a div to collapse
            //create the li
            var thisNote = document.createElement("li")
            thisNote.setAttribute('class', 'mb-2 flex flex-wrap items-center before:mr-4 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-main')
            thisNote.setAttribute('data-edit-item', '')
            if(defaultAddress || defaultDesc) {
                //create display for desc
                var thisDesc = document.createElement('code')
                    thisDesc.setAttribute('class', 'mr-2 h-9')
                    thisDesc.innerHTML = defaultDesc
                    thisNote.appendChild(thisDesc)
                //create span with ':' divider
                var thisEOASpan = document.createElement('span')
                thisEOASpan.setAttribute('class', 'mx-2')
                thisEOASpan.innerHTML = ':'
                thisNote.appendChild(thisEOASpan)
                //create anchor for address
                var thisAnchor = document.createElement('a')

                    thisAnchor.setAttribute("href", `${this.location.origin}?address=${defaultAddress}`)
                    thisAnchor.setAttribute('class', 'mr-2 h-9')
                    // thisNote.appendChild(thisAnchor)
                //create display for address
                var thisDisplay = document.createElement('code')
                    thisDisplay.setAttribute('class', 'mr-2 h-9 bg-blue underline')
                    thisDisplay.innerHTML = defaultAddress
                    thisAnchor.appendChild(thisDisplay)
                    thisNote.appendChild(thisAnchor)

                const copyButton = document.createElement('button')
                copyButton.className = "mr-2 lg:mr-4";
                copyButton.addEventListener('click', ()=>{
                    var toCopy = defaultAddress
                    navigator.clipboard.writeText(toCopy);
                })
                const copyImage = document.createElement("img");
                copyImage.className = "h-5 w-5";
                copyImage.setAttribute("src", "./svg/copy.svg");
                copyImage.setAttribute("alt", "copy icon");
                copyButton.appendChild(copyImage);
                thisNote.appendChild(copyButton);

                const etherscanAtag = document.createElement("a");
                etherscanAtag.className = "mr-2 lg:mr-4";
                etherscanAtag.setAttribute("href", chainScan + profileArray[2][index]);
                etherscanAtag.setAttribute("target", "_blank");
                const etherscanImage = document.createElement("img");
                etherscanImage.className = "h-5 w-5";
                etherscanImage.setAttribute("src", "./svg/etherscan.svg");
                etherscanImage.setAttribute("alt", "etherscan logo");
                etherscanAtag.appendChild(etherscanImage);
                thisNote.appendChild(etherscanAtag);

                if(accountPermission) {
                    //create delete button
                    var thisDelete = document.createElement('button')
                    thisDelete.setAttribute('class', 'mx-2 h-7 w-7 rounded-full bg-main p-0')
                    thisDelete.setAttribute('data-delete', '')
                    var deleteImg = document.createElement('img')
                    deleteImg.setAttribute('class', 'm-auto h-3/5 w-3/5 object-contain')
                    deleteImg.setAttribute('src', './svg/delete.svg')
                    deleteImg.setAttribute('alt', 'Wallet Logo')
                    thisDelete.appendChild(deleteImg)
                    thisNote.appendChild(thisDelete)
                    
                    thisDelete.addEventListener('click', () => {
                        console.log('deleting note from 1d index[', indexTuple, 'and', (indexTuple+1) + ']')
                        deleteWrittenNoteToContract(defaultAddress)
                    })
                }
            } else {

                //create input for note
                var inputDesc = document.createElement('input')
                // inputDesc.setAttribute('type', 'datalist')
                inputDesc.setAttribute('placeholder', 'Note Text')
                inputDesc.setAttribute('class', 'max-h-10 w-28 rounded-md border border-main px-3 py-3 text-md lg:w-1/3')
                inputDesc.setAttribute('data-field-edit', 'associated-desc')
                thisNote.appendChild(inputDesc)
                //create span with ':' divider
                var thisEOASpan = document.createElement('span')
                thisEOASpan.setAttribute('class', 'mx-2')
                thisEOASpan.innerHTML = ':'
                thisNote.appendChild(thisEOASpan)
                //create input for address
                var inputAddress = document.createElement('select')
                var respectingAccounts = profileArray[3]
                respectingAccounts.map((a)=> {
                    //only add option if no note has already been sent
                    var alreadySent = false 
                    var sent = profileArray[6]
                    sent.map((b)=>{
                        if(b.toLowerCase() == a.toLowerCase()) {
                            alreadySent = true
                        }
                    })
                    if(!alreadySent) {
                        var thisOption = document.createElement('option')
                        thisOption.value = a
                        thisOption.innerHTML = a
                        console.log(a)
                        inputAddress.appendChild(thisOption)
                    }
                })
                inputAddress.setAttribute('type', 'text')
                inputAddress.setAttribute('placeholder', 'Target Address')
                inputAddress.setAttribute('class', 'mr-4 max-h-10 w-28 rounded-md border border-main px-3 py-3 text-sm lg:w-1/3')
                inputAddress.setAttribute('data-field-edit', 'associated-address')
                thisNote.appendChild(inputAddress)
                //create write button
                var thisWrite = document.createElement('button')
                thisWrite.setAttribute('class', 'mx-2 h-7 w-7 rounded-full bg-main p-0')
                thisWrite.setAttribute('data-write', '')
                var writeImg = document.createElement('img')
                writeImg.setAttribute('class', 'm-auto h-3/5 w-3/5 object-contain')
                writeImg.setAttribute('src', './svg/write.svg')
                writeImg.setAttribute('alt', 'Wallet Logo')
                thisWrite.appendChild(writeImg)
                thisNote.appendChild(thisWrite)

                thisWrite.addEventListener('click', () => {
                    console.log(inputDesc.value, ':', inputAddress.value, 'was written to 1d index[', indexTuple, 'and', (indexTuple+1) + ']')
                    
                    console.log('sent new note entry to tuple 2d index', indexTuple)
                    setNoteToContract(inputAddress.value, inputDesc.value)
        
                })
                //populate
                if(defaultAddress || defaultDesc) {
                    inputDesc.value = defaultDesc
                    inputAddress.value = defaultAddress
                }
            }

            
                
            
            
            //attach li to list
            notesContainer.appendChild(thisNote)

            
        }

        //create an empty field for additional accounts
        createNoteInput(notesEditParent, notes.length)
        //populate all existing
        for(let i = 0; i < notes.length/2; i++) {
            var noteAddress = notes[i*2]
            var noteDesc = notes[(i*2)+1]
            createNoteInput(notesEditParent, i, noteDesc, noteAddress)
            createNoteInput(notesViewParent, i, noteDesc, noteAddress)
        }
        

        
    
  
        //respect info prepopulate
        //handled dynamically
        const allRespects = profileArray[4]
        if(allRespects) {
            const respectsEditParent = document.querySelectorAll('[data-edit-field="respect"]')[0]
            function createTagInput(respectsContainer, defaultInput) {
                //create the li
                var thisRespect = document.createElement("li")
                if(!defaultInput) {
                    thisRespect.setAttribute('class', 'mb-2 flex-wrap items-center before:mr-4 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-main')
                    thisRespect.setAttribute('data-edit-item', '')
                    //create input

                    var thisInput = document.createElement('input')
                    thisInput.setAttribute('type', 'text')
                    thisInput.setAttribute('placeholder', 'Address To Respect')
                    thisInput.setAttribute('class', 'mr-4 max-h-10 rounded-md border border-main px-3 py-3 text-md lg:w-1/3')
                    thisInput.setAttribute('data-field-edit', 'respect')
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
                    
                    //prepopulate if available
                    if(defaultInput) {
                        thisInput.value = defaultInput
                    }

                    thisWrite.addEventListener('click', () => {
                        console.log('giving respect to ' + thisInput.value)
                        giveRespectToContract(thisInput.value)
                    })
                } else {
                    //style as code block
                    thisRespect.setAttribute('class', 'mb-2 flex flex-wrap items-center before:mr-4 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-main')
                    //display existing address
                    var thisDisplay = document.createElement('code')
                    thisDisplay.setAttribute('class', 'mr-2 h-9 bg-blue underline')
                    thisDisplay.innerHTML = defaultInput
                    var thisAnchor = document.createElement('a')
                    thisAnchor.setAttribute("href", `${this.location.origin}?address=${defaultInput}`)
                    thisAnchor.setAttribute('class', 'mr-2 h-9')
                    thisAnchor.appendChild(thisDisplay)
                    thisRespect.appendChild(thisAnchor)
                    //copy button
                    const copyButton = document.createElement('button')
                    copyButton.className = "mr-2 lg:mr-4";
                    copyButton.addEventListener('click', ()=>{
                    var toCopy = defaultInput
                    navigator.clipboard.writeText(toCopy);
                    })
                    const copyImage = document.createElement("img");
                    copyImage.className = "h-5 w-5";
                    copyImage.setAttribute("src", "./svg/copy.svg");
                    copyImage.setAttribute("alt", "copy icon");
                    copyButton.appendChild(copyImage);
                    thisRespect.appendChild(copyButton);
                    //create delete/revoke button
                    if(defaultInput) {

                        var thisDelete = document.createElement('button')
                        thisDelete.setAttribute('class', 'mx-2 h-7 w-7 rounded-full bg-main p-0')
                        thisDelete.setAttribute('data-delete', '')
                        var deleteImg = document.createElement('img')
                        deleteImg.setAttribute('class', 'm-auto h-3/5 w-3/5 object-contain')
                        deleteImg.setAttribute('src', './svg/delete.svg')
                        deleteImg.setAttribute('alt', 'Wallet Logo')
                        thisDelete.appendChild(deleteImg)
                        thisRespect.appendChild(thisDelete)
                        
                        thisDelete.addEventListener('click', () => {
                            console.log('revoking respect to ' + defaultInput)
                            revokeRespectToContract(defaultInput)
                        })
                    }
                }

                //attach li to list
                respectsContainer.appendChild(thisRespect)
                
            }
            //populate all existing
            for(let i = 0; i < allRespects.length; i++) {
                var respect = allRespects[i]
                createTagInput(respectsEditParent, respect)
            }
            //create an empty field for additional accounts
            createTagInput(respectsEditParent)
        }

        //Custom Data info prepopulate
        //handled dynamically
        const customData = profileArray[8]
        const CDEditParent = document.querySelectorAll('[data-edit-field="custom-data"]')[0]
        function createCDInput(CDContainer, defaultInput) {
            //create the li
            var thisCD = document.createElement("li")
            thisCD.setAttribute('class', 'mb-2 flex items-center before:mr-4 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-main')
            thisCD.setAttribute('data-edit-item', '')
            //create input
            var thisInput = document.createElement('input')
            thisInput.setAttribute('type', 'text')
            thisInput.setAttribute('placeholder', 'Data')
            thisInput.setAttribute('class', 'mr-4 max-h-10 rounded-md border border-main px-3 py-3 text-md lg:w-1/3')
            thisInput.setAttribute('data-field-edit', 'custom-data')
            thisCD.appendChild(thisInput)
            //create write button
            var thisWrite = document.createElement('button')
            thisWrite.setAttribute('class', 'mx-2 h-7 w-7 rounded-full bg-main p-0')
            thisWrite.setAttribute('data-write', '')
            var writeImg = document.createElement('img')
            writeImg.setAttribute('class', 'm-auto h-3/5 w-3/5 object-contain')
            writeImg.setAttribute('src', './svg/write.svg')
            writeImg.setAttribute('alt', 'Wallet Logo')
            thisWrite.appendChild(writeImg)
            thisCD.appendChild(thisWrite)
            //create delete button
            if(defaultInput && defaultInput != ' ') {

                var thisDelete = document.createElement('button')
                thisDelete.setAttribute('class', 'mx-2 h-7 w-7 rounded-full bg-main p-0')
                thisDelete.setAttribute('data-delete', '')
                var deleteImg = document.createElement('img')
                deleteImg.setAttribute('class', 'm-auto h-3/5 w-3/5 object-contain')
                deleteImg.setAttribute('src', './svg/delete.svg')
                deleteImg.setAttribute('alt', 'Wallet Logo')
                thisDelete.appendChild(deleteImg)

                thisDelete.addEventListener('click', () => {
                    console.log('deleting custom data')
                    setCustomDataToContract(' ')
                })
                thisCD.appendChild(thisDelete)
            }
            
            //attach li to list
            
            
            //prepopulate if available
            CDContainer.appendChild(thisCD)
            if(defaultInput && defaultInput != ' ') {
                thisInput.value = defaultInput
            }
            
            thisWrite.addEventListener('click', ()=> {
                console.log('setting custom data to ' + thisInput.value)
                setCustomDataToContract(thisInput.value)
            })


            
        }
        
        
        //populate with existing data
        var existingCD = customData
        if(existingCD == '') {
            existingCD = ' '
        }
        createCDInput(CDEditParent, existingCD)



        //set up button handlers
        var pingButton = document.getElementById('ping-button')
        pingButton.addEventListener('click', () => {
            console.log('pinging chain')
            pingToContract()
        })
        
    } else {
        console.log('no profileArray or not composable, failed to prefill form')

        //handle prep for initial account setup

        //prep object
        let allBasics = {}
        allBasics.alias = document.querySelectorAll('[data-edit-field="alias"')[0]
        allBasics.detail = document.querySelectorAll('[data-edit-field="detail"')[0]
        

        //create profile links input
        const editProfileLinkContainer = document.getElementById('edit-profile-links')
        //generate input fields
        function createProfileLinkInput(container, index, value) {
            //create the li
            var thisLink = document.createElement("div")
            thisLink.setAttribute('class', 'mb-2 flex items-center before:mr-4 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-main')
            thisLink.setAttribute('data-edit-item', '')
            //create name
            var names = ['Social:', 'Website:', 'Gallery:']
            
            var thisName = document.createElement('h5')
            thisName.setAttribute('class', 'mb-2 w-1/2')
            thisName.innerHTML = names[index]
            thisLink.appendChild(thisName)
            


            //create input
            var thisInput = document.createElement('input')
            thisInput.setAttribute('type', 'text')
            thisInput.setAttribute('placeholder', 'Link')
            thisInput.setAttribute('class', 'mr-4 w-2/3 max-h-10 rounded-md border border-main px-3 py-3 text-md lg:w-1/3')
            thisInput.setAttribute('data-field-edit', 'tag')
            thisLink.appendChild(thisInput)

            //create write button
            var thisWrite = document.createElement('button')
            thisWrite.setAttribute('class', 'mx-2 h-7 w-7 rounded-full bg-main p-0')
            thisWrite.setAttribute('data-write', '')
            var writeImg = document.createElement('img')
            writeImg.setAttribute('class', 'm-auto h-3/5 w-3/5 object-contain')
            writeImg.setAttribute('src', './svg/write.svg')
            writeImg.setAttribute('alt', 'Wallet Logo')
            thisWrite.appendChild(writeImg)
            thisLink.appendChild(thisWrite)

            
            
            thisWrite.addEventListener('click', ()=>{
                //transform link to check for http/https
                var linkValue = thisInput.value
                var prefix = 'http://'
                var prefixB = 'https://'
                if (!thisInput.value.includes(prefix) && !thisInput.value.includes(prefixB)) {
                    var linkValue = 'https://' + thisInput.value
                }
                console.log(linkValue)
                if(index == 0) {

                    setSocialToContract(linkValue)
                } else if(index == 1) {
                    
                    setWebsiteToContract(linkValue)
                } else if(index == 2) {

                    setGalleryToContract(linkValue)
                }
            })
            

            //attach to container
            container.appendChild(thisLink)

            if(index == 0) {
                allBasics.social = thisInput
            } else if(index == 1) {
                allBasics.website = thisInput
            } else if(index == 2) {
                allBasics.gallery = thisInput
            }
            
        }

        for(let i = 0; i < 3; i++) {
            createProfileLinkInput(editProfileLinkContainer, i)
        }


        //button to submit all data
        const submitAll = document.getElementById('submit-all')
        submitAll.addEventListener('click', ()=> {
            setMainBasicsToContract(allBasics.alias.value, allBasics.detail.value, allBasics.social.value, allBasics.website.value, allBasics.gallery.value)
        })
      }
}