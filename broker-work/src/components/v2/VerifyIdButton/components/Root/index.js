import cs from './index.less';
import Button from '../Button';
import SelectPanel from '../SelectPanel';
import {
  VERIFY_STATE_MAP,
  OPTIONS_TO_VERIFY,
  OPTIONS_TO_VERIFY_MAP,
  value_type_map,
  showFieldMap
} from '../../constants';
import i18n from 'utils/i18n';
import NoDataView from 'components/v2/NoDataView/verify';
import { Popover } from 'lean-ui';
import { getCountry } from 'utils/country';

export default class Root extends PureComponent {
  state = {
    verifyState: VERIFY_STATE_MAP.UNVERIFIED,
    verifyLayoutResult: {}, //用于页面展示的结果数据，真实result从props中获取
    options: []
  };
  componentDidMount() {
    const { getProductVasSwitch, getVerifyType } = this.props;
    getVerifyType().then(rs => {
      if (rs.result) {
        let options = rs.data.map(el => {
          return OPTIONS_TO_VERIFY_MAP[el];
        });
        console.log('options', options, this.props);
        this.setState({ options }, () => {
          this.updateVerifyData(this.props);
          if (getProductVasSwitch) {
            getProductVasSwitch();
          }
        });
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    // const data =
    //   nextProps.taskInitialValues && nextProps.taskInitialValues.step1;
    // let options = [...this.state.options];
    // if (data && data.certificateTypeGbg) {
    //   options = options.filter(el => {
    //     return el.type === value_type_map[data.certificateTypeGbg];
    //   });
    // }

    // console.log('options1', options, nextProps);

    // this.setState(
    //   {
    //     options
    //   },
    //   () => {
    //     this.updateVerifyData(nextProps);
    //   }
    // );
    this.updateVerifyData(nextProps);
  }
  updateVerifyData = _props => {
    console.log('excute', _props);
    const props = _props || this.props;
    const verifyLayoutResult = this.filterUpdatedData(props);
    console.log('verifyLayoutResult', verifyLayoutResult);
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
      if (!item) {
        return newResult;
      }
      switch (key) {
        case 'idNum':
        case 'accountNo':
          const value = item.number;
          const newValue = verifyData[key];
          const name = item.name;
          const newName = verifyData.name;
          if (value === newValue && name === newName) {
            //旧值与新值相等
            newResult[key] = verifyResult[key];
          }
          break;
        case 'drivingLicenceNumberGbg':
        case 'medicareNumberGbg':
        case 'shortPassportNumberGbg':
        case 'residentIdentityNumberGbg':
        case 'passportMrzNumberFullGbg':
          const same = showFieldMap[key].every(el => {
            if (el === 'countryGbg') {
              const country = getCountry(true);
              const val = country.find(c => c.value === verifyData[el]);
              verifyData[el] = val ? val.label : verifyData[el];
            }
            return (
              item[el] ===
              (Array.isArray(verifyData[el])
                ? verifyData[el][0]
                : verifyData[el])
            );
          });
          console.log('same', item, verifyData);
          if (same) {
            newResult[key] = verifyResult[key];
          }
          break;
        default:
          '';
      }
    });
    console.log('newResult', newResult);
    return newResult;
  };
  getVerifyStateByResult = result => {
    const isEmpty = !Object.keys(result).filter(key =>
      this.state.options.find(opt => opt.key === key)
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
    let isDuplicate;
    console.log('ket', key);
    switch (key) {
      case 'idNum':
      case 'accountNo':
        isDuplicate =
          verifyResult[key] &&
          verifyResult[key].name === verifyData.name &&
          verifyResult[key].number === verifyData[key];
        break;
      case 'drivingLicenceNumberGbg':
      case 'medicareNumberGbg':
      case 'shortPassportNumberGbg':
      case 'residentIdentityNumberGbg':
      case 'passportMrzNumberFullGbg':
        isDuplicate = showFieldMap[key].every(el => {
          return verifyResult[key]
            ? verifyResult[key][el] ===
                (Array.isArray(verifyData[el])
                  ? verifyData[el][0]
                  : verifyData[el])
            : false;
        });
        break;
      default:
        '';
    }
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
    console.log('excute1');
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
        this.state.options.some(item => {
          return verifyData[item.key];
        })
      ) &&
      !this.state.options.some(item => {
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
    const { verifyState, verifyLayoutResult, options } = this.state;
    const { productVasSwitch } = this.props;
    if (!(productVasSwitch && productVasSwitch.VERIFICATION)) return <div />;
    const isResultLayout = this.getIsResultLayout();
    const isEmpty = this.isDataEmpty();
    console.log('verifyLayoutResult', verifyLayoutResult);
    return (
      <Popover
        placement="bottomLeft"
        trigger="click"
        content={
          <div className={cs['panel-block']}>
            {isEmpty ? (
              <NoDataView text={i18n['verification.tips.no_data']} />
            ) : (
              <SelectPanel
                {...this.props}
                verifyState={verifyState}
                options={options}
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
        }
      >
        <span>
          <Button
            {...this.props}
            verifyState={verifyState}
            verifyLayoutResult={verifyLayoutResult}
          />
        </span>
      </Popover>
    );
  }
}
