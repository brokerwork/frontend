import { Dialog } from 'lean-ui';
import Loading from 'components/Loading';
import CheckList from './checkList';
import { PureComponent } from 'react';
import cs from './style.less';
import i18n from 'utils/i18n';

export default class AddToWorkbench extends PureComponent {
  constructor(props) {
    super(props);
    const { myDashboardArr = [], options = [] } = props;
    this.state = {
      loading: true,
      showModal: false,
      selected: []
    };
  }
  toggleModal() {
    this.setState({
      showModal: true
    });
  }
  onConfirm() {
    const { saveMyDashboard, myDashboardArr = [], showTopAlert } = this.props;
    const { selected, selectedBackup } = this.state;
    let submitData = this.arrayMerge(selected, myDashboardArr);
    if (submitData.length > 18) {
      showTopAlert({
        content: i18n['dashboard.tips.my_dashboard.add_failed']
      });
      return;
    }
    saveMyDashboard(submitData).then(res => {
      if (res.result) {
        this.setState({
          showModal: false
        });
      }
    });
  }
  arrayMerge(thisPageSelected, prevAllSelect) {
    const { options = [] } = this.props;
    console.log('init', options, thisPageSelected, prevAllSelect);
    const deleted = options.filter(op => {
      return !thisPageSelected.includes(op);
    });
    const selected = prevAllSelect.filter(sl => {
      return !deleted.includes(sl);
    });
    const add = thisPageSelected.filter(sl => {
      return !prevAllSelect.includes(sl);
    });
    return [...selected, ...add];
  }
  onHide() {
    this.setState({
      showModal: false
    });
  }
  onChange(selected) {
    this.setState({ selected });
  }
  componentDidMount() {
    const { myDashboardArr = [], options = [], getMyDashboard } = this.props;
    let selectedInThisPage = [];
    getMyDashboard().then(res => {
      const { result, data = [] } = res;
      if (result) {
        options.forEach(op => {
          if (data.includes(op)) {
            selectedInThisPage.push(op);
          }
        });
      }
      this.setState({ loading: false, selected: selectedInThisPage });
    });
  }
  render() {
    const { options, className } = this.props;
    const { showModal, selected, loading } = this.state;
    return (
      <div
        className={cs['add-workbench'] + `${className ? ' ' + className : ''}`}
      >
        <div className={cs['add-btn']} onClick={this.toggleModal.bind(this)}>
          <i className="fa fa-fa-add-btn" />
        </div>
        {showModal ? (
          <Dialog
            visible={true}
            title={i18n['dashboard.addworkbench.title']}
            onHide={this.onHide.bind(this)}
            onOk={this.onConfirm.bind(this)}
            onCancel={this.onHide.bind(this)}
            okText={i18n['general.confirm']}
            cancelText={i18n['general.cancel']}
          >
            {loading ? (
              <Loading />
            ) : (
              <CheckList
                options={options}
                defaultVal={selected}
                onChange={this.onChange.bind(this)}
              />
            )}
          </Dialog>
        ) : null}
      </div>
    );
  }
}
