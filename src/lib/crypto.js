// src/lib/crypto.js
import crypto from 'crypto';

// CLAVE SECRETA: En producción iría en .env, para tu demo úsala aquí.
// Debe tener 32 caracteres exactos para aes-256-cbc
const ENCRYPTION_KEY = 'auditoria-seguridad-2025-clave!!'; 
const IV_LENGTH = 16; // Para AES, siempre es 16

/**
 * Encripta un texto
 */
export function encrypt(text) {
  if (!text) return text;
  // Generar un vector de inicialización aleatorio
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  // Retornamos IV:TextoCifrado para poder desencriptar luego
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * Desencripta un texto
 */
export function decrypt(text) {
  if (!text) return text;
  // Si el texto no tiene el formato iv:content, asumimos que no está cifrado (legacy data)
  const textParts = text.split(':');
  if (textParts.length < 2) return text; 

  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    // Si falla (por clave incorrecta o datos corruptos), devolvemos el original
    return text;
  }
}