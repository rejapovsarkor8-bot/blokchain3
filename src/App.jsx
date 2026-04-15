import React, { useState } from 'react';
import WalletModal from './components/WalletModal.jsx';
import ContractPanel from './components/ContractPanel.jsx';
import { connectMetaMask, connectCoinbase, connectWalletConnect } from './utils/web3Provider.js';

function App() {
  const [walletInfo, setWalletInfo] = useState({
    account: null,
    walletType: null,
    contract: null,
    web3: null
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorApp, setErrorApp] = useState('');

  const handleConnect = async (walletType) => {
    try {
      setErrorApp('');
      let result;
      if (walletType === 'metamask') {
        result = await connectMetaMask();
      } else if (walletType === 'coinbase') {
        result = await connectCoinbase();
      } else if (walletType === 'walletconnect') {
        result = await connectWalletConnect();
      }
      
      if (result) {
        setWalletInfo(result);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      setErrorApp(err.message || "Failed to connect wallet");
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header-row">
          <h2 className="title">🚀 Premium DApp</h2>
          
          <div className={`status-badge ${walletInfo.account ? 'connected' : 'disconnected'}`}>
            <span></span> {walletInfo.account ? `${walletInfo.walletType}: ${formatAddress(walletInfo.account)}` : 'Hamyon ulanmagan'}
          </div>
        </div>

        {errorApp && <div className="tx-status error show" style={{marginBottom: '20px'}}>{errorApp}</div>}

        {!walletInfo.account ? (
          <div style={{ textAlign: 'center', margin: '40px 0' }}>
            <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
              Quyidagi tugma orqali Web3 olamiga kiring:
            </p>
            <button className="btn" onClick={() => setIsModalOpen(true)} style={{ margin: '0 auto' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"/>
              </svg>
              Connect Wallet
            </button>
          </div>
        ) : (
          <ContractPanel 
            contract={walletInfo.contract} 
            account={walletInfo.account} 
            web3={walletInfo.web3} 
          />
        )}
      </div>

      <WalletModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={handleConnect} 
      />
    </div>
  );
}

export default App;
