import PagePanel from 'components/PagePanel';
import TypeList from '../../containers/TypeList';
import i18n from 'utils/i18n';
import { Button, Icon } from 'lean-ui';
import cs from './index.less';

export default class Deposit extends PureComponent {
  showOperateTypeModal = () => {
    const { setParams } = this.props;
    setParams(
      {
        showOperateTypeModal: true,
        target: null
      },
      'deposit'
    );
  };

  render() {
    const { depositTypeList } = this.props;

    return (
      <PagePanel>
        <PagePanel.Header className={cs.header}>
          {i18n['settings.deposit_withdraw.deposit.title']}
          <Button type="default" onClick={this.showOperateTypeModal}>
            {i18n['general.add']}
          </Button>
        </PagePanel.Header>
        <PagePanel.Body className={cs.body}>
          <TypeList type="deposit" list={depositTypeList} />
        </PagePanel.Body>
      </PagePanel>
    );
  }
}
