quickcheck - Node.js port of the QuickCheck unit test framework

Example

	var qc = require("quickcheck");

	function propertyEven(x) { return x % 2 == 0; }

	qc.forAll(propertyEven, qc.arbByte);

	*** Failed!
	27