let currentChainId = null;
const web3Main = new Web3(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_MAIN}`);
const web3Sepolia = new Web3(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_SEPOLIA}`);
const web3Optimism = new Web3(`https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_OPTIMISM}`);
const web3Base = new Web3(`https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_BASE}`);
let currentChain = null;
let currentAccount = null;
window.sessionStorage.setItem('chainIDLoaded', false)

// arbitrum and polygon not yet supported
let chains = [
  {
    name: 'mainnet',
    id: 1,
    explorerBaseUrl: "https://etherscan.io/address/",
    contractAddress: "0x1f5A0f2FA2C0289a8b9639Cb18884a4d2c60c409"
  },
  {
    name: 'sepolia',
    id: 11155111,
    explorerBaseUrl: "https://sepolia.etherscan.io/address/",
    contractAddress: "0x1f5A0f2FA2C0289a8b9639Cb18884a4d2c60c409"
  },
  {
    name: 'optimism',
    id: 10,
    explorerBaseUrl: "https://optimistic.etherscan.io/address/",
    contractAddress: "0x1f5A0f2FA2C0289a8b9639Cb18884a4d2c60c409"
  },
  {
    name: 'base',
    id: 8453,
    explorerBaseUrl: "https://basescan.org/address/",
    contractAddress: "0x1f5A0f2FA2C0289a8b9639Cb18884a4d2c60c409"
  },
  {
    name: 'arbitrum',
    id: 42161,
    explorerBaseUrl: "https://arbiscan.io/address/",
    contractAddress: "0x1f5A0f2FA2C0289a8b9639Cb18884a4d2c60c409"
  },
  {
    name: 'polygon',
    id: 137,
    explorerBaseUrl: "https://polygonscan.com/address/",
    contractAddress: "0x1f5A0f2FA2C0289a8b9639Cb18884a4d2c60c409"
  },
]

var chainParams = new URLSearchParams(window.location.search)
let EE_ADDRESS
if(chainParams.has("chain")) {
  //Find contract address based on search query
  var findChainID = chains.find(o => o.id === Number(chainParams.get("chain")))
  chainIndex = chains.indexOf(findChainID);
  EE_ADDRESS = chains[chainIndex].contractAddress
} else {
  if(currentAccount) {
    //Find contract address based on wallet chainID
    window.addEventListener('load', ()=>{
      var findChainID = chains.find(o => o.id === Number(chainParams.get("chain")))
      chainIndex = chains.indexOf(findChainID);
      EE_ADDRESS = chains[chainIndex].contractAddress
      
    })
  } else {
    //Use default (mainnet)
    chainIndex = 0
    EE_ADDRESS = "0x1f5A0f2FA2C0289a8b9639Cb18884a4d2c60c409"
  }
}
const EE_Contract_Alchemy = new web3Main.eth.Contract(EE_ABI, chains[0].contractAddress);
const EE_Contract_Alchemy_Sepolia = new web3Sepolia.eth.Contract(EE_ABI, chains[1].contractAddress);
const EE_Contract_Alchemy_Optimism = new web3Optimism.eth.Contract(EE_ABI, chains[2].contractAddress);
const EE_Contract_Alchemy_Base = new web3Base.eth.Contract(EE_ABI, chains[3].contractAddress);

const connectButton = document.querySelector("[data-connect]");
const connectButtonText = document.querySelector("[data-connect] span");

let web3User = null; // For MetaMask or any Ethereum-compatible wallet
let EE_Contract_User = null;

/*****************************************/
/* Detect the MetaMask Ethereum provider */
/*****************************************/
async function getProvider() {
  const provider = await detectEthereumProvider();
  if (provider) {
    startApp(provider);
  } else {
    console.log("Please install MetaMask!");
    createNoWalletMsg()
  }
}

getProvider();

