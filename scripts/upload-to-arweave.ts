import Arweave from 'arweave';
import fs from 'fs';
import path from 'path';

// Arweave instance oluştur
const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
});

async function uploadToArweave() {
    try {
        // JWK dosyasını oku
        const jwk = JSON.parse(fs.readFileSync('arweave-key.json').toString());

        // Görselleri yükle
        const imageUrls: string[] = [];
        for (let i = 0; i < 5; i++) {
            const imageData = fs.readFileSync(`nfts/${i}.png`);
            const transaction = await arweave.createTransaction({ data: imageData }, jwk);
            transaction.addTag('Content-Type', 'image/png');
            
            await arweave.transactions.sign(transaction, jwk);
            await arweave.transactions.post(transaction);
            
            const imageUrl = `https://arweave.net/${transaction.id}`;
            imageUrls.push(imageUrl);
            console.log(`Image ${i} uploaded: ${imageUrl}`);
        }

        // Metadata'ları güncelle ve yükle
        for (let i = 0; i < 5; i++) {
            const metadata = JSON.parse(fs.readFileSync(`assets/metadata/${i}.json`).toString());
            metadata.image = imageUrls[i];
            metadata.properties.files[0].uri = imageUrls[i];

            const metadataStr = JSON.stringify(metadata, null, 2);
            const transaction = await arweave.createTransaction({ data: metadataStr }, jwk);
            transaction.addTag('Content-Type', 'application/json');
            
            await arweave.transactions.sign(transaction, jwk);
            await arweave.transactions.post(transaction);
            
            const metadataUrl = `https://arweave.net/${transaction.id}`;
            console.log(`Metadata ${i} uploaded: ${metadataUrl}`);

            // Metadata URL'ini kaydet
            fs.writeFileSync(
                `assets/metadata/${i}.json`,
                JSON.stringify({ ...metadata, uri: metadataUrl }, null, 2)
            );
        }

        console.log('Upload completed successfully!');
    } catch (error) {
        console.error('Error uploading to Arweave:', error);
    }
}

uploadToArweave(); 