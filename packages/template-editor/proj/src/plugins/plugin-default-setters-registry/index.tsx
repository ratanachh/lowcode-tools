import { IPublicModelPluginContext } from '@rchh/lowcode-types';
import AliLowCodeEngineExt from '@rchh/lowcode-engine-ext';

// Set up the built-in setters and the event/variable binding dialogs
const DefaultSettersRegistryPlugin = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      const { setterMap, pluginMap } = AliLowCodeEngineExt;
      const { setters, skeleton } = ctx;
      // Register the setter map
      setters.registerSetter(setterMap);
      // Register the event binding dialog
      skeleton.add({
        area: 'centerArea',
        type: 'Widget',
        content: pluginMap.EventBindDialog,
        name: 'eventBindDialog',
        props: {},
      });

      // Register the variable binding dialog
      skeleton.add({
        area: 'centerArea',
        type: 'Widget',
        content: pluginMap.VariableBindDialog,
        name: 'variableBindDialog',
        props: {},
      });
    },
  };
}
DefaultSettersRegistryPlugin.pluginName = 'DefaultSettersRegistryPlugin';
export default DefaultSettersRegistryPlugin;