/**
 * function from http://stackoverflow.com/a/6274381
 *
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

function csrByte(randomness) {
    var out = 0;
    if (randomness.random_index < randomness.maxlen){
        out = randomness.randomness[randomness.random_index];
        randomness.random_index++;
    } else {
        out = randomness.randomness[Math.floor(Math.random() * randomness.randomness.length)];
    }
    return out;
}

function goodRandomByte(randomness, b) {
    var out = 0;
    while ((out == 0) || (b == out))
        out = csrByte(randomness);
    return out;
}

function createSplit(randomness, b, amount) {
    var out = new Array(amount);
    var sR  = 0;
    for (j = 0; j < amount - 2; j++) {
        r   = goodRandomByte(randomness, b);
        sR  += r;
        sR  %= 256;
        out[j] = r;
    }
    var sr  = goodRandomByte(randomness, b);
    out[amount-2] = (256 + sr - sR) % 256;
    out[amount-1] = (256 - sr + b) % 256;
    shuffle(out);
    return out;
}

onmessage = function (event) {
    var bytes = event.data.bytes;
    var randomness = {
        "randomness": event.data.randomness,
        "maxlen": event.data.randomness.length,
        "random_index": 0
    };
    var amount = event.data.amount;
    var result = new Array(bytes.length);
    var offset = event.data.offset;
    var alpha_array = Array.apply(null, Array(amount)).map(function(){return 255});
    for (i = 0; i < bytes.length; i++) {
        // Ignore the Alpha byte
        if (((i+offset) % 4) == 3){
            result[i] = alpha_array;
        } else {
            result[i] = createSplit(randomness, bytes[i], amount);
        }
    }
    postMessage({"offset": event.data.offset, "result": result});
    close();
};
