import { loadSchema } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";

export const myschema = await loadSchema("./schema/schema.graphql", {
	loaders: [new GraphQLFileLoader()],
});
