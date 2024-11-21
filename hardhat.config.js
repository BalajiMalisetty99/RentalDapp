/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.27",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "0xe7b25b098219ef5e2c9f71806603bdb87fba31fdef9fd44867861475633b235f", // Private key 2
        "0x9e83d7e1e00e68fd87008d831bc810b702961f9c3c95993a3416772da5472b7b"  // Private key 1
      ],
    },
  },
};
