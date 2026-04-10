import PagePanel from 'components/PagePanel';
import TypeList from '../../containers/TypeList';
import i18n from 'utils/i18n';
import cs from './index.less';
import { Button, Icon } from 'lean-ui';

export default class Withdraw extends PureComponent {
  showOperateTypeModal = () => {
    const { setParams } = this.props;
    setParams(
      {
        showOperateTypeModal: true,
        target: null
      },
      'withdraw'
    );
  };

  render() {
    const { withdrawTypeList } = this.props;

    return (
      <PagePanel>
        <PagePanel.Header className={cs.header}>
          {i18n['settings.deposit_withdraw.withdraw.title']}
          <Button type="default" onClick={this.showOperateTypeModal}>
            {i18n['general.add']}
          </Button>
        </PagePanel.Header>
        <PagePanel.Body className={cs.body}>
          <TypeList type="withdraw" list={withdrawTypeList} />
        </PagePanel.Body>
      </PagePanel>
    );
  }
}
