import React, { FC, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
} from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID, 
  createInitializeMintInstruction, 
  MINT_SIZE,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from '@solana/spl-token';
import { 
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
  createCreateMetadataAccountV3Instruction,
  DataV2,
} from '@metaplex-foundation/mpl-token-metadata';

interface MintNFTProps {
  nftData: {
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
  };
}

export const MintNFT: FC<MintNFTProps> = ({ nftData }) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [isMinting, setIsMinting] = useState(false);
  const [mintAddress, setMintAddress] = useState<string | null>(null);

  const handleMint = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      alert('Please connect your wallet first!');
      return;
    }

    try {
      setIsMinting(true);

      // Generate a new mint keypair
      const mintKeypair = Keypair.generate();
      console.log('Generated mint address:', mintKeypair.publicKey.toBase58());

      // Calculate rent exempt amount
      const lamports = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);

      // Create mint account
      const createAccountInstruction = SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID
      });

      // Initialize mint instruction
      const initializeMintInstruction = createInitializeMintInstruction(
        mintKeypair.publicKey,
        0,
        wallet.publicKey,
        wallet.publicKey
      );

      // Get metadata PDA
      const [metadataPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('metadata'),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      );

      // Get associated token account address
      const associatedTokenAddress = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        wallet.publicKey
      );

      // Create associated token account instruction
      const createAssociatedTokenAccountIx = createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        associatedTokenAddress,
        wallet.publicKey,
        mintKeypair.publicKey
      );

      // Create mint to instruction
      const mintToInstruction = createMintToInstruction(
        mintKeypair.publicKey,
        associatedTokenAddress,
        wallet.publicKey,
        1
      );

      // Metadata for the token
      const tokenMetadata = {
        name: nftData.name,
        symbol: nftData.symbol,
        uri: nftData.uri,
        sellerFeeBasisPoints: nftData.sellerFeeBasisPoints,
        creators: [{
          address: wallet.publicKey,
          verified: false,
          share: 100,
        }],
        collection: null,
        uses: null,
      } as DataV2;

      // Create metadata instruction
      const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
        {
          metadata: metadataPDA,
          mint: mintKeypair.publicKey,
          mintAuthority: wallet.publicKey,
          payer: wallet.publicKey,
          updateAuthority: wallet.publicKey,
        },
        {
          createMetadataAccountArgsV3: {
            data: tokenMetadata,
            isMutable: true,
            collectionDetails: null,
          },
        }
      );

      const transaction = new Transaction();
      transaction.add(createAccountInstruction);
      transaction.add(initializeMintInstruction);
      transaction.add(createMetadataInstruction);
      transaction.add(createAssociatedTokenAccountIx);
      transaction.add(mintToInstruction);

      // Get recent blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      try {
        // Sign transaction
        const signedTx = await wallet.signTransaction(transaction);
        signedTx.partialSign(mintKeypair);

        console.log('Sending transaction...');

        // Send transaction with confirmation
        const signature = await connection.sendRawTransaction(signedTx.serialize(), {
          skipPreflight: false,
          preflightCommitment: 'confirmed',
          maxRetries: 5
        });

        console.log('Transaction sent:', signature);
        
        // Wait for confirmation
        const confirmation = await connection.confirmTransaction({
          signature,
          blockhash,
          lastValidBlockHeight
        });

        if (confirmation.value.err) {
          throw new Error(`Transaction failed: ${confirmation.value.err}`);
        }

        console.log('Transaction confirmed:', confirmation);
        setMintAddress(mintKeypair.publicKey.toBase58());
        alert('NFT minted successfully!');

      } catch (error) {
        console.error('Transaction error:', error);
        throw error;
      }

    } catch (error) {
      console.error('Error minting NFT:', error);
      if (error instanceof Error) {
        alert(`Failed to mint NFT: ${error.message}`);
      } else {
        alert('Failed to mint NFT. Please try again.');
      }
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="mint-container">
     
      
      <div className="wallet-buttons">
        <WalletMultiButton />
        {wallet.connected && (
          <button
            onClick={() => wallet.disconnect()}
            className="disconnect-button"
          >
            Disconnect
          </button>
        )}
      </div>
      
      {wallet.connected && (
        <button
          onClick={handleMint}
          disabled={isMinting}
          className="mint-button"
        >
          {isMinting ? 'Minting...' : 'Mint NFT'}
        </button>
      )}

      {mintAddress && (
        <div className="mint-result">
          <p>NFT Minted!</p>
          <p>Mint Address: {mintAddress}</p>
          <a 
            href={`https://eclipsescan.xyz/account/${mintAddress}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Eclipse Explorer
          </a>
        </div>
      )}
    </div>
  );
}; 