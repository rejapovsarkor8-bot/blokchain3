import Web3 from 'web3';
import ABI from '../contracts/MyAwesomeNFT_ABI.json';

// Testnet Contract Address (Replace after deploying MyAwesomeNFT.sol)
const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; 

export const connectMetaMask = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    return { web3, account: accounts[0], contract, walletType: 'MetaMask' };
  } else {
    throw new Error('MetaMask topilmadi. Iltimos brauzer kengaytmasini o`rnating.');
  }
};

export const connectCoinbase = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    return { web3, account: accounts[0], contract, walletType: 'Coinbase Wallet' };
  } else {
    throw new Error('Coinbase Wallet topilmadi.');
  }
};

export const connectWalletConnect = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    return { web3, account: accounts[0], contract, walletType: 'WalletConnect' };
  } else {
    throw new Error('WalletConnect provider not injected.');
  }
};
