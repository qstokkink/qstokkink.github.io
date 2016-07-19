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
    return out;
}

onmessage = function (event) {
    bytes = event.data.bytes;
    randomness = {
        "randomness": event.data.randomness,
        "maxlen": event.data.randomness.length,
        "random_index": 0
    };
    amount = event.data.amount;
    result = new Array(bytes.length);
    alpha_array = Array.apply(null, Array(amount)).map(function(){return 255});
    for (i = 0; i < bytes.length; i++) {
        // Ignore the Alpha byte
        if ((i % 4) == 3){
            result[i] = alpha_array;
        } else {
            result[i] = createSplit(randomness, bytes[i], amount);
        }
    }
    postMessage({"offset": event.data.offset, "result": result});
    close();
};
