// http://graphics.stanford.edu/~seander/bithacks.html
export function popcnt(v: bigint) {
    let c = 0n
    for (; v; c++) {
        v &= v - 1n; // clear the least significant bit set
    }
    return c
}

export function forwardmask(bits: bigint) {
    let masks: bigint[] = []
    for (let n = 1n; n < bits;){
        masks = masks.map(x => x | (x << n))
        masks.push((1n << n) - 1n)
        n <<= 1n;
    }
    return masks
}

export function backwardmask(bits: bigint) {
    let mask = (1n << bits) - 1n
    const fmask = mask
    let masks: bigint[] = []
    while (bits > 1) {
        bits >>= 1n
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
    if (bits <= 128n) return popcnt

    // Convert to power of 2 (e.g.) 118 -> 128, 24 -> 32
    let approx_bits = bits
    bits = 1n;
    while(approx_bits > bits) bits <<= 1n;

    // Initialize masks
    let masks = 
        backwardmask(bits)
        // forwardmask(bits)

    // Run constant-time popcnt
    return (v: bigint) => { 
        let bits = 1n
        for (const mask of masks) {
            v = (v & mask) + ((v & ~mask) >> bits)
            bits <<= 1n
        }
        return v
    }
}
