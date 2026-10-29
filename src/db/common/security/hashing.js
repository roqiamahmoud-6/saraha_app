import bcrypt from "bcrypt";
import { salt_or_round } from "../../../../env/config.service.js";

const SALT_ROUNDS = salt_or_round;

export async function Hash(text) {
    return await bcrypt.hash(text, SALT_ROUNDS);
}

export async function Comparee(text, hashedText) {
    return await bcrypt.compare(text, hashedText);
}