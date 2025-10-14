# Generated API Client

This folder will contain the Orval-generated TypeScript client for the YSHAI API.

- Generate or refresh the OpenAPI spec:
  - `npm run swagger:gen`
- Generate the client from the spec:
  - `npm run client:gen`

By default, the client is generated as a fetch-based client with `credentials: 'include'` to support HttpOnly cookie authentication.

If your backend runs on a different base URL, update `baseUrl` in `orval.config.js` or override it at runtime when calling the generated functions.
