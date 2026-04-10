import React from 'react';
import { Page, PageContent } from 'widgets/PageWrapper';
import { Header } from "widgets/Header";
import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import cssLogin from 'pages/Login/components/login.less';
import css from './settings.less';
import { pxToRem, fontSizeByDPR } from '../../utils/styleUtils';
import { IconTextField } from "../../widgets/IconTextField";
import { IconSelectField } from "../../widgets/IconSelectField";
import SelectField from 'material-ui/SelectField';
import { getCachedToken } from 'utils/userinfo';
import i18n from 'utils/i18n'

let email = require("images/icon_email@3x.png");
let area = require("images/icon_area_code@3x.png");
let phone = require("images/icon_phone_number@3x.png");
let verification = require("images/icon_verification_code@3x.png");
let pwd = require("images/icon_password@3x.png");
let pwd2 = require("images/icon_confirm_password@3x.png");

let textStyle = {
    width: "100%",
    height: pxToRem(88)
};
let hintStyle = {
    lineHeight: pxToRem(88),
    bottom: "50%",
    top: "initial",
    transform: "translateY(50%)"
};
let underlineStyle = {
    bottom: 0
};
let underlineFocusStyle = {
    borderColor: "#00A3FE"
};
let wrapper = {
    paddingLeft: pxToRem(30),
    paddingRight: pxToRem(30),
    borderTop: '1px solid rgb(224,224,224)',
};
let inkBarStyle = {
    height: pxToRem(4),
    marginTop: pxToRem(-4),
    backgroundColor: "#fff"
}

