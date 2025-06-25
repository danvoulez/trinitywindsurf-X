class Span {
  constructor({ type, data = {}, parent_id = null, span_id = null, timestamp = null } = {}) {
    this.type = type;
    this.data = data;
    this.parent_id = parent_id || undefined;
    this.span_id = span_id || this._generateId();
    this.timestamp = timestamp || new Date().toISOString();
    this.validate();
  }

  _generateId() {
    // simple unique id using timestamp and random numbers
    return `span_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  validate() {
    if (!this.type || typeof this.type !== 'string') {
      throw new Error('Span type is required and must be a string');
    }
    if (!this.span_id || typeof this.span_id !== 'string') {
      throw new Error('span_id must be a string');
    }
    if (!this.timestamp) {
      throw new Error('timestamp is required');
    }
  }

  toJSON() {
    const obj = {
      type: this.type,
      span_id: this.span_id,
      timestamp: this.timestamp,
      data: this.data
    };
    if (this.parent_id) obj.parent_id = this.parent_id;
    return obj;
  }

  static fromJSON(json) {
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }
    return new Span(json);
  }
}

module.exports = Span;
