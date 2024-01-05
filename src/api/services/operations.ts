import { ethers } from "ethers";
import { Client, Presets } from "userop";
import config from "../../../config.json";
import crypto from "crypto";
import { UserRepository } from "../repositories/users/UsersRepository";
import { UserRepositoryImpl } from "../repositories/users/UsersRepositoryImpl";
import db from "../database/database"

export class OperationsService {
    saltSelected: string | undefined
    private userRepository: UserRepository

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    send = async (address: string, amount: string, username: string, password: string) => {
        // config.signingKey
        /*const user = await this.userRepository.userByEmail(email);
        console.log('login ' + email);
        if (user === undefined) {
            throw "user doesn't exist";
        }
        
        const signingKey = '0x' + crypto.pbkdf2Sync(password, user!.salt, 10000, 32, "sha512").toString('hex');
        console.log(signingKey);
        console.log(config.signingKey);
        const simpleAccount = await Presets.Builder.SimpleAccount.init(
            new ethers.Wallet(signingKey),
            config.rpcUrl
          );
        const address = simpleAccount.getSender();
        return address*/

        const client = await Client.init(config.rpcUrl, {
            overrideBundlerRpc: undefined,
          });

        const user = await this.userRepository.userByEmail(username);
        console.log('login ' + username);
        if (user === undefined) {
            throw "user doesn't exist";
        }
        
        const signingKey = '0x' + crypto.pbkdf2Sync(password, user!.salt, 10000, 32, "sha512").toString('hex');

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

export default new OperationsService(new UserRepositoryImpl(db))