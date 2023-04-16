import { schemaParser } from "../../../lib/index.js";
import { cwd } from "node:process";
import Link from "next/link";

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

	return (
		<>
			<div className="container grid h-screen grid-cols-2 p-16 text-gray-900">
				<div className="w-1/4">{sidebar()}</div>
				<div>
					<div className="text-3xl font-bold text-center">{typeInfo?.name}</div>
					<div className="my-8 text-justify">{typeInfo?.description}</div>
				</div>
			</div>
		</>
	);
}

export async function getStaticProps(context) {
	const { type } = context.params;
	const sidebar = t.getSidebar("schema");
	const typeName = t.getTypename(type[1]);

	console.log(typeName);

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
