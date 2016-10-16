var rgb2hsv = function() {
    var rr, gg, bb,
        r = arguments[0] / 255,
        g = arguments[1] / 255,
        b = arguments[2] / 255,
        h, s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c) {
            return (v - c) / 6 / diff + 1 / 2;
        };

    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
            h = bb - gg;
        } else if (g === v) {
            h = (1 / 3) + rr - bb;
        } else if (b === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        } else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
}

var hsvToRgb = function(h, s, v) {
    var r, g, b;
    var i;
    var f, p, q, t;

    // Make sure our arguments stay in-range
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));

    // We accept saturation and value arguments from 0 to 100 because that's
    // how Photoshop represents those values. Internally, however, the
    // saturation and value are calculated from a range of 0 to 1. We make
    // That conversion here.
    s /= 100;
    v /= 100;

    if (s == 0) {
        // Achromatic (grey)
        r = g = b = v;
        return "rgb(" + Math.round(r * 255) + "," + Math.round(g * 255) + "," + Math.round(b * 255) + ")";
    }

    h /= 60; // sector 0 to 5
    i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));

    switch (i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;

        case 1:
            r = q;
            g = v;
            b = p;
            break;

        case 2:
            r = p;
            g = v;
            b = t;
            break;

        case 3:
            r = p;
            g = q;
            b = v;
            break;

        case 4:
            r = t;
            g = p;
            b = v;
            break;

        default: // case 5:
            r = v;
            g = p;
            b = q;
    }
    // console.log([Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]);
    return "rgb(" + Math.round(r * 255) + "," + Math.round(g * 255) + "," + Math.round(b * 255) + ")";
}

var hexToRgb = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return "rgb(" + parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + ")";
};

/**
 * Cobert rgb to hex
 *
 * @method rgbToHex
 * @chainable
 */
var rgbToHex = function(rgb) {
    var result = rgb.match(/\d+/g);

    function hex(x) {
        var digits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");
        return isNaN(x) ? "00" : digits[(x - x % 16) / 16] + digits[x % 16];
    }

    return "#" + hex(result[0]) + hex(result[1]) + hex(result[2]);
};

