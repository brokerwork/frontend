import Panel from 'components/Panel';
import Button from 'components/Button';
import StepList from './StepList';
import cs from '../index.less';
import i18n from 'utils/i18n';
import _ from 'lodash';

export default class RealAccountSetting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = this.initialState();
  }
  initialState = () => {
    const copyData = _.cloneDeep(this.props.paltSetting);
    const {
      firstStepFieldList,
      firstPoolFieldList,
      secondPoolFieldList,
      secondStepFieldList,
      thirdStepFieldList,
      thirdPoolFieldList
    } = copyData;
    return {
      firstStepFieldList,
      firstPoolFieldList,
      secondPoolFieldList,
      secondStepFieldList,
      thirdStepFieldList,
      thirdPoolFieldList
    };
  };
  componentWillReceiveProps(nextProps) {
    const {
      paltSetting: {
        firstStepFieldList,
        firstPoolFieldList,
        secondPoolFieldList,
        secondStepFieldList,
        thirdStepFieldList,
        thirdPoolFieldList
      }
    } = nextProps;
    if (!_.isEqual(nextProps.paltSetting, this.props.paltSetting)) {
      this.setState({
        firstStepFieldList,
        firstPoolFieldList,
        secondPoolFieldList,
        secondStepFieldList,
        thirdStepFieldList,
        thirdPoolFieldList
      });
    }
  }
  /**
   * 点击启用，禁用，对列表的操作
   */
  isEnabled = (listDelete, listPush, params) => {
    const newListDelete = _.cloneDeep(listDelete);
    const newListPush = _.cloneDeep(listPush);
    newListDelete.splice(params.key, 1);
    newListPush.push(params.item);
    this.setState({
      [`${params.type}${params.sort ? 'Step' : 'Pool'}FieldList`]: newListDelete,
      [`${params.type}${params.sort ? 'Pool' : 'Step'}FieldList`]: newListPush
    });
  };
  arrTans(arr, oldIndex, newIndex) {
    const oldId = arr[oldIndex];
    arr.splice(oldIndex, 1);
    arr.splice(newIndex, 0, oldId);
    return arr;
  }
  onSort = type => evt => {
    const data = this.state[`${type}StepFieldList`];
    const { oldIndex, newIndex } = evt;
    const copyed = _.cloneDeep(data);
    const end = this.arrTans(copyed, oldIndex, newIndex);
    if (oldIndex !== newIndex) {
      this.setState({
        [`${type}StepFieldList`]: end
      });
    }
  };
  onSave = () => {
    const { savePlatSetting, plat, productId, getPlatSetting, showTopAlert } = this.props;
    const { firstStepFieldList, secondStepFieldList, thirdStepFieldList } = this.state;
    const params = { firstStepFieldList, secondStepFieldList, thirdStepFieldList };
    params.productId = productId;
    savePlatSetting(plat, 'form-fields', params).then(res => {
      if (res.result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.save_success']
        });
        getPlatSetting(plat);
      }
    });
  };
  onReset = () => {
    const {
      firstStepFieldList,
      firstPoolFieldList,
      secondPoolFieldList,
      secondStepFieldList,
      thirdStepFieldList,
      thirdPoolFieldList
    } = this.initialState();
    this.setState({
      firstStepFieldList,
      firstPoolFieldList,
      secondPoolFieldList,
      secondStepFieldList,
      thirdStepFieldList,
      thirdPoolFieldList
    });
    this.props.showTopAlert({
      style: 'success',
      content: i18n['general.reset_success']
    });
  };
  render() {
    const {
      firstStepFieldList,
      firstPoolFieldList,
      secondPoolFieldList,
      secondStepFieldList,
      thirdStepFieldList,
      thirdPoolFieldList
    } = this.state;
    return (
      <div>
        <Panel className={cs.margin_15} header={i18n['platform.tab.open.account.real']}>
          <StepList
            title={i18n['platform.tab.open.account.step1']}
            sortableData={firstStepFieldList}
            dissortableData={firstPoolFieldList}
            type="first"
            isEnabled={this.isEnabled}
            onSort={this.onSort}
          />
          <StepList
            title={i18n['platform.tab.open.account.step2']}
            sortableData={secondStepFieldList}
            dissortableData={secondPoolFieldList}
            type="second"
            isEnabled={this.isEnabled}
            onSort={this.onSort}
          />
          <StepList
            title={i18n['platform.tab.open.account.step3']}
            sortableData={thirdStepFieldList}
            dissortableData={thirdPoolFieldList}
            type="third"
            isEnabled={this.isEnabled}
            onSort={this.onSort}
          />
          <div>
            <Button style="primary" className={cs.margin_right} onClick={this.onSave}>
              {i18n['app.btn.save']}
            </Button>
            <Button onClick={this.onReset}> {i18n['app.btn.reset']}</Button>
          </div>
        </Panel>
      </div>
    );
  }
}
