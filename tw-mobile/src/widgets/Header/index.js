import React from 'react';

import css from "./index.less";

export class Header extends React.Component {
	render() {
		return (
			<div className={css["header"]}>
				<div className={css["header-top"]}>
					<div className={css["custom"]}>
						{this.props.children}
					</div>
				</div>
			</div>
		)
	}
}
