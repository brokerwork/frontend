import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Table, Panel, TableColumnOpt, DatePicker, Button} from 'fooui';
import * as DTO from '../model/all';
import {utils} from '../../common/utils';
import {ValidationUtils} from '../../common/validateUtils';

let getValue = utils.getValue;
let DATE_FORMAT = 'MM/DD/YYYY';
let editStyle = { textDecoration: 'underline', cursor: 'pointer' };
let deleteStyle = { textDecoration: 'underline', cursor: 'pointer' };
let contactColumns:Array<TableColumnOpt> = [
    {
        title: '姓名',
        dataIndex: '11',
        key: '11',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerContactsDTO, newValue) {
            rowData.customContact.contactsName = newValue;
        },
        validateField: function (rowData: DTO.CustomerContactsDTO, newValue, control) {
            
            if (ValidationUtils.isNull(newValue) || ValidationUtils.isEmptyString(newValue)) {
                control.className += ' field-validate-error';
                control.title = "名字不能为空";
                return false;
            } else {
                control.className = control.className.replace(/field-validate-error/g, '');
                control.title = '';
                return true;
            }
        },
        syncRef: 'contactsName',
        renderer: function (value, rowData: DTO.CustomerContactsDTO, rowIndex, tbl) {
            var customContact: DTO.CustomContract = getValue(rowData, 'customContact');
            var value = getValue(customContact, 'contactsName');
            if (rowData.isEditing) {
                return <input ref={`contactsName${rowIndex}`}
                              defaultValue={value}
                              style={{ width: '100%' }}
                              onBlur={()=>{tbl.validateFields()}}
                />
            }
            return value;
        }
    },
    {
        title: '职务',
        dataIndex: '22',
        key: '22',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerContactsDTO, newValue) {
            rowData.customContact.resign = newValue;
        },
        validateField: function (rowData: DTO.CustomerContactsDTO, newValue, control) {
            return true;
        },
        syncRef: 'resign',
        renderer: function (value, rowData: DTO.CustomerContactsDTO, rowIndex) {
            var customContact: DTO.CustomContact = getValue(rowData, 'customContact');
            var resign = getValue(customContact, 'resign');
            if (rowData.isEditing) {
                return <input ref={`resign${rowIndex}`} defaultValue={resign} style={{ width: '100%' }}/>
            }
            return resign;
        }
    },
    {
        title: '性别',
        dataIndex: '33',
        key: '33',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerContactsDTO, newValue) {
            rowData.customContact.gender = newValue;
        },
        validateField: function (rowData: DTO.CustomerContactsDTO, newValue, control) {
            return true;
        },
        syncRef: 'gender',
        renderer: function (value, rowData: DTO.CustomerContactsDTO, rowIndex) {
            var customContact: DTO.CustomContact = getValue(rowData, 'customContact');
            var gender = getValue(customContact, 'gender');
            if (rowData.isEditing) {
                return <select ref={`gender${rowIndex}`} defaultValue={gender} style={{ width: '100%' }}>
                    <option value="Male">男</option>
                    <option value="Female">女</option>
                </select>
            }
            return gender === 'Male' ? '男' : '女';
        }
    },
    {
        title: '生日',
        dataIndex: '44',
        key: '44',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerContactsDTO, newValue, datepicker) {
            var selectedDate = datepicker.getSelectedDate();
            rowData.customContact.birthday = selectedDate;
        },
        syncRef: 'birthday',
        validateField: function (rowData: DTO.CustomerContactsDTO, newValue, control) {
            return true;
        },
        renderer: function (value, rowData: DTO.CustomerContactsDTO, rowIndex) {
            var customContact: DTO.CustomContact = getValue(rowData, 'customContact');
            var birthday = getValue(customContact, 'birthday');
            if (rowData.isEditing) {
                return <DatePicker
                    ref={`birthday${rowIndex}`}
                    style={{ width: '100%' }}
                    showYearDropdown
                    dateFormatCalendar="MMMM"
                    selected={birthday ? moment(birthday) : null}
                    />
            }
            return birthday ? moment(birthday).format(DATE_FORMAT) : ''
        }
    },
    {
        title: '电话',
        dataIndex: '55',
        key: '55',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerContactsDTO, newValue) {
            rowData.customContact.phone = newValue;
        },
        syncRef: 'phone',
        validateField: function (rowData: DTO.CustomerContactsDTO, newValue, control) {
            
            if (!ValidationUtils.isPhoneNumber(newValue)) {
                control.className += ' field-validate-error';
                control.title = "电话号码是8~11位数字";
                return false;
            } else {
                control.className = control.className.replace(/field-validate-error/g, '');
                control.title = '';
                return true;
            }
        },
        renderer: function (value, rowData: DTO.CustomerContactsDTO, rowIndex, tbl) {
            var customContact: DTO.CustomContact = getValue(rowData, 'customContact');
            var phone = getValue(customContact, 'phone');
            if (rowData.isEditing) {
                return <input ref={`phone${rowIndex}`}
                              defaultValue={phone}
                              style={{ width: '100%' }}
                              onBlur={()=>{tbl.validateFields()}}
                />
            }
            return phone
        }
    },
    {
        title: '邮箱',
        dataIndex: '66',
        key: '66',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerContactsDTO, newValue) {
            rowData.customContact.email = newValue;
        },
        syncRef: 'email',
        validateField: function (rowData: DTO.CustomerContactsDTO, newValue, control) {
            
            if (!ValidationUtils.isEmail(newValue)) {
                control.className += ' field-validate-error';
                control.title = "邮箱格式不对";
                return false;
            } else {
                control.className = control.className.replace(/field-validate-error/g, '');
                control.title = '';
                return true;
            }
        },
        renderer: function (value, rowData: DTO.CustomerContactsDTO, rowIndex, tbl) {
            var customContact: DTO.CustomContact = getValue(rowData, 'customContact');
            var email = getValue(customContact, 'email');
            if (rowData.isEditing) {
                return <input ref={`email${rowIndex}`}
                              defaultValue={email}
                              style={{ width: '100%' }}
                              onBlur={()=>{tbl.validateFields()}}
                />
            }
            return email;
        }
    },
    {
        title: '备注',
        dataIndex: '77',
        key: '77',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerContactsDTO, newValue) {
            rowData.customContact.comments = newValue;
        },
        syncRef: 'comments',
        validateField: function (rowData: DTO.CustomerContactsDTO, newValue, control) {
            return true;
        },
        renderer: function (value, rowData: DTO.CustomerContactsDTO, rowIndex) {
            var customContact: DTO.CustomContact = getValue(rowData, 'customContact');
            var comments = getValue(customContact, 'comments');
            if (rowData.isEditing) {
                return <input ref={`comments${rowIndex}`} defaultValue={comments} style={{ width: '100%' }}/>
            }
            return comments
        }
    },
    {
        title: '创建时间',
        dataIndex: '88',
        key: '88',
        width: '9%',
        renderer: function (value, rowData: DTO.CustomerContactsDTO, rowIndex) {
            var createtime = getValue(rowData, 'createTime');
            return createtime ? moment(createtime).format(DATE_FORMAT) : ''
        }
    },
    {
        title: '操作',
        dataIndex: '99',
        key: '99',
        width: '9%',
        renderer: function (value, rowData: DTO.CustomerContactsDTO, rowIndex, tbl: Table) {
            var contactTable:ContactsTable = tbl.props.owner;

            return <div><span style={editStyle} onClick={() => {
                if (!rowData.isEditing) {
                    rowData.isEditing = true;
                    tbl.forceUpdate();
                } else { //click 保存
                    rowData.isEditing = false;
                    tbl.syncFields();
                    var isPassValidation = tbl.validateFields();
                    if (isPassValidation) {
                        tbl.forceUpdate();
                        contactTable.props.updateContact(rowData);
                    }
                }
            } }>{rowData.isEditing ? '保存' : '编辑'}</span>|<span style={deleteStyle} onClick={() => {
                if (rowData.contactId == null) {
                    var card = contactTable.props.owner;
                    var contactList = card.state.contactList;
                    card.setState({ contactList: contactList.slice(0, -1) });
                } else {
                    contactTable.props.deleteContact([rowData.contactId])
                }
            } }>删除</span></div>
        }
    }
];

interface P{
    contactList?:Array;
    addContacts?:Function;
    updateContact?:Function;
    deleteContact?:Function;
    owner?:any;
}
interface S{}

class ContactsTable extends React.Component<P, S>{
  constructor(props:P){
      super(props)
  }
  render(){
    return (<Panel title="联系人" showCollapseIcon={true}>
                <Table columns={contactColumns} data={this.props.contactList} owner={this}/>
                <div className="pull-right">
                    <Button bsStyle="primary" onClick={()=>{this.props.addContacts()}}>添加</Button>
                </div>
            </Panel>)
  }
}

export {ContactsTable}