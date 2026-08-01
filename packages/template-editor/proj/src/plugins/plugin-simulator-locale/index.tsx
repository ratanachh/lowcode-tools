import React from 'react';
import { IPublicModelPluginContext } from '@rchh/lowcode-types';
import { Select } from '@alifd/next';

const Option = Select.Option;
export interface IProps {
  currentLocale: string;
  onChange: (value: string) => void;
}

const LocaleSelect: React.FC<IProps> = (props): React.ReactElement => {
  const { currentLocale, onChange } = props;
  const currentLocaleValue = currentLocale || 'zh-CN';
  return (
    <div className="lowcode-plugin-simulator-locale-select">
        <Select
        id="select"
        onChange={onChange}
        defaultValue={currentLocaleValue}
        aria-label="Switch the canvas locale"
        style={{marginRight: 8}}
      >
        <Option value="zh-CN">Chinese</Option>
        <Option value="en-US">English</Option>
      </Select>
    </div>
  );
};
// Locale switcher for the canvas area
const SimulatorLocalePlugin = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      const { project, skeleton } = ctx;
      const currentLocale = project.simulatorHost?.get('locale') || 'zh-CN';
      const onLocaleChange = (value: string): void => {
        project.simulatorHost.set('locale', value);
      }
      skeleton.add({
        area: 'topArea',
        type: 'Widget',
        name: 'simulatorLocale',
        content: <LocaleSelect currentLocale={currentLocale} onChange={onLocaleChange} />,
        props: {
          align: 'center',
        },
      });
    },
  };
}
SimulatorLocalePlugin.pluginName = 'SimulatorLocalePlugin';
SimulatorLocalePlugin.meta = {
};
export default SimulatorLocalePlugin;