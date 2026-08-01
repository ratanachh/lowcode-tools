import * as React from 'react';
import './component.scss';

export default class BuiltIn extends React.Component<{ custom: any }> {
  props: { custom: any; };
  renderEmpty() {
    return (
      <div className="placeholder">The value set by the setter will be displayed here</div>
    )
  }
  renderCustomProp() {
    const { custom } = this.props;
    return (
      <div className="content">
        The value set by the setter is
        {JSON.stringify(custom, null, ' ')}
      </div>
    )
  }
  render() {
    const { custom } = this.props;
    return (
      <div className="builtin-component">
        {custom !== undefined ? this.renderCustomProp() : this.renderEmpty()}
      </div>
    )
  }
}