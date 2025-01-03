import * as web3 from '@solana/web3.js';
import * as token from '@solana/spl-token';
import * as fs from 'fs';
import * as path from 'path';
import { 
    PublicKey,
    keypairIdentity,
    Metaplex,
} from "@metaplex-foundation/js";
import fetch from 'node-fetch';

// @ts-ignore
global.fetch = fetch;

interface MintConfig {
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
}

// Devnet RPC endpoint
const RPC_ENDPOINT = "https://mainnetbeta-rpc.eclipse.xyz";

async function checkBalanceAndAirdrop(connection: web3.Connection, publicKey: web3.PublicKey) {
    const balance = await connection.getBalance(publicKey);
    console.log(`Current balance: ${balance / web3.LAMPORTS_PER_SOL} SOL`);

    if (balance < web3.LAMPORTS_PER_SOL) {
        console.log('Balance too low, requesting airdrop...');
        const signature = await connection.requestAirdrop(
            publicKey,
            2 * web3.LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(signature);
        const newBalance = await connection.getBalance(publicKey);
        console.log(`New balance: ${newBalance / web3.LAMPORTS_PER_SOL} SOL`);
    }
}

async function mintNFT() {
    try {
        // Upload sonuçlarını oku
        const uploadResults = JSON.parse(fs.readFileSync('upload-results.json', 'utf-8'));
        
        // Solana bağlantısını başlat (özel RPC ile)
        const connection = new web3.Connection(RPC_ENDPOINT, 'confirmed');
        
        // Wallet'ı yükle
        const keypairFile = fs.readFileSync('id.json', 'utf-8');
        const keypair = web3.Keypair.fromSecretKey(
            Uint8Array.from(JSON.parse(keypairFile))
        );

        // Bakiyeyi kontrol et ve gerekirse SOL al
        await checkBalanceAndAirdrop(connection, keypair.publicKey);

        // Metaplex instance'ı oluştur
        const metaplex = Metaplex.make(connection)
            .use(keypairIdentity(keypair));

        console.log('Starting CowAI NFT mint process...');

        for (const result of uploadResults) {
            const mintConfig: MintConfig = {
                name: result.name.replace('.png', ''),
                symbol: 'COWAI',
                uri: result.metadataUrl,
                sellerFeeBasisPoints: 500, // 5%
            };

            // NFT'yi oluştur
            const { nft } = await metaplex.nfts().create({
                uri: mintConfig.uri,
                name: mintConfig.name,
                symbol: mintConfig.symbol,
                sellerFeeBasisPoints: mintConfig.sellerFeeBasisPoints,
                creators: [
                    {
                        address: keypair.publicKey,
                        share: 100,
                    }
                ],
                isMutable: true,
            });

            console.log(`Minted CowAI NFT ${mintConfig.name}:`);
            console.log(`Mint Address: ${nft.address.toBase58()}`);
            console.log(`Metadata Address: ${nft.metadataAddress.toBase58()}\n`);
        }

        console.log('All CowAI NFTs minted successfully!');

    } catch (error) {
        console.error('Error minting CowAI NFTs:', error);
        throw error;
    }
}

mintNFT()
    .then(() => console.log('CowAI mint process completed!'))
    .catch(console.error); 