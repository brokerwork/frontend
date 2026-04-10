import * as React from 'react';
import {Table, TableColumnOpt} from 'fooui';
import {BWUserDTO as User} from '../model/user';


let hardCodeOpts:Array<TableColumnOpt> = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '8%',
        sortable: true
    },
    {
        title: '用户编号',
        dataIndex: 'userId',
        key: 'userId',
        width: '10%'
    },
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: '10%'
    },
    {
        title: '角色',
        dataIndex: 'roleId',
        key: 'roleId',
        width: '10%'
    },
    {
        title: '层级',
        dataIndex: '',
        key: '',
        width: '10%'
    },
    {
        title: '上级用户',
        dataIndex: 'parent',
        key: 'parent',
        width: '10%'
    },
    {
        title: '下级用户',
        dataIndex: '',
        key: '',
        width: '10%'
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        width: '10%'
    },
    {
        title: '手机',
        dataIndex: 'phone',
        key: 'phone',
        width: '10%'
    },
    {
        title: '城市',
        dataIndex: 'city',
        key: 'city',
        width: '10%'
    }
];

interface P {}
interface S {
    users:Array<User>;
}

class UserRecycleTable extends React.Component<P, S>{
    refs:any;
    constructor(props:P){
        super(props);
        this.state = {
            users: []
        }
    }
    selfSetState = (data:Array<User>)=>{
        this.setState({
            users: data
        })
    };
    render() {
        let opts:Array<TableColumnOpt> = [{
            title: '',
            key: 'checkbox',
            width: '2%',
            renderer: (value:any, rowData:User)=>{
                return (
                    <input type="checkbox"
                           checked={rowData.selected}
                           onChange={(e)=>{
                                var selected = !rowData.selected;
                            }}
                    />)
            },
            headerRenderer: (value:any, rowData:User)=>{
                return (
                    <input type="checkbox"
                           onChange={(e)=>{
                                var selected = !rowData.selected;
                            }}
                    />)
            }
        }].concat(hardCodeOpts);
        return (
            <Table columns={opts} data={this.state.users} />
        );
    }
}

export {UserRecycleTable};