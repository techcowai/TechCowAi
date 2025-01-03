import * as fs from 'fs';
import * as path from 'path';
import pinataSDK from '@pinata/sdk';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Pinata client with API keys from environment variables
const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_KEY
);

async function uploadToPinata() {
  try {
    // Upload images first
    const nftsDir = path.join(__dirname, '../assets/nfts');
    const files = fs.readdirSync(nftsDir);
    
    for (const file of files) {
      if (!file.endsWith('.jpg')) continue;
      
      const filePath = path.join(nftsDir, file);
      const readableStreamForFile = fs.createReadStream(filePath);
      
      const options = {
        pinataMetadata: {
          name: `TechCow AI #${file.split('.')[0]}`,
        },
      };
      
      console.log(`Uploading ${file} to Pinata...`);
      const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
      console.log(`Uploaded ${file}. IPFS hash: ${result.IpfsHash}`);
      
      // Update metadata with IPFS URL
      const metadataPath = path.join(__dirname, '../assets/metadata', `${file.split('.')[0]}.json`);
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      
      metadata.image = `ipfs://${result.IpfsHash}`;
      metadata.properties.files[0].uri = `ipfs://${result.IpfsHash}`;
      
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
      console.log(`Updated metadata for ${file}`);
    }
    
    // Upload metadata files
    const metadataDir = path.join(__dirname, '../assets/metadata');
    const metadataFiles = fs.readdirSync(metadataDir);
    
    for (const file of metadataFiles) {
      if (!file.endsWith('.json')) continue;
      
      const filePath = path.join(metadataDir, file);
      const readableStreamForFile = fs.createReadStream(filePath);
      
      const options = {
        pinataMetadata: {
          name: `TechCow AI #${file.split('.')[0]} Metadata`,
        },
      };
      
      console.log(`Uploading metadata ${file} to Pinata...`);
      const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
      console.log(`Uploaded metadata ${file}. IPFS hash: ${result.IpfsHash}`);
    }
    
    console.log('All files uploaded successfully!');
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
  }
}

uploadToPinata(); 