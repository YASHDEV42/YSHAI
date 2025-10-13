export default {
  auth: {
    input: 'http://localhost:5000/api-json',
    output: {
      mode: 'tags',
      target: './api/auth.ts',
      schemas: './api/model',
      client: 'fetch',
    },
    tags: ['Auth'],
  },
  users: {
    input: 'http://localhost:5000/api-json',
    output: {
      mode: 'tags',
      target: './api/users.ts',
      schemas: './api/model',
      client: 'fetch',
    },
    tags: ['Users'],
  },
};
