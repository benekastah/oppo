function $test_module() {
var __module__ = {};
try { throw "asdf" } catch ( $e ) { console.error($e) };
function $_u002b_ ( $a , $b ) { return $a + $b };
console.log($_u002b_(1, 1));
$test_module = function () { return __module__; };
return $test_module();
}

$test_module();