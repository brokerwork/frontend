import React, { Component } from 'react'
import { connect } from 'react-redux'

import * as actions from '../actions'
import * as commonActions from 'common/commonActions'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils'
import { FullPagePaperComponent } from 'widgets/FullPagePaperComponent'
import SubmitSuccess from 'widgets/SubmitSuccess'

import i18n from 'utils/i18n'
import { Storage } from 'utils/storage';
import css from './index.less'
import iconAddPic from 'images/icon_addpic.png'
import sucImg from 'images/done.png'
import imgX from 'images/img_x.png'

const fullPagePaperStyle = {
    width: '100%',
	background: 'linear-gradient(45deg,#67cBEC,#2686ff)'
}

const paperStyle = {
    width: '100%',
	padding: 0,
}
const buttonStyle = {
	backgroundColor: "#00A3FE",
	height: pxToRem(88),
	lineHeight: pxToRem(88),
}

const overlayStyle = {
	height: pxToRem(88),
	transition: 'none'
}

const labelStyle = {
	fontSize: fontSizeByDPR(36)
}

const style = {
    width: "100%",
    marginTop: pxToRem(75),
	transition: 'none',
	borderRadius: pxToRem(8),
	boxShadow: "0 0 0.2rem rgba(0,0,0,0.4)",
}

const TextFieldStyle = {
    width: '100%',
}
const TextFieldHintStyle = {
    fontSize: fontSizeByDPR(28),
}

const MAX_SIZE = 5 * 1024 * 1024

class Telegraphic extends Component {
    constructor() { 
        super()
        this.state = {
            uploadImg: [],
            money: '',
            realMoney: '',
            comment: '',
            moneyErr: '',
            realMoneyErr: '',
            commentErr: '',
            pageState: 'page1',         // 汇款底单 page1, 汇款表单 page2, 汇款成功 page3
        }
    }

    componentDidMount() { 
        
    }

    onBottomSubmit = (event) => { 
        event.preventDefault()
        this.setState({
            pageState: 'page2'
        })
    }

    //  提交表单
    onFastSubmit = (event) => { 
        event.preventDefault()
        let { telegraphicDeposit, selectedAccount, msgDialog } = this.props
        let { comment, money, realMoney, uploadImg } = this.state
        let select_account = JSON.parse(window.localStorage.getItem(Storage.Keys.ACCOUNT_DATA))
		if (!selectedAccount.account && select_account) { 
			selectedAccount = select_account		
        }
        if (!money) { 
            this.setState({
                moneyErr: i18n['telegraphic.write.money']
            })
            return false
        }
        // if (!realMoney) { 
        //     this.setState({
        //         realMoneyErr: i18n['telegraphic.write.real.money']
        //     })
        //     return false
        // }
        if (uploadImg.length <= 0) { 
            return msgDialog(i18n['telegraphic.submit.sheetUploadMsg'])
        }
        telegraphicDeposit({
            comment: comment,
            currency: selectedAccount.currency,
            depositAmount: money,
            payAmount: realMoney,
            url: uploadImg,
        }).then((res) => { 
            if (res && res.payload && res.payload.result) { 
                this.setState({
                    pageState: 'page3'
                })
            }
        })
    }
    //  返回账户列表
    backAccount = () => { 
        this.props.router.push('/accounts')
    }

    moneyChange = (ele, event, val) => { 
        this.setState({
            [ele]: val,
            [`${ele}Err`]: '',
        })
    }

    changeFile = (e) => { 
        let file = e.target.files[0]
        if (file && file.size >= MAX_SIZE){ 
            return this.props.msgDialog(i18n['general.upload.imageSizeError'])
        }
        const {
            getOssSignature,
            brand,
            msgDialog,
         } = this.props
        getOssSignature(brand.tenantId).then((res) => {
            if (res && res.payload && res.payload.result){ 
                const signature = res.payload.data
                // 上传到阿里云
                let xhr = new XMLHttpRequest();
                let data = new FormData();
                data.append('OSSAccessKeyId', signature.accessKey);
                data.append('policy', signature.policy);
                data.append('Signature', signature.signature);
                data.append('success_action_status', '200');
                data.append('key', signature.key);
                data.append('file', file);

                xhr.open('POST', signature.upload, true);
                xhr.onload = () => {
                    if (xhr.status === 200) {
                        this.setState({
                            uploadImg: [
                                ...this.state.uploadImg,
                                signature.preview
                            ]
                        })
                    } else {
                        msgDialog(i18n['mobile.upload.fail'])
                    }
                }
                // 上传
                xhr.send(data);
            }
        })
    }

