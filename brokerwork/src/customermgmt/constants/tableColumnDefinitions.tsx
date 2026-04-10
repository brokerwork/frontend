import * as React from 'react';
import {TableColumnOpt, Button, Col} from 'fooui';
import CustomerMgmtContants from './customerMgmtConstants';
import {utils} from '../../common/utils';
import {CustomerPropertiesDTO as Customer,
    CustomProfile, CustomRedundancy, CustomContact, SalesRecord} from '../model/customer';
import {
    SalesTargetPreopertiesDTO as Salestarget, ObjectiveReport, FirstQuarterRecord, SecondQuarterRecord, FourthQuarterRecord, ThirdQuarterRecord
} from '../model/salestarget';  
import {CustomerContractsDTO, CustomContract, KeyValPair} from '../model/salescontract';
import {CustomerContactsDTO, CustomContact as CContact, CustomRedundancy as CRedundancy} from '../model/contacts';
/* 客户表格 列定义 */
import CountryCityHelper from '../../common/countryCityHelper';

var tableDefinitions = {
    customerTableColumns:[
        {
            title: '优先级',
            dataIndex: 'importance',
            key: 'importance',
            width: '6%',
            renderer: function(value, rowData:Customer, rowIndex){
                var customProfile:CustomProfile = utils.getValue(rowData, 'customProfile');
                var elements = [];
                if (utils.getValue(customProfile, 'priority') == CustomerMgmtContants.CUSTOMER_PRIORITY_HIGH){
                    elements.push(<span className="fa fa-exclamation-circle"></span>)
                }
                if (utils.getValue(customProfile, 'importance') == CustomerMgmtContants.CUSTOMER_IMPORTANCE_HIGH){
                    elements.push(<span className="fa fa-star green-star"></span>);
                }
                return <span>{elements}</span>
            }
        },
        {
            title: '客户名称',
            dataIndex: 'customerName',
            key: 'customerName',
            width: '10%',
            sortable: true,
            renderer: function(value, rowData:Customer, rowIndex){
                var redundancy:CustomRedundancy = utils.getValue(rowData, 'redundancy');
                return utils.getValue(redundancy, 'customName');
            }
        },
        {
            title: '客户归属',
            dataIndex: 'customerSource',
            key: 'customerSource',
            width: '10%',
            renderer: function(value, rowData:Customer, rowIndex){
                var redundancy:CustomRedundancy = utils.getValue(rowData, 'redundancy');
                return utils.getValue(redundancy, 'oweName')
            }
        },
        {
            title: '客户类型',
            dataIndex: 'customerType',
            key: 'customerType',
            width: '10%',
            renderer: function(value, rowData:Customer, rowIndex, tbl){
                var customerMgmt = tbl.props.owner;
                var arr = customerMgmt.props.customerType;
                var customProfile:CustomProfile = utils.getValue(rowData, 'customProfile');
                var cmId = utils.getValue(customProfile, 'customType');
                var customtype = arr.find(item=>{
                    return item.cmId == cmId
                })
                if (customtype){
                    return customtype.zhCN
                }else{
                    return "";
                }

            }
        },
        {
            title: '城市',
            dataIndex: 'city',
            key: 'city',
            width: '10%',
            renderer: function(value, rowData:Customer, rowIndex){
                var customProfile:CustomProfile = utils.getValue(rowData, 'customProfile');
                var cityId = utils.getValue(customProfile, 'city');
                var s = CountryCityHelper.getText(cityId)
                return s;
            }
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width: '10%',
            renderer: function(value, rowData:Customer, rowIndex){
                var redundancy:CustomRedundancy = utils.getValue(rowData, 'redundancy');
                return utils.getValue(redundancy, 'customName');
            }
        },
        {
            title: '电话',
            dataIndex: 'phone',
            key: 'phone',
            width: '10%',
            renderer: function(value, rowData:Customer, rowIndex){
                var customProfile:CustomProfile = utils.getValue(rowData, 'customProfile');
                return utils.getValue(customProfile, 'phone');
            }
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
            width: '10%',
            renderer: function(value, rowData:Customer, rowIndex){
                var mainContact:CustomContact = utils.getValue(rowData, 'customProfile');
                return utils.getValue(mainContact, 'email');
            }
        },
        {
            title: '最后更新时间',
            dataIndex: 'lastUpdate',
            key: 'lastUpdate',
            width: '10%',
            renderer: function(value, rowData:Customer, rowIndex){
                var time = utils.getValue(rowData, 'modifyTime');
                return moment(time).format('YYYY/MM/DD')
            }
        // },
        // {
        //     title: '销售记录',
        //     dataIndex: 'salesRecord',
        //     key: 'salesRecord',
        //     width: '10%',
        //     renderer: function(value, rowData:Customer, rowIndex){
        //         var salesRecords:Array<SalesRecord> = utils.getValue(rowData, 'recordList') || [];
        //         var record:SalesRecord = salesRecords.length > 0 ? salesRecords[salesRecords.length-1] : null;
        //         return utils.getValue(record, 'comments');
        //     }
        }
    ],
/* 销售目标默认季度视图 列定义 */
    salesTargetTableColumns: [
        // {
        //     title: '职级',
        //     dataIndex: 'importance',
        //     key: 'importance',
        //     width: '6%',
        //     renderer: function(value, rowData:Salestarget, rowIndex){
        //         var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
        //         return utils.getValue(customObjective, 'importance');
        //     }
        // },
        {
            title: '姓名',
            dataIndex: 'nickname',
            key: 'nickname',
            width: '6%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                return utils.getValue(customObjective, 'nickname');
            }
        },
        // {
        //     title: '角色',
        //     dataIndex: 'roleName',
        //     key: 'roleName',
        //     width: '6%',
        //     renderer: function(value, rowData:Salestarget, rowIndex){
        //         var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
        //         return utils.getValue(customObjective, 'roleName');
        //     }
        // },
        {
            title: '指标类型',
            dataIndex: 'indicators',
            key: 'indicators',
            width: '6%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                var indicators = utils.getValue(customObjective, 'indicators');
                return indicators==="1"? "客户数":"销售额"
            }
        },
        {
            title: '年份',
            dataIndex: 'year',
            key: 'year',
            width: '6%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                return utils.getValue(customObjective, 'year');
            }
        },
        {
            title: '年度指标',
            dataIndex: 'yearGoal',
            key: 'yearGoal',
            width: '6%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                return utils.getValue(customObjective, 'yearGoal');
            }
        },
        {
            title: '第一季度',
            dataIndex: 'firstQuarter',
            key: 'firstQuarter',
            width: '6%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                var firstQuarter: FirstQuarterRecord = utils.getValue(customObjective,'firstQuarter');
                return utils.getValue(firstQuarter, 'quarterGoal');
            }
        },
        {
            title: '第二季度',
            dataIndex: 'secondQuarter',
            key: 'secondQuarter',
            width: '6%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                var secondQuarter: SecondQuarterRecord = utils.getValue(customObjective,'secondQuarter');
                return utils.getValue(secondQuarter, 'quarterGoal');
            }
        },
        {
            title: '第三季度',
            dataIndex: 'thirdQuarter',
            key: 'thirdQuarter',
            width: '6%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                var thirdQuarter: ThirdQuarterRecord = utils.getValue(customObjective,'thirdQuarter');
                return utils.getValue(thirdQuarter, 'quarterGoal');
            }
        },
        {
            title: '第四季度',
            dataIndex: 'fourthQuarter',
            key: 'quarterGoal',
            width: '6%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                var fourthQuarter: FourthQuarterRecord = utils.getValue(customObjective,'fourthQuarter');
                return utils.getValue(fourthQuarter, 'quarterGoal');
            }
        }

    ],
    /* 销售目标月份视图 列定义 */
    salesTargetTableMonthColumns: [
        // {
        //     title: '职级',
        //     dataIndex: 'importance',
        //     key: 'importance',
        //     width: '3%',
        //     renderer: function(value, rowData:Salestarget, rowIndex){
        //         var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
        //         return utils.getValue(customObjective, 'importance');
        //     }
        // },
        {
            title: '姓名',
            dataIndex: 'nickname',
            key: 'nickname',
            width: '3%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                return utils.getValue(customObjective, 'nickname');
            }
        },
        // {
        //     title: '角色',
        //     dataIndex: 'roleName',
        //     key: 'roleName',
        //     width: '3%',
        //     renderer: function(value, rowData:Salestarget, rowIndex){
        //         var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
        //         return utils.getValue(customObjective, 'roleName');
        //     }
        // },
        {
            title: '指标类型',
            dataIndex: 'indicators',
            key: 'indicators',
            width: '3%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                var indicators = utils.getValue(customObjective, 'indicators');
                return indicators==="1"? "客户数":"销售额"
            }
        },
        {
            title: '年份',
            dataIndex: 'year',
            key: 'year',
            width: '3%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                return utils.getValue(customObjective, 'year');
            }
        },
        {
            title: '年度指标',
            dataIndex: 'yearGoal',
            key: 'yearGoal',
            width: '3%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                return utils.getValue(customObjective, 'yearGoal');
            }
        },
        {
            title: '1月',
            dataIndex: 'firstQuarterfirstGoal',
            key: 'firstQuarterfirstGoal',
            width: '3%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                var firstQuarter: FirstQuarterRecord = utils.getValue(customObjective,'firstQuarter');
                return utils.getValue(firstQuarter, 'firstGoal');
            }
        },
        {
            title: '2月',
            dataIndex: 'firstQuartersecondGoal',
            key: 'firstQuartersecondGoal',
            width: '3%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                var firstQuarter: FirstQuarterRecord = utils.getValue(customObjective,'firstQuarter');
                return utils.getValue(firstQuarter, 'secondGoal');
            }
        },
        {
            title: '3月',
            dataIndex: 'firstQuarterthirdGoal',
            key: 'firstQuarterthirdGoal',
            width: '3%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                var firstQuarter: FirstQuarterRecord = utils.getValue(customObjective,'firstQuarter');
                return utils.getValue(firstQuarter, 'thirdGoal');
            }
        },
        {
            title: '4月',
            dataIndex: 'secondQuarterfirstGoal',
            key: 'secondQuarterfirstGoal',
            width: '3%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                var secondQuarter: SecondQuarterRecord = utils.getValue(customObjective,'secondQuarter');
                return utils.getValue(secondQuarter, 'firstGoal');
            }
        },
        {
            title: '5月',
            dataIndex: 'secondQuartersecondGoal',
            key: 'secondQuartersecondGoal',
            width: '3%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                var secondQuarter: SecondQuarterRecord = utils.getValue(customObjective,'secondQuarter');
                return utils.getValue(secondQuarter, 'secondGoal');
            }
        },
        {
            title: '6月',
            dataIndex: 'secondQuarterthirdGoal',
            key: 'secondQuarterthirdGoal',
            width: '3%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                var secondQuarter: SecondQuarterRecord = utils.getValue(customObjective,'secondQuarter');
                return utils.getValue(secondQuarter, 'thirdGoal');
            }
        },
        {
            title: '7月',
            dataIndex: 'thirdQuarterfirstGoal',
            key: 'thirdQuarterfirstGoal',
            width: '3%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                var thirdQuarter: ThirdQuarterRecord = utils.getValue(customObjective,'thirdQuarter');
                return utils.getValue(thirdQuarter, 'firstGoal');
            }
        },
        {
            title: '8月',
            dataIndex: 'thirdQuartersecondGoal',
            key: 'thirdQuartersecondGoal',
            width: '3%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                var thirdQuarter: ThirdQuarterRecord = utils.getValue(customObjective,'thirdQuarter');
                return utils.getValue(thirdQuarter, 'secondGoal');
            }
        },
        {
            title: '9月',
            dataIndex: 'thirdQuarterthirdGoal',
            key: 'thirdQuarterthirdGoal',
            width: '3%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                var thirdQuarter: ThirdQuarterRecord = utils.getValue(customObjective,'thirdQuarter');
                return utils.getValue(thirdQuarter, 'thirdGoal');
            }
        },
        {
            title: '10月',
            dataIndex: 'fourthQuarterfirstGoal',
            key: 'fourthQuarterfirstGoal',
            width: '3%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                var fourthQuarter: FourthQuarterRecord = utils.getValue(customObjective,'fourthQuarter');
                return utils.getValue(fourthQuarter, 'firstGoal');
            }
        },
        {
            title: '11月',
            dataIndex: 'fourthQuartersecondGoal',
            key: 'fourthQuartersecondGoal',
            width: '3%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                var fourthQuarter: FourthQuarterRecord = utils.getValue(customObjective,'fourthQuarter');
                return utils.getValue(fourthQuarter, 'secondGoal');
            }
        },
        {
            title: '12月',
            dataIndex: 'fourthQuarterthirdGoal',
            key: 'fourthQuarterthirdGoal',
            width: '3%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                var fourthQuarter: FourthQuarterRecord = utils.getValue(customObjective,'fourthQuarter');
                return utils.getValue(fourthQuarter, 'thirdGoal');
            }
        }
    ],
    /* 报表表格 列定义 接口没做好暂时搁置，写的不完全需要重新检查 */
    salesReportTableColumns: [
        {
            title: '用户编号',
            dataIndex: 'importance',
            key: 'importance',
            width: '6%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                return utils.getValue(customObjective, 'importance');
            }
        },
        {
            title: '姓名',
            dataIndex: 'nickname',
            key: 'nickname',
            width: '6%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                return utils.getValue(customObjective, 'nickname');
            }
        },
        {
            title: '角色',
            dataIndex: 'roleName',
            key: 'roleName',
            width: '6%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                return utils.getValue(customObjective, 'roleName');
            }
        },
        {
            title: '指标类型',
            dataIndex: 'indicators',
            key: 'indicators',
            width: '6%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                return utils.getValue(customObjective, 'indicators');
            }
        },
        {
            title: '年度目标',
            dataIndex: 'year',
            key: 'year',
            width: '6%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                return utils.getValue(customObjective, 'year');
            }
        },
        {
            title: '第一季度',
            dataIndex: 'yearGoal',
            key: 'yearGoal',
            width: '6%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                return utils.getValue(customObjective, 'yearGoal');
            }
        },
        {
            title: '第二季度',
            dataIndex: 'firstQuarter',
            key: 'firstQuarter',
            width: '6%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                var firstQuarter: FirstQuarterRecord = utils.getValue(customObjective,'firstQuarter');
                return utils.getValue(firstQuarter, 'quarterGoal');
            }
        },
        {
            title: '第三季度',
            dataIndex: 'secondQuarter',
            key: 'secondQuarter',
            width: '6%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                var secondQuarter: SecondQuarterRecord = utils.getValue(customObjective,'secondQuarter');
                return utils.getValue(secondQuarter, 'quarterGoal');
            }
        },
        {
            title: '第三季度',
            dataIndex: 'thirdQuarter',
            key: 'thirdQuarter',
            width: '6%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                var thirdQuarter: ThirdQuarterRecord = utils.getValue(customObjective,'thirdQuarter');
                return utils.getValue(thirdQuarter, 'quarterGoal');
            }
        },
        {
            title: '第四季度',
            dataIndex: 'fourthQuarter',
            key: 'quarterGoal',
            width: '6%',
            renderer: function(value, rowData:Salestarget, rowIndex){
                var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                var fourthQuarter: FourthQuarterRecord = utils.getValue(customObjective,'fourthQuarter');
                return utils.getValue(fourthQuarter, 'quarterGoal');
            }
        }

    ],
   /* 销售合同 列定义 接口没做好暂时搁置，写的不完全需要重新检查 */
    salesContractColumns:[
        {
            title:'合同ID',
            dataIndex:'contractId',
            key:'contractId',
            width:'2%',
            renderer: function(value, rowData:CustomerContractsDTO, rowIndex){
                return utils.getValue(rowData, 'contractId')
            }
        }
        ,{
            title:'合同编号',
            dataIndex:'contractNo',
            key:'contractNo',
            width:'5%',
            renderer: function(value, rowData:CustomerContractsDTO, rowIndex){
                var customContract:CustomerContractsDTO = utils.getValue(rowData, 'customContract')
                return utils.getValue(customContract, 'contractNo')
            }
        }
        ,{
            title:'客户名称',
            dataIndex:'customName',
            key:'customName',
            width:'5%',
            renderer: function(value, rowData:CustomerContractsDTO, rowIndex){
                var redundancy:CustomRedundancy = utils.getValue(rowData, 'redundancy');
                return utils.getValue(redundancy, 'customName')
            }
        }
        ,{
            title:'客户归属',
            dataIndex:'oweName',
            key:'oweName',
            width:'5%',
            renderer: function(value, rowData:CustomerContractsDTO, rowIndex){
                var redundancy:CustomRedundancy = utils.getValue(rowData, 'redundancy');
                return utils.getValue(redundancy, 'oweName')
            }
        },{
            title:'总金额',
            dataIndex:'totalAmount',
            key:'totalAmount',
            width:'5%',
            renderer: function(value, rowData:CustomerContractsDTO, rowIndex){
                var customContract:CustomContract = utils.getValue(rowData, 'customContract');
                return utils.getValue(customContract, 'totalAmount');
            }
        },{
            title:'合同期限',
            dataIndex:'contractDue',
            key:'contractDue',
            width:'9%',
            renderer: function(value, rowData:CustomerContractsDTO, rowIndex){
                var customContract:CustomContract = utils.getValue(rowData, 'customContract');
                var startDate = utils.getValue(customContract, 'contractStartDay');
                var endDate = utils.getValue(customContract, 'contractEndDay');
                return moment(startDate).format('YYYY/MM/DD') + '-' + moment(endDate).format('YYYY/MM/DD');
            }
        },{
            title:'产品名称',
            dataIndex:'productName',
            key:'productName',
            width:'5%',
            renderer: function(value, rowData:CustomerContractsDTO, rowIndex){
                var customContract:CustomContract = utils.getValue(rowData, 'customContract');
                var keyValPair:KeyValPair = utils.getValue(customContract, 'product');
                return utils.getValue(keyValPair, 'name');
            }
        },{
            title:'合同下载',
            dataIndex:'contractFile',
            key:'contractFile',
            width:'5%',
            renderer: function(value, rowData:CustomerContractsDTO, rowIndex){
                var customContract:CustomContract = utils.getValue(rowData, 'customContract');
                var downloadUrl = `/download/contract?id=${rowData.contractId}`;
                return <a href={downloadUrl} style={{textDecoration:'underline'}} className="edit-card">下载</a>
            }
        },{
            title:'创建时间',
            dataIndex:'createTime',
            key:'createTime',
            width:'5%',
            renderer: function(value, rowData:CustomerContractsDTO, rowIndex){
                var date = utils.getValue(rowData, 'createTime');
                return moment(date).format('YYYY/MM/DD')
            }
        },{
            title:'备注',
            dataIndex:'comments',
            key:'comments',
            width:'5%',
            renderer: function(value, rowData:CustomerContractsDTO, rowIndex){
                var customContract:CustomContract = utils.getValue(rowData, 'customContract');
                return utils.getValue(customContract, 'comments');
            }
        }
    ],
    // 联系人 列定义
    contactsTableColumns: [
    {
        title: '主联系人',
        dataIndex: 'mainContacts',
        key: 'mainContacts',
        width: '10%',
        renderer: function (value: any, rowData: any, rowIndex: any) {
            let isMaster: boolean = utils.getValue(rowData, 'master');
            if (isMaster) {
                return (
                    <span className="fa fa-star"
                          style= {{color: '#1ca59e'}} 
                    />
                );
            }
            else {
                return (
                    <span className="fa fa-star-o" />
                )
            }
        }
    },
    {
        title: '客户名称',
        dataIndex: 'customerName',
        key: 'customerName',
        width: '10%',
        renderer: function (value: any, rowData: any, rowIndex: any) {
            let CRedundancy: CRedundancy = utils.getValue(rowData, 'redundancy');
            return utils.getValue(CRedundancy, 'customName');
        }
    },
    {
        title: '客户归属',
        dataIndex: 'customerOwner',
        key: 'customerOwner',
        width: '5%',
        renderer: function (value: any, rowData: any, rowIndex: any) {
            let CRedundancy: CRedundancy = utils.getValue(rowData, 'redundancy');
            return utils.getValue(CRedundancy, 'oweName');
        }
    },
    {
        title: '联系人姓名',
        dataIndex: 'contactsName',
        key: 'contactsName',
        width: '5%',
        renderer: function (value: any, rowData: any, rowIndex: any) {
            let CContact: CContact = utils.getValue(rowData, 'customContact');
            return utils.getValue(CContact, 'contactsName');
        }
    },
    {
        title: '职务',
        dataIndex: 'position',
        key: 'position',
        width: '10%',
        renderer: function (value: any, rowData: any, rowIndex: any) {
            let CContact: CContact = utils.getValue(rowData, 'customContact');
            return utils.getValue(CContact, 'resign');
        }
    },
    {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        width: '5%',
        renderer: function (value: any, rowData: any, rowIndex: any) {
            let CContact: CContact = utils.getValue(rowData, 'customContact');
            return utils.getValue(CContact, 'gender');
        }
    },{
        title: '生日',
        dataIndex: 'birthday',
        key: 'birthday',
        width: '5%',
        renderer: function (value: any, rowData: any, rowIndex: any) {
            let CContact: CContact = utils.getValue(rowData, 'customContact');
            return utils.getValue(CContact, 'birthday');
        }
    },
    {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
        width: '10%',
        renderer: function (value: any, rowData: any, rowIndex: any) {
            let CContact: CContact = utils.getValue(rowData, 'customContact');
            return utils.getValue(CContact, 'phone');
        }
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        width: '10%',
        renderer: function (value: any, rowData: any, rowIndex: any) {
            let CContact: CContact = utils.getValue(rowData, 'customContact');
            return utils.getValue(CContact, 'email');
        }
    },
    {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: '5%',
        renderer: function (value: any, rowData: any, rowIndex: any) {
            let CContact: CContact = utils.getValue(rowData, 'customContact');
            return utils.getValue(CContact, 'comments');
        }
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: '10%',
         renderer: function (value: any, rowData: any, rowIndex: any) {
            return utils.getValue(rowData, 'createTime');
        }
    }
]
}

export default tableDefinitions;