const { Connection, PublicKey } = require('@solana/web3.js');

const getSolConnection = (rpcUrl) => {
    return new Connection(rpcUrl, 'confirmed');
};

const getSolPublicKey = (address) => {
    return new PublicKey(address);
};

module.exports = {
    getSolConnection,
    getSolPublicKey,
};
