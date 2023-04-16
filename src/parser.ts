import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";

import { getSchema } from "./introspection/introspection.js";
import { GraphQLSchema } from "graphql";
import {
	SimplifiedIntrospection,
	SimplifiedType,
} from "./introspection/types.js";
import map from "lodash/map.js";
import compact from "lodash/compact.js";
import find from "lodash/find.js";
import groupBy from "lodash/groupBy.js";
import orderBy from "lodash/orderBy.js";

export class schemaParser {
	location: string;
	schema: GraphQLSchema;
	simplifiedSchema: SimplifiedIntrospection;

	constructor(location: string) {
		this.schema = this.loadSchema(location);
		this.simplifiedSchema = getSchema(this.schema);
	}

	loadSchema(location: string) {
		const schema = loadSchemaSync(location, {
			loaders: [new GraphQLFileLoader()],
		});
		return schema;
	}

	// dump(): void {
	// 	fs.writeFile("test.json", stringifyObject(this.schema), function (err) {
	// 		if (err) {
	// 			console.log(err);
	// 		}
	// 	});
	// }

	// dumpSimplified(): void {
	// 	fs.writeFile(
	// 		"test.json",
	// 		stringifyObject(this.simplifiedSchema),
	// 		function (err) {
	// 			if (err) {
	// 				console.log(err);
	// 			}
	// 		}
	// 	);
	// }

	getRoutes(): { params: { type: string[] } }[] {
		const routes = map(this.simplifiedSchema.types, (type) => {
			if (!type.name.startsWith("__")) {
				return [type.kind.toLowerCase(), type.name.toLocaleLowerCase()];
			}
		});

		return compact(routes).map((route) => {
			return { params: { type: route } };
		});
	}

	// FIXME: define a type for sidebar
	// FIXME: it could be defined as constructor to improve performance
	// FIXME: also construct prefix if needed or empty
	getSidebar(prefix?: string) {
		const sidebar = map(this.simplifiedSchema.types, (type) => {
			if (!type.name.startsWith("__")) {
				return {
					kind: type.kind,
					name: type.name,
					path: `${type.kind.toLowerCase()}/${type.name.toLowerCase()}`,
				};
			}
		});
		return groupBy(orderBy(compact(sidebar), "name", "asc"), "kind");
	}

	// FIXME: Define a type? maybe reuse a type?
	getTypename(name: string) {
		// FIXME: there should be a better way to do this ... can it be right to uppercase all objects by default?
		console.log(name);
		const type: SimplifiedType = find(
			this.simplifiedSchema.types,
			function (o) {
				return o.name.toUpperCase() == name.toUpperCase();
			}
		);

		return { description: type?.description, name: type?.name };
	}
}
