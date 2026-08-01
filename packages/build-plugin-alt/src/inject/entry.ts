//@ts-nocheck 
// Plugin debugging entry file
function getDefault(module) {
  if (module.__esModule) {
    return module.default
  }

  return module;
}

const Module = getDefault(require(__altUtilsName));
const result = { "name": name, module: Module, pluginType: 'vuPlugin', type: __bundleType };
console.info('[vdev] Generating: ', result);
export default result;
