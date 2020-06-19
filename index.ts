const zero = BigInt(0)
const one = BigInt(1)

// http://graphics.stanford.edu/~seander/bithacks.html
export function popcnt(v: bigint) {
    let c = zero
    for (; v; c++) {
        v &= v - one; // clear the least significant bit set
    }
    return c
}

export function forwardmask(bits: bigint) {
    let masks: bigint[] = []
    for (let n = one; n < bits;){
        masks = masks.map(x => x | (x << n))
        masks.push((one << n) - one)
        n <<= one;
    }
    return masks
}

export function backwardmask(bits: bigint) {
    let mask = (one << bits) - one
    const fmask = mask
    let masks: bigint[] = []
    while (bits > 1) {
        bits >>= one
        mask = ((mask << bits) ^ mask) & fmask
        masks.push(mask)
    }
    masks = masks.reverse()
    return masks
}

// Generalization of htps://stackoverflow.com/a/9830282 (i.e. generalized naive hamming weight)
// Constant time (parallel) O(log2(bits))
// Long setup time, can be precalculated if we know the max bits
// bits = 2 ** n
// See https://blog.devdroplets.com/generalized-hamming-weight/
export function fastpopcnt(bits: bigint) {
    // Not worth the time generating masks
    if (bits <= BigInt(128)) return popcnt

    // Convert to power of 2 (e.g.) 118 -> 128, 24 -> 32
    let approx_bits = bits
    bits = one;
    while(approx_bits > bits) bits <<= one;

    // Initialize masks
    let masks = 
        backwardmask(bits)
        // forwardmask(bits)

    // Run constant-time popcnt
    return (v: bigint) => { 
        let bits = one
        for (const mask of masks) {
            v = (v & mask) + ((v & ~mask) >> bits)
            bits <<= one
        }
        return v
    }
}
