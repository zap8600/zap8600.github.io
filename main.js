let wasm_inst; // WebAssembly.Instance
let exports; // WebAssembly.Exports
const decoder = new TextDecoder();
const encoder = new TextEncoder();

function wasm_string_to_js(p, len){
    const sub = mem.subarray(p, p+len);
    const text = decoder.decode(sub);
    return text;
}
function write4(p, val){
    memview.setInt32(p, val, true);
}
function js_string_to_wasm(s){
    const encoded = encoder.encode(s);
    const p = exports.malloc(encoded.length+4);
    write4(p, encoded.length);
    mem.set(encoded, p+4);
    return p;
}
const imports = {
    // JavaScript functions you’re exposing to C go here.
    "wasi_snapshot_preview1": {
        environ_sizes_get() { return 0; },
        environ_get() { return 0; },
        proc_exit() { return 0; },
        fd_write() { return 0; },
        fd_close() { return 0; },
        fd_seek() { return 0; },
        args_get() { return 0; },
        args_sizes_get() { return 0; },
        clock_res_get() { return 0; },
        clock_time_get() { return 0; },
        fd_advise() { return 0; },
        fd_allocate() { return 0; },
        fd_datasync() { return 0; },
    }
};
fetch('csgp4.wasm')
  .then(response => response.arrayBuffer())
  .then(bytes => WebAssembly.instantiate(bytes, imports))
  .then(x=>{
      wasm_inst = x.instance;
      exports = wasm_inst.exports;
  });
