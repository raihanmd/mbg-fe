import type { SnapConfig } from '@metamask/snaps-cli';
import { resolve } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const config: SnapConfig = {
  input: resolve(__dirname, 'src/index.tsx'),
  server: {
    port: 8080,
  },
  polyfills: {
    buffer: true,
  },
  environment: {
    API_URL: process.env.API_URL || 'http://localhost:4000',
  },
};

export default config;
