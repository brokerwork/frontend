import cs from './index.less';
import {
  VERIFY_ICON_MAP,
  VERIFY_BUTTON_TEXT_MAP,
  OPTIONS_TO_VERIFY,
  VERIFY_STATE_MAP,
  KEY_TYPE_MAP,
  showFieldMap
} from '../../constants';
import SelectItem from '../SelectItem';
import Result from '../Result';
import i18n from 'utils/i18n';
import moment from 'moment';
import { Button } from 'lean-ui';
import { getCountry } from 'utils/country';

export default class SelectPanel extends PureComponent {
  state = {
    selectedItemMap: {},
    duplicateItems: {}
  };
  onItemSelect = (key, toggle) => {
    const { selectedItemMap } = this.state;
    const copyData = JSON.parse(JSON.stringify(selectedItemMap));
    if (toggle) {
      copyData[key] = toggle;
    } else {
      delete copyData[key];
    }
    this.setState({
      selectedItemMap: copyData
    });
  };

  onSubmit = () => {
    const { onSubmit } = this.props;
    const selectedData = this.getSelectedData();
    const verifiedData = this.getVerifidData();
    const data = this.deelDuplicateAndVerifiedData(
      selectedData.concat(verifiedData)
    );

    const country = getCountry(true);
    data.forEach(el => {
      if (el.countryGbg) {
        el.countryGbg = country.find(c => c.value === el.countryGbg).label;
      }
    });
    if (onSubmit && data.length) {
      onSubmit(data);
      this.setState({
        selectedItemMap: {}
      });
    }
  };

  deelDuplicateAndVerifiedData = data => {
    const {
      verifyData,
      verifyResult,
      setLayoutResult,
      isItemDuplicate
    } = this.props;
    const { selectedItemMap } = this.state;
    const quickResult = [];
    const duplicateItems = {};
    const unDuplicateData = data.filter(item => {
      const resultItem = verifyResult[item.key];
      const isDuplicate = isItemDuplicate(item.key);
      if (isDuplicate) {
        quickResult.push({
          key: item.key,
          value: resultItem
        });
        duplicateItems[item.key] = true;
      } else {
        delete duplicateItems[item.key];
      }
      return !isDuplicate;
    });
    Object.keys(verifyResult).forEach(key => {
      const isInUnDuplicateData = unDuplicateData.some(
        unDupItem => unDupItem.key === key
      );
      if (!isInUnDuplicateData && isItemDuplicate(key)) {
        quickResult.push({
          key: key,
          value: verifyResult[key]
        });
      }
    });
    setLayoutResult(quickResult);
    this.setState({
      duplicateItems
    });
    return unDuplicateData;
  };
  //已验证项默认选中
  getVerifidData = () => {
    const { verifyLayoutResult, verifyData, verifyResult } = this.props;
    return Object.keys(verifyLayoutResult).map(key => {
      return {
        type: KEY_TYPE_MAP[key],
        name: verifyData.name,
        number: verifyData[key],
        key: key
      };
    });
  };

  getSelectedData = () => {
    const { verifyData, verifyResult } = this.props;
    const { selectedItemMap } = this.state;
    return Object.keys(selectedItemMap).map(key => {
      const item = selectedItemMap[key];
      let data = {
        type: item.type,
        name: verifyData.name,
        number: verifyData[item.key],
        key: item.key
      };
      showFieldMap[key] &&
        showFieldMap[key].forEach(el => {
          data[el] = verifyData[el];
        });
      console.log('data111', data);
      return data;
    });
  };
  getCheckTime = () => {
    const { verifyLayoutResult, verifyData } = this.props;
    const timestamp = Object.keys(verifyLayoutResult).reduce((max, key) => {
      if (verifyLayoutResult[key].checkTime > max) {
        return verifyLayoutResult[key].checkTime;
      } else {
        return max;
      }
    }, 0);
    return timestamp && moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
  };
  renderSelectItem = (item, i) => {
    const { verifyLayoutResult, verifyData, fields } = this.props;
    const { selectedItemMap, duplicateItems } = this.state;
    const { key } = item;
    const result = verifyLayoutResult[key];
    const value = verifyData[key];
    console.log('result', verifyLayoutResult, item, value);
    if (result) {
      return (
        <Result
          key={i}
          result={result}
          option={item}
          isDuplicate={!!duplicateItems[key]}
          verifyData={verifyData}
        />
      );
    } else if (value) {
      return (
        <SelectItem
          fields={fields}
          onItemSelect={this.onItemSelect}
          selectedItemMap={selectedItemMap}
          key={i}
          option={item}
          verifyData={verifyData}
        />
      );
    } else {
      return <div key={i} />;
    }
  };
  componentDidMount() {
    const { updateVerifyData } = this.props;
    if (updateVerifyData) {
      updateVerifyData();
    }
  }
  // onReSelect = () => {
  //   const { onReSelect, verifyResult, isItemDuplicate } = this.props;
  //   const { selectedItemMap } = this.state;
  //   const newSelectedItems = OPTIONS_TO_VERIFY.reduce((obj, item) => {
  //     const key = item.key;
  //     const resultItem = verifyResult[key];
  //     if (resultItem && !resultItem.checkState && isItemDuplicate(key)) {
  //       obj[key] = item;
  //     }
  //     return obj;
  //   }, {});
  //   this.setState(
  //     {
  //       selectedItemMap: newSelectedItems
  //     },
  //     onReSelect
  //   );
  // };
  render() {
    const {
      verifyState,
      options,
      // onReSelect,
      verifyLayoutResult,
      verifyRecordResult,
      verifyResult,
      isResultLayout
    } = this.props;
    const checkTime = this.getCheckTime();
    return (
      <div className={cs['select-panel']}>
        <div>{options.map(this.renderSelectItem)}</div>
        <div className={cs['check-time']}>
          {checkTime ? (
            <div>
              {i18n['verification.check_time']}: {checkTime}
            </div>
          ) : (
            undefined
          )}
        </div>
        <Button className={cs['button']} type="primary" onClick={this.onSubmit}>
          {verifyState !== VERIFY_STATE_MAP.UNVERIFIED
            ? i18n['verification.button.re_verify']
            : i18n['verification.button.verify']}
        </Button>

        {/* <Button
          style={isResultLayout ? {} : { display: 'none' }}
          className={cs['button']}
          bsStyle="link"
          onClick={this.onReSelect}
        >
          {i18n['verification.button.re_select']}
        </Button> */}
      </div>
    );
  }
}
