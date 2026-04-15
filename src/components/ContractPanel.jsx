import React, { useState } from 'react';
import Web3 from 'web3';

const ContractPanel = ({ contract, account, web3 }) => {
  const [readData, setReadData] = useState('-');
  const [inputData, setInputData] = useState('');
  const [gasLimit, setGasLimit] = useState('3000000');
  const [gasPrice, setGasPrice] = useState('20');
  
  const [txStatus, setTxStatus] = useState({ state: '', message: '' });

  const handleRead = async () => {
    if (!contract) return;
    try {
      const result = await contract.methods.getData().call();
      setReadData(result || 'Bo`sh');
      console.log('Contract Data:', result);
    } catch (err) {
      console.error('Read Error:', err);
      setTxStatus({ state: 'error', message: 'Read error: ' + err.message });
    }
  };

  const handleWrite = async () => {
    if (!contract || !inputData) {
      setTxStatus({ state: 'error', message: 'Ma`lumot kiriting' });
      return;
    }

    try {
      setTxStatus({ state: 'pending', message: 'Pending... Tranzaksiya tasdiqlanmoqda' });
      
      const priceInWei = web3.utils.toWei(gasPrice.toString(), 'gwei');

      // send metodi orqali tranzaksiya
      const tx = await contract.methods.setData(inputData).send({
        from: account,
        gas: gasLimit,
        gasPrice: priceInWei
      });

      console.log("Transaction Hash:", tx.transactionHash);
      setTxStatus({ state: 'success', message: `Success ✅ Tranzaksiya tasdiqlandi. Hash: ${tx.transactionHash.substring(0, 10)}...` });
      setInputData('');
    } catch (err) {
      console.error('Write Error:', err);
      // Xatoliklarni ushlash
      let errorMsg = 'Error ❌ Tranzaksiyada xatolik yuz berdi';
      if (err.message.includes('User denied')) {
        errorMsg = 'Error ❌ Foydalanuvchi tranzaksiyani rad etdi';
      }
      setTxStatus({ state: 'error', message: errorMsg });
    }
  };

  return (
    <div>
      <div className="panel">
        <h3 className="panel-title">1. Kontraktdan o'qish (View Call)</h3>
        <button className="btn" onClick={handleRead} style={{ marginBottom: '15px' }}>
          Ma`lumotni O'qish (getData)
        </button>
        <div className="read-result">
          {readData}
        </div>
      </div>

      <div className="divider"></div>

      <div className="panel">
        <h3 className="panel-title">2. Kontraktga yozish (Send Tx)</h3>
        <div className="input-group">
          <label>Yangi ma'lumot (String):</label>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Salom Web3!" 
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
          />
        </div>

        <div className="gas-grid">
          <div className="input-group">
            <label>Gas Limit:</label>
            <input 
              type="number" 
              className="input-field" 
              value={gasLimit}
              onChange={(e) => setGasLimit(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Gas Price (Gwei):</label>
            <input 
              type="number" 
              className="input-field" 
              value={gasPrice}
              onChange={(e) => setGasPrice(e.target.value)}
            />
          </div>
        </div>

        <button className="btn" onClick={handleWrite} style={{ width: '100%', background: '#8b5cf6' }}>
          Tranzaksiya Yuborish (setData)
        </button>

        <div className={`tx-status ${txStatus.state} ${txStatus.state ? 'show' : ''}`}>
          {txStatus.message}
        </div>
      </div>
    </div>
  );
};

export default ContractPanel;
