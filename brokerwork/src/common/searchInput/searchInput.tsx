// libs
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import {UserHelper} from '../../common/userHelper';
import {HttpClient} from '../../http/httpclient';
import { Message } from 'fooui';

let token = UserHelper.getToken();
interface P {
    className?: string;
    classMenu?: string;
    isChangeText?: boolean;
    hasMenu?: boolean;
    onChange?: any;
    menuItemColor?: number;
    alignment?:string //下拉框的对齐方式,
    selectedIndex?:number;
    defaluttext?: string;
    getData?:any;
    getHandleData?: any;
    callbackparent?:any;
    vendor:any;
    server:any;
}
interface S {
    showMenu?: boolean;
    defaluttext?: string;
    data?:any;
    selectedLogin: string;
    open: boolean;
    showRenderMenu: boolean;
}

export default class SearchSelect extends React.Component<P, S>{
    static defaultProps = {
        className: '',
        classMenu: '',
        default: 'default',
        isChangeText: false,
        hasMenu: true,
        onChange: (e: any)=> {},
        alignment:'alignLeft'
    }
    constructor(props: P) {
        super(props);    
        this.state = {
            showMenu: false,
            data:[],
            showRenderMenu: false
        };
    }
    componentDidMount(){//初始化获得用户信息
         this.setState({
            selectedLogin:this.props.defaluttext; 
        })
    }

    componentWillReceiveProps = (newProps) => {
        this.setState({
            selectedLogin:newProps.defaluttext; 
        })
    }

    _onClickItem = (item)=> {//点击之后更新文本框结果＋把选择结果回传回去
        ReactDOM.findDOMNode(this.refs.cnm).value = item
        this.setState({
            showMenu: false,
            selectedLogin: item
        },() => {
            ReactDOM.findDOMNode(this.refs.cnm).value = item
        });
        this.props.callbackparent(item);
    }

    _onClickShowMenu = (e: any)=> {  
        ReactDOM.findDOMNode(this.refs.cnm).value = "";
        this.setState({
                showMenu: true,
                defaluttext:"",
                data:[]
            }) 
        if (this.props.hasMenu) {
            this.setState({
                showMenu: !this.state.showMenu
            });
        }else{
            this.onSearch(this.state.defaluttext);
        }
    }

    promiseId = 0

    onSearch = () => {
        const {vendor, server} = this.props;
        let text = ReactDOM.findDOMNode(this.refs.cnm).value;
        if (server === undefined){
           Message.error("请选择服务器");
           return
        }
        if(text === "" || text === undefined){
            return undefined
        }
        let extraHeaders = {
                 "x-api-vendor": vendor,
                "x-api-serverid":server,
                'X-Api-Token': token
        }
        const p = HttpClient.doGet( '/v1/account/manage/fuzzy/' + text + '?returnNum=10', {}, extraHeaders) 
                .then(res=>{
                    if(res.data && p.id === this.promiseId){
                        this.setState({
                            data: res.data,
                            showMenu: true
                        })
                    }
            }) 
        p.id = ++this.promiseId;    
    }
    

    _onClickHideMenu = (e: any)=> {
        let self: any = this;
        setTimeout(function() {
            self.setState({
                showMenu: false
            });
        }, 500);
    }

    render() {
        const {selectedLogin, data} = this.state;
        let divStyle = this.state.showMenu ? " open newSelectInput" : "newSelectInput";
        let btnStyle = "btn dropdown-toggle" + this.props.className;
        return (
            <div className={divStyle} >
                <button type="button" onClick={this._onClickShowMenu} className="btn">
                    {selectedLogin}<i className='fa fa-caret caret'></i>
                </button>
                <ul className={"outer"+" "+this.props.alignment} onMouseLeave={this._onClickHideMenu}>
                    <div>
                        <input type="text" 
                            className={btnStyle}
                            ref="cnm"
                            data-toggle="dropdown"
                            aria-expanded="false"
                            onChange={this.onSearch}            
                        />
                    </div>
                    {
                        data && data.map((item, index) => {
                            return <li key={index} className="inner" onClick={this._onClickItem.bind(this, item)}>
                                         {item}
                                    </li>
                        })
                    }
                </ul>
            </div>
        );
    };
}
