
import { ComponentMetadata, Snippet } from '@rchh/lowcode-types';

const ButtonMeta: ComponentMetadata = {
  "componentName": "Button",
  "title": "Button",
  "docUrl": "",
  "screenshot": "",
  "devMode": "proCode",
  group: 'Test Components',
  "npm": {
    "package": "@rchh/example-components",
    "version": "1.0.0",
    "exportName": "Button",
    "main": "src/index.tsx",
    "destructuring": true,
    "subName": ""
  },
  "configure": {
    "props": [
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "title",
            "zh-CN": "title"
          }
        },
        "name": "title",
        "setter": {
          "componentName": "TestSetter",
          props: {
            defaultChecked: true
          }
        }
      }
    ],
    "supports": {
      "style": true
    },
    "component": {}
  }
};
const snippets: Snippet[] = [
  {
    "title": "Button",
    "screenshot": "",
    "schema": {
      "componentName": "Button",
      "props": {}
    }
  }
];

export default {
  ...ButtonMeta,
  snippets
};
