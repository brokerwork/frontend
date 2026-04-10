// libs
import * as React from 'react';
import {
	Modal,
	FormGroup,
	Col,
	ControlLabel,
	InputGroup,
	FormControl
} from 'fooui';
/* ------------------- main start ---------------------- */

class CommissionSettingPopup extends React.Component<{}, {}> {
	refs: any;
	constructor(props: any) {
		super(props);
	}

	saveCommissionSetting = () => {

	}

	show = () => {
		this.refs.m.show();
	}

	render() {
		return (
			<Modal
				show={false}
				ref="m"
				title="佣金参数"
				hasOk
				okText="保存"
				onOk={this.saveCommissionSetting}
				>
				<FormGroup style={{ width: '900px' }}>
					<Col componentClass={ControlLabel} sm={3}>
						XAU 1：(上级:0 $/每手)
            </Col>
					<Col sm={3}>
						<FormGroup>
							<InputGroup>
								<FormControl type="text" placeholder="" />
								<InputGroup.Addon>$/每手</InputGroup.Addon>
							</InputGroup>
						</FormGroup>
					</Col>
					<Col componentClass={ControlLabel} sm={3}>
						XAU 1：(上级:0 $/每处理)：
            </Col>
					<Col sm={3}>
						<FormGroup>
							<InputGroup>
								<FormControl type="text" placeholder="" />
								<InputGroup.Addon>$/每手</InputGroup.Addon>
							</InputGroup>
						</FormGroup>
					</Col>
				</FormGroup>
			</Modal>
		)
	}
}

export default CommissionSettingPopup;