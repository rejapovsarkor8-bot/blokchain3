import React, { useState, useEffect } from 'react';

const NFTPanel = ({ contract, account, web3 }) => {
  const [nfts, setNfts] = useState([]);
  const [tokenURI, setTokenURI] = useState('');
  
  const [txStatus, setTxStatus] = useState({ state: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMyNFTs();
  }, [account, contract]);

  const fetchMyNFTs = async () => {
    if (!contract || !account) return;
    try {
      // Get balance of NFTs owned by user
      const balance = await contract.methods.balanceOf(account).call();
      const nftList = [];

      for (let i = 0; i < balance; i++) {
        // Enumerable allows us to get token ID by index
        const tokenId = await contract.methods.tokenOfOwnerByIndex(account, i).call();
        const uri = await contract.methods.tokenURI(tokenId).call();
        
        nftList.push({
          id: tokenId.toString(),
          uri: uri
        });
      }
      setNfts(nftList);
    } catch (err) {
      console.error('Fetch NFTs error:', err);
    }
  };

  const handleMint = async () => {
    if (!contract || !tokenURI) {
      setTxStatus({ state: 'error', message: 'Iltimos URI kiriting!' });
      return;
    }

    try {
      setIsLoading(true);
      setTxStatus({ state: 'pending', message: 'Minting... Tranzaksiya tasdiqlanmoqda ⏳' });

      const tx = await contract.methods.mintNFT(tokenURI).send({
        from: account
      });

      setTxStatus({ state: 'success', message: `Muvaffaqiyatli Mint qilindi! 🎉 Hash: ${tx.transactionHash.substring(0,10)}...` });
      setTokenURI('');
      fetchMyNFTs(); // Refresh CRUD Read
    } catch (err) {
      setTxStatus({ state: 'error', message: 'Xatolik yuz berdi ❌: ' + err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="panel" style={{marginBottom: '20px'}}>
        <h3 className="panel-title">1. Yangi NFT Yaratish (MINT)</h3>
        <p style={{fontSize: '13px', color: '#94a3b8', marginBottom: '15px'}}>IPFS orqali rasm urlsini kiriting.</p>
        <div className="input-group">
          <label>Token URI (Masalan: https://ipfs.io/ipfs/Qm...)</label>
          <input 
            type="text" 
            className="input-field" 
            placeholder="IPFS URL"
            value={tokenURI}
            onChange={(e) => setTokenURI(e.target.value)}
          />
        </div>
        <button 
          className="btn" 
          onClick={handleMint} 
          disabled={isLoading}
          style={{ width: '100%', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}
        >
          {isLoading ? 'Iltimos Kuting...' : 'Mint NFT 🎨'}
        </button>

        <div className={`tx-status ${txStatus.state} ${txStatus.state ? 'show' : ''}`}>
          {txStatus.message}
        </div>
      </div>

      <div className="divider"></div>

      <div className="panel">
        <h3 className="panel-title">2. Mening Kolleksiyam (My NFTs)</h3>
        
        {nfts.length === 0 ? (
          <p style={{color: '#94a3b8'}}>Sizda hozircha hech qanday NFT yo'q.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {nfts.map((nft) => (
              <div key={nft.id} style={{
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '12px',
                padding: '10px',
                textAlign: 'center'
              }}>
                <img 
                  src={nft.uri} 
                  alt={`NFT ${nft.id}`} 
                  style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Invalid+Image' }}
                />
                <span style={{fontWeight: 'bold', display: 'block'}}>ID: #{nft.id}</span>
              </div>
            ))}
          </div>
        )}
        
        <button className="btn" onClick={fetchMyNFTs} style={{ marginTop: '15px', width: '100%', background: '#475569' }}>
          Yangilash (Refresh)
        </button>
      </div>
    </div>
  );
};

export default NFTPanel;