function startApp(provider) {
  if (provider !== window.ethereum) {
    console.error("Do you have multiple wallets installed?");
  }
  web3User = new Web3(provider); // Initialize user's web3

  // Now initialize the user's contract object
  EE_Contract_User = new web3User.eth.Contract(EE_ABI, EE_ADDRESS);

  // Attach event handlers
  ethereum.on("chainChanged", handleChainChanged);
  ethereum.on("accountsChanged", handleAccountsChanged);

  // Fetch and set the current chain ID
  ethereum
    .request({ method: "eth_chainId" })
    .then((chainId) => {
      // Convert the chain ID from hex to decimal
      currentChainId = parseInt(chainId, 16);
      console.log("Current Chain ID:", currentChainId);
      window.sessionStorage.setItem('chainIDLoaded', true)
      // You can now use currentChainId in other parts of your app
    })
    .catch(handleError);

  // Check for existing accounts
  ethereum.request({ method: "eth_accounts" }).then(handleAccountsChanged).catch(handleError);
}

function handleChainChanged() {
  // Convert the chain ID from hex to decimal
  currentChainId = parseInt(_chainId, 16);
  console.log("Chain ID changed to:", currentChainId);
  window.location.reload();
}



function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    console.log("Please connect to MetaMask.");
    connectButtonText.textContent = "Connect MetaMask";
  } else if (accounts[0] !== currentAccount) {
    const firstConnection = currentAccount ? false : true
    console.log('setting currentAccount')
    currentAccount = accounts[0];
    console.log("Account connected:", currentAccount);
    console.log(currentAccount);
    connectButtonText.textContent = typeof currentAccount == 'string' ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}` : currentAccount;

  }
}

function handleError(error) {
  console.error(error);
  if(!currentChainId) {
    currentChainId = 1
  }
}

function connectWallet() {
  if(!currentAccount) {
    //initial connection
    ethereum.request({ method: "eth_requestAccounts" }).then(!currentAccount ? handleAccountsChanged : ()=> {}).catch(handleError);
  } else {
    //connect new account
    ethereum.request({
      method: "wallet_requestPermissions",
      params: [
        {
          eth_accounts: {}
        }
      ]
    }).then(handleAccountsChanged).catch(handleError);
    console.log('reconnecting')
  }
}

function manageDropdown () {
  if (connectButton) {
    if(!currentAccount) {
      const profileDropdown = document.getElementById('profile-dropdown')
      profileDropdown.classList.remove('flex')
      profileDropdown.classList.add('hidden')
      profileDropdown.style.border = 'none'

      connectButton.addEventListener("click", function (event) {
        event.preventDefault();
        connectWallet();
      });
    } else if(currentAccount) {
      removeEventListener('click', connectButton)
      let profileDropped = false
      const profileDropdown = document.getElementById('profile-dropdown')
      profileDropdown.style.border = 'none'
      const myProfileButton = document.getElementById('my-profile')
      myProfileButton.style.height = '0'
      const reconnectButton = document.getElementById('reconnect')
      reconnectButton.style.height = '0'


      function toggleProfileDropdown() {
        if(profileDropped) {
          profileDropdown.style.height = '0px'
          myProfileButton.style.height = '0px'
          reconnectButton.style.height = '0px'
          profileDropdown.style.border = 'none'
          profileDropdown.classList.add('hidden')
          profileDropped = false
          
        } else {
          profileDropdown.style.height = '10rem'
          myProfileButton.style.height = '5rem'
          reconnectButton.style.height = '5rem'
          profileDropdown.style.border = '1px solid black'
          profileDropdown.classList.remove('hidden')
          profileDropped = true
        }
      }
      
      connectButton.addEventListener("click", function (event) {
        event.preventDefault();
        toggleProfileDropdown();
      });
      reconnectButton.addEventListener('click', ()=>{
        connectWallet();
      })
      myProfileButton.addEventListener('click', ()=>{

        window.location.href = `${window.location.origin}?address=${currentAccount}`

        console.log('my profile link ' + profileLink)
        console.log(profileParams)
      })
    }
  }
}

window.addEventListener('load', ()=> {
  manageDropdown()
}) 
  