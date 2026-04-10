import Table from 'components/Table';
import Button from 'components/Button';
import cs from './Nation.less';
import i18n from 'utils/i18n';
import PaginationBar from 'components/PaginationBar';
import Checkbox from 'components/Checkbox';

export default class Nation extends PureComponent {
  state = {
    keyword: '',
    pageNo: 1,
    pageSize: 20
  }

  componentDidMount() {
    this.getNationList();
  }

  getNationList = () => {
    const { keyword, pageNo, pageSize } = this.state;
    const { getNationList } = this.props;

    getNationList(keyword, pageNo, pageSize);
  }

  onChange = (evt) => {
    this.setState({
      keyword: evt.target.value
    });
  }

  onSearch = (evt) => { 
    if (evt.which === 13) {
      this.setState({
        pageNo: 1
      }, () => {
        this.getNationList();
      });
    }
  }

  onPageChange = ({ pageNo, pageSize }) => {
    this.setState({
      pageNo,
      pageSize
    }, () => {
      this.getNationList();
    });
  }

  updateNationStatus = (nation) => {
    const { updateNationStatus, showTopAlert } = this.props;
    const status = nation.enable ? 'disable' : 'enable';

    updateNationStatus(status, nation.id).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.modify_success']
        });
      }
    });
  }

  disableNation = (nation) => {
    const { showTipsModal } = this.props;
    const isDefaulted = nation.defaulted;

    showTipsModal({
      content: isDefaulted ? i18n['nation.disable.disabled.tips'] : i18n['nation.disable.tips'],
      noConfirm: isDefaulted,
      onConfirm: (cb) => {
        cb();
        this.updateNationStatus(nation);
      }
    });
  }

  toggleNationDefault = (nation, evt) => {
    const { setNationDefault, clearNationDefault, showTopAlert } = this.props;
    const checked = evt.target.checked;
    const action = checked ? setNationDefault : clearNationDefault;

    action(nation.id).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.modify_success']
        });
      }
    });
  }

  render() {
    const { keyword } = this.state;
    const { nationList } = this.props;

    return (
      <div className={cs['wrapper']}>
        <div>
          <p>{i18n['field.setting.field.form.nation.tips1']}</p>
          <p>{i18n['field.setting.field.form.nation.tips2']}</p>
        </div>
        <div className="actions-bar">
          <div>
            <input 
              type="text" 
              className={`form-control ${cs['form-control']}`} 
              placeholder={i18n['field.setting.field.form.nation.placeholder']} 
              value={keyword} 
              onChange={this.onChange}
              onKeyPress={this.onSearch}
            />
          </div>
        </div>
        <Table>
          <Table.Header>
            <th>{i18n['field.setting.field.form.nation.title']}</th>
            <th>{i18n['table.header.operation']}</th>
            <th>{i18n['field.setting.field.option.default']}</th>
          </Table.Header>
          <Table.Body>
            {nationList.list.map((nation, idx) => {
              return (
                <tr key={idx}>
                  <td>
                    {nation.value}
                  </td>
                  <td>
                    {nation.enable
                      ? <Button icon onClick={this.disableNation.bind(this, nation)} title={i18n['nation.button.disable.tips']}>
                          <i className="fa fa-ban"></i>
                        </Button>
                      : <Button icon style="primary" onClick={this.updateNationStatus.bind(this, nation)} title={i18n['nation.button.enable.tips']}>
                          <i className="fa fa-check-circle"></i>
                        </Button>}
                  </td>
                  <td className="text-center">
                    <Checkbox 
                      inline 
                      checked={nation.defaulted} 
                      disabled={!nation.enable}
                      onChange={this.toggleNationDefault.bind(this, nation)}
                    ></Checkbox>
                  </td>
                </tr>
              );
            })}
          </Table.Body>
        </Table>
        <PaginationBar
          onPageChange={this.onPageChange}
          total={nationList.total}
          pageSize={nationList.size}
          pageNo={nationList.pager}
        ></PaginationBar>
      </div>
    );
  }
}