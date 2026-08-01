# <%- name %> [![][npm-image]][npm-url]

<%- description %>

---

## Usage

### Register the plugin
```jsx
import { plugins } from '@rchh/lowcode-engine';
import <%- componentName %> from '<%- name %>';

// Register with the engine
plugins.register(<%- componentName %>);
```

### Plugin properties & methods
No public properties or methods are exposed.

### Plugin dependencies
This plugin depends on the following plugins:

| Plugin name | Package name |
| --- | --- |

## Development
### Prerequisites

### Start
```sh
npm i & npm start
```

### Publish
```sh
npm run pub
```

[npm-image]: https://img.shields.io/badge/<%- name %>
[npm-url]: https://www.npmjs.com/package/<%- name %>
