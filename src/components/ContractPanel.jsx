import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const ContractPanel = ({ contract, account, web3 }) => {
  const [patientStatus, setPatientStatus] = useState('-');
  const [patientBalance, setPatientBalance] = useState('0');
  
  const [feeInput, setFeeInput] = useState('0.01'); // ETH
  const [txStatus, setTxStatus] = useState({ state: '', message: '' });

  // Admin controls
  const [isOwner, setIsOwner] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('0.01');

  useEffect(() => {
    checkOwner();
    fetchPatientInfo();
  }, [account, contract]);

  const checkOwner = async () => {
    if (!contract) return;
    try {
      const ownerAddr = await contract.methods.owner().call();
      if (ownerAddr.toLowerCase() === account.toLowerCase()) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPatientInfo = async () => {
    if (!contract) return;
    try {
      const result = await contract.methods.getPatientInfo(account).call();
      setPatientStatus(result[0] || 'Navbatga yozilmagan');
      setPatientBalance(web3.utils.fromWei(result[1].toString(), 'ether'));
    } catch (err) {
      console.error('Fetch Info Error:', err);
    }
  };

  const notify = (state, message) => {
    setTxStatus({ state, message });
    if (state === 'success') {
      fetchPatientInfo(); // tranzaksiya tugagach malumotni yangilash
    }
  };

  const handleBookAppointment = async () => {
    if (!contract || !feeInput) return;
    try {
      notify('pending', 'Pending... Tranzaksiya tasdiqlanmoqda (Booking)');
      const valueInWei = web3.utils.toWei(feeInput.toString(), 'ether');

      const tx = await contract.methods.bookAppointment().send({
        from: account,
        value: valueInWei
      });

      notify('success', `Success ✅ Navbat yozildi. Hash: ${tx.transactionHash.substring(0,10)}...`);
    } catch (err) {
      let errorMsg = err.message.includes('User denied') ? 'Error ❌ Bekor qilindi' : 'Error ❌ Xatolik yuz berdi: ' + err.message;
      notify('error', errorMsg);
    }
  };

  const handleTransferToSpecial = async () => {
    if (!contract || !recipientAddress) return;
    try {
      notify('pending', 'Pending... Boshqa manzilga o`tkazilmoqda');
      const valueInWei = web3.utils.toWei(transferAmount.toString(), 'ether');

      const tx = await contract.methods.transferToSpecial(recipientAddress).send({
        from: account,
        value: valueInWei
      });

      notify('success', `Success ✅ Yuborildi! Hash: ${tx.transactionHash.substring(0,10)}...`);
    } catch (err) {
      notify('error', 'Error ❌ Ruxsat etilmagan yoki yuborish xatosi qildi.');
    }
  };

  const handleWithdraw = async () => {
    if (!contract) return;
    try {
      notify('pending', 'Pending... Mablag` yechilmoqda');
      const tx = await contract.methods.withdrawFunds().send({
        from: account
      });
      notify('success', `Success ✅ Barcha ETH kashelokka tushdi. Hash: ${tx.transactionHash.substring(0,10)}...`);
    } catch (err) {
      notify('error', 'Error ❌ Yechib olishda xatolik yuz berdi');
    }
  };

  return (
    <div>
      <div className="panel">
        <h3 className="panel-title">1. Mening Navbatim (Bemor Info)</h3>
        <div className="read-result" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{marginBottom: '5px'}}><strong>Status:</strong> <span style={{color: '#60a5fa'}}>{patientStatus}</span></div>
          <div><strong>Sarflangan pul:</strong> <span style={{color: '#10b981'}}>{patientBalance} ETH</span></div>
        </div>
        <button className="btn" onClick={fetchPatientInfo} style={{ marginTop: '15px', background: '#475569' }}>
          Yangilash
        </button>
      </div>

      <div className="divider"></div>

      <div className="panel">
        <h3 className="panel-title">2. Navbatga Yozilish (To'lov bilan)</h3>
        <p style={{fontSize: '13px', color: '#94a3b8', marginBottom: '15px'}}>Standard: >= 0.01 ETH | VIP: >= 0.05 ETH</p>
        <div className="input-group">
          <label>To'lov miqdori (ETH):</label>
          <input 
            type="number" 
            className="input-field" 
            value={feeInput}
            onChange={(e) => setFeeInput(e.target.value)}
          />
        </div>
        <button className="btn" onClick={handleBookAppointment} style={{ width: '100%', background: '#8b5cf6' }}>
          To'lov Qilish & Navbatga Kirish
        </button>
      </div>

      <div className="divider"></div>

      <div className="panel">
        <h3 className="panel-title">3. Boshqa manzilga to'lov o'tkazish</h3>
        <p style={{fontSize: '13px', color: '#94a3b8', marginBottom: '15px'}}>(Faqat ruxsat etilgan "Special" adresi ishlata oladi)</p>
        <div className="gas-grid">
          <div className="input-group">
            <label>Manzil (Recepient):</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="0x..."
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Miqdor (ETH):</label>
            <input 
              type="number" 
              className="input-field" 
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
            />
          </div>
        </div>
        <button className="btn" onClick={handleTransferToSpecial} style={{ width: '100%', background: '#3b82f6' }}>
          To'lovni o'tkazish (Transfer)
        </button>
      </div>

      {isOwner && (
        <div className="panel" style={{ marginTop: '25px', border: '1px solid var(--warning)', padding: '20px', borderRadius: '12px' }}>
          <h3 className="panel-title" style={{color: 'var(--warning)'}}>👑 Admin Paneli</h3>
          <p style={{fontSize: '13px', color: '#cbd5e1', marginBottom: '15px'}}>Siz Shifoxona egasi (Owner) hisoblanganingiz uchun ushbu tugma sizga ko'rinmoqda.</p>
          <button className="btn" onClick={handleWithdraw} style={{ width: '100%', background: 'var(--warning)', color: '#000' }}>
            Barcha mablag'larni yechib olish
          </button>
        </div>
      )}

      <div className={`tx-status ${txStatus.state} ${txStatus.state ? 'show' : ''}`}>
        {txStatus.message}
      </div>
    </div>
  );
};

export default ContractPanel;
