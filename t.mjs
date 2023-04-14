import json from "./t.json" assert { type: "json" };
import _ from "lodash";

const sidebar = _.map(json.types, (type) => {
	if (!type.name.startsWith("__")) {
		return {
			kind: type.kind,
			name: type.name,
			path: `${type.kind.toLowerCase()}/${type.name.toLowerCase()}`,
		};
	}
});

console.log(_.orderBy(_.groupBy(_.compact(sidebar), "kind"), "name", "asc"));
