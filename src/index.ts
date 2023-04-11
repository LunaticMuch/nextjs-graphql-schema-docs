import { myschema } from "./loader.js";
import stringifyObject from "stringify-object";
import { getSchema } from "./introspection/introspection.js";

const t = getSchema(myschema);

import fs from "fs";
fs.writeFile("test.json", stringifyObject(t), function (err) {
	if (err) {
		console.log(err);
	}
});
