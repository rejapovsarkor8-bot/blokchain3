# 🎨 Premium Web3 NFT Minting DApp

Ushbu repozitoriya Web3 loyihalash asosida maxsus yaratilgan **ERC-721 NFT Minting DApp** kodlarini o'z ichiga oladi. U kengaytirilgan UI/UX arxitekturasi va real-vaqtda markazlashmagan hisoblarni tortib olish xususiyatlariga ega.

## 🚀 Loyiha Arxitekturasi va Ishlashi

Loyiha ikki qismdan iborat:

### 1. Smart Kontrakt (Backend yechim)
- **Fayl**: `src/contracts/MyAwesomeNFT.sol`
- **Texnologiya**: Solidity `^0.8.20`, OpenZeppelin kutubxonalari.
- **Xususiyatlari**: 
  - `ERC721URIStorage` orqali rasm va IPFS havolalarini saqlaydi.
  - `ERC721Enumerable` orqali foydalanuvchilarning o'ziga tegishli sanalgan nftlarini frontendga render qilish logikasini ta'minlaydi (Read/Display).

### 2. DApp Interfeysi (Frontend)
- **Fayl**: `src/App.jsx` hamda `src/components/ContractPanel.jsx`
- **Texnologiya**: React + Vite, Web3.js
- **Xususiyatlari**: 
  - Hamyonni xavfsiz ulash va tarmoqni aniqlash.
  - CRUD o'qish imkoniyati (Sizga tegishli NFT larni ID lari va interfeyslari chizib ko'rsatiladi).
  - Mint qilish jarayonida tranzaksiyani kutib turuvchi zamonaviy progress UI.

## 🛠️ Loyihani Tizimga Tushirish

Loyihani o'z obyektingizda ishga tushirish uchun sizga `Node.js` hamda Metamask kabi inyeksion kripto-hamyon kerak bo'ladi.

1. NPM modullarini yuklash:
```bash
npm install
```

2. Loyihani dev rejimda ochish:
```bash
npm run dev
```

3. Shuningdek ushbu repoda `presentation.html` fayli ham mavjud. Uni ikki marta bosib brauzeringizda taqdimot demo-slaydlaridan xabardor bo'lishingiz mumkin!
