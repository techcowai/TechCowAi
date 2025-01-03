import Arweave from 'arweave';
import fs from 'fs';

const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
});

async function createWallet() {
    try {
        const key = await arweave.wallets.generate();
        fs.writeFileSync('arweave-wallet.json', JSON.stringify(key, null, 2));
        const address = await arweave.wallets.jwkToAddress(key);
        console.log('Wallet created successfully!');
        console.log('Wallet address:', address);
        console.log('Wallet saved to arweave-wallet.json');
        return { key, address };
    } catch (error) {
        console.error('Error creating wallet:', error);
        throw error;
    }
}

createWallet()
    .then(() => console.log('Wallet creation complete!'))
    .catch(console.error); 