import { IPublicModelPluginContext } from '@rchh/lowcode-types';
import { Button } from '@alifd/next';
import { material } from '@rchh/lowcode-engine';
import { Message } from '@alifd/next';

const loadIncrementalAssets = () => {
  material?.onChangeAssets(() => {
    Message.success('[MCBreadcrumb] Materials loaded successfully');
  });

  material.loadIncrementalAssets({
    packages: [
      {
        title: 'MCBreadcrumb',
        package: 'mc-breadcrumb',
        version: '1.0.0',
        urls: [
          'https://unpkg.alibaba-inc.com/mc-breadcrumb@1.0.0/dist/MCBreadcrumb.js',
          'https://unpkg.alibaba-inc.com/mc-breadcrumb@1.0.0/dist/MCBreadcrumb.css',
        ],
        library: 'MCBreadcrumb',
      },
    ],
    components: [
      {
        componentName: 'MCBreadcrumb',
        title: 'MCBreadcrumb',
        docUrl: '',
        screenshot: '',
        npm: {
          package: 'mc-breadcrumb',
          version: '1.0.0',
          exportName: 'MCBreadcrumb',
          main: 'lib/index.js',
          destructuring: false,
          subName: '',
        },
        props: [
          {
            name: 'prefix',
            propType: 'string',
            description: 'Brand prefix for the style class names',
            defaultValue: 'next-',
          },
          {
            name: 'title',
            propType: 'string',
            description: 'Title',
            defaultValue: 'next-',
          },
          {
            name: 'rtl',
            propType: 'bool',
          },
          {
            name: 'children',
            propType: {
              type: 'instanceOf',
              value: 'node',
            },
            description: 'Breadcrumb children; must be Breadcrumb.Item elements',
          },
          {
            name: 'maxNode',
            propType: {
              type: 'oneOfType',
              value: [
                'number',
                {
                  type: 'oneOf',
                  value: ['auto'],
                },
              ],
            },
            description:
              'Maximum number of breadcrumb items to display; extra items are hidden. Set to auto to fit the parent width automatically.',
            defaultValue: 100,
          },
          {
            name: 'separator',
            propType: {
              type: 'instanceOf',
              value: 'node',
            },
            description: 'Separator; can be text or an Icon',
          },
          {
            name: 'component',
            propType: {
              type: 'oneOfType',
              value: ['string', 'func'],
            },
            description: 'HTML tag to render',
            defaultValue: 'nav',
          },
          {
            name: 'className',
            propType: 'any',
          },
          {
            name: 'style',
            propType: 'object',
          },
        ],
        configure: {
          component: {
            isContainer: true,
            isModel: true,
            rootSelector: 'div.MCBreadcrumb',
          },
        },
      },
    ],

    componentList: [
      {
        title: 'Common',
        icon: '',
        children: [
          {
            componentName: 'MCBreadcrumb',
            title: 'MC Breadcrumb',
            icon: '',
            package: 'mc-breadcrumb',
            library: 'MCBreadcrumb',
            snippets: [
              {
                title: 'MC Breadcrumb',
                screenshot:
                  'https://alifd.oss-cn-hangzhou.aliyuncs.com/fusion-cool/icons/icon-light/ic_light_breadcrumb.png',
                schema: {
                  componentName: 'MCBreadcrumb',
                  props: {
                    title: 'Material Center',
                    prefix: 'next-',
                    maxNode: 100,
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  });
};
const LoadIncrementalAssetsWidgetPlugin = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      const { skeleton } = ctx;

      skeleton.add({
        name: 'loadAssetsSample',
        area: 'topArea',
        type: 'Widget',
        props: {
          align: 'right',
          width: 80,
        },
        content: (
          <Button onClick={loadIncrementalAssets}>
            Load Assets Async
          </Button>
        ),
      });
    },
  };
}
LoadIncrementalAssetsWidgetPlugin.pluginName = 'LoadIncrementalAssetsWidgetPlugin';
export default LoadIncrementalAssetsWidgetPlugin;