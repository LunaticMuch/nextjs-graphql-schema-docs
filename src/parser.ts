import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { UrlLoader } from "@graphql-tools/url-loader";
import { getSchema } from "./introspection/introspection.js";
import { GraphQLSchema } from "graphql";
import {
	SimplifiedField,
	SimplifiedIntrospectionWithIds,
	SimplifiedTypeWithIDs,
} from "./types.js";
import map from "lodash/map.js";
import compact from "lodash/compact.js";
import find from "lodash/find.js";
import groupBy from "lodash/groupBy.js";
import orderBy from "lodash/orderBy.js";

import stringify from "safe-stable-stringify";
import { ROOT_TYPE_LOCALE } from "./helpers.js";

export class schemaParser {
	location: string;
	schema: GraphQLSchema;
	simplifiedSchema: SimplifiedIntrospectionWithIds;

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

	//
	getRoutes(): { params: { type: string[] } }[] {
		const queryRoot = this.simplifiedSchema.queryType.name;
		const mutationRoot = this.simplifiedSchema.mutationType.name;

		const objectRoutes = map(this.simplifiedSchema.types, (type) => {
			const segment = ROOT_TYPE_LOCALE[type.kind].plural;

			if (
				!type.name.startsWith("__") &&
				!(type.name == queryRoot) &&
				!(type.name == mutationRoot)
			) {
				return [segment, type.name.toLocaleLowerCase()];
			}
		});

		const queryRoutes = map(this.simplifiedSchema.queryType.fields, (query) => {
			return ["queries", query.name.toLocaleLowerCase()];
		});

		const mutationRoutes = map(
			this.simplifiedSchema.mutationType.fields,
			(mutation) => {
				return ["mutations", mutation.name.toLocaleLowerCase()];
			}
		);

		const allRoutes = [...objectRoutes, ...queryRoutes, ...mutationRoutes];

		return compact(allRoutes).map((route) => {
			return { params: { type: route } };
		});
	}

	// FIXME: define a type for sidebar
	// FIXME: it could be defined as constructor to improve performance
	// FIXME: also construct prefix if needed or empty
	getSidebar(prefix?: string) {
		const objects = map(this.simplifiedSchema.types, (type) => {
			const segment = ROOT_TYPE_LOCALE[type.kind].plural;

			if (!type.name.startsWith("__")) {
				return {
					kind: type.kind,
					name: type.name,
					path: `${segment}/${type.name.toLowerCase()}`,
				};
			}
		});

		const queries = map(this.simplifiedSchema.queryType.fields, (query) => {
			return {
				kind: "QUERY",
				name: query.name,
				path: `queries/${query.name.toLowerCase()}`,
			};
		});

		const mutations = map(
			this.simplifiedSchema.mutationType.fields,
			(mutation) => {
				return {
					kind: "MUTATION",
					name: mutation.name,
					path: `mutations/${mutation.name.toLowerCase()}`,
				};
			}
		);

		const allObjects = [...objects, ...queries, ...mutations];
		const orderedObjects = groupBy(
			orderBy(compact(allObjects), "name", "asc"),
			"kind"
		);
		console.log(orderedObjects);
		return orderedObjects;
	}

	// FIXME: Define a type? maybe reuse a type?
	// FIXME: there should be a better way to do this ... can it be right to uppercase all objects by default?
	// FIXME: also, the kind is not a kind, given it's plural and part of grouping on the sidebar
	getTypeName(kind: string, name: string): object {
		switch (kind) {
			case "queries": {
				const query: SimplifiedField<SimplifiedTypeWithIDs> = find(
					this.simplifiedSchema.queryType.fields,
					function (o) {
						return o.name.toUpperCase() == name.toUpperCase();
					}
				);
				const t = stringify(query);
				return JSON.parse(t);
			}

			case "mutations": {
				const mutation: SimplifiedField<SimplifiedTypeWithIDs> = find(
					this.simplifiedSchema.mutationType.fields,
					function (o) {
						return o.name.toUpperCase() == name.toUpperCase();
					}
				);
				const t = stringify(mutation);
				return JSON.parse(t);
			}

			default: {
				const type: SimplifiedTypeWithIDs = find(
					this.simplifiedSchema.types,
					function (o) {
						return o.name.toUpperCase() == name.toUpperCase();
					}
				);
				const t = stringify(type);
				return JSON.parse(t);
			}
		}
	}
}
