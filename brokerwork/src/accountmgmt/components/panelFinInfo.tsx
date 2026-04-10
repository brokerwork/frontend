// libs
import * as React from 'react';
import { connect } from 'react-redux'
import {
  Form,
  FormGroup,
  ControlLabel,
  Col,
  CountryPicker,
  FormControl,
  Button,
  Message
} from 'fooui'
import { IAccountState } from '../store/mt4store';
import DropdownOption from '../model/dropdownOption';
import FinInfo from '../model/finInfo';
import { updateFinInfo, hideEditAccountCard } from '../actions/editAccountActions';
import ActionTypes from '../actions/actionTypes';
import { I18nLoader } from '../../i18n/loader';
import PrivilegeHelper from '../../common/privilegeHelper';
import CustomField from '../../common/CustomField/CustomField';
/* ------------------- main start ---------------------- */

let countryPickerStyle = { width: '254px', display: 'inline-block' };
let countryPickerStyleFirst = { width: '84.3px', display: 'inline-block' };

interface P {
  assetsRangeArray: Array<DropdownOption>,
  investmentYearArray: Array<DropdownOption>,
  knowledgeLevelArray: Array<DropdownOption>,
  incomeSourceArray: Array<DropdownOption>,
  investmentExperienceArray: Array<DropdownOption>,
  currentFinInfo?: FinInfo,
  dispatch?: Function,
  hideEditAccountCard: Function,
  updateFinInfo: Function,
  financeFields: Object[],
  currentAccountFinInfo: Object
}

interface S {
  editableFinInfo: FinInfo
}

class PanelFinInfo extends React.Component<P, S> {
  saveFinInfoHandler = () => {
    let ACCOUNTMT4_MODIFY_PERSONAL = PrivilegeHelper.getHavePrivilege("ACCOUNTMT4_MODIFY-PERSONAL");
    if (ACCOUNTMT4_MODIFY_PERSONAL) {
      const {updateFinInfo} = this.props;
      updateFinInfo(this.financeData);
    } else {
      Message.error(I18nLoader.getErrorText("没有修改权限，请联系管理员"));
    }

  }

  close = () => {
    this.props.hideEditAccountCard();
  }

  dataChange = (data) => {
    this.financeData = data;
  }

  render() {
    const {financeFields, currentAccountFinInfo} = this.props;
    return (
      <div className="ed-acct-tab-countent">
        <CustomField
          data={currentAccountFinInfo}
          i18n={{}}
          fields={financeFields}
          onChange={this.dataChange}
          externalData={{}}
        />
        <div className="text-right">
          <Button
            bsStyle="primary"
            onClick={this.saveFinInfoHandler}
            >提交</Button>
          <Button
            onClick={this.close}
            >取消</Button>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state: IAccountState) {
  let e = state.editAccount;
  return {
    assetsRangeArray: e.assetsRangeArray,
    investmentYearArray: e.investmentYearArray,
    knowledgeLevelArray: e.knowledgeLevelArray,
    incomeSourceArray: e.incomeSourceArray,
    investmentExperienceArray: e.investmentExperienceArray,
    currentFinInfo: e.currentAccountFinInfo,
    financeFields: e.financeFields,
    currentAccountFinInfo: e.currentAccountFinInfo,
  }
}

export default connect<P, any, any>(mapStateToProps, {
  hideEditAccountCard, updateFinInfo
})(PanelFinInfo)
