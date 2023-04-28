import { schemaParser } from "./parser.js";

// Override
import stringify from "safe-stable-stringify";
const parsedSchema = new schemaParser("schema/schema.graphql");

// Dump stringified schema
console.log(stringify(parsedSchema));

// Dump a type
console.log(parsedSchema.getTypename("Author"));

export * from "./parser.js";
