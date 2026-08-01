import { createElement, forwardRef, ForwardRefRenderFunction } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import './style.scss';

export interface ComponentProps {
  /**
   * Name
   */
  name: string;
  /**
   * Child nodes
   */
  children: any;
}

/**
 * Example component
 * @param props
 * @constructor
 */
function ExampleComponent(props: ComponentProps, ref: any) {
  return (
    <View ref={ref} className="container">
      <Text className="name">{props.name || ''}</Text>
      <Text className="content">{props.children}</Text>
    </View>
  );
}

const RefComponent = forwardRef(ExampleComponent as ForwardRefRenderFunction<any, ComponentProps>);

RefComponent.defaultProps = {
  name: 'Title',
};
RefComponent.displayName = 'ExampleComponent';

export default RefComponent;
