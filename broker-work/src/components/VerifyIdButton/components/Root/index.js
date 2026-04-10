import cs from './index.less';
import Button from '../Button';
import SelectPanel from '../SelectPanel';
import Tips from 'components/Tips';
import { VERIFY_STATE_MAP, OPTIONS_TO_VERIFY } from '../../constants';
import i18n from 'utils/i18n';
import NoDataView from 'components/NoDataView';

export default class Root extends PureComponent {
  state = {
    verifyState: VERIFY_STATE_MAP.UNVERIFIED,
    verifyLayoutResult: {} //用于页面展示的结果数据，真实result从props中获取
  };
  componentDidMount() {
    const { getProductVasSwitch } = this.props;
    this.updateVerifyData(this.props);
    if (getProductVasSwitch) {
      getProductVasSwitch();
    }
  }
  componentWillReceiveProps(nextProps) {
    this.updateVerifyData(nextProps);
  }
  updateVerifyData = _props => {
    const props = _props || this.props;
    const verifyLayoutResult = this.filterUpdatedData(props);
    const verifyState = this.getVerifyStateByResult(verifyLayoutResult);
    this.setState({
      verifyLayoutResult,
      verifyState
    });
  };
  filterUpdatedData = ({ verifyResult, verifyData }) => {
    const newResult = {};
    Object.keys(verifyResult).forEach(key => {
      const item = verifyResult[key];
      if (item) {
        const value = item.number;
        const newValue = verifyData[key];
        const name = item.name;
        const newName = verifyData.name;
        if (value === newValue && name === newName) {
          //旧值与新值相等
          newResult[key] = verifyResult[key];
        }
      }
    });
    return newResult;
  };
  getVerifyStateByResult = result => {
    const isEmpty = !Object.keys(result).filter(key =>
      OPTIONS_TO_VERIFY.find(opt => opt.key === key)
    ).length;
    const isAllSuccess = Object.keys(result).every(key => {
      return result[key].checkState;
    });
    return isEmpty
      ? VERIFY_STATE_MAP.UNVERIFIED
      : isAllSuccess
        ? VERIFY_STATE_MAP.SUCCESSED
        : VERIFY_STATE_MAP.FAILED;
  };
  isItemDuplicate = (key, emptyAsDuplicate = true) => {
    const { verifyResult, verifyData } = this.props;
    const isDuplicate =
      verifyResult[key] &&
      verifyResult[key].name === verifyData.name &&
      verifyResult[key].number === verifyData[key];
    return isDuplicate || (emptyAsDuplicate && this.isResultedEmpty(key));
  };

  isResultedEmpty = key => {
    const { verifyResult, verifyData } = this.props;
    return verifyResult[key] && (!verifyData.name || !verifyData[key]);
  };

  // onReSelect = () => {
  //   const { verifyLayoutResult } = this.state;
  //   const copyData = JSON.parse(JSON.stringify(verifyLayoutResult));
  //   Object.keys(copyData).forEach(key => {
  //     const item = copyData[key];
  //     if (!this.isItemDuplicate(key)) {
  //       delete copyData[key];
  //     }
  //   });
  //   this.setState({
  //     verifyLayoutResult: copyData
  //   });
  // };
  setLayoutResult = array => {
    const { verifyLayoutResult } = this.state;
    const copyData = JSON.parse(JSON.stringify(verifyLayoutResult));
    array.forEach(item => {
      const { key, value } = item;
      copyData[key] = value;
    });
    this.setState({
      verifyLayoutResult: copyData
    });
  };
  getIsResultLayout = () => {
    const { verifyLayoutResult } = this.state;
    const fullResult = this.filterUpdatedData(this.props);
    return (
      Object.keys(verifyLayoutResult).length === Object.keys(fullResult).length
    );
  };
  isDataEmpty = () => {
    const { verifyLayoutResult } = this.state;
    const { verifyData } = this.props;
    const result =
      !(
        verifyData.name &&
        OPTIONS_TO_VERIFY.some(item => {
          return verifyData[item.key];
        })
      ) &&
      !OPTIONS_TO_VERIFY.some(item => {
        return verifyLayoutResult[item.key];
      });

    return result;
  };
  onSubmit = data => {
    const { onSubmit } = this.props;
    if (onSubmit) {
      const submit = onSubmit(data);
      this.setState({
        verifyState: VERIFY_STATE_MAP.VERIFING
      });
    }
  };
  render() {
    const { verifyState, verifyLayoutResult } = this.state;
    const { productVasSwitch } = this.props;
    if (!(productVasSwitch && productVasSwitch.VERIFICATION)) return <div />;
    const isResultLayout = this.getIsResultLayout();
    const isEmpty = this.isDataEmpty();
    return (
      <Tips
        className={cs['tips']}
        popoverClassName={`${cs['tips-box']}`}
        align="bottom-right"
        text={
          <Button
            {...this.props}
            verifyState={verifyState}
            verifyLayoutResult={verifyLayoutResult}
          />
        }
      >
        <div className={cs['result-title']}>
          {i18n['verification.title.verification']}
        </div>
        <div className={cs['panel-block']}>
          {isEmpty ? (
            <NoDataView text={i18n['verification.tips.no_data']} />
          ) : (
            <SelectPanel
              {...this.props}
              verifyState={verifyState}
              updateVerifyData={this.updateVerifyData}
              verifyLayoutResult={verifyLayoutResult}
              onReSelect={this.onReSelect}
              isResultLayout={isResultLayout}
              setLayoutResult={this.setLayoutResult}
              isItemDuplicate={this.isItemDuplicate}
              onSubmit={this.onSubmit}
            />
          )}
        </div>
      </Tips>
    );
  }
}
