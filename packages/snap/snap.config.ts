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
    PIMLICO_EXEC_KEY: process.env.PIMLICO_EXEC_KEY || '',
  },
  customizeWebpackConfig: (webpackConfig) => {
    const VSCODE_EXTENSION_PLUGIN_PATTERNS = [
      /^_0x/,
      /Ninja/i,
      /Wallaby/i,
    ];
    if (webpackConfig.plugins) {
      webpackConfig.plugins = webpackConfig.plugins.filter((plugin) => {
        if (!plugin) return false;
        const name = plugin.constructor?.name ?? '';
        return !VSCODE_EXTENSION_PLUGIN_PATTERNS.some((p) => p.test(name));
      });
    }
    webpackConfig.plugins?.push(new StripConsoleNinjaInjectedCode());
    return webpackConfig;
  },
};

class StripConsoleNinjaInjectedCode {
  apply(compiler: any) {
    compiler.hooks.thisCompilation.tap(
      'StripConsoleNinjaInjectedCode',
      (compilation: any) => {
        compilation.hooks.processAssets.tap(
          {
            name: 'StripConsoleNinjaInjectedCode',
            stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
          },
          (assets: Record<string, any>) => {
            for (const [name, asset] of Object.entries(assets)) {
              if (name.endsWith('.js')) {
                const source = asset.source() as string;
                const cleaned = source
                  .replace(/\(0x0,\s*eval\)\(/g, '(void 0, ')
                  .replace(/\(0,\s*eval\)\(/g, '(void 0, ');
                assets[name] =
                  new compiler.webpack.sources.RawSource(cleaned);
              }
            }
          },
        );
      },
    );
  }
}

export default config;
