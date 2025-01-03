import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface MintCardProps {
  onMint: () => void;
  price: string;
  walletAddress?: string;
}

const MintCard = ({ onMint, price, walletAddress }: MintCardProps) => {
  const { connected } = useWallet();

  return (
    <div className="max-w-md mx-auto bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          TechCow AI NFT Collection
        </h2>
        <p className="text-gray-300 text-center mb-6">
          Mint your unique TechCow AI NFT and join our community of digital art collectors.
        </p>
        
        <div className="space-y-4">
          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="text-gray-400 text-sm">Price</p>
            <p className="text-white font-medium">{price}</p>
          </div>
          
          {connected ? (
            <div className="space-y-4">
              <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-gray-400 text-sm">Wallet</p>
                <p className="text-white font-medium truncate">{walletAddress}</p>
              </div>
              <button
                onClick={onMint}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Mint NFT
              </button>
            </div>
          ) : (
            <WalletMultiButton className="w-full !bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 !text-white font-medium rounded-lg hover:opacity-90 transition-opacity" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MintCard; 