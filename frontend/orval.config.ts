
module.exports = {
  yshai: {
    input: "http://localhost:5000/api-json",
    output: {
      target: "/lib/api-client.ts",
      client: "fetch",
      override: {
        fetch: {
          implementation: "./lib/apiFetch.ts"
        }
      }
    },
  },
};
