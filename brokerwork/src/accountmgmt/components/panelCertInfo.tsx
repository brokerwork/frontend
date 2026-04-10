// libs
import * as React from 'react';
import { connect } from 'react-redux';
import {
  Form,
  FormGroup,
  Col,
  ControlLabel,
  Button,
  FileUpload,
  Message
} from 'fooui'
import DropdownOption from '../model/dropdownOption';
import CertInfo from '../model/certInfo';
import { IAccountState } from '../store/mt4store';
import { Reviewer } from '../../customermgmt/components/fileReview';
import FileUploadHelper from '../../common/ossHelper';
import { updateCertInfo } from '../actions/editAccountActions';
import ActionTypes from '../actions/actionTypes';
import { I18nLoader } from '../../i18n/loader';
import PrivilegeHelper from '../../common/privilegeHelper';
import CustomField from '../../common/CustomField/CustomField';
import {hideEditAccountCard} from '../actions/editAccountActions';

/* ------------------- main start ---------------------- */

let uploadedFileStyle = {
  width: '80px',
  height: '80px',
  cursor: 'pointer',
  marginBottom: '3px',
  border: '1px solid black'
}

interface P {
  identityTypeArray: Array<DropdownOption>,
  addressTypeArray: Array<DropdownOption>,
  currentAccountCertInfo: CertInfo,
  dispatch?: Function,
  certificatesFields: any[],
  certificatesData: Object,
  updateCertInfo: Function,
  hideEditAccountCard: Function,
}

interface S {
  editableCertInfo?: CertInfo,
  identityNoErrorMsg?: string
}

class PanelCertInfo extends React.Component<P, S> {
  constructor(props: any) {
    super(props);
    this.state = {
      editableCertInfo: new CertInfo(this.props.currentAccountCertInfo),
      identityNoErrorMsg: ''
    }
  }

  componentWillReceiveProps(nextProps: P) {
    this.setState({
      editableCertInfo: new CertInfo(nextProps.currentAccountCertInfo)
    })
  }

  update = (name: string, value: string) => {
    this.setState({
      editableCertInfo: Object.assign({}, this.state.editableCertInfo, {
        [name]: value
      })
    })
  }

  close = () => {
    this.props.hideEditAccountCard()
  }

  saveCertInfo = () => {
    const {updateCertInfo} = this.props;
    let ed = this.state.editableCertInfo;
    let ACCOUNTMT4_MODIFY_PERSONAL = PrivilegeHelper.getHavePrivilege("ACCOUNTMT4_MODIFY-PERSONAL");
    if ((ed.identityType != '-1' && ed.identityType !== '') && !ed.identityNo) {
      this.setState({
        identityNoErrorMsg: '证件号码不能为空'
      })
      return
    } else {
      if (ACCOUNTMT4_MODIFY_PERSONAL) {
        updateCertInfo(this.certificatesData);
      } else {
        Message.error(I18nLoader.getErrorText("没有修改权限，请联系管理员"));
      }

    }
  }

  clearIdentityNoErrorMsg = () => {
    this.setState({
      identityNoErrorMsg: ''
    })
  }

  dataChange = (data) => {
    this.certificatesData = data;
  }

  render() {
    const {certificatesFields, currentAccountCertInfo} = this.props;
    return (
      <div className="ed-acct-tab-countent">
        <CustomField
          data={currentAccountCertInfo}
          i18n={{}}
          fields={certificatesFields}
          onChange={this.dataChange}
          externalData={{}}
        />
        <div className="text-right">
          <Button bsStyle="primary" onClick={this.saveCertInfo}>提交</Button>
          <Button onClick={this.close}>取消</Button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAccountState) {
  return {
    identityTypeArray: state.editAccount.identityTypeArray,
    addressTypeArray: state.editAccount.addressTypeArray,
    currentAccountCertInfo: state.editAccount.currentAccountCertInfo,
    certificatesFields: state.editAccount.certificatesFields,
    certificatesData: state.editAccount.certificatesData,
    // data: state.editAccount.data,
  }
}

export default connect<P, any, any>(mapStateToProps, {
  updateCertInfo,
  hideEditAccountCard
})(PanelCertInfo);
