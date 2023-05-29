# Plugin for generating schema documentation in Next.JS

> **WARNING**: Be careful, this is currently a **beta**, or a preview-release version. It might work as expected, it might even not work at all, or I might sell your house without your knowledge!

## Rationale

### Why

GraphQL Schema includes documentation in the schema definition. This is fantastic. However, browsing the documentation is often, if not always, limited to GraphQL Playgrounds. Playgrounds offer documentation browsing only for the purpose of building a query. More than showing documentation, the playground delivers documentation as handy reference for an a software developer. In my opinion, that could be much better. Something I love is [GraphQL API schema documentation](https://shopify.dev/docs/api/admin-graphql) from [Shopify](https://shopify.com). This documentation, which is derived from the schema, with some additions done outside it (it is a guess, the the method and solution are not open or disclosed), is the way to go in my opinion. I makes easier to browse the entire schema, particularly for those who are not software engineers building a query, and it allows you to integrate the reference into your application manual or playbook.

### How

In theory, and even in practice, GraphQL allows for introspection. So it is quite easy to read the schema and work with it. Otherwise, if you have access to the schema SDL that is quite easy.
Having access to the schema is the first part, and the simplest one. In GraphQL, given it is a _type system_ everything is a type, so if requires some logic for getting it in a way it can be easily printed.

### Alternatives

The list of alternatives is quite short, if not narrow and limited to one. The only alterative I have found so far is [GraphQL Markdown](https://graphql-markdown.github.io). This plugin, built for [docusaurus](https://docusaurus.io), boosts the same concept I am trying to deliver. However, it's limited to markdown. Markdown is not, IMO, fit for purpose. The reason is that Markdown is perfect when it comes to writing text documents, with no formal structure. It fails short if you want to render a richer user interface. If you see the output of this plugin, despite the very good job, is not the best and can even confuse the reader. MDX is an option, actually not available in this plugin. Anyway, it would work correctly only with docusaurus and still limited to how docusaurus works.

## Usage

> **NOTE**: It is assumed you have a basic knowledge of [Next.JS router](https://nextjs.org/docs/app/building-your-application/routing) and, in particular, [dynamic routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes).

### `schemaParser` class

The root of the component is a class. The class has been used to facilitate the ingestion and parsing of the schema. You might want, in the page you use for the dynamic route, to create an instance of `schemaParser`.

```javascript
const t = new schemaParser("schema.graphql");
```

### Dynamic router

You need a catch-all route for using this plugin. The route should be `[...type]`

You can either use the pages router with `getStaticPaths` or the new app router with `getStaticParams`. This is an example with the pages router:

```javascript
export async function getStaticPaths() {
	const routes = t.getRoutes();
	return {
		paths: routes,
		fallback: false,
	};
}
```

### Printing data

## API Reference

This package exports a class named `schemaParser`

### `schemaParser(uri: string)`

The API access a URI as a `string` which can be one of the following:

- A remote GraphQL introspection endpoint, in the format `https://somedomain.sometld/any/path/if/needed`. Only `https://` is accepted as valid URL.
- A schema SDL file, either a single file or glob. The schema must be valid, no partial schema are supported.

The load of schema is backed by [@graphql-tools](https://the-guild.dev/graphql/tools/docs/schema-loading#load-graphqlschema-by-using-different-loaders-from-different-sources)

### `schemaParser.getRoutes()`

Return a list of routes in a [catch-all format](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#catch-all-segments).
Example:

```javascript
[
	{ params: { type: "Author" } },
	{ params: { type: "Book" } },
	{ params: { type: "Name" } },
];
```

### `schemaParser.getTypename(name: string)`

Return the type information for a given type.

### `schemaParser.getSidebar(prefix: string)`

Return a displayable sidebar with all types

## Using the embedded example

1. Clone the repo as usual
2. Run the following to install dependencies

```bash
npm ci && npm ci --prefix ./example
```

3. Build the plugin and start the server

```bash
npm run start:example
```

Now the example server will be available on [http://localhost:3000/](http://localhost:3000/)

The demo schema is available in `schema/schema.graphql`. You can add types and fields, but always add a description as right now it does not catch a missing description and throws an error.

## Credits

Much of the work has been inspired from [GraphQL Markdown](https://graphql-markdown.github.io) and [GraphQL Voyager](https://github.com/graphql-kit/graphql-voyager).
The core code for working out the schema is extracted from GraphQL Voyager.

A special thank to [@della-90](https://github.com/della-90) for the work on [parents identification](https://github.com/LunaticMuch/next-schema-plugin-ts/pull/1).
