const fs = require('fs');
const path = require('path');

class ContractLoader {
  constructor(contractsDir = './contracts') {
    this.contractsDir = contractsDir;
    this.contracts = new Map();
    this.ajv = null; // placeholder for future JSON schema validation
  }

  loadAll() {
    const files = this._findContractFiles(this.contractsDir);
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const contract = JSON.parse(content);
      this._validateContract(contract);
      this.contracts.set(contract.contract, contract);
    }
  }

  get(contractName) {
    return this.contracts.get(contractName);
  }

  _findContractFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of list) {
      const res = path.resolve(dir, entry.name);
      if (entry.isDirectory()) {
        results = results.concat(this._findContractFiles(res));
      } else if (entry.isFile() && entry.name.endsWith('.logline')) {
        results.push(res);
      }
    }
    return results;
  }

  _validateContract(contract) {
    if (!contract.contract || typeof contract.contract !== 'string') {
      throw new Error('contract field must be a string');
    }
    if (!contract.version || typeof contract.version !== 'string') {
      throw new Error('version field must be a string');
    }
    if (!contract.description || typeof contract.description !== 'string') {
      throw new Error('description field must be a string');
    }
    if (!contract.exec || typeof contract.exec.command !== 'string') {
      throw new Error('exec.command is required');
    }
  }
}

module.exports = ContractLoader;
