import React from 'react';
import classnames from 'classnames';
import { IProps } from './common/props';

export type TSize = 'large' | 'default' | 'small';
export interface IButton extends IProps {
  prefixCls?: string;
  size: TSize;
}

export default class Button extends React.PureComponent<IButton, {}> {
  public static defaultProps: IButton = {
    prefixCls: 'w-btn',
    size: 'default',
  }
  public render() {
    const { prefixCls, className, children, size } = this.props;
    const cls = classnames(className, {
      [`${prefixCls}-size-${size}`]: size,
    });
    return (
      <button type="button" className={cls}>
        {children && React.Children.map(children, (child) => {
          if (!child) return child;
          if(React.isValidElement(child)) return child;
          return <span>{child}</span>;
        })}
      </button>
    )
  }
}