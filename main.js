let wasm_inst; // WebAssembly.Instance
let mem = new WebAssembly.Memory({initial:200});
let memview; // DataView
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
    env:{
        memory: mem,
        pow: Math.pow,
        "wasi_snapshot_preview1": {
            environ_sizes_get(){ return 0; },
            environ_get() { return 0; },
            proc_exit() { return 0; },
            fd_write() { return 0; },
        }
    },
};
let blob = atob("AGFzbQEAAAABLwhgA39/fwF/YAN/fn8BfmABfwF/YAR/fn9/AX9gBH9/f38Bf2ABfwBgAABgAAF/AokBBBZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAIWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQdmZF9zZWVrAAMWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF93cml0ZQAEFndhc2lfc25hcHNob3RfcHJldmlldzEJcHJvY19leGl0AAUDEhEGBgcCAwQFBgYHBgICAAABAQQFAXABBAQFAwEAAgYIAX8BQZCJBAsHEwIGbWVtb3J5AgAGX3N0YXJ0AAUJCQEAQQELAxASFAqxCRECAAtEAQF/AkACQEEAKAL0iICAAA0AQQBBATYC9IiAgAAQhICAgAAQhoCAgAAhABCMgICAACAADQEPCwAACyAAEIqAgIAAAAspAQV/I4CAgIAAIQBBECEBIAAgAWshAkEAIQMgAiADNgIMQQAhBCAEDwsPACAAEICAgIAAQf//A3ELFQAgACABIAIgAxCBgICAAEH//wNxCxUAIAAgASACIAMQgoCAgABB//8DcQsLACAAEIOAgIAAAAsCAAsOABCLgICAABCOgICAAAsIAEH8iICAAAuDAwEDfwJAEI2AgIAAKAIAIgBFDQADQAJAIAAoAhQgACgCGEYNACAAQQBBACAAKAIgEYCAgIAAABoLAkAgACgCBCIBIAAoAggiAkYNACAAIAEgAmusQQEgACgCJBGBgICAAAAaCyAAKAI0IgANAAsLAkBBACgCgImAgAAiAEUNAAJAIAAoAhQgACgCGEYNACAAQQBBACAAKAIgEYCAgIAAABoLIAAoAgQiASAAKAIIIgJGDQAgACABIAJrrEEBIAAoAiQRgYCAgAAAGgsCQEEAKAKAiYCAACIARQ0AAkAgACgCFCAAKAIYRg0AIABBAEEAIAAoAiARgICAgAAAGgsgACgCBCIBIAAoAggiAkYNACAAIAEgAmusQQEgACgCJBGBgICAAAAaCwJAQQAoAvCIgIAAIgBFDQACQCAAKAIUIAAoAhhGDQAgAEEAQQAgACgCIBGAgICAAAAaCyAAKAIEIgEgACgCCCICRg0AIAAgASACa6xBASAAKAIkEYGAgIAAABoLCyEAAkAgABCHgICAACIADQBBAA8LQQAgADYC+IiAgABBfwsNACAAKAI4EI+AgIAAC3EBAn8jgICAgABBEGsiAySAgICAAEF/IQQCQAJAIAJBf0oNAEEAQRw2AviIgIAADAELAkAgACABIAIgA0EMahCJgICAACICRQ0AQQAgAjYC+IiAgABBfyEEDAELIAMoAgwhBAsgA0EQaiSAgICAACAEC7sCAQd/I4CAgIAAQRBrIgMkgICAgAAgAyACNgIMIAMgATYCCCADIAAoAhgiATYCACADIAAoAhQgAWsiATYCBEECIQQCQAJAIAEgAmoiBSAAKAI4IANBAhCRgICAACIBRg0AIAMhBgNAAkAgAUF/Sg0AQQAhASAAQQA2AhggAEIANwMQIAAgACgCAEEgcjYCACAEQQJGDQMgAiAGKAIEayEBDAMLIAYgASAGKAIEIgdLIghBA3RqIgkgCSgCACABIAdBACAIG2siB2o2AgAgBkEMQQQgCBtqIgYgBigCACAHazYCACAJIQYgBSABayIFIAAoAjggCSAEIAhrIgQQkYCAgAAiAUcNAAsLIAAgACgCKCIBNgIYIAAgATYCFCAAIAEgACgCLGo2AhAgAiEBCyADQRBqJICAgIAAIAELZAEBfyOAgICAAEEQayIDJICAgIAAAkACQCAAIAEgAkH/AXEgA0EIahCIgICAACICRQ0AQQBBxgAgAiACQcwARhs2AviIgIAAQn8hAQwBCyADKQMIIQELIANBEGokgICAgAAgAQsRACAAKAI4IAEgAhCTgICAAAsLewEAQYAIC3QFAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAADAAAAjAQAAAAAAAAAAAAAAAAAAAIAAAAAAAAA/////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAC/AwRuYW1lAZkDFQAqX19pbXBvcnRlZF93YXNpX3NuYXBzaG90X3ByZXZpZXcxX2ZkX2Nsb3NlASlfX2ltcG9ydGVkX3dhc2lfc25hcHNob3RfcHJldmlldzFfZmRfc2VlawIqX19pbXBvcnRlZF93YXNpX3NuYXBzaG90X3ByZXZpZXcxX2ZkX3dyaXRlAytfX2ltcG9ydGVkX3dhc2lfc25hcHNob3RfcHJldmlldzFfcHJvY19leGl0BBFfX3dhc21fY2FsbF9jdG9ycwUGX3N0YXJ0Bg9fX29yaWdpbmFsX21haW4HD19fd2FzaV9mZF9jbG9zZQgOX193YXNpX2ZkX3NlZWsJD19fd2FzaV9mZF93cml0ZQoQX193YXNpX3Byb2NfZXhpdAsFZHVtbXkMEV9fd2FzbV9jYWxsX2R0b3JzDQpfX29mbF9sb2NrDgxfX3N0ZGlvX2V4aXQPBWNsb3NlEA1fX3N0ZGlvX2Nsb3NlEQZ3cml0ZXYSDV9fc3RkaW9fd3JpdGUTB19fbHNlZWsUDF9fc3RkaW9fc2VlawcSAQAPX19zdGFja19wb2ludGVyCQgBAAUuZGF0YQAmCXByb2R1Y2VycwEMcHJvY2Vzc2VkLWJ5AQVjbGFuZwYxNi4wLjAAOQ90YXJnZXRfZmVhdHVyZXMDKwtidWxrLW1lbW9yeSsPbXV0YWJsZS1nbG9iYWxzKwhzaWduLWV4dA==")
let array = new Uint8Array(new ArrayBuffer(blob.length));
for(let i = 0; i < blob.length; i++) array[i] = blob.charCodeAt(i);
WebAssembly.instantiate(array, imports).then(x=>{
    wasm_inst = x.instance;
    exports = wasm_inst.exports;
    const list = document.getElementById("list");
    for(var func in exports) {
        list.innerHTML += `<li><a href="#">${list.children.length + 1}: ${Object.keys(exports)[func]}</a></li>`;
    }
});
