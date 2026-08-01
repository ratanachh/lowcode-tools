## Overview

## Documentation

```ts
export interface LowcodeOptions {
  builtinAssets?: Array<string|Assets>; // Saved into the build output as built-in assets
  extraAssets?: Array<string|Assets>; // Loaded into the asset bundle only in the debug environment
  noParse?: boolean; // Disable automatic generation of the lowcode meta
  categories?: string[]; // Component categories shown in the components pane
  groups?: string[]; // Component tab groups shown in the components pane
  baseLibrary?: 'react'|'rax';
  setterMap?: SetterMap; // Setters to inject
}

export interface SetterMap {
  [SetterName: string]: string;
}

export type Assets = {
  package: string;
  version: string;
  urls: string[];
  library: string;
};
// Example
// {
//   package: 'antd',
//   version: '4.17.3',
//   urls: [
//     'https://g.alicdn.com/code/lib/antd/4.17.3/antd.min.js',
//     'https://g.alicdn.com/code/lib/antd/4.17.3/antd.min.css',
//   ],
//   library: 'antd',
// }
```
## Development and Debugging
### Component development

The `demo/component` directory holds a test component project. It depends on build-plugin-lowcode, and the related configuration lives in `demo/component/build.lowcode.js`.

You can debug by editing the build-plugin-lowcode source or the configuration in `demo/component/build.lowcode.js`.

```bash
# Run from the build-plugin-lowcode root directory to start the debug environment
npm run component:dev
```
