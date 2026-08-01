/**
 * @title Basic
 * @desc A basic demo
 * @order 1
 */
/* @jsx createElement */
import { createElement } from 'rax';
import { ExampleComponent } from '<%= projectName %>';

export default () => {
  return <ExampleComponent name="Example">Component example</ExampleComponent>;
};
