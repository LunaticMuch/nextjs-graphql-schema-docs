# Plugin for generating schema documentation in Next.JS

## Run the example

1. Clone the repo as usual
2. Run the following to install dependencies

```bash
npm ci && npm ci --prefix ./example
```

3. Build the plugin and start the server

```bash
npm run start:example
```

Now the example server will be available on http://localhost:3000

The schema is available in `schema/schema.graphql`. You can add types and fields, but always add a description as right now it does not catch a missing description and throws an error.
