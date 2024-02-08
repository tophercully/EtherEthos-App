const web3 = new Web3("https://eth-mainnet.g.alchemy.com/v2/3Ip2Q4U5C0FL8bcCdOk_iZzAc90rIKsQ"); // Production API key locked to domain and contract. :)
const web3Sepolia = new Web3("https://eth-sepolia.g.alchemy.com/v2/ybQlJw7yHs3ediVFKRFsaKutMg7jzeP6"); // Testnet API key
const EE_ADDRESS = "0x770af72f943A24316CB3195BA6C22C49f9306C5a";
const EE_Contract_Alchemy = new web3.eth.Contract(EE_ABI, EE_ADDRESS);
const EE_Contract_Alchemy_Sepolia = new web3Sepolia.eth.Contract(EE_ABI, EE_ADDRESS);
const connectButton = document.querySelector("[data-connect]");
const connectButtonText = document.querySelector("[data-connect] span");

let web3User = null; // For MetaMask or any Ethereum-compatible wallet
let EE_Contract_User = null

/*****************************************/
/* Detect the MetaMask Ethereum provider */
/*****************************************/
async function getProvider(){
    const provider = await detectEthereumProvider();
    if (provider) {
        startApp(provider);
    } else {
        console.log('Please install MetaMask!');
    }
}

getProvider();

function startApp(provider) {
    if (provider !== window.ethereum) {
        console.error('Do you have multiple wallets installed?');
    }
    web3User = new Web3(provider); // Initialize user's web3

    // Now initialize the user's contract object
    EE_Contract_User = new web3User.eth.Contract(EE_ABI, EE_ADDRESS);

    // Attach event handlers
    ethereum.on('chainChanged', handleChainChanged);
    ethereum.on('accountsChanged', handleAccountsChanged);

    // Check for existing accounts
    ethereum
        .request({ method: 'eth_accounts' })
        .then(handleAccountsChanged)
        .catch(handleError);
}

function handleChainChanged() {
    window.location.reload();
}

let currentAccount = null;

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        console.log('Please connect to MetaMask.');
        connectButtonText.textContent = "Connect MetaMask";
    } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0];
        console.log("Account connected:", currentAccount);
        connectButtonText.textContent = `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`;
    }
}

function handleError(error) {
    console.error(error);
}

function connectWallet() {
    ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(handleAccountsChanged)
        .catch(handleError);
}


if (connectButton) {
  connectButton.addEventListener("click", function (event) {
    event.preventDefault()
    connectWallet();
  });
}