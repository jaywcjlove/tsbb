import React from 'react';
import PropTypes from 'prop-types';
import styles from './style/index.module.less';
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
export default function Button(props: ButtonProps = {}) {
  const {
    prefixCls,
    type,
    size,
    active,
    disabled,
    block,
    basic,
    className,
    loading,
    children,
    htmlType,
    ...others
  } = props;

  const cls = [
    className,
    prefixCls,
    styles.test,
    size ? `${prefixCls}-${size}` : false,
    type ? `${prefixCls}-${type}` : false,
    basic ? `${prefixCls}-basic` : false,
    loading ? `${prefixCls}-loading` : false,
    disabled || loading ? 'disabled' : false,
    active ? 'active' : false,
    block ? 'block' : false,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button {...others} disabled={disabled || loading} type={htmlType} className={cls}>
      {children &&
        React.Children.map(children, (child) => {
          if (React.isValidElement(child)) return child;
          return <span> {child} </span>;
        })}
    </button>
  );
}

Button.defaultProps = {
  prefixCls: 'w-btn',
  disabled: false,
  active: false,
  loading: false,
  block: false,
  basic: false,
  htmlType: 'button',
  type: 'light',
  size: 'default',
};
Button.propTypes = {
  prefixCls: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  block: PropTypes.bool,
  active: PropTypes.bool,
  basic: PropTypes.bool,
  htmlType: PropTypes.string,
  type: PropTypes.oneOf(['primary', 'success', 'warning', 'danger', 'light', 'dark', 'link']),
  size: PropTypes.oneOf(['large', 'default', 'small']),
};
