import crypto from 'crypto'

const IV_LENGTH = 16; // For AES, this is always 16

export class password {
    static encrypt(text: string, key: string) {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(
            "aes-256-cbc",
            Buffer.from(key, "hex"),
            iv
        );

        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return iv.toString("hex") + ":" + encrypted.toString("hex");
    }
    
    static decrypt(text: string, key: string): { result: string, isValid: boolean } {
        try {
            const parts = text.split(":");

            if (parts.length < 2) {
                throw new Error("Invalid encrypted text format");
            }

            const ivHex = parts.shift();

            if (!ivHex) {
                throw new Error("IV is missing");
            }

            const iv = Buffer.from(ivHex, "hex");
            const encryptedText = Buffer.from(parts.join(":"), "hex");

            const decipher = crypto.createDecipheriv(
                "aes-256-cbc",
                Buffer.from(key, "hex"),
                iv
            );

            const decrypted = Buffer.concat([
                decipher.update(encryptedText),
                decipher.final(),
            ]);

            const result = decrypted.toString("utf8");

            return {
                result,
                isValid: true
            }
        } catch (error) {
            return {
                result: '',
                isValid: false
            }
        }
    }

}