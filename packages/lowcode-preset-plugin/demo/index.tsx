import init, { editor, project, material, setters } from '../src/index';
import { createFetchHandler } from '@rchh/lowcode-datasource-fetch-handler'
import { getPageSchema } from '../src/utils';

const LCE_CONTAINER = document.getElementById('lce-container');

const config =  {
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
  },
  presetConfig: {
    logo: {
      logo: 'https://cdn.npmmirror.com/npmmirror-logo.png'
    }
  }
};


(async function main() {
  await init((ctx) => {
    return {
      name: 'editor-init',
      async init() {
        // Override the separator prop setter of the breadcrumb component
        const assets = await (
          await fetch(
            `https://alifd.alicdn.com/npm/@rchh/lowcode-materials/build/lowcode/assets-prod.json`
          )
        ).json();
        // Set the material assets description
        const { material, project } = ctx;
  
        await material.setAssets(assets);
  
        const schema = await getPageSchema();
  
        // Load the schema
        project.openDocument(schema);
      },
    };
  }, [], LCE_CONTAINER, config);
})();
