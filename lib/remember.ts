import CryptoJS from "crypto-js";

const STORAGE_KEY = "REMEMBERED_CREDENTIALS";
const SECRET_KEY = "SECRET_KEY_REMEMBERED_CREDENTIALS_FGPU";

// 🔒 Encrypt text
export const encrypt = (text: string): string => {
  try {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  } catch (err) {
    console.error("Encryption failed:", err);
    return "";
  }
};

// 🔓 Decrypt text
export const decrypt = (cipher: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
    const result = bytes.toString(CryptoJS.enc.Utf8);
    if (!result) throw new Error("Invalid decryption result");
    return result;
  } catch (err) {
    console.error("Decryption failed:", err);
    return "";
  }
};

// 💾 Save credentials (email → password mapping)
export const saveCredential = (email: string, password: string) => {
  try {
    const encrypted = localStorage.getItem(STORAGE_KEY);
    let credentials: Record<string, string> = {};

    if (encrypted) {
      try {
        credentials = JSON.parse(decrypt(encrypted)) || {};
      } catch (err) {
        console.error("Failed to parse stored credentials:", err);
        credentials = {};
      }
    }

    credentials[email] = password; // add/update
    localStorage.setItem(STORAGE_KEY, encrypt(JSON.stringify(credentials)));
  } catch (err) {
    console.error("Failed to save credentials:", err);
  }
};

// 🔍 Get saved password for email
export const getPasswordForEmail = (email: string): string | null => {
  try {
    const encrypted = localStorage.getItem(STORAGE_KEY);
    if (!encrypted) return null;

    const decrypted = decrypt(encrypted);
    if (!decrypted) return null;

    const credentials = JSON.parse(decrypted) as Record<string, string>;
    return credentials[email] || null;
  } catch (err) {
    console.error("Failed to retrieve password:", err);
    return null;
  }
};

// 🗑️ Remove credentials for one email
export const removeCredential = (email: string) => {
  try {
    const encrypted = localStorage.getItem(STORAGE_KEY);
    if (!encrypted) return;

    const decrypted = decrypt(encrypted);
    if (!decrypted) return;

    const credentials = JSON.parse(decrypted) as Record<string, string>;
    if (credentials[email]) {
      delete credentials[email];
      localStorage.setItem(STORAGE_KEY, encrypt(JSON.stringify(credentials)));
    }
  } catch (err) {
    console.error("Failed to remove credential:", err);
  }
};
