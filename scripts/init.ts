import fs from "fs/promises";
import path from "path";
import prettier from "prettier";
import { ethers } from "ethers";
import { Presets } from "userop";

const INIT_CONFIG = {
  rpcUrl: "https://polygon-mumbai.g.alchemy.com/v2/C_uL5mQ5cklmTwpR9UXrDhnTe9YTCKgt",
  signingKey: new ethers.Wallet(ethers.utils.randomBytes(32)).privateKey,
  secp256r1Key: Presets.Signers.BarzSecp256r1.generatePrivateKey(),
  paymaster: {
    rpcUrl: "https://api.stackup.sh/v1/paymaster/API_KEY",
    context: {},
  },
};
const CONFIG_PATH = path.resolve(__dirname, "../config.json");

async function main() {
  return fs.writeFile(
    CONFIG_PATH,
    prettier.format(JSON.stringify(INIT_CONFIG, null, 2), { parser: "json" })
  );
}

main()
  .then(() => console.log(`Config written to ${CONFIG_PATH}`))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
