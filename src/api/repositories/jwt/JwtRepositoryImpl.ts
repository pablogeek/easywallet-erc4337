import { JwtPayLoad } from "../../models/JwtPayload";
import { JwtRepository } from "./JwtRepository";
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export class JwtRepositoryImpl implements JwtRepository {
    verifyToken(token: string): JwtPayLoad | null {
        try {
            const secretKey = process.env.JWT_SECRET_KEY!;
            return jwt.verify(token, secretKey) as JwtPayLoad;
        } catch (error) {
            console.error("Token verification failed:", error);
            return null;
        }
    }
    generateToken(payload: JwtPayLoad): string {
        const secretKey = process.env.JWT_SECRET_KEY!
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // token expires in 1 hour
        return token;
    }
}