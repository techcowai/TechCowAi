# Eclipse NFT Collection Technical Guide

## Project Structure
```
EclipseNft/
├── src/
│   ├── components/
│   │   └── MintNFT.tsx       # Main NFT minting component
│   ├── assets/
│   │   ├── nfts/             # NFT image files (0.jpg to 4.jpg)
│   │   └── metadata/         # NFT metadata files (0.json to 4.json)
│   ├── scripts/
│   │   └── upload-to-pinata.ts # Script for uploading to Pinata
│   └── App.tsx               # Main app component with wallet providers
```

## Technical Details

### NFT Collection Setup
1. **Image Requirements**:
   - Place NFT images in `assets/nfts/` directory
   - Name format: `0.jpg`, `1.jpg`, etc.
   - Recommended size: 500x500px or larger

2. **Metadata Structure** (`assets/metadata/[0-4].json`):
```json
{
  "name": "TechCow AI #0",
  "description": "Collection description",
  "image": "TO_BE_UPDATED_BY_SCRIPT",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Trait Value"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "TO_BE_UPDATED_BY_SCRIPT",
        "type": "image/png"
      }
    ],
    "category": "image",
    "creators": [
      {
        "address": "YOUR_WALLET_ADDRESS",
        "share": 100
      }
    ]
  }
}
```

### Pinata Upload Process
1. Create `.env` file with Pinata credentials:
```
PINATA_API_KEY=your_api_key
PINATA_SECRET_KEY=your_secret_key
```

2. Run upload script:
```bash
npx ts-node scripts/upload-to-pinata.ts
```

3. Script will:
   - Upload all images from `assets/nfts/`
   - Update metadata files with IPFS URLs
   - Upload metadata files
   - Output all IPFS hashes

### NFT Minting Component
- Located in `src/components/MintNFT.tsx`
- Uses `@solana/spl-token` v0.3.8
- Uses `@metaplex-foundation/mpl-token-metadata` v2.13.0

### Key Configuration in App.tsx
1. Update METADATA_URLS array with new metadata IPFS URLs
2. Configure NFT collection details:
```typescript
const nftData = {
  name: "Collection Name",
  symbol: "SYMBOL",
  uri: METADATA_URLS[0],
  sellerFeeBasisPoints: 500 // 5% royalty
};
```

## Dependencies
Required packages:
```json
{
  "@solana/spl-token": "0.3.8",
  "@metaplex-foundation/mpl-token-metadata": "2.13.0",
  "@solana/web3.js": "^1.87.6",
  "@solana/wallet-adapter-react": "^0.15.35",
  "@solana/wallet-adapter-react-ui": "^0.9.34"
}
```

## Minting Process
1. Generates new mint keypair
2. Creates mint account
3. Initializes mint
4. Creates metadata PDA
5. Creates Associated Token Account (ATA)
6. Mints one token to user's ATA
7. Links metadata to the token

## Important Notes
- Uses Eclipse Mainnet RPC endpoint
- Metadata is immutable once uploaded to IPFS
- Each NFT is minted as a unique token
- Supports wallet connection via Phantom and other Solana wallets
- Transaction fees are paid by the minter
- Royalty fee is set to 5% (500 basis points)

## Common Issues
1. If Pinata upload fails:
   - Check API keys in .env
   - Verify image files exist in correct directory
   - Check file naming convention

2. If minting fails:
   - Ensure wallet has sufficient SOL
   - Check RPC endpoint connection
   - Verify metadata URLs in App.tsx

## For New Collections
1. Replace images in `assets/nfts/`
2. Update metadata files in `assets/metadata/`
3. Run Pinata upload script
4. Update METADATA_URLS in App.tsx
5. Update nftData configuration
6. Test mint process 