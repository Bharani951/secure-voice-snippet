import { useState } from "react";
import CryptoJS from "crypto-js";

const useEncryption = () => {
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [error, setError] = useState(null);

  // Generate a random key for encryption
  const generateKey = () => {
    const key = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
    setEncryptionKey(key);
    return key;
  };

  // Use existing key
  const useKey = (key) => {
    setEncryptionKey(key);
  };

  // Generate IV (Initialization Vector)
  const generateIV = () => {
    return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
  };

  // Encrypt text data
  const encryptText = (text, key = encryptionKey) => {
    try {
      setError(null);
      if (!key) {
        key = generateKey();
      }

      const iv = generateIV();
      const encrypted = CryptoJS.AES.encrypt(text, key, {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      return {
        encryptedData: encrypted.toString(),
        iv,
        key,
      };
    } catch (err) {
      setError("Encryption failed: " + err.message);
      throw err;
    }
  };

  // Decrypt text data
  const decryptText = (encryptedText, key = encryptionKey, iv) => {
    try {
      setError(null);
      if (!key) {
        throw new Error("Encryption key is required for decryption");
      }

      const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (err) {
      setError("Decryption failed: " + err.message);
      throw err;
    }
  };

  // Encrypt audio blob data
  const encryptData = async (data) => {
    return new Promise((resolve, reject) => {
      try {
        setError(null);
        const key = encryptionKey || generateKey();
        const iv = generateIV();

        // Read the blob as array buffer
        const reader = new FileReader();
        reader.onload = (event) => {
          const arrayBuffer = event.target.result;
          // Convert to word array for CryptoJS
          const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

          // Encrypt
          const encrypted = CryptoJS.AES.encrypt(wordArray, key, {
            iv: CryptoJS.enc.Hex.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          });

          // Convert to blob for upload
          const encryptedBlob = new Blob([encrypted.toString()], {
            type: "application/octet-stream",
          });

          resolve({
            encryptedData: encryptedBlob,
            iv,
            key,
            authTag: "CBC-mode", // Placeholder for auth tag (CBC doesn't use auth tags)
          });
        };

        reader.onerror = (error) => {
          setError("Failed to read file: " + error);
          reject(error);
        };

        reader.readAsArrayBuffer(data);
      } catch (err) {
        setError("Encryption failed: " + err.message);
        reject(err);
      }
    });
  };

  // Decrypt audio blob data
  const decryptData = async (encryptedData, key = encryptionKey, iv) => {
    return new Promise((resolve, reject) => {
      try {
        setError(null);
        if (!key) {
          throw new Error("Encryption key is required for decryption");
        }

        // Read the blob as text
        const reader = new FileReader();
        reader.onload = (event) => {
          const encryptedText = event.target.result;

          // Decrypt
          const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
            iv: CryptoJS.enc.Hex.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          });

          // Convert to array buffer
          const arrayBuffer = wordArrayToArrayBuffer(decrypted);

          // Create a blob from the array buffer
          const decryptedBlob = new Blob([arrayBuffer], { type: "audio/mpeg" });

          resolve(decryptedBlob);
        };

        reader.onerror = (error) => {
          setError("Failed to read encrypted file: " + error);
          reject(error);
        };

        reader.readAsText(encryptedData);
      } catch (err) {
        setError("Decryption failed: " + err.message);
        reject(err);
      }
    });
  };

  // Helper function to convert WordArray to ArrayBuffer
  const wordArrayToArrayBuffer = (wordArray) => {
    const length = wordArray.sigBytes;
    const arrayBuffer = new ArrayBuffer(length);
    const dataView = new DataView(arrayBuffer);

    for (let i = 0; i < length; i++) {
      dataView.setUint8(
        i,
        (wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
      );
    }

    return arrayBuffer;
  };

  return {
    encryptionKey,
    error,
    generateKey,
    useKey,
    encryptText,
    decryptText,
    encryptData,
    decryptData,
  };
};

export default useEncryption;
