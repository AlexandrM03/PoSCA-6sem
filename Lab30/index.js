const express = require('express');
const app = express();
const fs = require('fs');

app.use('/', express.static('.'));

const wasmCode = fs.readFileSync('./functions.wasm');
const wasmImport = {};
const wasmModule = new WebAssembly.Module(wasmCode);
const wasmInstance = new WebAssembly.Instance(wasmModule, wasmImport);

app.get('/', (req, res) => {
    res.type('html').send(
        `sum(5, 6) = ${wasmInstance.exports.sum(5, 6)}<br>` +
        `mul(5, 6) = ${wasmInstance.exports.mul(5, 6)}<br>` +
        `sub(5, 6) = ${wasmInstance.exports.sub(5, 6)}<br>`
    );
});

app.listen(3000, () => {
    console.log('Server started at http://localhost:3000')
});