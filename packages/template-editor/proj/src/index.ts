import { init, plugins } from '@rchh/lowcode-engine';
import { createFetchHandler } from '@rchh/lowcode-datasource-fetch-handler'
import EditorInitPlugin from './plugins/plugin-editor-init';
import UndoRedoPlugin from '@rchh/lowcode-plugin-undo-redo';
import ZhEnPlugin from '@rchh/lowcode-plugin-zh-en';
import CodeGenPlugin from '@alilc/lowcode-plugin-code-generator';
import DataSourcePanePlugin from '@rchh/lowcode-plugin-datasource-pane';
import SchemaPlugin from '@rchh/lowcode-plugin-schema';
import CodeEditorPlugin from "@rchh/lowcode-plugin-code-editor";
import ManualPlugin from "@rchh/lowcode-plugin-manual";
import InjectPlugin from '@rchh/lowcode-plugin-inject';
import SimulatorResizerPlugin from '@rchh/lowcode-plugin-simulator-select';
import ComponentPanelPlugin from './plugins/plugin-component-panel';
import DefaultSettersRegistryPlugin from './plugins/plugin-default-setters-registry';
import LoadIncrementalAssetsWidgetPlugin from './plugins/plugin-load-incremental-assets-widget';
import SaveSamplePlugin from './plugins/plugin-save-sample';
import PreviewSamplePlugin from './plugins/plugin-preview-sample';
import CustomSetterSamplePlugin from './plugins/plugin-custom-setter-sample';
import SetRefPropPlugin from '@rchh/lowcode-plugin-set-ref-prop';
import LogoSamplePlugin from './plugins/plugin-logo-sample';
import SimulatorLocalePlugin from './plugins/plugin-simulator-locale';
import lowcodePlugin from './plugins/plugin-lowcode-component';
import appHelper from './appHelper';
import './global.scss';

async function registerPlugins() {
  await plugins.register(InjectPlugin);

  await plugins.register(EditorInitPlugin, {
    scenarioName: 'general',
    displayName: 'General Scenario',
    info: {
      urls: [
        {
          key: 'Designer',
          value: 'https://github.com/alibaba/lowcode-demo/tree/main/demo-general',
        },
        {
          key: 'fusion-ui materials',
          value: 'https://github.com/alibaba/lowcode-materials/tree/main/packages/fusion-ui',
        },
        {
          key: 'fusion materials',
          value: 'https://github.com/alibaba/lowcode-materials/tree/main/packages/fusion-lowcode-materials',
        }
      ],
    },
  });

  // Set up the built-in setters and the event/variable binding dialogs
  await plugins.register(DefaultSettersRegistryPlugin);

  await plugins.register(LogoSamplePlugin);

  await plugins.register(ComponentPanelPlugin);

  await plugins.register(SchemaPlugin, { isProjectSchema: true });

  await plugins.register(ManualPlugin);

  // Register undo/redo
  await plugins.register(UndoRedoPlugin);

  // Register the Chinese/English locale switcher
  await plugins.register(ZhEnPlugin);

  await plugins.register(SetRefPropPlugin);

  await plugins.register(SimulatorResizerPlugin);

  await plugins.register(LoadIncrementalAssetsWidgetPlugin);

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

  await plugins.register(CodeEditorPlugin);

  // Register the code generation plugin
  await plugins.register(CodeGenPlugin);

  await plugins.register(SaveSamplePlugin);

  await plugins.register(PreviewSamplePlugin);

  await plugins.register(CustomSetterSamplePlugin);

  // Locale switcher for the designer canvas
  await plugins.register(SimulatorLocalePlugin);

  await plugins.register(lowcodePlugin);
};

(async function main() {
  await registerPlugins();

  init(document.getElementById('lce-container')!, {
    locale: 'zh-CN',
    enableCondition: true,
    enableCanvasLock: true,
    // Enable variable binding by default
    supportVariableGlobally: true,
    requestHandlersMap: {
      fetch: createFetchHandler(),
    },
    appHelper,
  });
})();
