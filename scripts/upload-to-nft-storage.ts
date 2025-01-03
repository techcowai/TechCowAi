import { NFTStorage, File } from 'nft.storage';
import fs from 'fs';
import path from 'path';
import mime from 'mime';

const NFT_STORAGE_KEY = 'cc293087.5896da8824f44ff0b29f4a461b739ed0';

async function uploadToNFTStorage() {
    try {
        const client = new NFTStorage({ token: NFT_STORAGE_KEY });

        // Görselleri yükle
        const imageUrls: string[] = [];
        for (let i = 0; i < 5; i++) {
            const imageData = fs.readFileSync(`assets/nfts/${i}.jpg`);
            const imageFile = new File([imageData], `${i}.jpg`, { type: 'image/jpeg' });
            const imageCid = await client.storeBlob(imageFile);
            const imageUrl = `https://ipfs.io/ipfs/${imageCid}`;
            imageUrls.push(imageUrl);
            console.log(`Image ${i} uploaded: ${imageUrl}`);
        }

        // Metadata'ları güncelle ve yükle
        for (let i = 0; i < 5; i++) {
            const metadata = JSON.parse(fs.readFileSync(`assets/metadata/${i}.json`).toString());
            metadata.image = imageUrls[i];
            metadata.properties.files[0].uri = imageUrls[i];

            const metadataFile = new File(
                [JSON.stringify(metadata, null, 2)],
                `${i}.json`,
                { type: 'application/json' }
            );

            const metadataCid = await client.storeBlob(metadataFile);
            const metadataUrl = `https://ipfs.io/ipfs/${metadataCid}`;
            console.log(`Metadata ${i} uploaded: ${metadataUrl}`);

            // Metadata URL'ini kaydet
            fs.writeFileSync(
                `assets/metadata/${i}.json`,
                JSON.stringify({ ...metadata, uri: metadataUrl }, null, 2)
            );
        }

        console.log('Upload completed successfully!');
    } catch (error) {
        console.error('Error uploading to NFT.Storage:', error);
    }
}

uploadToNFTStorage(); 