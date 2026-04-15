import Web3 from 'web3';
import ABI from '../contracts/SimpleStorageABI.json';

// Testnet (Sepolia) or Local Node Address
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

export const connectMetaMask = async () => {
  if (window.ethereum) {
    if (!window.ethereum.isMetaMask) {
      // Just check but allow anyway
    }
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
  // Normally requires @walletconnect/web3-provider or similar
  // For standard emulation showing multiple support easily:
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
