/** @type {import('orval').Config} */
module.exports = {
  yshai: {
    input: './swagger-spec.json',
    output: {
      target: './clients/yshai/index.ts',
      schemas: './clients/yshai/models',
      mode: 'tags-split',
      client: 'fetch',
      baseUrl: 'http://localhost:5000',
      override: {
        fetch: {
          includeCredentials: true,
        },
      },
    },
  },
};
