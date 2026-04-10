import * as React from 'react';
import {Button, Row, Col} from 'fooui';
import * as classnames from 'classnames';
import {Panel,
    DropdownButton, MenuItem, CustomDateRangePicker,
    FormControl, ButtonGroup, FormGroup, Form, Checkbox
} from 'fooui';
import {HttpClient} from '../../http/httpclient';
import {UserHelper} from '../../common/userHelper';
import PrivilegeHelper from '../../common/privilegeHelper';
let userInfo = UserHelper.getUserInfo();
interface P {

}
interface S {
    emailType?:any

}
class ResendMessage extends React.Component<P, S>{

    constructor(props: P) {
        super(props);
        this.state={
            emailType:[]
        }

    }
    componentDidMount() {
        this.sendEmail();
    }
    sendEmail=()=>{
        var url='/v1/message/config/list';
        var param={
            "type":"MAIL",
            "level":"USER"
        }
        HttpClient.doPost(url,param)
            .then(res=>{
                let arr = [];
                let usertempid ;
                if(res.result){
                    var len = res.data.length;
                    for (var i = 0;i<len;i++) {
                        if (res.data[i].level === "TENANT"){
                                usertempid = res.data[i].id
                                    for (var i = 0;i<len;i++) {
                                        let obj = {};
                                        obj.label = res.data[i].from;
                                        obj.value = res.data[i].id;
                                        arr.push(obj);
                                    }
                        }
                        
                    }
                    this.setState({
                        emailType:arr
                    })
                }
            })
    }

    render() {
        return (
            <Form horizontal className="add-panel small-panel resend-message">
                <FormGroup>
                    <Col  sm={4} className="fontcolor">
                        <span className="required-field">*</span>
                        选择发件邮箱：
                    </Col>
                    <Col sm={8}>
                        <select ref="selectEmail" className="form-control m-bot15 resend-form">
                            {
                                this.state.emailType.map((item)=>{
                                    return(
                                    <option value={item.value}>{item.label}</option>
                                        )
                                    })
                                }
                        </select>

                    </Col>
                </FormGroup>


            </Form>

        )
    }
}

export {ResendMessage};