var colorValues = [
    ["Alice Blue    ", "239,247,255"],
    ["Antique White ", "249,234,214"],
    ["Aqua  ", "0,255,255"],
    ["Aquamarine    ", "127,255,211"],
    ["Azure ", "239,255,255"],
    ["Beige ", "244,244,219"],
    ["Bisque    ", "255,226,196"],
    ["Black ", "0,0,0"],
    ["Blanched Almond   ", "255,234,204"],
    ["Blue  ", "0,0,255"],
    ["Blue Violet   ", "137,43,226"],
    ["Brown ", "165,40,40"],
    ["Burlywood ", "221,183,135"],
    ["Cadet Blue    ", "94,158,160"],
    ["Chartreuse    ", "127,255,0"],
    ["Chocolate ", "209,104,30"],
    ["Coral ", "255,127,79"],
    ["Cornflower    ", "99,147,237"],
    ["Cornsilk  ", "255,247,219"],
    ["Crimson   ", "219,20,61"],
    ["Cyan  ", "0,255,255"],
    ["Dark Blue ", "0,0,140"],
    ["Dark Cyan ", "0,140,140"],
    ["Dark Goldenrod    ", "183,135,10"],
    ["Dark Gray ", "168,168,168"],
    ["Dark Green    ", "0,99,0"],
    ["Dark Khaki    ", "188,183,107"],
    ["Dark Magenta  ", "140,0,140"],
    ["Dark Olive Green  ", "84,107,45"],
    ["Dark Orange   ", "255,140,0"],
    ["Dark Orchid   ", "153,51,204"],
    ["Dark Red  ", "140,0,0"],
    ["Dark Salmon   ", "232,150,122"],
    ["Dark Sea Green    ", "142,188,142"],
    ["Dark Slate Blue   ", "71,61,140"],
    ["Dark Slate Gray   ", "45,79,79"],
    ["Dark Turquoise    ", "0,206,209"],
    ["Dark Violet   ", "147,0,211"],
    ["Deep Pink ", "255,20,147"],
    ["Deep Sky Blue ", "0,191,255"],
    ["Dim Gray  ", "104,104,104"],
    ["Dodger Blue   ", "30,142,255"],
    ["Firebrick ", "178,33,33"],
    ["Floral White  ", "255,249,239"],
    ["Forest Green  ", "33,140,33"],
    ["Fuchsia   ", "255,0,255"],
    ["Gainsboro ", "219,219,219"],
    ["Ghost White   ", "247,247,255"],
    ["Gold  ", "255,214,0"],
    ["Goldenrod ", "216,165,33"],
    ["Gray  ", "191,191,191"],
    ["Web Gray  ", "127,127,127"],
    ["Green ", "0,255,0"],
    ["Web Green ", "0,127,0"],
    ["Green Yellow  ", "173,255,45"],
    ["Honeydew  ", "239,255,239"],
    ["Hot Pink  ", "255,104,181"],
    ["Indian Red    ", "204,91,91"],
    ["Indigo    ", "73,0,130"],
    ["Ivory ", "255,255,239"],
    ["Khaki ", "239,229,140"],
    ["Lavender  ", "229,229,249"],
    ["Lavender Blush    ", "255,239,244"],
    ["Lawn Green    ", "124,252,0"],
    ["Lemon Chiffon ", "255,249,204"],
    ["Light Blue    ", "173,216,229"],
    ["Light Coral   ", "239,127,127"],
    ["Light Cyan    ", "224,255,255"],
    ["Light Goldenrod   ", "249,249,209"],
    ["Light Gray    ", "211,211,211"],
    ["Light Green   ", "142,237,142"],
    ["Light Pink    ", "255,181,193"],
    ["Light Salmon  ", "255,160,122"],
    ["Light Sea Green   ", "33,178,170"],
    ["Light Sky Blue    ", "135,206,249"],
    ["Light Slate Gray  ", "119,135,153"],
    ["Light Steel Blue  ", "175,196,221"],
    ["Light Yellow  ", "255,255,224"],
    ["Lime  ", "0,255,0"],
    ["Lime Green    ", "51,204,51"],
    ["Linen ", "249,239,229"],
    ["Magenta   ", "255,0,255"],
    ["Maroon    ", "175,48,96"],
    ["Web Maroon    ", "127,0,0"],
    ["Medium Aquamarine ", "102,204,170"],
    ["Medium Blue   ", "0,0,204"],
    ["Medium Orchid ", "186,84,211"],
    ["Medium Purple ", "147,112,219"],
    ["Medium Sea Green  ", "61,178,112"],
    ["Medium Slate Blue ", "122,104,237"],
    ["Medium Spring Green   ", "0,249,153"],
    ["Medium Turquoise  ", "71,209,204"],
    ["Medium Violet Red ", "198,20,132"],
    ["Midnight Blue ", "25,25,112"],
    ["Mint Cream    ", "244,255,249"],
    ["Misty Rose    ", "255,226,224"],
    ["Moccasin  ", "255,226,181"],
    ["Navajo White  ", "255,221,173"],
    ["Navy Blue ", "0,0,127"],
    ["Old Lace  ", "252,244,229"],
    ["Olive ", "127,127,0"],
    ["Olive Drab    ", "107,142,35"],
    ["Orange    ", "255,165,0"],
    ["Orange Red    ", "255,68,0"],
    ["Orchid    ", "216,112,214"],
    ["Pale Goldenrod    ", "237,232,170"],
    ["Pale Green    ", "153,249,153"],
    ["Pale Turquoise    ", "175,237,237"],
    ["Pale Violet Red   ", "219,112,147"],
    ["Papaya Whip   ", "255,239,214"],
    ["Peach Puff    ", "255,216,186"],
    ["Peru  ", "204,132,63"],
    ["Pink  ", "255,191,204"],
    ["Plum  ", "221,160,221"],
    ["Powder Blue   ", "175,224,229"],
    ["Purple    ", "160,33,239"],
    ["Web Purple    ", "127,0,127"],
    ["Rebecca Purple    ", "102,51,153"],
    ["Red   ", "255,0,0"],
    ["Rosy Brown    ", "188,142,142"],
    ["Royal Blue    ", "63,104,224"],
    ["Saddle Brown  ", "140,68,17"],
    ["Salmon    ", "249,127,114"],
    ["Sandy Brown   ", "244,163,96"],
    ["Sea Green ", "45,140,86"],
    ["Seashell  ", "255,244,237"],
    ["Sienna    ", "160,81,45"],
    ["Silver    ", "191,191,191"],
    ["Sky Blue  ", "135,206,234"],
    ["Slate Blue    ", "107,89,204"],
    ["Slate Gray    ", "112,127,142"],
    ["Snow  ", "255,249,249"],
    ["Spring Green  ", "0,255,127"],
    ["Steel Blue    ", "68,130,181"],
    ["Tan   ", "209,181,140"],
    ["Teal  ", "0,127,127"],
    ["Thistle   ", "216,191,216"],
    ["Tomato    ", "255,99,71"],
    ["Turquoise ", "63,224,209"],
    ["Violet    ", "237,130,237"],
    ["Wheat ", "244,221,178"],
    ["White ", "255,255,255"],
    ["White Smoke   ", "244,244,244"],
    ["Yellow    ", "255,255,0"],
    ["Yellow Green  ", "153,204,51"]
];

// var value = "0,255,0";
// var initValue = value.split(',');
// console.log("initValue", initValue, 'converted to hsv', hsvToRgb(initValue[0], initValue[1], initValue[2]));
// hsvToRgb(initValue[0], initValue[1], 100);

for (var i = 0; i < colorValues.length;i++) {
    var rgbInput = colorValues[i][1].split(',');
    var hsvConverted = rgb2hsv(rgbInput[0],rgbInput[1],rgbInput[2]);
    var rgb = hsvToRgb(hsvConverted.h, hsvConverted.s, 100).replace('rgb',"").replace('(',"").replace(')',"").split(',');
    console.log('Converted',rgbInput, hsvConverted, rgb, "diff\t", rgbInput[0]-rgb[0]);
}