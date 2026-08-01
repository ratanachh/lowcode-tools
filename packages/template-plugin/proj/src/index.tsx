import * as React from 'react';
import { IPublicModelPluginContext } from '@rchh/lowcode-types';
import Icon from './icon';

const <%- componentName %> = (ctx: IPublicModelPluginContext, options: any) => {
  return {
    // Plugin initializer, called right after the engine is initialized
    init() {
      // The options passed in at registration time are available here
      // console.log(options.name);

      // Add a panel to the engine
      ctx.skeleton.add({
        area: 'leftArea',
        name: '<%- componentName %>Pane',
        type: 'PanelDock',
        props: {
          icon: <Icon />,
          description: 'Demo',
        },
        content: <div>This is a demo panel</div>,
      });

      ctx.logger.log('Hello from the plugin');
    },
  };
};

// Plugin name, unique within the registration environment
<%- componentName %>.pluginName = '<%- componentName %>';
<%- componentName %>.meta = {
  // Names of the plugins this one depends on
  dependencies: [],
  engines: {
    lowcodeEngine: '^1.1.0', // This plugin requires an engine matching ^1.1.0
  },
}

export default <%- componentName %>;
