import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-white text-center">
          TechCow AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-pink-200">NFT Collection</span>
        </h1>
        <p className="text-gray-200 text-center mt-2">
          Discover and collect unique AI-generated cyberpunk highland cows on the Eclipse blockchain.
        </p>
      </div>
    </header>
  );
};

export default Header; 