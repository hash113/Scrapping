"use strict";

var XY = function(x, y) {
        this.x = x;
        this.y = y;
    },
    hueLimits = {
        red: new XY(0.675, 0.322),
        green: new XY(0.409, 0.518),
        blue: new XY(0.167, 0.04)
    },
    livingColorsLimits = {
        red: new XY(0.704, 0.296),
        green: new XY(0.2151, 0.7106),
        blue: new XY(0.138, 0.08)
    },
    defaultLimits = {
        red: new XY(1.0, 0),
        green: new XY(0.0, 1.0),
        blue: new XY(0.0, 0.0)
    };

function _crossProduct(p1, p2) {
    return (p1.x * p2.y - p1.y * p2.x);
}

function _isInColorGamut(p, lampLimits) {
    var v1 = new XY(
            lampLimits.green.x - lampLimits.red.x, lampLimits.green.y - lampLimits.red.y
        ),
        v2 = new XY(
            lampLimits.blue.x - lampLimits.red.x, lampLimits.blue.y - lampLimits.red.y
        ),
        q = new XY(p.x - lampLimits.red.x, p.y - lampLimits.red.y),
        s = _crossProduct(q, v2) / _crossProduct(v1, v2),
        t = _crossProduct(v1, q) / _crossProduct(v1, v2);

    return (s >= 0.0) && (t >= 0.0) && (s + t <= 1.0);
}

/**
 * Find the closest point on a line. This point will be reproducible by the limits.
 *
 * @param start {XY} The point where the line starts.
 * @param stop {XY} The point where the line ends.
 * @param point {XY} The point which is close to the line.
 * @return {XY} A point that is on the line specified, and closest to the XY provided.
 */
function _getClosestPoint(start, stop, point) {
    var AP = new XY(point.x - start.x, point.y - start.y),
        AB = new XY(stop.x - start.x, stop.y - start.y),
        ab2 = AB.x * AB.x + AB.y * AB.y,
        ap_ab = AP.x * AB.x + AP.y * AB.y,
        t = ap_ab / ab2;

    if (t < 0.0) {
        t = 0.0;
    } else if (t > 1.0) {
        t = 1.0;
    }

    return new XY(
        start.x + AB.x * t, start.y + AB.y * t
    );
}

