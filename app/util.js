const HSVtoRGB = (h, s, v) => {
    var r, g, b, i, f, p, q, t;
    if (h && s === undefined && v === undefined) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0:
            r = v, g = t, b = p;
            break;
        case 1:
            r = q, g = v, b = p;
            break;
        case 2:
            r = p, g = v, b = t;
            break;
        case 3:
            r = p, g = q, b = v;
            break;
        case 4:
            r = t, g = p, b = v;
            break;
        case 5:
            r = v, g = p, b = q;
            break;
    }
    var rgb = (Math.floor(r * 0xFF) << 16) | (Math.floor(g * 0xFF) << 8) | Math.floor(b * 0xFF);
    return rgb;
};


export const randomRGB = () => {
    var hue = Math.random() * 360;
    var saturation = Math.random() * 0.4 + 0.3;
    var rgb = HSVtoRGB(hue, saturation, 0.5);
    return rgb;
};


let callbacks = {};
export const on = (event, cb) => {
    if (callbacks[event] === undefined) {
        callbacks[event] = [];
    }
    callbacks[event].push(cb);
};

export const emit = (event, data) => {
    callbacks[event].forEach(cb => {
        cb(data);
    });
};
