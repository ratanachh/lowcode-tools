import React from 'react';
import {
  ILowCodePluginContext,
  plugins,
  project,
} from '@rchh/lowcode-engine';
import AliLowCodeEngineExt from '@rchh/lowcode-engine-ext';
import { Button, Icon } from '@alifd/next';
import UndoRedoPlugin from '@rchh/lowcode-plugin-undo-redo';
import ComponentsPane from '@rchh/lowcode-plugin-components-pane';
import ZhEnPlugin from '@rchh/lowcode-plugin-zh-en';
import CodeGenPlugin from '@alilc/lowcode-plugin-code-generator';
import DataSourcePanePlugin from '@rchh/lowcode-plugin-datasource-pane';
import SchemaPlugin from '@rchh/lowcode-plugin-schema';
import CodeEditor from "@rchh/lowcode-plugin-code-editor";
import ManualPlugin from "@rchh/lowcode-plugin-manual";
import Inject, { injectAssets } from '@rchh/lowcode-plugin-inject';
import SimulatorResizer from '@rchh/lowcode-plugin-simulator-select';

import Logo from './logo';
import { preview, resetSchema, saveSchema } from 'src/utils';

const registerDefaultPlugins = async (presetConfig) => {
  await plugins.register(ManualPlugin);

  // await plugins.register(Inject);

  // Plugin API reference: https://lowcode-engine.cn/site/docs/api/plugins
  SchemaPlugin.pluginName = 'SchemaPlugin';
  await plugins.register(SchemaPlugin);

  SimulatorResizer.pluginName = 'SimulatorResizer';
  plugins.register(SimulatorResizer);

  const builtinPluginRegistry = (ctx: ILowCodePluginContext) => {
    return {
      name: 'builtin-plugin-registry',
      async init() {
        const { skeleton } = ctx;
        const { logo: customLogoConfig } = presetConfig || {};


        // Register the logo widget
        skeleton.add({
          area: 'topArea',
          type: 'Widget',
          name: 'logo',
          content: Logo,
          contentProps: {
            logo: customLogoConfig?.logo || 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: customLogoConfig?.href || 'https://lowcode-engine.cn',
          },
          props: {
            align: 'left',
          },
        });

        // Register the components pane
        const componentsPane = skeleton.add({
          area: 'leftArea',
          type: 'PanelDock',
          name: 'componentsPane',
          content: ComponentsPane,
          contentProps: {},
          props: {
            align: 'top',
            icon: 'zujianku',
            description: 'Component Library',
          },
        });
        componentsPane?.disable?.();
        project.onSimulatorRendererReady(() => {
          componentsPane?.enable?.();
        })
      },
    };
  }
  builtinPluginRegistry.pluginName = 'builtinPluginRegistry';
  await plugins.register(builtinPluginRegistry);

  // Set up the built-in setters and the event/variable binding dialogs
  const setterRegistry = (ctx: ILowCodePluginContext) => {
    const { setterMap, pluginMap } = AliLowCodeEngineExt;
    return {
      name: 'ext-setters-registry',
      async init() {
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
  setterRegistry.pluginName = 'setterRegistry';
  await plugins.register(setterRegistry);

  // Register undo/redo
  await plugins.register(UndoRedoPlugin);

  // Register the Chinese/English locale switcher
  await plugins.register(ZhEnPlugin);

  const previewSample = (ctx: ILowCodePluginContext) => {
    return {
      name: 'previewSample',
      async init() {
        const { skeleton } = ctx;
        skeleton.add({
          name: 'previewSample',
          area: 'topArea',
          type: 'Widget',
          props: {
            align: 'right',
          },
          content: (
            <Button ghost="light" iconSize="large" onClick={preview}>
              <Icon type="bofang" />
            </Button>
          ),
        });
      },
    };
  };
  previewSample.pluginName = 'previewSample';
  await plugins.register(previewSample);

  // Register the save widget
  const saveSample = (ctx: ILowCodePluginContext) => {
    return {
      name: 'saveSample',
      async init() {
        const { skeleton, hotkey } = ctx;
        skeleton.add({
          name: 'resetSchema',
          area: 'topArea',
          type: 'Widget',
          props: {
            align: 'right',
          },
          content: (
            <Button type="secondary" onClick={resetSchema}>
              Reset
            </Button>
          ),
        });
        skeleton.add({
          name: 'saveSample',
          area: 'topArea',
          type: 'Widget',
          props: {
            align: 'right',
          },
          content: (
            <Button type="primary" onClick={saveSchema}>
              Save
            </Button>
          ),
        });

        hotkey.bind('command+s', (e) => {
          e.preventDefault();
          // saveSchema();
        });
      },
    };
  }
  saveSample.pluginName = 'saveSample';
  await plugins.register(saveSample);

  // Register the code generation plugin
  CodeGenPlugin.pluginName = 'CodeGenPlugin';
  await plugins.register(CodeGenPlugin);

  DataSourcePanePlugin.pluginName = 'DataSourcePane';
  // Declaring and passing plugin options, see https://lowcode-engine.cn/site/docs/api/plugins
  await plugins.register(DataSourcePanePlugin, {
    importPlugins: [],
    dataSourceTypes: [
      {
        type: 'fetch',
      },
      {
        type: 'jsonp',
      }
    ]
  });

  CodeEditor.pluginName = 'CodeEditor';
  await plugins.register(CodeEditor);

  console.log('Built-in plugin registration complete')
}

export default registerDefaultPlugins;