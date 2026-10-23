import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function Hash(text) {
    return await bcrypt.hash(text, SALT_ROUNDS);
}

export async function Comparee(text, hashedText) {
    return await bcrypt.compare(text, hashedText);
}