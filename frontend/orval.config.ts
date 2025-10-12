
module.exports = {
  yshai: {
    input: "http://localhost:5000/api-json",
    output: {
      target: "src/lib/api-client.ts",
      client: "fetch",
    },
  },
};