    //  删除图片
    deleteImg = (imgUrl) => { 
        this.setState({
            uploadImg: this.state.uploadImg.filter((item) => { 
                return item != imgUrl
            })
        })
    }

    render() {
        let depositSetting = {}
        let { selectedAccount, structuralList } = this.props;
		let select_account = JSON.parse(window.localStorage.getItem(Storage.Keys.ACCOUNT_DATA))
		if (!selectedAccount.account && select_account) { 
			selectedAccount = select_account		
		}
		let structural_list = JSON.parse(window.localStorage.getItem('LIST'))
		if (!structuralList || structuralList.length <= 0) { 
			structuralList = structural_list
        }
        if (structuralList && structuralList.length > 0) { 
            structuralList.forEach((item) => { 
                if (item.structural == selectedAccount.vendor) {
					depositSetting = item.depositSetting
                }
            })
        }
        let { uploadImg, pageState, money, realMoney, comment, moneyErr, realMoneyErr, commentErr } = this.state
        return (
            <div style={{ height: '100%' }}>
                <FullPagePaperComponent
                    style={fullPagePaperStyle}
                    paperStyle={paperStyle}>
                    {/**汇款底单**/}
                    {
                        pageState == 'page1' && <div className={css['telegraphic-bottom-form']}>
                            <div className={css['telegraphic-html']}>
                                <div dangerouslySetInnerHTML={{ __html: depositSetting.telegraphic }}></div>
                            </div>
                            <div className={css['telegraphic-html-btn']}>
                                <RaisedButton
                                    label={i18n['telegraphic.submit.title']}
                                    primary={true}
                                    buttonStyle={buttonStyle}
                                    overlayStyle={overlayStyle}
                                    style={style}
                                    labelStyle={labelStyle}
                                    onTouchTap={this.onBottomSubmit}/>
                            </div>
                        </div>
                    }
                    {/*电汇入金表单*/}
                    {
                        pageState == 'page2' && <div className={css['tele-des-form']}>
                            <p className={css['tele-des-tit']}>{i18n['telegraphic.modal.cardTitle']}</p>
                            <p className={css['tele-des-info']}><span>{i18n['telegraphic.submit.account']}</span><span className={css['info-right']}>{selectedAccount.account}</span></p>
                            <p className={css['tele-des-info']}><span>{i18n['telegraphic.submit.accountName']}</span><span className={css['info-right']}>{selectedAccount.accountName}</span></p>
                            <p className={css['tele-des-info']}><span>{i18n['deposit.currency']}</span><span className={css['info-right']}>{selectedAccount.currency}</span></p>
                            <div className={css['tele-field']}>
                                <TextField
                                    id={'deposit-money'}
                                    value={money}
                                    errorText={moneyErr}
                                    hintText={`${i18n['telegraphic.write.money']}(${selectedAccount.currency})`}
                                    hintStyle={TextFieldHintStyle}
                                    style={TextFieldStyle}
                                    onChange={this.moneyChange.bind(this, 'money')}/>
                                <TextField
                                    id={'real-deposit-money'}
                                    value={realMoney}
                                    errorText={realMoneyErr}
                                    hintText={i18n['telegraphic.write.real.money']}
                                    hintStyle={TextFieldHintStyle}
                                    style={TextFieldStyle}
                                    onChange={this.moneyChange.bind(this, 'realMoney')}/>
                                <TextField
                                    id={'deposit-comment'}
                                    value={comment}
                                    errorText={commentErr}
                                    hintText={i18n['telegraphic.write.comment']}
                                    hintStyle={TextFieldHintStyle}
                                    style={TextFieldStyle}
                                    onChange={this.moneyChange.bind(this, 'comment')} />
                            </div>
                            <p className={css['tele-des-tit2']}>{i18n['telegraphic.submit.sheetUploadMsg']}</p>
                            <div className={css['img-wrap']}>
                                <div className={css['add-pic']}>
                                    {
                                        uploadImg && uploadImg.length ? uploadImg.map((item, index) => { 
                                            return <div key={index} className={css['upload-pic-wrap']}>
                                                <img onClick={this.deleteImg.bind(this, item)} src={imgX} className={css['upload-pic-x']}/>
                                                <img src={item.indexOf('http') == 0 || item.indexOf('//') == 0 ? item : `/api${item}`} className={css['upload-pic']} />
                                            </div>
                                        }) : null
                                    } 
                                    <div className={css['add-file']}>
                                        {
                                            uploadImg.length < 10 && <img src={iconAddPic} className={css['icon-pic']} />
                                        }
                                        <input type='file' onChange={this.changeFile}/>
                                    </div>
                                </div>
                            </div>
                            <div className={css['telegraphic-html-btn']}>
                                <RaisedButton
                                    label={i18n['general.button.submitNow']}
                                    primary={true}
                                    buttonStyle={buttonStyle}
                                    overlayStyle={overlayStyle}
                                    style={style}
                                    labelStyle={labelStyle}
                                    onTouchTap={this.onFastSubmit}/>
                            </div>
                        </div>
                    }
                    {/*汇款底单提交成功*/}
                    {
                        pageState == 'page3' && <div className={css['tele-form-suc']}>
                            <div className={css['suc-tit']}>
                                <SubmitSuccess
                                    img={sucImg}
                                    title={i18n['telegraphic.submit.success']}
                                    des={i18n['telegraphic.down.info']}/>
                            </div>
                            <div className={css['suc-form']}>
                                <div className={css['account-info']}>
                                    <p className={css['tele-des-tit']}>{i18n['telegraphic.account.info']}</p>
                                    <p className={css['tele-des-info2']}><span>{i18n['telegraphic.submit.account']}</span><span className={css['info-right']}>{selectedAccount.account}</span></p>
                                    <p className={css['tele-des-info2']}><span>{i18n['telegraphic.submit.accountName']}</span><span className={css['info-right']}>{selectedAccount.accountName}</span></p>
                                    <p className={css['tele-des-info2']}><span>{i18n['deposit.currency']}</span><span className={css['info-right']}>{selectedAccount.currency}</span></p>
                                </div>
                                <div className={css['hui-info']}>
                                    <p className={css['tele-des-tit']}>{i18n['telegraphic.deposit.info']}</p>
                                    <p className={css['tele-des-info2']}><span>{i18n['fundflow.column.deposit.depositAmount']}</span><span className={css['info-right']}>{money}</span></p>
                                    <p className={css['tele-des-info2']}><span>{i18n['telegraphic.real.money']}</span><span className={css['info-right']}>{realMoney}</span></p>
                                    <p className={css['tele-des-info2']}><span>{i18n['fundflow.column.common.comment']}</span><span className={css['info-right']}>{comment}</span></p>
                                </div>
                                <div className={css['hui-img']}>
                                    <p className={css['tele-des-tit']}>{i18n['telegraphic.submit.sheet']}</p> 
                                    {
                                        uploadImg && uploadImg.length ? uploadImg.map((item, index) => { 
                                            return <img key={index} src={item.indexOf('http') == 0 || item.indexOf('//') == 0 ? item : `/api${item}`}/>
                                        }) : null
                                    }
                                </div>
                            </div>
                            <div className={css['telegraphic-html-btn']}>
                                <RaisedButton
                                    label={i18n['mobile.back.account']}
                                    primary={true}
                                    buttonStyle={buttonStyle}
                                    overlayStyle={overlayStyle}
                                    style={style}
                                    labelStyle={labelStyle}
                                    onTouchTap={this.backAccount}/>
                            </div>
                        </div>
                    }
                </FullPagePaperComponent>
            </div>
        )
    }
}

export default connect(
    ({ common, telegraphicPage }) => ({
        brand: common.brand,
        selectedAccount: common.selectedAccount,
		structuralList: common.structuralList
    }), ({...actions, ...commonActions})
)(Telegraphic)