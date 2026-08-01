# <%- componentName %> [![][npm-image]][npm-url]

<%- description %>

---

## Using it in the standard component metadata protocol

```js
 configure: {
   props: [
     {
        type: 'field',
        name: 'someprop',
        title: 'Some property',
        setter: '<%- componentName %>'
     }
   ]
 }
```

[npm-image]: https://img.shields.io/badge/<%- name %>
[npm-url]: https://www.npmjs.com/package/<%- name %>
