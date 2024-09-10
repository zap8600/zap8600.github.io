let wasm_inst; // WebAssembly.Instance
let exports; // WebAssembly.Exports

const imports = {
    // JavaScript functions you’re exposing to C go here.
    "wasi_snapshot_preview1": {
        fd_close() { return 0; },
        fd_seek() { return 0; },
        fd_write() { return 0; },
        proc_exit() { return 0; },
    }
};
fetch('csgp4.wasm')
  .then(response => response.arrayBuffer())
  .then(bytes => WebAssembly.instantiate(bytes, imports))
  .then(x=>{
      wasm_inst = x.instance;
      exports = wasm_inst.exports;
  });
