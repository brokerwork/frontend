import * as React from 'react';
import PropTypes from 'prop-types';
import * as classNames from "classnames"
import SiderBar from "./sider"

export interface BasicProps extends React.HTMLAttributes<HTMLDivElement> {
  prefix?: string;
  direction?: string;
}

function generator(props: BasicProps) {
    return class Adapter extends React.Component<BasicProps, any> {
		render() {
			const { prefix } = props
			const { className, direction, children, ...others } = this.props;
			const classes = classNames(prefix, className, {
				[`${prefix}-horizontal`]: direction === "horizontal"
			});
		  	return <div className={classes} {...others}>{children}</div>
		}
	}
}

export const Layout = generator({
	prefix: 'lean-layout',
});

export const Header = generator({
	prefix: 'lean-header',
});

export const Footer = generator({
	prefix: 'lean-footer',
});

// export const Sider = generator({
// 	prefix: 'lean-sider',
// });

export const Content = generator({
	prefix: 'lean-content',
});
export const Sider = SiderBar
export default { Layout, Header, Sider, Footer, Content }
