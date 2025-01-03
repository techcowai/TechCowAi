import { FC, useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const EclipseFaucet: FC = () => {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [balance, setBalance] = useState<number | null>(null);

    const checkBalance = async () => {
        if (!wallet.publicKey) return;
        try {
            const balance = await connection.getBalance(wallet.publicKey);
            setBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
            console.error('Error checking balance:', error);
        }
    };

    useEffect(() => {
        if (wallet.connected) {
            checkBalance();
            const interval = setInterval(checkBalance, 5000);
            return () => clearInterval(interval);
        } else {
            setBalance(null);
        }
    }, [wallet.connected, wallet.publicKey]);

    return (
        <div className="faucet-container">
            <h3>Eclipse Mainnet Balance</h3>
            {balance !== null && (
                <p>Current Balance: {balance.toFixed(4)} ETH</p>
            )}
            <div className="faucet-info">
                <p>Note: This is Eclipse Mainnet. You need ETH to mint NFTs.</p>
                <p>You can get ETH from:</p>
                <ul>
                    <li>
                        <a 
                            href="https://bridge.eclipse.xyz" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            Eclipse Bridge
                        </a>
                    </li>
                    <li>
                        <a 
                            href="https://app.uniswap.org" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            Uniswap
                        </a>
                    </li>
                    <li>
                        <a 
                            href="https://www.binance.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            Binance
                        </a>
                    </li>
                </ul>
                <p className="info-note">
                    Note: After bridging ETH to Eclipse network, you'll need to wait for confirmation (usually 10-15 minutes).
                </p>
            </div>
        </div>
    );
}; 