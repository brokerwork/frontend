import React, { Component } from 'react'
import { connect } from 'react-redux'
import uuid from 'uuid'

import * as actions from '../../actions'
import * as commonActions from 'common/commonActions'
import { getCachedToken } from 'utils/userinfo'
import i18n from 'utils/i18n'

import css from './index.less'
import iconAddPic from 'images/icon_addpic.png'

const MAX_SIZE = 5 * 1024 * 1024

class RenderImg extends Component { 
    constructor() { 
        super()
        this.state = {
            
        }
    }

    changeFile = (e) => { 
        let file = e.target.files[0]
        if (file.size >= MAX_SIZE){ 
            return this.props.msgDialog(i18n['general.upload.imageSizeError'])
        }
        const {
            getOssSignature,
            brand,
            upload,
            item,
            updateFormData,
            formData,
            errText,
            updateErrText,
            isSame,
            msgDialog
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
                        updateFormData({
                            ...formData,
                            [item.key]: signature.preview
                        })
                        updateErrText({
                            ...errText,
                            [item.key]: ''
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

    render() { 
        const {
            formData,
            errText,
            updateErrText,
            isSame,
            item
        } = this.props
        return (
            <div className={css['img-wrap']}>
                <div className={css['add-pic']}>
                    {
                        formData[item.key] ? <img
                            src={formData[item.key].indexOf('http') == 0 || formData[item.key].indexOf('//') == 0 ? formData[item.key] : `/api${formData[item.key]}`}
                            className={css['upload-pic']} />
                            : <img src={iconAddPic} className={css['icon-pic']} />
                    } 
                    <input type='file' accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" onChange={this.changeFile}/>
                </div>
                {
                    errText[item.key] && <div className={css['line']}>{errText[item.key]}</div>
                }
            </div>
        )
    }
}
export default connect(
    ({ common, openAcctStepPage }) => ({
        brand: common.brand,
    }), ({ ...actions, ...commonActions })
)(RenderImg)