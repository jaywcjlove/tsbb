import React from 'react';
import './style/index.less';

export interface ButtonProps {
  prefixCls?: string;
  type?: string;
  size?: 'large' | 'default' | 'small';
  active?: boolean;
  disabled?: boolean;
  block?: boolean;
  basic?: boolean;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
  htmlType?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

export default class Button extends React.PureComponent<ButtonProps> {
  public static defaultProps: ButtonProps = {
    type: 'light',
    prefixCls: 'w-btn',
    size: 'default',
    htmlType: 'button',
  };
  render() {
    const { prefixCls, className, children, type, htmlType, size } = this.props;
    const cls = [className, prefixCls, size ? `${prefixCls}-${size}` : false, type ? `${prefixCls}-${type}` : false]
      .filter(Boolean)
      .join(' ');
    return (
      <button type={htmlType} className={cls}>
        {children &&
          React.Children.map(children, (child) => {
            if (!child) return child;
            if (React.isValidElement(child)) return child;
            return <span>{child}</span>;
          })}
      </button>
    );
  }
}
