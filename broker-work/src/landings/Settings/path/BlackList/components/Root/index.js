import { Button, Icon, Modal } from 'lean-ui';
import i18n from 'utils/i18n';
import SettingActionBar from 'landings/Settings/components/SettingActionBar';
import cs from './style.less';
import AddModal from '../../containers/AddModal';
import List from '../../containers/List';

export default class Root extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showAdd: false,
      editItem: null,
      idInfoReady: false
    };
  }
  componentDidMount() {
    const { getBlackList, pageParam, getIdType } = this.props;
    getBlackList(pageParam);
    getIdType().then(() => {
      this.setState({
        idInfoReady: true
      });
    });
  }

  toggleModal = key => {
    this.setState({
      showAdd: true,
      editItem: null
    });
  };

  changeEditItem = item => {
    this.setState({
      showAdd: true,
      editItem: item
    });
  };

  finishEditItem = () => {
    this.setState({
      showAdd: false,
      editItem: null
    });
  };

  render() {
    const { userRights } = this.props;
    const { showAdd, editItem, idInfoReady } = this.state;
    return (
      <div>
        <div className={cs.body}>
          <SettingActionBar title={i18n['settings.black_list']}>
            {userRights['SYSTEM_BLACKLIST_ADD'] ? (
              <Button
                type="primary"
                onClick={this.toggleModal.bind(this, 'showAdd')}
              >
                <Icon icon="add-outline" />
                {i18n['settings.black_list.add']}
              </Button>
            ) : null}
          </SettingActionBar>
        </div>
        {idInfoReady ? <List changeEditItem={this.changeEditItem} /> : null}
        {showAdd ? (
          <AddModal
            show={showAdd}
            initData={editItem}
            finishEditItem={this.finishEditItem}
            onHide={() => {
              this.setState({ showAdd: false });
            }}
          />
        ) : null}
      </div>
    );
  }
}
