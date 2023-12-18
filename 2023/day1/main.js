"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var text_1 = require("./text");
var input = text_1.text;
function getNumber(string) {
    var digits = string
        .replace(/one/g, 'one1one')
        .replace(/two/g, 'two2two')
        .replace(/three/g, 'three3three')
        .replace(/four/g, 'four4four')
        .replace(/five/g, 'five5five')
        .replace(/six/g, 'six6six')
        .replace(/seven/g, 'seven7seven')
        .replace(/eight/g, 'eight8eight')
        .replace(/nine/g, 'nine9nine')
        .replace(/\D/g, '');
    return Number(digits[0] + digits.slice(-1));
}
function sumNumbers(label, numbers) {
    var sum = 0;
    numbers.split('\n').forEach(function (element) {
        sum += getNumber(element);
    });
    console.log("".concat(label, ": ").concat(sum));
}
sumNumbers('input', input);
