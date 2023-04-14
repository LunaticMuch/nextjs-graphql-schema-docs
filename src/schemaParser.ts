// import stringifyObject from "stringify-object";
// import { getSchema } from "./introspection/introspection.js";
// import fs from "fs";
// import { GraphQLSchema } from "graphql";
// import {
// 	SimplifiedIntrospection,
// 	SimplifiedType,
// } from "./introspection/types.js";
// import map from "lodash/map.js";
// import compact from "lodash/compact.js";
// import find from "lodash/find.js";

// export class schemaParser {
// 	schema: GraphQLSchema;
// 	simplifiedSchema: SimplifiedIntrospection;

// 	constructor(schema: GraphQLSchema) {
// 		this.schema = schema;
// 		this.simplifiedSchema = getSchema(this.schema);
// 	}

// 	dump(): void {
// 		fs.writeFile("test.json", stringifyObject(this.schema), function (err) {
// 			if (err) {
// 				console.log(err);
// 			}
// 		});
// 	}

// 	dumpSimplified(): void {
// 		fs.writeFile(
// 			"test.json",
// 			stringifyObject(this.simplifiedSchema),
// 			function (err) {
// 				if (err) {
// 					console.log(err);
// 				}
// 			}
// 		);
// 	}

// 	getRoutes(): { params: { type: string[] } }[] {
// 		const routes = map(this.simplifiedSchema.types, (type) => {
// 			if (!type.name.startsWith("__")) {
// 				return [type.kind.toLowerCase(), type.name.toLocaleLowerCase()];
// 			}
// 		});

// 		return compact(routes).map((route) => {
// 			return { params: { type: route } };
// 		});
// 	}

// 	getTypename(name: string) {
// 		// FIXME: there should be a better way to do this ... can it be right to uppercase all objects by default?

// 		const type: SimplifiedType = find(
// 			this.simplifiedSchema.types,
// 			function (o) {
// 				return o.name.toUpperCase() == name.toUpperCase();
// 			}
// 		);

// 		// console.log(type);

// 		return { desc: type?.description, name: type?.name };
// 	}
// }
