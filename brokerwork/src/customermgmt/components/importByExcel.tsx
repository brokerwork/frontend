import * as React from 'react';
import {Button, Row, Col} from 'fooui';
import * as classnames from 'classnames';

interface P{}
interface S{
    selectedIndex:number
}
class ImportByExcel extends React.Component<P,S>{

    constructor(props:P){
        super(props);
        this.state = {
            selectedIndex:0
        }
    }

    tabSwitch = (index)=>{
        this.setState({selectedIndex: index});
    };

    render(){
        let cn1 = classnames({
            'primary': this.state.selectedIndex == 0
        });
        let cn2 = classnames({
            'primary': this.state.selectedIndex == 1
        });
        let cn3 = classnames({
            'primary': this.state.selectedIndex == 2
        });
        return (
            <div className="import-panel">
                <div className="import-steps">
                    <Col md={4}>
                        <Button bsStyle={cn1}>1.上传文档</Button>
                    </Col>
                    <Col md={4}>
                        <Button bsStyle={cn2}>2.导入数据</Button>
                    </Col>
                    <Col md={4}>
                        <Button bsStyle={cn3}>3.完成</Button>
                    </Col>
                </div>
                <div className="tab1" style={this.state.selectedIndex == 0 ? {display:'block'} : {display:'none'}}>
                    <div className="tab2"></div>
                    <div className="tab3"></div>
                    <div className="step1">一,请按照数据模版的格式准备要导入的数据.<a href="#/import/template/download">下载数据模版</a></div>
                    <div className="import-notes">
                        <h5>注意事项:</h5>
                        <ul>
                            <li>模板中的表头名称不可更改,表头行不能删除</li>
                            <li>项目顺序可以调整,不需要的项目可以删减,不可以增加项目</li>
                            <li>客户名称为必填项</li>
                            <li>导入文件不要超过5MB</li>
                        </ul>
                    </div>
                    <div className="step2">
                        二.请选择需要导入的XLS文件
                    </div>
                    <hr className="h-rule"/>
                    <div className="options pull-right">
                        <Button bsStyle="primary" onClick={this.tabSwitch.bind(this, 1)}>下一步</Button>
                        <Button bsStyle="primary">取消</Button>
                    </div>
                </div>
                <div className="tab2" style={this.state.selectedIndex == 1 ? {display:'block'} : {display:'none'}}>
                    <p>文件上传成功,是否导入数据</p>
                    <hr className="h-rule"/>
                    <div className="options pull-right">
                        <Button bsStyle="primary" onClick={this.tabSwitch.bind(this, 2)}>开始导入</Button>
                        <Button bsStyle="primary">取消</Button>
                    </div>
                </div>
                <div className="tab3" style={this.state.selectedIndex == 2 ? {display:'block'} : {display:'none'}}>
                    <p>数据导入完成,重复数据2条. <a href="#/import/duplicatedata/downlowd">下载</a></p>
                    <hr className="h-rule"/>
                    <div className="options pull-right">
                        <Button bsStyle="primary">确定</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export {ImportByExcel};