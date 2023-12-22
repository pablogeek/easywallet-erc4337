import { ethers } from "ethers";
import { Presets } from "userop";
import config from "../../../config.json";
import crypto from "crypto"

export class LoginService {
    saltSelected: string | undefined

    login = async (username: string, password: string) => {
        // config.signingKey
        if (this.saltSelected === undefined) {
            const salt = this.generateSalt() 
            this.saltSelected = salt
        }
        const signingKey = '0x' + crypto.pbkdf2Sync(password, this.saltSelected, 10000, 32, "sha512").toString('hex');
        console.log(signingKey);
        console.log(config.signingKey);
        const simpleAccount = await Presets.Builder.SimpleAccount.init(
            new ethers.Wallet(signingKey),
            config.rpcUrl
          );
          const address = simpleAccount.getSender();
        return address
    }

    private generateSalt = (): string => {
        const salt = crypto.randomBytes(16).toString('hex');
        return salt;
    }
}

export default new LoginService()