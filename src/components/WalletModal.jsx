import React from 'react';

const WalletModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Hamyonni Tanlang</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="wallet-list">
          <button className="wallet-btn" onClick={() => onSelect('metamask')}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" />
            MetaMask
          </button>
          
          <button className="wallet-btn" onClick={() => onSelect('coinbase')}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Coinbase.svg" alt="Coinbase" style={{background: 'white', borderRadius: '50%', padding: '2px'}} />
            Coinbase Wallet
          </button>
          
          <button className="wallet-btn" onClick={() => onSelect('walletconnect')}>
            <img src="https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Blue%20(Default)/Logo.png" alt="WalletConnect" />
            WalletConnect
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
