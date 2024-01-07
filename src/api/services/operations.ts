import { ethers } from "ethers";
import { Client, Presets } from "userop";
import config from "../../../config.json";
import crypto from "crypto";
import { UserRepository } from "../repositories/users/UsersRepository";
import { UserRepositoryImpl } from "../repositories/users/UsersRepositoryImpl";
import { JwtRepository } from "../repositories/jwt/JwtRepository";
import { JwtRepositoryImpl } from "../repositories/jwt/JwtRepositoryImpl";
import db from "../database/database"

export class OperationsService {
    saltSelected: string | undefined
    private userRepository: UserRepository
    private jwtRepository: JwtRepository;

    constructor(userRepository: UserRepository, jwtRepository: JwtRepository) {
        this.userRepository = userRepository;
        this.jwtRepository = jwtRepository;
    }

    send = async (address: string, amount: string, key: string) => {
        const client = await Client.init(config.rpcUrl, {
            overrideBundlerRpc: undefined,
        });

        const payload = this.jwtRepository.verifyToken(key);

        if (payload === undefined) {
            throw "wrong auth key";
        }

        const user = await this.userRepository.userById(payload!.userId);
        console.log('login ' + payload!.userId);
        if (user === undefined) {
            throw "user doesn't exist";
        }
        
        const signingKey = '0x' + crypto.pbkdf2Sync(user!.password, user!.salt, 10000, 32, "sha512").toString('hex');
        const target = ethers.utils.getAddress(address);
        const value = ethers.utils.parseEther(amount);

        const simpleAccount = await Presets.Builder.SimpleAccount.init(
            new ethers.Wallet(signingKey),
            config.rpcUrl
        );

        const res = await client.sendUserOperation(
          simpleAccount.execute(target, value, "0x"),
          {
            dryRun: false,
            onBuild: (op) => console.log("Signed UserOperation:", op),
          }
        );
        console.log(`UserOpHash: ${res.userOpHash}`);
      
        console.log("Waiting for transaction...");
        const ev = await res.wait();
        console.log(`Transaction hash: ${ev?.transactionHash ?? null} event: ${ev}`);
    }
}

export default new OperationsService(new UserRepositoryImpl(db), new JwtRepositoryImpl())