require('babel-polyfill');
import * as React from 'react';
import {MenuItem, Dropdown} from 'react-bootstrap';
import {Button} from 'fooui';
import { HttpClient } from '../http/httpclient'

interface P {
}
interface S {
    companyEmail: string;
    companyAddress: string;
    companySite: string;
    companyPhone: string;
    companyName: string;
    showPoweredBy: boolean;
}
class AppFooter extends React.Component<P, S>{
    constructor(props: P) {
        super(props);
        this.state = {
            companyEmail: "support@lwork.com",
            companyAddress: "SHANGHAI",
            companySite: "www.lwork.com",
            companyPhone:"86-021-64335673",
            companyName: "LEAN WORK",
            showPoweredBy: true
        }
    }
    componentWillMount() {
		this.getlogo();
	}
    getlogo = () => {
		var url = '/v1/product/brand';
		HttpClient.doGet(url)
			.then(res => {
				if(res.result) {
					if(res.data.companyPhone != "" || res.data.companyPhone != undefined) {
						this.setState({companyPhone:res.data.companyPhone});
					}
					if(res.data.companyEmail != "" || res.data.companyEmail != undefined) {
						this.setState({companyEmail: res.data.companyEmail});
					}
					if(res.data.companyAddress != "" || res.data.companyAddress != undefined) {
						this.setState({companyAddress: res.data.companyAddress});
					}
                    if(res.data.companySite != "" || res.data.companySite != undefined) {
						this.setState({companySite: res.data.companySite});
					}
                    if( res.data.companyName != "" || res.data.companyName !=undefined){
                        this.setState({companyName: res.data.companyName});
                    }
                    if( res.data.showPoweredBy != undefined){
                        this.setState({showPoweredBy: res.data.showPoweredBy});
                    }
				}
			})
	}
    render() {
        return (
            <footer className="footer-section">
                <div className="text-center">
                    <i className="fa fa-envelope"></i>&nbsp; <a href={"mailto:" + this.state.companyEmail}>{this.state.companyEmail}</a>
                   &nbsp;&nbsp;<i className="fa fa-phone"></i> &nbsp;{this.state.companyPhone}&nbsp;&nbsp;<i className="fa fa-map-marker"></i> &nbsp;&nbsp;{this.state.companyAddress} &nbsp;&nbsp;
                    Copyright © {new Date().getFullYear()} <a href={this.state.companySite} target="_blank" className="decorate">{this.state.companyName}</a>. All rights reserved. {this.state.showPoweredBy ? <span>Powered by <a href="http://www.lwork.com" className="decorate" target="_blank">LEAN WORK</a></span> : undefined}
                </div>
            </footer>
        );
    }
}
export {AppFooter};