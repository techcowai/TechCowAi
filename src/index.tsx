import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { PublicKey } from '@solana/web3.js';

const ECLIPSE_NFT_PROGRAM_ID = new PublicKey("NFTomzGE8vJ7GBVrLbPnY5QrGtqGzDhBrKxMA6vX76m");

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 