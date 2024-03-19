const createErrorMsg = (msg) => {
    //check for existing messages
    var existingMsg = document.getElementById('wallet-status-msg')
    if(existingMsg) {
        existingMsg.remove()
    }
    //build message module
    var errorBody = document.createElement('div')
    var errorMsg = document.createElement('h1')
    errorBody.setAttribute('id', "wallet-status-msg")
    var closeButton = document.createElement('button')
    
    //style
    errorBody.className = 'fixed bottom-0 left-0 w-full h-12 z-100 px-5 flex items-center justify-between bg-red'
    errorMsg.setAttribute('class', 'text-base')

    // statusMsg.setAttribute('class', '')
    closeButton.setAttribute('class', 'w-1/10 aspect-square bg-red-400')
    
    //fill message text
    if(msg) {
        errorMsg.innerHTML = msg

    } else {
        errorMsg.innerHTML = 'Transaction Error'
    }
    errorBody.appendChild(errorMsg)
    
    //button event
    closeButton.innerHTML = 'Close'
    closeButton.addEventListener('click', ()=>{
        errorBody.remove()
    })
    errorBody.appendChild(closeButton)

    //attach to document
    document.body.appendChild(errorBody)
}

const createStatusMsg = (msg) => {
    //check for existing messages
    var existingMsg = document.getElementById('wallet-status-msg')
    if(existingMsg) {
        existingMsg.remove()
    }
    //build message module
    var statusBody = document.createElement('div')
    var statusMsg = document.createElement('h1')
    statusBody.setAttribute('id', "wallet-status-msg")
    var closeButton = document.createElement('button')
    
    //style
    statusBody.className = 'fixed bottom-0 left-0 w-full h-12 z-100 px-5 flex items-center justify-between bg-blue'

    // statusMsg.setAttribute('class', '')
    closeButton.setAttribute('class', 'w-1/10 aspect-square bg-red-400')
    
    //fill message text
    statusMsg.innerHTML = 'Sending transaction to wallet...'
    statusBody.appendChild(statusMsg)
    
    //button event
    closeButton.innerHTML = 'Close'
    closeButton.addEventListener('click', ()=>{
        statusBody.remove()
    })
    statusBody.appendChild(closeButton)

    //attach to document
    document.body.appendChild(statusBody)

    setTimeout(()=>{
        statusBody.remove()
    }, 10000)
}