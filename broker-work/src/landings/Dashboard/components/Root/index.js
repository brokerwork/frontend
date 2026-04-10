import DashboardItem from '../../containers/DashboardItem';
import DateRangePicker from './../DateRangePicker';
import { Button } from 'lean-ui';
import cs from 'landings/Dashboard/components/common.less';
import csr from './Root.less';
import i18n from 'utils/i18n';
import setPageTitle from 'utils/setPageTitle';
import { MENUS } from 'utils/headerMenus';
import constants from '../constants';
import moment from 'moment';
import _ from 'lodash';

const loadLen = 9;
export default class Root extends PureComponent {
  constructor(props) {
    super(props);
    const { myDashboardArr = [] } = props;
    this.state = {
      edit: false,
      myDashboardArr,
      showDashboardArr: [],
      showDashboardArrBak: []
    };
  }
  componentDidMount() {
    const { getMyDashboard, setDashboardViewRight, userRights } = this.props;

    Promise.resolve(setDashboardViewRight(userRights)).then(() => {
      getMyDashboard().then(res => {
        const { result, data = [] } = res;
        const { dashboardViewRight } = this.props;
        const filteredData = data.filter(
          item =>
            dashboardViewRight[constants[item].right] &&
            userRights[constants[item].category]
        );

        if (result) {
          this.setState({
            myDashboardArr: filteredData,
            showDashboardArr: this.showDashboardTrans(filteredData)
          });
        }
      });
    });
  }
  showDashboardTrans(myDashboardArr) {
    const temp = [...myDashboardArr];
    let showDashboardArr = [];
    if (myDashboardArr.length > loadLen) {
      showDashboardArr = temp.splice(0, loadLen);
    } else {
      showDashboardArr = [...temp];
    }
    return showDashboardArr;
  }
  loadMore() {
    const { myDashboardArr } = this.state;
    this.setState({
      showDashboardArr: myDashboardArr
    });
  }
  modifyParams(field, value) {
    console.log(1, field, value)
    const { modifyParams, searchParams } = this.props;
    let obj;
    if (field === 'date') {
      obj = {
        fromTime: value.start,
        toTime: value.end
      };
    }
    const params = {
      ...searchParams,
      ...obj
    };
    modifyParams(params);
  }
  editChange(type) {
    const { showDashboardArr, showDashboardArrBak } = this.state;
    if (type === 'cancel') {
      this.setState({
        edit: false,
        showDashboardArr: showDashboardArrBak
      });
      return;
    }
    if (type === 'edit') {
      const showDashboardArrBak = [...showDashboardArr];
      this.setState({
        edit: true,
        showDashboardArrBak
      });
      return;
    }
  }
  updateMyDashboard() {
    const { myDashboardArr } = this.state;
    const { saveMyDashboard, showTopAlert } = this.props;
    saveMyDashboard(myDashboardArr).then(res => {
      if (res.result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.modify_success']
        });
        this.setState({
          edit: false,
          myDashboardArr: res.data.type || []
        });
      }
    });
  }
  onItemDelete(item) {
    const { myDashboardArr, showDashboardArr } = this.state;
    let end = _.remove(myDashboardArr, function(d) {
      return d !== item;
    });
    let showEnd = _.remove(showDashboardArr, function(d) {
      return d !== item;
    });
    this.setState({ myDashboardArr: end, showDashboardArr: showEnd });
  }
  render() {
    const { searchParams } = this.props;
    const { edit, myDashboardArr, showDashboardArr } = this.state;
    return (
      <div className={csr['my-dashboard']}>
        <div className={cs['navigation-bar']}>
          <div className={cs['navigation-left']} />
          {edit
            ? [
                <Button
                  key="update"
                  className={csr['button']}
                  type="primary"
                  onClick={this.updateMyDashboard.bind(this)}
                >
                  {i18n['general.update']}
                </Button>,
                <Button
                  key="cancel"
                  className={csr['button']}
                  type="primary"
                  onClick={this.editChange.bind(this, 'cancel')}
                >
                  {i18n['general.cancel']}
                </Button>
              ]
            : [
                <DateRangePicker
                  key="date-range"
                  align="right"
                  onChange={this.modifyParams.bind(this, 'date')}
                  defaultDate={{
                    start: searchParams.fromTime,
                    end: searchParams.toTime
                  }}
                  defaultLabel={
                    i18n['general.date_range_picker.option.last7days']
                  }
                />,
                <Button
                  key="edit"
                  className={csr['button']}
                  type="primary"
                  onClick={this.editChange.bind(this, 'edit')}
                >
                  <span className="fa fa-pencil" />
                  {i18n['general.edit']}
                </Button>
              ]}
        </div>
        <div className={csr['dashboard-innerBox']}>
          {showDashboardArr.length
            ? showDashboardArr.map(item => {
                return (
                  <DashboardItem
                    key={item}
                    item={constants[item]}
                    edit={edit}
                    onDelete={this.onItemDelete.bind(this)}
                  />
                );
              })
            : null}
        </div>
        {showDashboardArr.length > 0 &&
        myDashboardArr.length > loadLen &&
        myDashboardArr.length !== showDashboardArr.length ? (
          <div className={`${csr['load']}`} onClick={this.loadMore.bind(this)}>
            <span className="fa fa-chevron-down" />
          </div>
        ) : null}
      </div>
    );
  }
}
