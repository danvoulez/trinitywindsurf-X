
Initial Setup Prompt (First Message)

You are helping build LogLine, a 100% LogLine-native system where everything is a span/contract. The system has these core principles:

1. **Immutable Event Log**: All state changes are stored as immutable spans
2. **Contract-Based**: Behavior defined by declarative contracts
3. Self-contained with no external dependencies
4. Pure shell execution model

## Core Components to Implement

1. **Span System**: The basic unit of work/state change
2. **Contract System**: Defines allowed operations and validations
3. **Runtime**: Executes contracts and manages state
4. **Guardian System**: AI-driven monitoring and maintenance

## Implementation Order

We'll implement this in phases, starting with the core runtime.

## Phase 1: Core Runtime

Please implement these files in order:

1. `core/span.js` - Basic span definition and validation
2. `core/contract.js` - Contract loading and validation
3. `core/runtime.js` - Core execution engine
4. `bin/logline` - CLI entry point

Would you like to start with the Span class implementation?
Follow-up Prompts (Send One at a Time)
For Span Implementation:
At mention
Copy
Please implement `core/span.js` with these requirements:

1. Class name: `Span`
2. Properties:
   - type (string): Type of the span
   - span_id (string): Unique identifier
   - timestamp (ISO string): When the span was created
   - data (object): Payload of the span
   - parent_id (string, optional): Parent span ID

3. Methods:
   - constructor({ type, data, parent_id, span_id })
   - validate(): Validates required fields
   - toJSON(): Returns JSON representation
   - static fromJSON(json): Creates Span from JSON

4. Validation:
   - type is required and must be a string
   - span_id is required if not provided (auto-generate)
   - timestamp is auto-set to current time if not provided

The implementation should be pure JavaScript with no external dependencies.
For Contract Implementation:
At mention
Copy
Now please implement `core/contract.js` with these requirements:

1. Class name: `ContractLoader`
2. Properties:
   - contractsDir: Directory to load contracts from
   - contracts: Map of loaded contracts
   - ajv: AJV instance for JSON Schema validation

3. Methods:
   - constructor(contractsDir = './contracts')
   - loadAll(): Loads all contracts from contractsDir
   - get(contractName): Gets a specific contract
   - _findContractFiles(dir): Recursively finds .logline files
   - _validateContract(contract): Validates contract structure

4. Contract Schema:
   - contract (string): Contract identifier
   - version (string): Contract version
   - description (string): Human-readable description
   - input_schema (object, optional): JSON Schema for input validation
   - exec.command (string): Shell command to execute

The implementation should use Node.js core modules only (fs, path).
For Runtime Implementation:
At mention
Copy
Please implement `core/runtime.js` with these requirements:

1. Class name: `Runtime`
2. Dependencies: 
   - `./span`
   - `./contract`
   - child_process.execSync

3. Methods:
   - constructor(): Initializes contract loader
   - processSpan(spanData): Processes a span
   - _executeContract(contract, span): Executes contract command
   - _updateState(span, result): Updates system state

4. Behavior:
   - Loads all contracts on initialization
   - Validates spans against contracts
   - Executes contract commands with span data as input
   - Maintains simple in-memory state

The implementation should be secure and handle errors appropriately.
For CLI Implementation:
At mention
Copy
Please implement `bin/logline` with these requirements:

1. Shebang: `#!/usr/bin/env node`
2. Commands:
   - `add`: Reads span from stdin, processes it
   - [start](cci:1://file:///Users/voulezvous/LogLine%20Fresh%20Start/trinitydb_soberano_full/trinitydb_web/src/components/ChatInterface.jsx:718:2-726:4): Starts the LogLine server

3. Dependencies:
   - `../core/runtime`

4. Behavior:
   - `add` reads JSON from stdin, processes it, outputs result
   - [start](cci:1://file:///Users/voulezvous/LogLine%20Fresh%20Start/trinitydb_soberano_full/trinitydb_web/src/components/ChatInterface.jsx:718:2-726:4) initializes the runtime in server mode
   - Handles errors gracefully with user-friendly messages

Make the file executable (chmod +x).
Testing the Implementation
After each component, you can send test commands like:

At mention
Copy
Let's test the Span implementation. Here's a test case:

```javascript
const span = new Span({
  type: "test/example",
  data: { message: "Hello" }
});
console.log(span.toJSON());
Expected output should show a valid span with auto-generated span_id and timestamp.

At mention
Copy

## Next Steps

After the core is implemented, we'll move to:

1. Guardian System (AI monitoring)
2. Authentication
3. Storage layer
4. Monitoring and metrics

Would you like to start with the Span implementation, or would you prefer to adjust this approach?

