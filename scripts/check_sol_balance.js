const { getSolConnection, getSolPublicKey } = require('../utils/sol-utils');
const solConfig = require('../config/sol-config');

async function checkSolBalance() {
    const solanaRpcUrl = 'https://api.mainnet-beta.solana.com';
    const connection = getSolConnection(solanaRpcUrl);
    const recipientAddress = 'recipient_solana_address';
    const publicKey = getSolPublicKey(recipientAddress);

    const balance = await connection.getTokenAccountsByOwner(publicKey, {
        mint: getSolPublicKey(solConfig.usdcAddress),
    });

    if (balance.value.length > 0) {
        console.log('USDC Balance:', balance.value[0].account.data.parsed.info.tokenAmount.uiAmount);
    } else {
        console.log('No USDC found in the wallet.');
    }
}

checkSolBalance().catch(console.error);
