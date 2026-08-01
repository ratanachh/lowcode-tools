---
title: Simple Usage
order: 1
---

This demo shows the simplest single-line usage.

```jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ExampleComponent from '<%=projectName%>';

class App extends Component {
  render() {
    return (
      <div>
        <ExampleComponent />
      </div>
    );
  }
}

ReactDOM.render(<App />, mountNode);
```
