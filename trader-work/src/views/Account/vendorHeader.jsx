import React, { Component } from 'react'
import { Select } from 'antd'
import Button from '@/components/Button'
import './vendorHeader.less'
import i18n from '@/utils/i18n'

const { Option } = Select

class VendorHeader extends Component { 
    constructor() { 
        super()
    }

    componentWillMount() { 
        const { getPlatformList, platformList } = this.props
        if (!platformList || platformList.length <= 0) { 
            getPlatformList && getPlatformList()
        }
    }

    onSelectVendor = (vendor) => { 
        this.props.history.push(`/account/open/real/${vendor}`)
    }

    render() { 
        const { bindIcon, vendorName, description, type, platformList, showBtn, tip, plat } = this.props
        let vendorList = []
        let vendor = ''
        if (platformList && platformList.length) { 
            platformList.forEach((item) => { 
                if (item.featureStatus.LiveAccount === 'Enabled') { 
                    vendorList.push({
                        vendor: item.vendor,
                        displayName: item.displayName,
                    })
                }
                if (item.displayName == vendorName) { 
                    vendor = item.vendor
                }
            })
        }
        return (
            [<div className="vendor-header">
                <div>
                    <div className="vendor-icon-wrap">
                        <div className="vendor-icon">
                            <img src={bindIcon}/>
                        </div>
                    </div>
                    <div className="vendor-title">
                        {
                            type && type == 'real' && vendorList.length
                                ?
                            <Select
                                onChange={this.onSelectVendor}
                                dropdownMatchSelectWidth={false}
                                defaultValue={vendor}>
                                    {
                                        vendorList.map((item) => { 
                                            return <Option value={item.vendor}>{item.displayName}</Option>
                                        })
                                    }
                            </Select> : <p className="vendor-vendor">{vendorName}</p>
                        }
                        <p className="vendor-des">{description}</p>
                    </div>
                </div>
                {showBtn && <Button type="primary" onClick={this.props.onSave}>{i18n['general.save']}</Button>}
            </div>, (plat==='MT4'||plat==='MT5') && <div className="head-tip" dangerouslySetInnerHTML={{__html: tip}}></div>]
        )
    }
}

export default VendorHeader