import { init, plugins } from '@rchh/lowcode-engine';
import { createFetchHandler } from '@rchh/lowcode-datasource-fetch-handler'
import { IPublicTypeEngineOptions, IPublicTypePlugin } from '@rchh/lowcode-types';

import registerDefaultPlugins from './plugins';
import registerDefaultSetters from './setters';

import './index.scss';

export * from '@rchh/lowcode-engine';

const defaultConfig = {
  // locale: 'zh-CN',
  enableCondition: true,
  enableCanvasLock: true,
  // Enable variable binding by default
  supportVariableGlobally: true,
  // simulatorUrl does not need to be configured when it shares a parent path with engine-core.js.
  // It is set here because the alifd CDN serves engine-core.js and react-simulator-renderer.js from different npm packages and paths.
  simulatorUrl: [
    'https://alifd.alicdn.com/npm/@rchh/lowcode-react-simulator-renderer@latest/dist/css/react-simulator-renderer.css',
    'https://alifd.alicdn.com/npm/@rchh/lowcode-react-simulator-renderer@latest/dist/js/react-simulator-renderer.js'
  ],
  requestHandlersMap: {
    fetch: createFetchHandler()
  }
};

export default async (cb: IPublicTypePlugin, customPlugins: any, container: HTMLElement, config: IPublicTypeEngineOptions & { presetConfig: any }) => {

  const realConfig = { ...defaultConfig, ...(config || {}) };
  const { presetConfig } = realConfig;

  await registerDefaultPlugins(presetConfig);
  registerDefaultSetters();

  // Handle the initialization callback passed in from outside
  if (typeof cb === 'function') {
    cb.pluginName = 'editorInit';
    await plugins.register(cb);
  }

  init(container, realConfig);
}