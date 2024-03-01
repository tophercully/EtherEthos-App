function prepopulate(profileArray, verificationData) {
    //depopulate in case of previous account info remaining
    document.querySelectorAll('[data-edit-field="alias"]')[0].innerHTML = ""
    document.querySelectorAll('[data-edit-field="detail"]')[0].innerHTML = ""
    document.querySelectorAll('[data-edit-field="social"]')[0].innerHTML = ""
    document.querySelectorAll('[data-edit-field="website"]')[0].innerHTML = ""
    document.querySelectorAll('[data-edit-field="gallery"]')[0].innerHTML = ""
    document.querySelectorAll('[data-edit-field="pfp-id"]')[0].innerHTML = ""
    document.querySelectorAll('[data-edit-field="pfp-address"]')[0].innerHTML = ""
    document.querySelectorAll('[data-edit-field="user-verification"]')[0].innerHTML = ""
    document.querySelectorAll('[data-edit-field="notes"]')[0].innerHTML = ""
    document.querySelectorAll('[data-edit-field="respect"]')[0].innerHTML = ""
    document.querySelectorAll('[data-edit-field="links"]')[0].innerHTML = ""
    document.querySelectorAll('[data-edit-field="associated"]')[0].innerHTML = ""
    document.querySelectorAll('[data-edit-field="custom-data"]')[0].innerHTML = ""
    //autopopulate form info when available
    console.log(profileArray)
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
        const editSocial = document.querySelectorAll('[data-edit-field="social"]')[0]
        const editWebsite = document.querySelectorAll('[data-edit-field="website"]')[0]
        const editGallery = document.querySelectorAll('[data-edit-field="gallery"]')[0]
        const editPFPToken = document.querySelectorAll('[data-edit-field="pfp-id"]')[0]
        const editPFPAddress = document.querySelectorAll('[data-edit-field="pfp-address"]')[0]
        
        editAlias.value = profileArray[0][0]
        editDetail.value = profileArray[0][1]
        editSocial.value = profileArray[0][2]
        editWebsite.value = profileArray[0][3]
        editGallery.value = profileArray[0][4]
        editPFPToken.value = profileArray[0][5]
        editPFPAddress.value = profileArray[0][6]
        
        
        
        //tags info prepopulate
        //handled dynamically
        const allTags = profileArray[6]
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

            //attach li to list
            thisTag.appendChild(thisDelete)
  
            //prepopulate if available
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
            thisDelete.addEventListener('click', ()=> {
                console.log('deleting tag ' + defaultInput)
                deleteTagToContract(index)
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
            thisLink.setAttribute('class', 'my-2 flex items-center before:mr-4 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-main')
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
            var thisDelete = document.createElement('button')
            thisDelete.setAttribute('class', 'mx-2 h-7 w-7 rounded-full bg-main p-0')
            var deleteImg = document.createElement('img')
            deleteImg.setAttribute('class', 'm-auto h-3/5 w-3/5 object-contain')
            deleteImg.setAttribute('src', './svg/delete.svg')
            deleteImg.setAttribute('alt', 'Wallet Logo')
            thisDelete.appendChild(deleteImg)
            thisLink.appendChild(thisDelete)

            

            //attach li to list
            linksContainer.appendChild(thisLink)
            //populate
            if(defaultURL || defaultName) {
              inputName.value = defaultName
              inputURL.value = defaultURL
            }

            thisWrite.addEventListener('click', () => {
                if(defaultURL || defaultName) {
                    //update existing entry
                    console.log('updating link at tuple 2d index ' + index)
                    updateAdditionalLinkToContract(index, inputName.value, inputURL.value)
                } else {
                    //create existing entry
                    console.log('pushing new link')
                    pushAdditionalLinkToContract(inputName.value, inputURL.value)
                }
            })

            thisDelete.addEventListener('click', () => {
                //delete this entry
                console.log('deleting link at tuple 2d index ' + index)
                deleteAdditionalLinkToContract(index)
                
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
        if(EOAs.length/2 > 0) {
          const EOAEditParent = document.querySelectorAll('[data-edit-field="associated"]')[0]
          function createEAOInput(EOAContainer, index, defaultDesc, defaultAddress) {
            indexTuple = index * 2 //should target this address in the doubled array [1a, 1b, 2a, 2b]
            //'index' is for the array of tuples [[1a, 1b], [2a, 2b]]
  
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
            thisDelete.addEventListener('click', () => {
              console.log('deleting index[', indexTuple, 'and', (indexTuple+1) + ']')
              inputAddress.value = ' '
              inputDesc.value = ' '
              if(defaultAddress || defaultDesc) {
                deleteAssociatedAccountToContract(index)
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


        //Notes info prepopulate
        //handled dynamically
        const notes = profileArray[5]
        const notesEditParent = document.querySelectorAll('[data-edit-field="notes"]')[0]
        function createNoteInput(notesContainer, index, defaultDesc, defaultAddress) {
            indexTuple = index * 2 //should target this address in the doubled array [1a, 1b, 2a, 2b]
            //'index' is for the array of tuples [[1a, 1b], [2a, 2b]]

            //create the li
            var thisNote = document.createElement("li")
            thisNote.setAttribute('class', 'my-2 flex items-center before:mr-4 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-main')
            thisNote.setAttribute('data-edit-item', '')
            //create input1
            var inputDesc = document.createElement('input')
            inputDesc.setAttribute('type', 'text')
            inputDesc.setAttribute('placeholder', 'Note Text')
            inputDesc.setAttribute('class', 'max-h-10 w-28 rounded-md border border-main px-3 py-3 text-md lg:w-1/3')
            inputDesc.setAttribute('data-field-edit', 'associated-desc')
            thisNote.appendChild(inputDesc)
            //create span with ':' divider
            var thisEOASpan = document.createElement('span')
            thisEOASpan.setAttribute('class', 'mx-2')
            thisEOASpan.innerHTML = ':'
            thisNote.appendChild(thisEOASpan)
            //create input1
            var inputAddress = document.createElement('input')
            inputAddress.setAttribute('type', 'text')
            inputAddress.setAttribute('placeholder', 'Target Address')
            inputAddress.setAttribute('class', 'mr-4 max-h-10 w-28 rounded-md border border-main px-3 py-3 text-md lg:w-1/3')
            inputAddress.setAttribute('data-field-edit', 'associated-address')
            thisNote.appendChild(inputAddress)

            if(!defaultAddress) {
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
            } else {
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
                    inputAddress.value = ' '
                    inputDesc.value = ' '
                    if(defaultAddress || defaultDesc) {
                        deleteWrittenNoteToContract(inputAddress.value)
                    }
                })
            }
            
            //attach li to list
            notesContainer.appendChild(thisNote)

            //populate
            if(defaultAddress || defaultDesc) {
                inputDesc.value = defaultDesc
                inputAddress.value = defaultAddress
            }
        }
        //populate all existing
        for(let i = 0; i < notes.length/2; i++) {
        var noteAddress = notes[i*2]
        var noteDesc = notes[(i*2)+1]
        createNoteInput(notesEditParent, i, noteDesc, noteAddress)
        }
        //create an empty field for additional accounts
        createNoteInput(notesEditParent, notes.length)

        
    
  
        //respect info prepopulate
        //handled dynamically
        const allRespects = profileArray[4]
        if(allRespects) {
            const respectsEditParent = document.querySelectorAll('[data-edit-field="respect"]')[0]
            function createTagInput(respectsContainer, defaultInput) {
                //create the li
                var thisRespect = document.createElement("li")
                if(!defaultInput) {
                    thisRespect.setAttribute('class', 'my-2 flex items-center before:mr-4 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-main')
                    thisRespect.setAttribute('data-edit-item', '')
                    //create input
                    var thisInput = document.createElement('input')
                    thisInput.setAttribute('type', 'text')
                    thisInput.setAttribute('placeholder', 'Respected Account Address')
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
                    thisRespect.setAttribute('class', 'my-2 flex items-center before:mr-4 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-main')
                    //display existing address
                    var thisDisplay = document.createElement('code')
                    thisDisplay.setAttribute('class', 'mr-2 h-9')
                    thisDisplay.innerHTML = defaultInput
                    thisRespect.appendChild(thisDisplay)
                    //create delete/revoke button
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
            thisCD.setAttribute('class', 'my-2 flex items-center before:mr-4 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-main')
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
            var thisDelete = document.createElement('button')
            thisDelete.setAttribute('class', 'mx-2 h-7 w-7 rounded-full bg-main p-0')
            thisDelete.setAttribute('data-delete', '')
            var deleteImg = document.createElement('img')
            deleteImg.setAttribute('class', 'm-auto h-3/5 w-3/5 object-contain')
            deleteImg.setAttribute('src', './svg/delete.svg')
            deleteImg.setAttribute('alt', 'Wallet Logo')
            thisDelete.appendChild(deleteImg)
            
            //attach li to list
            thisCD.appendChild(thisDelete)
            
            //prepopulate if available
            CDContainer.appendChild(thisCD)
            if(defaultInput && defaultInput != ' ') {
                thisInput.value = defaultInput
            }
            
            thisWrite.addEventListener('click', ()=> {
                console.log('setting custom data to ' + thisInput.value)
                setCustomDataToContract(thisInput.value)
            })


            thisDelete.addEventListener('click', () => {
                console.log('deleting custom data')
                setCustomDataToContract(' ')
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
        console.log('no profileArray, failed to prefill form')
      }
}