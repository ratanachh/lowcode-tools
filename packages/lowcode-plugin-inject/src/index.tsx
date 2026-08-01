import * as React from 'react';
import { plugins, setters } from '@rchh/lowcode-engine';
import { IPublicModelPluginContext, IPublicEnumPluginRegisterLevel, IPublicTypePlugin } from '@rchh/lowcode-types';
import { getInjectedResource, injectAssets, needInject, injectComponents, filterPackages, setInjectServerHost, type InjectOptions } from './utils';
import { Notification } from '@alifd/next';
import { AppInject } from './appInject';

let injectedPluginConfigMap = null;
let injectedPlugins = [];

export async function getInjectedPlugin(name: string, ctx: IPublicModelPluginContext, injectOptions?: InjectOptions) {
  if (!injectedPluginConfigMap) {
    injectedPluginConfigMap = {};
    injectedPlugins = await getInjectedResource('plugin', injectOptions);
    if (injectedPlugins && injectedPlugins.length > 0) {
      injectedPlugins.forEach((item: any) => {
        let pluginName = item.module?.pluginName;
        if (!pluginName) {
          const config = item.module(ctx);
          pluginName = config?.name;
        }
        injectedPluginConfigMap[pluginName] = item.module;
      });
    }
  }
  if (name === undefined) return undefined;
  return injectedPluginConfigMap[name];
}

interface IOptions extends InjectOptions {
  injectServerHost?: string;
}

const Inject = (ctx: IPublicModelPluginContext, options: IOptions = {}) => {
  const { injectServerHost, ...injectOptions } = options;
  if (!needInject) {
    return {
      init() {}
    }
  }

  if (ctx.registerLevel === IPublicEnumPluginRegisterLevel.Workspace) {
    return AppInject(ctx, options);
  }

  if (options?.injectServerHost) {
    setInjectServerHost(options.injectServerHost);
  }

  // Inject the existing designer plugins.
  // This overrides the plugin registration logic, so only plugins registered after this one support injection.
  const originalRegister = plugins.register;
  plugins.register = async function (plugin: IPublicTypePlugin, pluginOptions: any, options: any) {
    let pluginName = plugin.pluginName;
    if (!pluginName) {
      const pluginConfig = plugin(ctx, pluginOptions);
      // Backward compatibility
      pluginName = (pluginConfig as any).name;
    }
    const injectedSameNamePlugin = await getInjectedPlugin(pluginName, ctx, injectOptions);
    if (injectedSameNamePlugin) {
      injectedPluginConfigMap[pluginName] = null;
      return originalRegister.call(this, injectedSameNamePlugin, pluginOptions, options);
    } else {
      return originalRegister.call(this, plugin, pluginOptions, options);
    }
  }

  return {
    // Plugin name, unique within the registration environment
    name: 'LowcodePluginInjectAlt',
    // Names of the plugins this one depends on
    dep: [],
    // Plugin initializer, called right after the engine is initialized
    async init() {

      // Inject the newly added designer plugins
      if (injectedPluginConfigMap) {
        // TODO: switch to the engine's onInit event
        setTimeout(async () => {
          for (const key in injectedPluginConfigMap) {
            if (injectedPluginConfigMap[key]) {
              // Supports both the old and new APIs: the new one takes only creator and options, the old one takes three arguments
              await plugins.register(injectedPluginConfigMap[key], { autoInit: true }, { autoInit: true });
            }
          }
        });
      }
      const injectedSetters = await getInjectedResource('vs', injectOptions);
      injectedSetters.forEach((item) => {
        setters.registerSetter(item.module.displayName, item.module);
      });
      if (injectedPlugins.length > 0 || injectedSetters.length > 0) {
        Notification.success({
          title: 'Successfully injected the following plugins',
          content: (
            <div>
              {injectedPlugins && injectedPlugins.map((item: any) => (
                <p>Designer plugin: <b>{item.name}</b></p>
              ))}
              {injectedSetters && injectedSetters.map((item: any) => (
                <p>Setter: <b>{item.name}</b></p>
              ))}
            </div>
          )
        })
      }
    },
  };
};

Inject.pluginName = 'LowcodePluginInjectAlt';

export default Inject;
Inject.meta = {
  dependencies: [],
  preferenceDeclaration: {
    title: 'Host address serving the injected resources',
    properties: [
      {
        key: 'injectServerHost',
        type: 'string',
        description: 'Host address serving the injected resources',
      },
    ],
  },
};

export {
  injectAssets,
  injectComponents,
  filterPackages,
}