function _getDistanceBetweenPoints(pOne, pTwo) {
    var dx = pOne.x - pTwo.x,
        dy = pOne.y - pTwo.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function _getXYStateFromRGB(red, green, blue, limits) {
    // console.log(red, green,blue);
    red = (red / 255);
    green = (green / 255);
    blue = (blue / 255);
    // console.log(red, green,blue);
    var r = _gammaCorrection(red),
        g = _gammaCorrection(green),
        b = _gammaCorrection(blue),
        X = r * 0.664511 + g * 0.154324 + b * 0.162028,
        Y = r * 0.283881 + g * 0.668433 + b * 0.047685,
        Z = r * 0.000088 + g * 0.072310 + b * 0.986039,
        cx = X / (X + Y + Z),
        cy = Y / (X + Y + Z),
        xyPoint;

    cx = isNaN(cx) ? 0.0 : cx;
    cy = isNaN(cy) ? 0.0 : cy;

    xyPoint = new XY(cx, cy);

    if (!_isInColorGamut(xyPoint, limits)) {
        xyPoint = _resolveXYPointForLamp(xyPoint, limits);
    }

    return [Number(xyPoint.x), Number(xyPoint.y)];
}

/**
 * This function is a rough approximation of the reversal of RGB to xy transform. It is a gross approximation and does
 * get close, but is not exact.
 * @param x
 * @param y
 * @param brightness
 * @returns {Array} RGB values
 * @private
 *
 * This function is a modification of the one found at https://github.com/bjohnso5/hue-hacking/blob/master/src/colors.js#L251
 */
function _getRGBFromXYState(x, y, brightness) {
    // console.log('brightness', brightness);
    var Y = brightness,
        X = (Y / y) * x,
        Z = (Y / y) * (1 - x - y),
        rgb = [
            X * 1.656492 - Y * 0.354851 - Z * 0.255038, -X * 0.707196 + Y * 1.655397 + Z * 0.036152,
            X * 0.051713 - Y * 0.121364 + Z * 1.011530
        ];
    var r = rgb[0];
    var g = rgb[1];
    var b = rgb[2];
    if (r > b && r > g && r > 1.0) {
        // red is too big
        g = g / r;
        b = b / r;
        r = 1.0;
    } else if (g > b && g > r && g > 1.0) {
        // green is too big
        r = r / g;
        b = b / g;
        g = 1.0;
    } else if (b > r && b > g && b > 1.0) {
        // blue is too big
        r = r / b;
        g = g / b;
        b = 1.0;
    }
    rgb = [r, g, b];
    // Apply reverse gamma correction.
    rgb = rgb.map(function(x) {
        return (x <= 0.0031308) ? (12.92 * x) : ((1.0 + 0.055) * Math.pow(x, (1.0 / 2.4)) - 0.055);
    });

    // Bring all negative components to zero.
    rgb = rgb.map(function(x) {
        return Math.max(0, x);
    });

    // If one component is greater than 1, weight components by that value.
    // var max = Math.max(rgb[0], rgb[1], rgb[2]);
    // console.log(max);
    // if (max > 1) {
    //     rgb = rgb.map(function (x) { return x / max; });
    // }
    var r = rgb[0];
    var g = rgb[1];
    var b = rgb[2];
    if (r > b && r > g) {
        // red is biggest
        if (r > 1.0) {
            g = g / r;
            b = b / r;
            r = 1.0;
        }
    } else if (g > b && g > r) {
        // green is biggest
        if (g > 1.0) {
            r = r / g;
            b = b / g;
            g = 1.0;
        }
    } else if (b > r && b > g) {
        // blue is biggest
        if (b > 1.0) {
            r = r / b;
            g = g / b;
            b = 1.0;
        }
    }
    // console.log(rgb, r, g, b);
    rgb = [r, g, b];
    rgb = rgb.map(function(x) {
        return Math.floor(x * 255);
    });

    return rgb;
}

/**
 * When a color is outside the limits, find the closest point on each line in the CIE 1931 'triangle'.
 * @param point {XY} The point that is outside the limits
 * @param limits The limits of the bulb (red, green and blue XY points).
 * @returns {XY}
 */
function _resolveXYPointForLamp(point, limits) {

    var pAB = _getClosestPoint(limits.red, limits.green, point),
        pAC = _getClosestPoint(limits.blue, limits.red, point),
        pBC = _getClosestPoint(limits.green, limits.blue, point),
        dAB = _getDistanceBetweenPoints(point, pAB),
        dAC = _getDistanceBetweenPoints(point, pAC),
        dBC = _getDistanceBetweenPoints(point, pBC),
        lowest = dAB,
        closestPoint = pAB;

    if (dAC < lowest) {
        lowest = dAC;
        closestPoint = pAC;
    }

    if (dBC < lowest) {
        closestPoint = pBC;
    }

    return closestPoint;
}

function _gammaCorrection(value) {
    var result = value;
    if (value > 0.04045) {
        result = Math.pow((value + 0.055) / (1.0 + 0.055), 2.4);
    } else {
        result = value / 12.92;
    }
    return result;
}

function _getLimits(modelid) {
    var limits = defaultLimits;

    if (modelid) {
        modelid = modelid.toLowerCase();

        if (/^lct/.test(modelid)) {
            // This is a Hue bulb
            limits = hueLimits;
        } else if (/^llc/.test(modelid)) {
            // This is a Living Color lamp (Bloom, Iris, etc..)
            limits = livingColorsLimits;
        } else if (/^lwb/.test(modelid)) {
            // This is a lux bulb
            limits = defaultLimits;
        } else {
            limits = defaultLimits;
        }
    }

    return limits;
}
console.log(process.argv[2]);
var rgbInput = process.argv[2].split(',')

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
for (var i = 0; i < colorValues.length;i++) {
    // console.log(i);
    var rgbInput = colorValues[i][1].split(',');
    // console.log(rgbInput, i);
    var xy = _getXYStateFromRGB(rgbInput[0], rgbInput[1], rgbInput[2], defaultLimits)
    var string = '';
    for (var j = 0; j < 255; j++) {
        string += _getRGBFromXYState(xy[0], xy[1], j) + "\t";
    }
    var newValue =_getRGBFromXYState(xy[0], xy[1], 100);
    console.log("xy value", rgbInput, string);
    // console.log('difference',rgbInput,'\t',newValue[0]-rgbInput[0],newValue[1]-rgbInput[1],newValue[2]-rgbInput[2]);
}

module.exports = {
    convertRGBtoXY: function(rgb, modelid) {
        var limits = _getLimits(modelid);
        return _getXYStateFromRGB(rgb[0], rgb[1], rgb[2], limits);
    },
    convertXYtoRGB: _getRGBFromXYState
};
