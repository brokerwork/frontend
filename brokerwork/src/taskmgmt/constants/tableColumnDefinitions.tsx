import * as React from 'react';
import {TableColumnOpt, Button, Col} from 'fooui';
import {utils} from '../../common/utils';
import * as DTO from '../model/index';
import SharedData from "../model/sharedData";
/* 任务列表 列定义 */

var tableDefinitions = {
    columns:[
        {
            title: '',
            dataIndex: 'emergency',
            key: 'emergency',
            width: '1%',
            renderer: function(value, rowData:DTO.TaskJobItemDTO, rowIndex){
                var elements = [];
                elements.push(rowData.emergency ? <span className="fa fa-exclamation-circle" style={{color: 'red'}}></span> : null)
                return (<span>{elements}</span>)
            }
        },
        {
            title: '优先级',
            dataIndex: 'importance',
            key: 'importance',
            width: '5%',
            renderer: function(value:any, rowData:DTO.TaskJobItemDTO, rowIndex:any) {
                let data:any = SharedData.getData();
                let priorityId = utils.getValue(rowData, 'priority');
                let obj: any = data.find((value: any, index: number, arr: any) => {
                    if (priorityId === value.cmId) {
                        return true;
                    }
                    else {
                        return false;
                    }
                });
                if (!obj) {
                    return '';
                }
                let styleObj:any;
                switch(priorityId){
                    case "1":
                        styleObj = {
                            color: '#fc445b',
                            borderColor: '#fc445b'
                        };
                        break;
                    case "2":
                        styleObj = {
                            color: '#feb400',
                            borderColor: '#feb400'
                        };
                        break;
                    case "3":
                        styleObj = {
                            color: '#1ca5fc',
                            borderColor: '#1ca5fc'
                        };
                        break;
                    case "4":
                        styleObj = {
                            color: '#3aaf7e',
                            borderColor: '#3aaf7e'
                        };
                        break;
                    default:
                        styleObj = {
                            color: '#9975b4',
                            borderColor: '#9975b4'
                        };
                }
                return <Button className="ghost-btn important-types"
                                style={Object.assign({cursor: 'default'}, styleObj)}>
                                {obj.zhCN}
                        </Button>;
            }
        },
        {
            title: 'ID',
            dataIndex: 'jobId',
            key: 'jobId',
            width: '10%',
            sortable: true,
            renderer: function(value, rowData:DTO.TaskJobItemDTO, rowIndex){
                return utils.getValue(rowData, 'jobId')
            }
        },
        {
            title: '任务标题',
            dataIndex: 'taskTitle',
            key: 'taskTitle',
            width: '10%',
            renderer: function(value, rowData:DTO.TaskJobItemDTO, rowIndex){
                return <a className="edit-card"
                            href="javascript:"
                            style={{display: 'inline-block', padding: '0 5px', color: '#428bca'}}
                        >
                            {utils.getValue(rowData, 'jobName')}
                        </a>
            }
        },
        {
            title: '任务类型/标签',
            dataIndex: 'taskCategory',
            key: 'taskCategory',
            width: '10%',
            renderer: function(value, rowData:DTO.TaskJobItemDTO, rowIndex){
                return utils.getValue(rowData, 'jobTag')
            }
        },{
            title: '指派给',
            dataIndex: 'assignTo',
            key: 'assignTo',
            width: '10%',
            renderer: function(value, rowData:DTO.TaskJobItemDTO, rowIndex){
                return "我"
            }
        },{
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: '10%',
            renderer: function(value, rowData:DTO.TaskJobItemDTO, rowIndex){
                return utils.getValue(rowData, 'state');
            }
        },{
            title: '截止时间',
            dataIndex: 'endTime',
            key: 'endTime',
            width: '10%',
            renderer: function(value, rowData:DTO.TaskJobItemDTO, rowIndex){
                return moment(utils.getValue(rowData, 'endTime')).format("MM-DD-YYYY");
            }
        },{
            title: '最新评论',
            dataIndex: 'latestComments',
            key: 'latestComments',
            width: '10%',
            renderer: function(value, rowData:DTO.TaskJobItemDTO, rowIndex){
                var comments = utils.getValue(rowData, 'commentList') || [];
                var latestComment:DTO.JobComment = comments[0]
                return utils.getValue(latestComment, 'content')
            }
        },{
            title: '发布者',
            dataIndex: 'publisher',
            key: 'publisher',
            width: '10%',
            renderer: function(value, rowData:DTO.TaskJobItemDTO, rowIndex){
                var keypair:DTO.KeyValPair = utils.getValue(rowData,'creator');
                return utils.getValue(keypair.name);
            }
        },{
            title: '最后更新时间',
            dataIndex: 'lastUpdateTime',
            key: 'lastUpdateTime',
            width: '10%',
            renderer: function(value, rowData:DTO.TaskJobItemDTO, rowIndex){
                return moment(utils.getValue(rowData, 'modifyTime')).format("MM-DD-YYYY");
            }
        }
    ]
}

export default tableDefinitions;