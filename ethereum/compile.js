const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'blockchain.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

var input = {
  language: 'Solidity',
  sources: {
    'background.sol': {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

fs.ensureDirSync(buildPath);

for (var contractName in output.contracts['background.sol']) {
  fs.outputJsonSync(
    path.resolve(buildPath, contractName.replace(':', '') + '.json'),
    output.contracts['background.sol'][contractName]
  );
  //     output.contracts['background.sol'][contractName].evm.bytecode.object
}

