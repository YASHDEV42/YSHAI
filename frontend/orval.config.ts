import { defineConfig } from 'orval';

const SCHEMAS_DIR = './api/model';

const createTagConfig = (tag: string, filename: string): any => ({
  input: {
    target: 'http://localhost:5000/api-json',
  },
  output: {
    target: `./api/${filename}.ts`,
    schemas: SCHEMAS_DIR,
    client: 'fetch',
    mode: 'tags-split',
    clean: true,
    override: {
      mutator: {
        path: './lib/orval-mutator.ts', name: 'orvalMutator',
      },
    },
  },
  tags: [tag],
});

export default defineConfig({
  auth: createTagConfig('Auth', 'auth'),
  users: createTagConfig('Users', 'users'),
  posts: createTagConfig('Posts', 'posts'),
  teams: createTagConfig('Teams', 'teams'),
  media: createTagConfig('Media', 'media'),
  ai: createTagConfig('AI', 'ai'),
  moderation: createTagConfig('Moderation', 'moderation'),
  analytics: createTagConfig('Analytics', 'analytics'),
  billing: createTagConfig('Billing', 'billing'),
  notifications: createTagConfig('Notifications', 'notifications'),
  admin: createTagConfig('Admin', 'admin'),
  system: createTagConfig('System', 'system'),
});
