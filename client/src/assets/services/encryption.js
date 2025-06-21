import CryptoJS from "crypto-js";

const encryptionService = {
  // Generate a random encryption key
  generateKey: () => {
    return CryptoJS.lib.WordArray.random(32).toString();
  },

  // Generate a random IV (Initialization Vector)
  generateIV: () => {
    return CryptoJS.lib.WordArray.random(16).toString();
  },

  // Encrypt text using AES-GCM
  encryptText: (text, key, iv) => {
    const encrypted = CryptoJS.AES.encrypt(text, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString();
  },

  // Decrypt text using AES-GCM
  decryptText: (encryptedText, key, iv) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  },

  // Encrypt file data (returns Promise)
  encryptFile: (fileData, key, iv) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();

        reader.onload = (event) => {
          const arrayBuffer = event.target.result;
          const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

          const encrypted = CryptoJS.AES.encrypt(wordArray, key, {
            iv: CryptoJS.enc.Hex.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          });

          // Convert to blob
          const encryptedData = encrypted.toString();
          const blob = new Blob([encryptedData], {
            type: "application/octet-stream",
          });

          resolve({
            blob,
            iv,
          });
        };

        reader.onerror = (error) => {
          reject(error);
        };

        reader.readAsArrayBuffer(fileData);
      } catch (error) {
        reject(error);
      }
    });
  },

  // Decrypt file data (returns Promise)
  decryptFile: (encryptedData, key, iv) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();

        reader.onload = (event) => {
          const encryptedText = event.target.result;

          const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
            iv: CryptoJS.enc.Hex.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          });

          // Convert to ArrayBuffer
          const wordArray = decrypted;
          const arrayBuffer = wordArrayToArrayBuffer(wordArray);

          // Create a Blob from the ArrayBuffer
          const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });

          resolve(blob);
        };

        reader.onerror = (error) => {
          reject(error);
        };

        reader.readAsText(encryptedData);
      } catch (error) {
        reject(error);
      }
    });
  },
};

// Helper function to convert WordArray to ArrayBuffer
function wordArrayToArrayBuffer(wordArray) {
  const byteArray = [];
  for (let i = 0; i < wordArray.sigBytes; i++) {
    byteArray.push(
      (wordArray.words[Math.floor(i / 4)] >> (8 * (3 - (i % 4)))) & 0xff
    );
  }
  return new Uint8Array(byteArray).buffer;
}

export default encryptionService;
