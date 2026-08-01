import * as React from 'react';
import {
  plugins,
  skeleton,
} from '@rchh/lowcode-engine';
import { IPublicModelPluginContext } from '@rchh/lowcode-types';
import Logo from '../../builtIn/logo';
import UndoRedo from '@rchh/lowcode-plugin-undo-redo';
import ComponentsPane from '@rchh/lowcode-plugin-components-pane';
import ZhEn from '@rchh/lowcode-plugin-zh-en';
import SchemaPlugin from '@rchh/lowcode-plugin-schema';
import CodeEditor from "@rchh/lowcode-plugin-code-editor";
import { getPageSchema, saveSchema, resetSchema, preview } from './utils';
import assets from '../../public/assets.json';

;
export default async ({ type, demoPlugin = undefined }) => {

  const registerPlugin = async (plugin) => {
    // Avoid registering the plugin under debug a second time
    if (demoPlugin?.pluginName && plugin.pluginName === demoPlugin?.pluginName) {
      return;
    }
    await plugins.register(plugin);
  }
  // Plugin API reference: https://lowcode-engine.cn/site/docs/api/plugins
  await registerPlugin(SchemaPlugin);
  await registerPlugin(CodeEditor);

  const editorInit = (ctx: IPublicModelPluginContext) => {

    return {
      name: 'editor-init',
      async init() {

        if (type === 'setter') {
          const COMP_NAME = "BuiltInComp";
          const COMP_VERSION = '1.0.0';
          const COMP_TITLE = 'Built-in Debug Component';
          const COMP_PACKAGE = 'setter-plugin-builtin-component';

          (assets as any).packages.push({
            package: COMP_PACKAGE,
            version: COMP_VERSION,
            urls: [
              `/js/component.js`,
              `/css/component.css`
            ],
            library: COMP_NAME
          });

          (assets as any).components.unshift({
            componentName: COMP_NAME,
            category: 'Debug',
            group: 'Debug',
            title: COMP_TITLE,
            icon: "https://img.alicdn.com/imgextra/i1/O1CN01m4IZ481VKPwFFbDhP_!!6000000002634-2-tps-112-112.png",
            docUrl: "",
            screenshot: "",
            npm: {
              package: COMP_PACKAGE,
              version: COMP_VERSION
            },
            props: [
              {
                name: "custom",
                title: "Content",
                propType: "string"
              }
            ],
            snippets: [
              {
                title: "Built-in Debug Component",
                screenshot: "https://img.alicdn.com/imgextra/i1/O1CN01m4IZ481VKPwFFbDhP_!!6000000002634-2-tps-112-112.png",
                schema: {
                  componentName: COMP_NAME,
                  props: {
                  }
                }
              }
            ],
            configure: {
              props: {
                isExtends: true,
                override: [
                  {
                    name: "custom",
                    title: "",
                    setter: "DemoSetter"
                  }
                ]
              }
            }
          });
        }

        // Set the material assets description
        const { material, project } = ctx;
        material.setAssets(assets as any);

        const schema = await getPageSchema(type);

        // Load the schema
        project.openDocument(schema);
      },
    };
  };
  editorInit.pluginName = 'editorInit';

  await registerPlugin(editorInit);

  const builtinPluginRegistry = (ctx: IPublicModelPluginContext) => {
    return {
      name: 'builtin-plugin-registry',
      async init() {
        // Register the logo widget
        skeleton.add({
          area: 'topArea',
          type: 'Widget',
          name: 'logo',
          content: Logo,
          contentProps: {
            logo:
              'https://img.alicdn.com/tfs/TB1_SocGkT2gK0jSZFkXXcIQFXa-66-66.png',
            href: '/',
          },
          props: {
            align: 'left',
            width: 100,
          },
        });

        // Register the components pane
        skeleton.add({
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
      },
    };
  }
  builtinPluginRegistry.pluginName = 'builtinPluginRegistry';

  await registerPlugin(builtinPluginRegistry);

  // Register undo/redo
  await registerPlugin(UndoRedo);
  // Register the Chinese/English locale switcher
  await registerPlugin(ZhEn);

    // Register the save widget
    const saveSample = (ctx: IPublicModelPluginContext) => {
      return {
        name: 'saveSample',
        async init() {
          ctx.skeleton.add({
            name: 'saveSample',
            area: 'topArea',
            type: 'Widget',
            props: {
              align: 'right',
            },
            content: <button
              className='save-sample'
              onClick={saveSchema}
            >Save to Local</button>
          });
          ctx.skeleton.add({
            name: 'resetSchema',
            area: 'topArea',
            type: 'Widget',
            props: {
              align: 'right',
            },
            content: <button
              className='save-sample'
              onClick={resetSchema}
            >Reset Page</button>
          });
          ctx.hotkey.bind('command+s', (e) => {
            e.preventDefault();
            saveSchema();
          });
        },
      };
    }
    saveSample.pluginName = 'saveSample';
    await registerPlugin(saveSample);
}
