import { IPublicModelPluginContext } from '@rchh/lowcode-types';
import TitleSetter from '@alilc/lowcode-setter-title';
import BehaviorSetter from './setters/behavior-setter';
import CustomSetter from './setters/custom-setter';

// Example of registering custom setters
const CustomSetterSamplePlugin = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      const { setters } = ctx;

      setters.registerSetter('TitleSetter', TitleSetter);
      setters.registerSetter('BehaviorSetter', BehaviorSetter);
      setters.registerSetter('CustomSetter', CustomSetter);
    },
  };
}
CustomSetterSamplePlugin.pluginName = 'CustomSetterSamplePlugin';
export default CustomSetterSamplePlugin;