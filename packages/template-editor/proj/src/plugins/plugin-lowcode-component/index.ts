import { IPublicModelPluginContext } from "@rchh/lowcode-types";
import lowcodeSchema from './lowcode-schema.json'

const lowcodePlugin = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      const { material } = ctx;
      material.loadIncrementalAssets({
        version: '',
        components: [{
          devMode: 'lowCode',
          componentName: 'LowcodeDemo',
          title: 'LowCode Component Example',
          group: 'LowCode Components',
          schema: lowcodeSchema as any,
          snippets: [{
            schema: {
              componentName: 'LowcodeDemo'
            },
          }]
        }],
      })
    },
  };
}
lowcodePlugin.pluginName = 'lowcodePlugin';
lowcodePlugin.meta = {
};
export default lowcodePlugin;