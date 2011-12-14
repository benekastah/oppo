#!/usr/bin/env node
/*jslint nodejs:true */

var qc = require("./quickcheck");

function propertyEven(x) { return x % 2 === 0; }

function arbEven() {
	var b = qc.arbByte();

	if (b % 2 === 0) { return b; }
	else { return (b + 1) % 256; }
}

function validInteger(s) {
	var i = parseInt(s, 10);
	return typeof(i) === "number" && !isNaN(i);
}

function arbDigits() {
	var
		d = "",
		fn = function () { return String.fromCharCode(48 + Math.floor(Math.random() * 10)); };

	while (d.length < 1) { d = qc.arbArray(fn); }

	return d;
}

function main() {
	qc.forAll(propertyEven, qc.arbByte); // *** Failed!

	qc.forAll(propertyEven, arbEven); // +++ OK, passed 100 tests.

	qc.forAll(validInteger, qc.arbString); // *** Failed!

	qc.forAll(validInteger, arbDigits); // +++ OK, passed 100 tests.
}

if (!module.parent) { main(); }