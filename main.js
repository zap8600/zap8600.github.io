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
        pow: Math.pow
    },
};
let blob = atob("AGFzbQEAAAABBAFgAAADAgEABAUBcAEBAQUDAQACBisHfwFBgIgEC38AQYAIC38AQYAIC38AQYAIC38AQYCIBAt/AEEAC38AQQELB3cIBm1lbW9yeQIAEV9fd2FzbV9jYWxsX2N0b3JzAAAMX19kc29faGFuZGxlAwEKX19kYXRhX2VuZAMCDV9fZ2xvYmFsX2Jhc2UDAwtfX2hlYXBfYmFzZQMEDV9fbWVtb3J5X2Jhc2UDBQxfX3RhYmxlX2Jhc2UDBgoEAQIACwAbBG5hbWUBFAEAEV9fd2FzbV9jYWxsX2N0b3JzAC8JcHJvZHVjZXJzAQxwcm9jZXNzZWQtYnkBBWNsYW5nDzEwLjAuMC00dWJ1bnR1MQ==")
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