export class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            phone: '',
            verification: '',
            pwd: '',
            pwd2: '',
            area: "+86",
            time: i18n['general.getverifycode'],
            disabledTime: false,
            isEmail: true//用于判断是绑定email还是phone
        };
    }
    _renderPassword = () => {
        return (
            <div>
                <IconTextField
                    iconSrc={pwd}
                    type={"password"}
                    hintText={i18n['login.errormsg.password.required']}
                    value={this.state.pwd}
                    onChange={this._onPasswordChange}
                    style={textStyle}
                    underlineStyle={underlineStyle}
                    hintStyle={hintStyle}
                    underlineFocusStyle={underlineFocusStyle}
                />
                <IconTextField
                    iconSrc={pwd2}
                    type={"password"}
                    hintText={i18n['password.confirm.errMsg2']}
                    value={this.state.pwd2}
                    onChange={this._onPasswordChange2}
                    style={textStyle}
                    underlineStyle={underlineStyle}
                    hintStyle={hintStyle}
                    underlineFocusStyle={underlineFocusStyle}
                />
            </div>
        )
    }
    _renderEmail = () => {
        return (
            <div style={wrapper}>
                <IconTextField
                    iconSrc={email}
                    hintText={i18n['menu.email']}
                    value={this.state.email}
                    onChange={this._onEmailChange}
                    style={textStyle}
                    underlineStyle={underlineStyle}
                    hintStyle={hintStyle}
                    underlineFocusStyle={underlineFocusStyle}
                />
                {this._renderPassword()}
            </div >
        )
    }
    _renderPhone = () => {
        let verifyStyle = {
            position: "absolute",
            right: 0,
            top: pxToRem(11),
            height: pxToRem(66),
            color: "#00a3fe",
            border: pxToRem(1) + ' solid #00a3fe',
            borderRadius: pxToRem(8),
            zIndex: 100,
            marginLeft: pxToRem(40),
            textAlign: 'center'
        };
        let items = [
            <MenuItem value="+86" key="0" primaryText="+86" />,
            <MenuItem value="1" key="1" primaryText="1" />,
            <MenuItem value="2" key="2" primaryText="2" />,
            <MenuItem value="3" key="3" primaryText="3" />
        ];
        let selectedStyle = {
            paddingLeft: pxToRem(80),
            backgroundImage: `url("${area}")`,
            backgroundSize: `${fontSizeByDPR(38)} ${fontSizeByDPR(38)}`,
            backgroundPositionX: fontSizeByDPR(17),
            backgroundPositionY: 'center',
            backgroundRepeat: 'no-repeat',
        };
        return (
            <div style={wrapper}>
                <div className={css["clearHr"]}>
                    <SelectField
                        fullWidth
                        labelStyle={selectedStyle}
                        value={this.state.area}
                        onChange={this._onAreaChange}
                        selectedMenuItemStyle={{
                            color: "#00a3fe"
                        }}
                    >
                        {items}
                    </SelectField>
                </div>
                <IconTextField
                    iconSrc={phone}
                    hintText={i18n['forgetpwd.errormsg.mobile.requied']}
                    value={this.state.phone}
                    onChange={this._onPhoneChange}
                    style={textStyle}
                    underlineStyle={underlineStyle}
                    hintStyle={hintStyle}
                    underlineFocusStyle={underlineFocusStyle}
                />
                <div style={{ position: "relative" }}>
                    <FlatButton className={css["clearLineHeight"]} style={verifyStyle}
                        label={this.state.time}
                        disabled={this.state.disabledTime}
                        onTouchTap={this._onVerifyClick} />
                    <IconTextField
                        iconSrc={verification}
                        hintText={i18n['signup.errormsg.verifycode.required']}
                        value={this.state.verification}
                        onChange={this._onVerificationChange}
                        style={textStyle}
                        underlineStyle={underlineStyle}
                        hintStyle={hintStyle}
                        inputStyle={{ paddingRight: pxToRem(300) }}
                        underlineFocusStyle={underlineFocusStyle}
                    />
                </div>
                {this._renderPassword()}
            </div >
        )
    }
    _createBinding = (isEmail) => {
        let wStyle = {
            boxShadow: "#C1DDFB 0px 1px 6px, #C1DDFB 0px 1px 4px",
            borderRadius: pxToRem(6),
        }
        let btnStyle = {
            backgroundColor: "#00a3fe",
            height: pxToRem(88),
            lineHeight: pxToRem(88)
        };
        let overlayStyle = {
            height: pxToRem(88)
        };
        return (
            <div>
                <p className={css["settingsContentTip"]}>
                    {i18n['mobile.pc.operation']}
                </p>
                <div className={css["divWrapper"]}>
                    {
                        isEmail ? this._renderEmail() :
                            this._renderPhone()
                    }
                </div>
                <div className={css["settingsContentOK"]}>
                    <RaisedButton label={i18n['bindaccount.confirm']}
                        labelColor="#fff"
                        buttonStyle={btnStyle}
                        overlayStyle={overlayStyle}
                        style={wStyle}
                        onTouchTap={this._onConfirmBinding}
                        fullWidth={true} />
                </div>
            </div>
        )
    }
    _onEmailChange = (event, value) => {
        this.setState({
            email: value
        });
    }
    _onAreaChange = (event, index, value) => {
        this.setState({
            area: value
        });
    }
    _onPhoneChange = (event, value) => {
        this.setState({
            phone: value
        });
    }
    _onVerificationChange = (event, value) => {
        this.setState({
            verification: value
        });
    }
    _onPasswordChange = (event, value) => {
        this.setState({
            pwd: value
        });
    }
    _onPasswordChange2 = (event, value) => {
        this.setState({
            pwd2: value
        });
    }
    _onVerifyClick = () => {
        let { area, phone } = this.state;
        let { fetchVerificationCode } = this.props;
        if (!phone) {
            return;
        }
        let time = 60;
        this.setState({
            time,
            disabledTime: true
        });
        let timer = setInterval(() => {
            time--;
            if (time === 0) {
                this.setState({
                    time: i18n['general.getverifycode'],
                    disabledTime: false
                });
                clearInterval(timer);
                return;
            }
            this.setState({
                time: time
            });

        }, 1000);
        fetchVerificationCode(phone).then(res => {
            if (res.result) {
                alert('get code');
            }
            else {
                alert(res.mcode);
            }
        }, err => {
            alert(err);
        });
    }
    _onConfirmBinding = (event) => {
        if (this.state.pwd !== this.state.pwd2) {
            alert(i18n['password.confirm.errMsg1']);
            return;
        }
        let url = '';
        let params = {};
        params.password = this.state.pwd;
        params.pwdVerify = this.state.pwd2;
        if (this.state.isEmail) {
            params.email = this.state.email;
            let { bindEmail } = this.props;
            bindEmail(params).then(res => {
                if (res.result) {
                    this.props.router.push('/accounts');
                }
                else {
                    alert(res.mcode);
                }
            }, err => {
                alert(err);
            });
        }
        else {
            params.phone = this.state.phone;
            params.code = this.state.verification;
            let { bindPhone } = this.props;
            bindPhone(params).then(res => {
                if (res.result) {
                    this.props.router.push('/accounts');
                }
                else {
                    alert(res.mcode);
                }
            }, err => {
                alert(err);
            });
        }
    }
    _onResetData = () => {
        setTimeout(function () {
            myScroll.refresh();
        }, 0);
        let isEmail = this.state.isEmail;
        this.setState({
            email: '',
            phone: '',
            verification: '',
            pwd: '',
            pwd2: '',
            isEmail: !isEmail
        });
    }
    _onDelayBinding = (event) => {
        event.preventDefault();
        this.props.router.push('/accounts');
    }
    render() {
        return (
            <Page className={css["settings"]}>
                <PageContent>
                    <Header>
                        <header className={css["settingsHeader"]}></header>
                    </Header>
                    <Tabs className={cssLogin['tabs']}
                        onChange={this._onResetData}
                        inkBarStyle={inkBarStyle}>
                        <Tab label={i18n['menu.email']}
                            style={{float:"left"}}
                            className={cssLogin['tab']}>
                            {this._createBinding(true)}
                        </Tab>
                        <Tab label={i18n['signup.mobile']}
                            style={{float:"right"}}
                            className={cssLogin['tab']} >
                            {this._createBinding(false)}
                        </Tab>
                    </Tabs>
                    <div className={css["settingsContentBind"]}>
                        <a href="#" onTouchEnd={this._onDelayBinding}>{i18n['mobile.after.bind']}</a>
                    </div>
                </PageContent>
            </Page >
        );
    }
}