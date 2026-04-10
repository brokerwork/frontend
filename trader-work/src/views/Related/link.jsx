import React, { Component } from 'react'
import { connect } from 'react-redux'

import * as linkActions from '@/actions/Related/link'
import * as appActions from '@/actions/App/app'
import * as commonActions from '@/actions/Common/common'
import i18n from '@/utils/i18n'

import './link.less'

class Link extends Component {
    constructor() { 
        super()
    }

    componentDidMount() { 
        const { getLink, setHeaderTitle } = this.props
        setHeaderTitle(i18n['menu.relatedmgmt.loadcenter'])
        getLink()
    }
    componentWillReceiveProps(){
        this.props.setHeaderTitle(i18n['menu.relatedmgmt.loadcenter'])
    }
    convertUrl = (url) => {
		let reg = /^https?:\/\/.{1,}$/
		if (reg.test(url)) {
			return url
		}
		return `//${url}`
	}

    render() {
        const { links }=this.props
        return (
            <div className="link-container">
                {
                    links && links.map((item, index) => { 
                        return <div key={index} className="link-row">
                            <span className="link-point"></span>
                            <span className="link-name">{item.linkName}</span>
                            <a
                                target="_blank"    
                                href={this.convertUrl(item.link)}
                                className="link-href">
                                {item.linkDesc}
                            </a>
                        </div>
                    })
                }    
            </div>
        )
    }
}

export default connect(
    ({ related }) => { 
        return {
            links: related.links,
        }
    }, {
        ...linkActions,
        ...appActions,
        ...commonActions,
    }
)(Link)