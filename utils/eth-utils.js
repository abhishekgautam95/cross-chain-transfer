const { ethers } = require('ethers');

const getEthProvider = (rpcUrl) => {
    return new ethers.providers.JsonRpcProvider(rpcUrl);
};

const getEthWallet = (privateKey, provider) => {
    return new ethers.Wallet(privateKey, provider);
};

module.exports = {
    getEthProvider,
    getEthWallet,
};
