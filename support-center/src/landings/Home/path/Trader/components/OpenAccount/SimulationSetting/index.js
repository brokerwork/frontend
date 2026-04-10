import Panel from 'components/Panel';
import Button from 'components/Button';
import AddAccountModal from './AddAccountModal';

import List from './List';
import { simulationColumns } from '../constant';
import i18n from 'utils/i18n';
import ccs from '../index.less';
export default class SimulationSetting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isAddModalVisible: false,
      editData: null
    };
  }
  modalVisible = visible => {
    this.setState({
      isAddModalVisible: visible
    });
  };
  editAccount = item => {
    this.modalVisible(true);
    this.setState({
      editData: item
    });
  };
  render() {
    const {
      paltSetting: { accountTypeList },
      submitForm,
      savePlatSetting,
      plat,
      productId,
      getPlatSetting,
      deleteAccountType,
      showTipsModal,
      showTopAlert,
      brandInfo: { languages = [] } = {}
    } = this.props;
    const { isAddModalVisible, editData } = this.state;
    return (
      <div>
        <Panel className={ccs.margin_20} header={i18n['platform.tab.open.account.simulator']}>
          <List
            columns={simulationColumns}
            data={accountTypeList}
            editAccount={this.editAccount}
            deleteAccountType={deleteAccountType}
            plat={plat}
            productId={productId}
            getPlatSetting={getPlatSetting}
            showTipsModal={showTipsModal}
            showTopAlert={showTopAlert}
          />
          <Button style="primary" onClick={this.editAccount.bind(this, null)}>
            {i18n['platform.tab.open.account.add.type']}
          </Button>
          {isAddModalVisible ? (
            <AddAccountModal
              onClose={this.modalVisible.bind(this, false)}
              submitForm={submitForm}
              editData={editData}
              savePlatSetting={savePlatSetting}
              plat={plat}
              productId={productId}
              getPlatSetting={getPlatSetting}
              showTopAlert={showTopAlert}
              languages={languages}
            />
          ) : null}
        </Panel>
      </div>
    );
  }
}
