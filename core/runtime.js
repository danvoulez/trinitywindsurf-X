const fs = require('fs');
const path = require('path');
const Span = require('./span');
const ContractLoader = require('./contract');
const { execSync } = require('child_process');

class Runtime {
  constructor() {
    this.contractLoader = new ContractLoader();
    this.contractLoader.loadAll();
    this.state = {};

    this.spanDir = path.resolve(__dirname, '..', 'spans');
    this.spanFile = path.join(this.spanDir, 'logline.main.jsonl');
    this._loadSpans();
  }

  _loadSpans() {
    if (!fs.existsSync(this.spanFile)) return;
    const content = fs.readFileSync(this.spanFile, 'utf8').trim();
    if (!content) return;
    for (const line of content.split('\n')) {
      if (!line.trim()) continue;
      try {
        const span = Span.fromJSON(line);
        this._updateState(span, null);
      } catch (_) {
        // ignore bad lines
      }
    }
  }

  processSpan(spanData) {
    try {
      const span = spanData instanceof Span ? spanData : new Span(spanData);
      const contract = this.contractLoader.get(span.type);
      if (!contract) {
        throw new Error(`No contract found for span type: ${span.type}`);
      }
      const result = this._executeContract(contract, span);
      this._appendSpan(span);
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

  _appendSpan(span) {
    if (!fs.existsSync(this.spanDir)) {
      fs.mkdirSync(this.spanDir, { recursive: true });
    }
    fs.appendFileSync(this.spanFile, JSON.stringify(span.toJSON()) + '\n');
  }

  query(options = {}) {
    const { type, limit } = options;
    if (!fs.existsSync(this.spanFile)) return [];
    const lines = fs.readFileSync(this.spanFile, 'utf8').trim().split('\n');
    const results = [];
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const span = JSON.parse(line);
        if (!type || span.type === type) {
          results.push(span);
          if (limit && results.length >= limit) break;
        }
      } catch (_) {
        continue;
      }
    }
    return results;
  }

  getState() {
    return this.state;
  }
}

module.exports = Runtime;
