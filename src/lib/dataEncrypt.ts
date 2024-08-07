import crypto from "node:crypto";

/**
 * returns a random 24-character string
 */
export default function generateID() {
    const buffer = crypto.randomBytes(12);

    const hexString = buffer.toString("hex");

    const paddedString = hexString.padStart(24, "0");

    return Buffer.from(paddedString, "hex");
};