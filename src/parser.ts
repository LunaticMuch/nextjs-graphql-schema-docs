import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { UrlLoader } from "@graphql-tools/url-loader";

// import * as fs from "fs";
// import stringifyObject from "stringify-object";

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

import stringify from "safe-stable-stringify";

export class schemaParser {
	location: string;
	schema: GraphQLSchema;
	simplifiedSchema: SimplifiedIntrospection;

	constructor(uri: string) {
		this.schema = this.loadSchema(uri);
		this.simplifiedSchema = getSchema(this.schema);
	}

	loadSchema(uri: string): GraphQLSchema {
		const URLregex = new RegExp("https://.+", "i");

		// FIXME: Can be done better
		if (!URLregex.test(uri)) {
			return loadSchemaSync(uri, {
				loaders: [new GraphQLFileLoader()],
			});
		} else {
			return loadSchemaSync(uri, { loaders: [new UrlLoader()] });
		}
	}

	// dump(): void {
	// 	fs.writeFile(
	// 		"schema_dump.json",
	// 		stringifyObject(this.schema),
	// 		function (err) {
	// 			if (err) {
	// 				console.log(err);
	// 			}
	// 		}
	// 	);
	// }

	// dumpSimplified(): void {
	// 	fs.writeFile(
	// 		"schema_simplified_dump.json",
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
	getTypename(name: string): object {
		// FIXME: there should be a better way to do this ... can it be right to uppercase all objects by default?
		const type: SimplifiedType = find(
			this.simplifiedSchema.types,
			function (o) {
				return o.name.toUpperCase() == name.toUpperCase();
			}
		);
		const t = stringify(type);
		return JSON.parse(t);
	}
}
