import React from 'react';
import css from "./index.less";

export class AccountHeader extends React.Component {

	render() {
		let index = 0;
		let { items, vendor } = this.props;
		let logo = ''
		let structuralList = JSON.parse(window.localStorage.getItem('LIST') || '{}')
		if (structuralList && structuralList.length){ 
			structuralList.forEach((item) => {
				if (item.structural == vendor){ 
					logo = item.basicSetting.structuralLogo
				}
			})
		}
		return (
			<div
				className={css["wrapper"]}>
				<div className={css["content"]}>
					<div className={css["logo"]}>
						<img src={logo}/>
					</div>
					<div className={css["right"]}>
						<div className={css["title"]}>{vendor}</div>
						{
							items && items.map((item) => {
								return (
									<div className={css["item"]} key={'accountHeader'+index++}>
										<span>{item.title}</span>
										<span>{item.content}</span>
									</div>
								)
							})
						}
					</div>
				</div>
			</div>
		)
	}

}

AccountHeader.propTypes = {
	items: React.PropTypes.array
}