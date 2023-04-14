import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";

// const mySchema = await loadSchema("../schema/schema.graphql", {
// 	loaders: [new GraphQLFileLoader()],
// });

import { schemaParser } from "../../../lib/index.js";

const loadedSchema = loadSchemaSync("../../../schema/schema.graphql", {
	loaders: [new GraphQLFileLoader()],
});

const t = new schemaParser(loadedSchema);

console.log(loadedSchema);

export default function Post({ postData }) {
	return (
		<div className="h-screen p-16 text-gray-100 bg-gray-800">
			<div className="text-3xl font-bold text-center">{postData.title}</div>
			<div className="my-8 text-justify text-gray-200">
				{postData.description}
			</div>
			<div className="text-gray-400">Published On: {postData.date}</div>
		</div>
	);
}

export async function getStaticProps(context) {
	const { type } = context.params;
	console.log(type);
	return {
		props: {
			postData: {
				description: "ciao come va?",
				title: "CIAO",
				date: "2020-02-02",
			},
		},
	};
}

export async function getStaticPaths() {
	const routes = t.getRoutes();
	console.log(routes);
	return routes;
	// const paths = [
	// 	["object", "author"],
	// 	["scalar", "id"],
	// 	["scalar", "string"],
	// 	["object", "post"],
	// 	["scalar", "int"],
	// 	["object", "query"],
	// 	["object", "mutation"],
	// 	["scalar", "boolean"],
	// ];
	// return {
	// 	paths: [
	// 		{ params: { type: ["object", "author"] } },
	// 		{ params: { type: ["object", "mutation"] } },
	// 	],
	// 	fallback: true,
	// };
}
