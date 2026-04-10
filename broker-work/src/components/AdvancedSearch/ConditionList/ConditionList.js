import cs from '../AdvancedSearch.less';
import { Button } from 'react-bootstrap';
import i18n from 'utils/i18n';
import Dropdown from 'components/Dropdown';
import PropTypes from 'prop-types';

let timer = null;
let cache = {};
export default class SearchCondition extends Component {
  state = {
    conditionList: [],
    currentValue: this.props.value
  };
  componentDidMount() {
    const { registFunction } = this.context;
    registFunction({
      ConditionGetList: this.getList,
      ConditionOnSelect: this.onSelect
    });
    this.getList(true).then(res => {
      const { value } = this.props;
      if (value && value.value) {
        this.onSelect(value);
      }
    });
  }
  componentWillReceiveProps(nextProps, nextContent) {
    const { searchType: nextSearchType } = nextContent;
    const { value: nextValue } = nextProps;
    const { currentValue } = this.state;
    const { searchType } = this.context;
    if (nextSearchType !== searchType) {
      setTimeout(() => {
        this.getList();
      });
    }
    if (!currentValue && nextValue) {
      // this.onSelect(nextValue);
    } else if (
      (currentValue && currentValue.value) !== (nextValue && nextValue.value)
    ) {
      this.setState({
        currentValue: nextValue
      });
    }
  }
  getList = useCache => {
    const { getConditions } = this.props;
    const { searchType } = this.context;
    if (useCache && cache[searchType]) {
      return new Promise(resolve => {
        this.setState(
          {
            conditionList: cache[searchType]
          },
          () => {
            resolve();
          }
        );
      });
    } else {
      return getConditions({ searchType }).then(res => {
        if (res.result) {
          const conditionList = parseConditionsListData(res.data);
          cache[searchType] = conditionList;
          this.setState(
            {
              conditionList
            },
            () => {
              return Promise.resolve();
            }
          );
        }
        return Promise.resolve();
      });
    }
  };
  onRemoveCondition = (condition, e) => {
    const {
      removeCondition,
      showTipsModal,
      showTopAlert,
      value: currentValue
    } = this.props;
    const { value } = condition;
    showTipsModal({
      content: i18n['advanced_search.form.confirm_remove'],
      onConfirm: cb => {
        removeCondition(value).then(res => {
          if (res.result) {
            showTopAlert({
              bsStyle: 'success',
              content: i18n['general.remove_success']
            });
            this.getList().then(() => {
              const { conditionList } = this.state;
              if (currentValue && currentValue.value === value) {
                this.onSelect(conditionList[0]);
              }
            });
            cb();
          }
        });
      }
    });
    e.preventDefault();
    e.stopPropagation();
  };
  renderItem = item => {
    return (
      <span className={cs['dropdown-li']}>
        <span className={cs['dropdown-label']}>{item.label}</span>
        {item.searchLevel === 'USER' ? (
          <i
            className="fa fa-remove"
            onClick={this.onRemoveCondition.bind(this, item)}
          />
        ) : (
          undefined
        )}
      </span>
    );
  };
  onSelect = (selected, justDoSelect) => {
    const { onSelect, showTopAlert } = this.props;
    const { currentValue } = this.state;
    if (justDoSelect) {
      if (onSelect) {
        onSelect(selected);
      }
      this.setState({
        currentValue: selected
      });
      return;
    }
    this.renderTags(selected).then(
      () => {
        if (onSelect) {
          onSelect(selected);
        }
        this.setState({
          currentValue: selected
        });
      },
      () => {
        this.setState({
          currentValue
        });
        showTopAlert({
          content: i18n['advanced_search.field_forbidden']
        });
      }
    );
  };
  renderTags = selected => {
    clearInterval(timer);
    const limit = 5;
    let count = 0;
    const promise = new Promise((resolve, reject) => {
      let checkTags = this.doRenderTags(selected);
      if (!checkTags) {
        timer = setInterval(() => {
          checkTags = this.doRenderTags(selected);
          if (checkTags) {
            checkTags.then(
              () => {
                resolve();
              },
              () => {
                reject();
              }
            );
            clearInterval(timer);
          } else if (count >= limit) {
            clearInterval(timer);
          } else {
            count++;
          }
        }, 1000);
      } else {
        checkTags.then(
          () => {
            resolve();
          },
          () => {
            reject();
          }
        );
      }
    });
    return promise;
  };
  doRenderTags = selected => {
    const { container } = this.props;
    const { openWithSearchId } = this.context;
    if (openWithSearchId) {
      return openWithSearchId(selected.searchId);
    }
  };
  render() {
    const { value, className } = this.props;
    const { conditionList, currentValue } = this.state;
    const _value = currentValue || {
      label: i18n['advanced_search.list.fast_search'],
      value: ''
    };
    if (!(conditionList && conditionList.length > 1)) {
      return <span />;
    }
    return (
      <Dropdown
        className={className}
        data={conditionList}
        onSelect={this.onSelect}
        autoWidth
        renderMenuItem={this.renderItem}
        value={_value}
      />
    );
  }
}

//组合条件信息
function parseConditionsListData(conditionsList) {
  const copyData = conditionsList.concat();
  let conditionsData = [
    { label: i18n['advanced_search.list.fast_search'], value: '' }
  ];
  copyData.forEach(condition => {
    conditionsData.push({
      ...condition,
      label: condition.name,
      value: condition.searchId
    });
  });
  return conditionsData;
}

SearchCondition.contextTypes = {
  openWithSearchId: PropTypes.func,
  registFunction: PropTypes.func,
  searchType: PropTypes.string
};
