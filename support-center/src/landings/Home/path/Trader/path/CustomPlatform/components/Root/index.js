import ContentWrapper from 'components/ContentWrapper';
import i18n from 'utils/i18n';
import Button from 'components/Button';
import cs from './index.less';
import AddPlatformModal from '../../containers/AddPlatformModal';
import List from '../../containers/List';

export default class Root extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { showAddPlatformModal: false, editingPlatform: null };
  }

  showAddPlatformModal = () => {
    this.setState({ showAddPlatformModal: true });
  };
  hideAddPlatformModal = () => {
    this.setState({ showAddPlatformModal: false, editingPlatform: null });
  };

  onClickEditPlatform = item => {
    this.setState({ showAddPlatformModal: true, editingPlatform: item });
  };

  render() {
    const { showAddPlatformModal, editingPlatform } = this.state;

    return (
      <ContentWrapper header={i18n['left.menu.customPlatform.setting']}>
        <div className={cs['add-container']}>
          <Button style="primary" onClick={this.showAddPlatformModal}>
            <i className="fa fa-plus"></i>
            {i18n['trader.customPlatform.add']}
          </Button>
        </div>
        <List onClickEditPlatform={this.onClickEditPlatform} />
        {showAddPlatformModal && (
          <AddPlatformModal onClose={this.hideAddPlatformModal} editingPlatform={editingPlatform} />
        )}
      </ContentWrapper>
    );
  }
}
