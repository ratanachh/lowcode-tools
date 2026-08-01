import { IPublicModelPluginContext } from '@rchh/lowcode-types';
import { injectAssets } from '@rchh/lowcode-plugin-inject';
import assets from '../../services/assets.json';
import { getProjectSchema } from '../../services/mockService';
const EditorInitPlugin = (ctx: IPublicModelPluginContext, options: any) => {
  return {
    async init() {
      const { material, project, config } = ctx;
      const scenarioName = options['scenarioName'];
      const scenarioDisplayName = options['displayName'] || scenarioName;
      const scenarioInfo = options['info'] || {};
      // Store in config so other engine-wide plugins can read it
      config.set('scenarioName', scenarioName);
      config.set('scenarioDisplayName', scenarioDisplayName);
      config.set('scenarioInfo', scenarioInfo);

      // Set the material assets description

      await material.setAssets(await injectAssets(assets));

      const schema = await getProjectSchema(scenarioName);
      // Load the schema
      project.importSchema(schema as any);
    },
  };
}
EditorInitPlugin.pluginName = 'EditorInitPlugin';
EditorInitPlugin.meta = {
  preferenceDeclaration: {
    title: 'Save plugin configuration',
    properties: [
      {
        key: 'scenarioName',
        type: 'string',
        description: 'Key used for localStorage persistence',
      },
      {
        key: 'displayName',
        type: 'string',
        description: 'Scenario name shown in the UI',
      },
      {
        key: 'info',
        type: 'object',
        description: 'Additional metadata',
      }
    ],
  },
};
export default EditorInitPlugin;