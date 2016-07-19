onmessage = function (event) {
    var bytes = event.data.bytes;
    var amount = event.data.bytes.length;
    var size = event.data.bytes[0].length;
    var offset = event.data.offset;
    var result = new Array(size);
    for (i = 0; i < size; i++) {
        // Ignore the Alpha byte
        if (((i+offset) % 4) == 3){
            result[i] = 255;
        } else {
            var out = bytes[0][i];
            for (j = 1; j < amount; j++)
                out = (out + bytes[j][i]) % 256;
            result[i] = out;
        }
    }
    postMessage({"offset": event.data.offset, "result": result});
    close();
};
