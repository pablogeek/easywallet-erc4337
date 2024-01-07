import { JwtPayLoad } from "../../models/JwtPayload"

export interface JwtRepository {
    verifyToken(jwtToken: string): JwtPayLoad | null
    generateToken(payload: JwtPayLoad): string
}