import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { MintNFT } from './components/MintNFT';

require('@solana/wallet-adapter-react-ui/styles.css');

// Eclipse Mainnet RPC endpoint
const ECLIPSE_MAINNET_RPC = "https://mainnetbeta-rpc.eclipse.xyz";

const METADATA_URLS = [
  ...Array(50).fill('ipfs://QmdbA6kdtrQ5GD9yxAMPBbESeLEQM4koGCxXzyqniad5VN')
];

function App() {
  const endpoint = ECLIPSE_MAINNET_RPC;
  const wallets = useMemo(() => [], []);

  const nftData = {
    name: "TechCow AI",
    symbol: "TCOW",
    uri: METADATA_URLS[0],
    sellerFeeBasisPoints: 500
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="App">
            <h1>TechCow AI NFT Collection</h1>
            <p>Discover and collect unique AI-generated cyberpunk highland cows on the Eclipse blockchain.</p>
            <div className="container">
              <h2>TechCow AI NFT Collection</h2>
              <p>Mint your unique TechCow AI NFT and join our community of digital art collectors.</p>
              <p>Price: Free (+ gas fees)</p>
              <MintNFT nftData={nftData} />
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App; 