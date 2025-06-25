const Span = require('./span');
const ContractLoader = require('./contract');
const { execSync } = require('child_process');

class Runtime {
  constructor() {
    this.contractLoader = new ContractLoader();
    this.contractLoader.loadAll();
    this.state = {};
  }

  processSpan(spanData) {
    try {
      const span = spanData instanceof Span ? spanData : new Span(spanData);
      const contract = this.contractLoader.get(span.type);
      if (!contract) {
        throw new Error(`No contract found for span type: ${span.type}`);
      }
      const result = this._executeContract(contract, span);
      this._updateState(span, result);
      return { span: span.toJSON(), result };
    } catch (err) {
      return { error: err.message };
    }
  }

  _executeContract(contract, span) {
    const env = { ...process.env, SPAN: JSON.stringify(span.toJSON()) };
    try {
      const output = execSync(contract.exec.command, { env, stdio: ['ignore', 'pipe', 'pipe'] });
      return output.toString().trim();
    } catch (err) {
      throw new Error(`Contract execution failed: ${err.message}`);
    }
  }

  _updateState(span, result) {
    // simple in-memory state keyed by span type
    if (!this.state[span.type]) {
      this.state[span.type] = [];
    }
    this.state[span.type].push({ span: span.toJSON(), result });
  }
}

module.exports = Runtime;
