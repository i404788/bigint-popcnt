import {forwardmask, backwardmask, fastpopcnt} from "./index";

console.log('Popcnt benchmark')

// O(bits)
function popcnt(v: bigint) {
    let c = 0
    for (; v; c++) {
        v &= v - 1n; // clear the least significant bit set
    }
    return c
}

const samples = 100000
const sample = (1n << 2048n)-1n
let res = 0
let start = Date.now()
for (let i = 0; i < samples; i++) res = popcnt(sample)
let time = Date.now() - start
console.log(`popcnt: ${res}, samples: ${samples}, ${time}ms, ${samples / time}p/ms`)

start = Date.now()
const max_mask = 8192n
const _popcnt = fastpopcnt(max_mask)
for (let i = 0; i < samples; i++) res = Number(_popcnt(sample))
time = Date.now() - start
console.log(`fastpopcnt(${max_mask}b): ${res}, samples: ${samples}, ${time}ms, ${samples / time}p/ms`)

//console.log(forwardmask(64n).map(x => x.toString(2) + ' ' + x.toString(2).length))
