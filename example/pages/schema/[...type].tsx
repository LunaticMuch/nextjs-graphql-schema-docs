import { schemaParser } from "../../../lib/index.js";
import { cwd } from "node:process";
import Link from "next/link";
import { TypeNameMetaFieldDef } from "graphql";

// Initialize the schema parser reading from disk
const t = new schemaParser(`${cwd()}/schema/schema.graphql`);

export default function Type({ typeInfo }) {
	const sidebar = () => {
		const sidebar = typeInfo?.sidebar;
		const keys = Object.keys(sidebar);

		return (
			<div className="">
				{keys.map((k) => (
					<div className="pb-4" key={k}>
						<span className="text-xl font-bold">{k}</span>
						<ul className="text-base">
							{sidebar[k].map((o) => (
								<li key={o.name}>
									<Link href={o.path} className="hover:underline">
										{o.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		);
	};

	const fields = () => {
		// const fields: object = Object.keys(typeInfo?.fields);

		// Object.entries(typeInfo?.fields).forEach((entry) => {
		// 	const [key, value] = entry;
		// 	console.log(value.name, value.description);
		// });

		let rows = [];

		Object.values(typeInfo?.fields).forEach((o) =>
			rows.push(
				<tr key={o.name}>
					<td>{o.name}</td>
					<td>{o.description}</td>
				</tr>
			)
		);

		return (
			<>
				<table className="gap-16 table-auto">
					<thead>
						<tr>
							<th>Name</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>{rows}</tbody>
				</table>
			</>
		);
	};

	return (
		<>
			<div className="container grid h-screen grid-flow-col col-auto p-16 text-gray-900 bg-white">
				<div className="">{sidebar()}</div>
				<div className="">
					<div className="text-3xl font-bold text-center">{typeInfo?.name}</div>
					<div className="my-8 text-justify">{typeInfo?.description}</div>
					<div>{fields()}</div>
				</div>
			</div>
		</>
	);
}

export async function getStaticProps(context) {
	const { type } = context.params;
	const sidebar = t.getSidebar("schema");
	//FIXME: the magic number sucks
	const typeName = t.getTypename(type[1]);

	// console.log(typeName);

	return {
		props: {
			typeInfo: {
				sidebar: sidebar,
				...typeName,
			},
		},
	};
}

export async function getStaticPaths() {
	const routes = t.getRoutes();
	return {
		paths: routes,
		fallback: false,
	};
}
