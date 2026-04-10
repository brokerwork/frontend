// libs
import * as React from 'react';
import { TableColumnOpt} from 'fooui';
import * as moment from 'moment';
import {userMgmtStore} from '../store/usermgmtstore'
import CountryCityHelper from '../../common/countryCityHelper';
import {
     activeUser,
     lockUser
} from '../actions/useractions';
// model
import {BWUserDTO} from '../model/user';
/* ------------------- main start ---------------------- */
let enableIconStyle = {
  backgroundColor: '#1fb5ad',
  color: '#fff',
  width: '24px',
  height: '24px',
  borderRadius: '3px',
  lineHeight: '24px'
}

let disableIconStyle = {
  backgroundColor: '#c7cbd6',
  color: '#fff',
  width: '24px',
  height: '24px',
  borderRadius: '3px',
  lineHeight: '24px'
}

let UserTableColumnOptions:{[name:string]: TableColumnOpt} = {
    checkbox: {
        title: '',
        key: 'checkbox',
        renderer() {
            return <input type="checkbox"/>
        },
        headerRenderer() {
            return <input type="checkbox"/>
        }
    },
    id: {
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
    },
    entityNo: {
        title: '用户编号',
        key: 'entityNo',
        renderer( v:any, rowData:any ) {
          return rowData.entityNo
         },
        headerRenderer() {
            return <div className="touchStyle">用户编号<i className="fa fa-sort"></i></div>
        }
    },
    username: {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        headerRenderer() {
            return <div className="touchStyle">姓名<i className="fa fa-sort"></i></div>
        }
    },
    roleId: {
        title: '角色',
        dataIndex: 'roleId',
        key: 'roleId',
        renderer: function(value, rowData, rowIndex, comp){
            let state = userMgmtStore.getState();
            let selectRole = state.userMgmt.selectRole;
            let role = '';
            selectRole.some((item,index)=>{
                let itemIdString = item.id + "";
                if(itemIdString===value) {
                    role = item.name;
                    return true;
                }
            })
            
            return role;
        }
    },
    levelId: {
        title: '层级',
        dataIndex: 'levelId',
        key: 'levelId',
        renderer: function(value, rowData, rowIndex, comp){
            let state = userMgmtStore.getState();
            let selectLevel= state.userMgmt.selectHierarchy;
            let level = '';
            selectLevel.some((item,index)=>{
                let itemIdString = item.id + "";
                if(itemIdString===value) {
                    level = item.name;
                    return true;
                }
            })
            
            return level;
        }
    },
    parent: {
        title: '上级用户',
        dataIndex: 'parent',
        key: 'parent',
        renderer: function(value, rowData, rowIndex, comp){
            let state = userMgmtStore.getState();
            let selectLevelCount = state.userMgmt.simpleUserList;
            let parentname = '';
            selectLevelCount.some((item,index)=>{
                let itemIdString = item.id + "";
                if(itemIdString===value) {
                    parentname = item.name;
                    return true;
                }
            })
            
            return parentname;
        }
    },
    memberCount: {
        title: '下级用户',
        dataIndex: 'subUserCount',
        key: 'subUserCount',
    },
    email: {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
    },
    phone: {
        title: '手机',
        dataIndex: 'phone',
        key: 'phone',
    },
    location: {
        title: '城市',
        dataIndex: 'country',
        key: 'country',
        renderer( v:any, rowData:BWUserDTO ) {
            let country = v ? v : '';
            let province = rowData.province ? rowData.province : '';
            let city = rowData.city ? rowData.city : '';
            let countryText = CountryCityHelper.getText( country) ? CountryCityHelper.getText( country) : '';
            let provinceText = CountryCityHelper.getText(province) ? CountryCityHelper.getText(province) : '';
            let cityText = CountryCityHelper.getText(city) ? CountryCityHelper.getText(city) : ''
            return countryText + ' ' + provinceText + ' ' + cityText
        }
    },
    login: {
        title: 'MT账号',
        dataIndex: 'login',
        key: 'login',
        renderer( v:any, rowData:any ) {
          return rowData.login
         }
    },
    active: {
      title: '登录状态',
      dataIndex: 'active',
      key: 'active',
      renderer(v:any, rowData:BWUserDTO) {
            let style = v === 1 ? enableIconStyle : disableIconStyle;
            let activeorlock = v === 1 ? lockUser : activeUser;
            return <i className="fa fa-check-circle touchhand" style={style} onClick={() => {
                userMgmtStore.dispatch(activeorlock(rowData.email));
            } }></i>
      }
    },
    additionalCol2: {
      title: 'additionalCol2',
      dataIndex: 'additionalCol2',
      key: 'additionalCol2'
    },
    additionalCol3: {
      title: 'additionalCol3',
      dataIndex: 'additionalCol3',
      key: 'additionalCol3'
    },
    additionalCol4: {
      title: 'additionalCol4',
      dataIndex: 'additionalCol4',
      key: 'additionalCol4'
    }
};


export { UserTableColumnOptions };