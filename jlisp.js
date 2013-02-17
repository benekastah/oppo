
var _clone = Object.create || function (o) {
	function Noop() {}
	Noop.prototype = o;
	return new Noop();
};

this.eval = function (ast) {
	var result;
	new Compiler(ast, function (err, code) {
		result = eval(code);
	});
	return result;
};


var type_key = "__type__";
var json_replacer = function (key, value) {
	if (value && typeof value === "object") {
		var type = value.constructor && value.constructor.name;
		if (type && typeof type === "string") {
			value = _clone(value);
			value[type_key] = type;
		}
	}
	return value;
};

var json_reviver = function (key, value) {
	var type = value[type_key];
	if (type && typeof type === "string") {
		var Class = self[type];
		if (Class && Class.from_json) {
			return Class.from_json(value);
		}
	}
	return value;
};

var json_parse = function (json) {
	return JSON.parse(json, json_reviver);
};
this.json_parse = json_parse;

var json_stringify = function (obj) {
	return JSON.stringify(obj, json_replacer, '\t');
};
this.json_stringify = json_stringify;


function get_scripts() {
	var outfile;

	var jlisp_scripts = [];
	if (typeof document !== "undefined") {
		var scripts = document.getElementsByTagName("script");
		var jlisp_scripts = [];
		for (var script_idx = 0, scripts_len = scripts.length; script_idx < scripts_len; script_idx++) {
			var script = scripts[script_idx];
			if (script.type === "text/lisp") {
				jlisp_scripts.push(script);
			}
		}
	} else if (typeof process !== "undefined") {
		var fs = require('fs');
		var jlisp_scripts = process.argv.slice(2);
		outfile = jlisp_scripts[0] + ".js";
	}

	var compiler = new Compiler(jlisp_scripts, function (err, code) {
		if (outfile) {
			var fs = require('fs');
			fs.writeFile(outfile, code, 'utf8', function (err) {
				if (!err) {
					console.log("Wrote " + outfile);
				} else {
					console.error(err);
				}
			});
		} else {
			eval(code);
		}
	});
}

get_scripts.call(this);
