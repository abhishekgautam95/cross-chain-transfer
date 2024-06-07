require('dotenv').config();
const axios = require('axios');
const { getEthProvider, getEthWallet } = require('../utils/eth-utils');
const { getSolConnection, getSolPublicKey } = require('../utils/sol-utils');
const ethConfig = require('../config/eth-config');
const solConfig = require('../config/sol-config');

const ethPrivateKey = process.env.ETH_PRIVATE_KEY;
const ethRpcUrl = process.env.ETH_RPC_URL;
const solPrivateKey = process.env.SOL_PRIVATE_KEY;
const solanaRpcUrl = 'https://api.mainnet-beta.solana.com';

// Debugging lines to check the environment variables
console.log(`ETH_PRIVATE_KEY: ${ethPrivateKey}`);
console.log(`ETH_RPC_URL: ${ethRpcUrl}`);
console.log(`SOL_PRIVATE_KEY: ${solPrivateKey}`);

async function transferUSDC() {
    // Ethereum setup
    const ethProvider = getEthProvider(ethRpcUrl);
    const ethWallet = getEthWallet(ethPrivateKey, ethProvider);
    const usdcContract = new ethers.Contract(ethConfig.usdcAddress, ['function transfer(address to, uint amount)'], ethWallet);

    // Solana setup
    const solConnection = getSolConnection(solanaRpcUrl);
    const solPublicKey = getSolPublicKey('recipient_solana_address');

    // Transfer USDC on Ethereum
    const amount = ethers.utils.parseUnits('1.0', 6); // Amount in USDC (6 decimals)
    const tx = await usdcContract.transfer(ethConfig.wormholeBridgeAddress, amount);
    await tx.wait();

    // Call Wormhole API to bridge the assets
    const response = await axios.post('https://api.wormholebridge.com/v1/transfer', {
        sourceChain: 'ethereum',
        targetChain: 'solana',
        asset: ethConfig.usdcAddress,
        amount: amount.toString(),
        recipient: solPublicKey.toString(),
    });

    if (response.data.success) {
        console.log('USDC transferred successfully to Solana!');
    } else {
        console.error('Error during transfer:', response.data.message);
    }
}

transferUSDC().catch(console.error);
