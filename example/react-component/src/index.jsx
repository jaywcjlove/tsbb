import React from 'react';
import classnames from 'classnames';
import { sum } from './sum';
import './index.less';

export default class Button extends React.PureComponent {
  static defaultProps = {
    type: 'light',
    prefixCls: 'w-btn',
    size: 'default',
    htmlType: 'button',
  }
  render() {
    const { prefixCls, className, children, type, htmlType, size } = this.props;
    const cls = classnames(className, prefixCls, {
      [`${prefixCls}-size-${size}`]: size,
      [`${prefixCls}-${type}`]: type,
    });
    return (
      <button type={htmlType} className={cls}>
        {children && React.Children.map(children, (child) => {
          if (!child) return child;
          if(React.isValidElement(child)) return child;
          return <span>{child}<span>{sum(1, 3)}</span></span>;
        })}
      </button>
    )
  }
}