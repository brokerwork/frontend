import { FormControl } from 'react-bootstrap';
import cls from 'utils/class';
import cs from './SearchInput.less';

// ----------------------------------------------
// example:
//
// <SearchInput
//   className={cs['search-text']}
//   getData={this.searchInputAjax}
//   handleData={handleData}
//   onSelect={searchMemberBySearch}
//   clearValueAfterSelect
// />
// props说明：
//  className: 定义search box样式
//  getData: 一个promise形式的ajax函数，返回一个promise
//    示例：
//       searchInputAjax = (v) => {
//         const {searchMemberType} = this.props;
//         return post({
//           url: '/v1/user/findSimpleByPage',
//           data: {
//             queryContent: v,
//             queryType: searchMemberType
//           }
//         });
//       }
//  handleData: 处理ajax返回的函数，返回的data会作为list的数据源
//     示例：
//       function handleData(res) {
//         if (!res.result) return Promise.reject(false);
//         const __d = res.data.list;
//         const __data = __d.map((item) => {
//           let labelStr = item.name;
//           const __strArr = [];
//           if (item.roleName) __strArr.push(item.roleName);
//           if (item.entityNo) __strArr.push(item.entityNo);
//           if (__strArr.length > 0) {
//             labelStr += ` (${__strArr.join('/')})`;
//           }
//           return {
//             entityNo: item.entityNo,
//             name: item.name,
//             role: item.roleName,
//             id: item.pubUserId,
//             label: labelStr
//           }
//         });
//
//         return Promise.resolve(__data);
//      }
//
// ----------------------------------------------

export default class SearchInput extends PureComponent {
  constructor(props) {
    super(props);
    let initValue = this.props.defaultText || this.props.value || '';
    if (props.labelFunc) {
      initValue = props.labelFunc(this);
    }
    this.state = {
      data: [],
      showList: false,
      inputValue: initValue
    };
  }

  onFocus = e => {
    this.setState({
      showList: true
    });
  };

  onBlur = e => {
    setTimeout(() => {
      this.setState({
        showList: false
      });
    }, 200);
  };

  // 爆露出私有方法，用于外部通过refs刷新可选列表, 一般不用
  __updateList = () => {
    const v = this.state.inputValue;
    this.onChange(v);
  };

  handleData(data) {
    return data;
  }
  componentWillReceiveProps(nextProps) {
    const { autoUpdate } = this.props;
    const { inputValue } = this.state;
    if (nextProps.value && nextProps.value !== inputValue) {
      this.setState(
        {
          inputValue: nextProps.value
        },
        () => {
          this.__updateList();
        }
      );
    }
  }
  promiseId = 0;

  onChange = e => {
    let { getData, handleData, onInputChange } = this.props;
    if (!getData) return;
    if (!handleData) {
      handleData = this.handleData;
    }
    const v = e.target ? e.target.value : e;
    this.setState({
      inputValue: v
    });

    if (this.props.onChange) this.props.onChange(v); //redux form

    const p = getData(v)
      .then(handleData)
      .then(data => {
        if (p.id !== this.promiseId) return;
        this.setState({
          data: data
        });
      });
    p.id = ++this.promiseId;
    if (onInputChange) {
      onInputChange(v);
    }
  };

  selectItem(item) {
    const { onSelect, clearValueAfterSelect = false } = this.props;
    const { data } = this.state;
    const v = clearValueAfterSelect ? '' : item.label;
    const list = clearValueAfterSelect ? [] : data;
    this.setState(
      {
        inputValue: v,
        data: list
      },
      () => {
        if (onSelect) onSelect(item);

        if (this.props.onChange) this.props.onChange(item.label); //redux form
      }
    );
  }

  render() {
    const { data, showList, inputValue } = this.state;
    const {
      className = '',
      disabled,
      error,
      value,
      autoUpdate,
      placeholder
    } = this.props;
    return (
      <div className={`${cs['container']} ${className}`}>
        <FormControl
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.onChange}
          value={
            autoUpdate && typeof value !== 'undefined' ? value : inputValue
          }
          type="text"
          placeholder={placeholder}
          className={error ? cs['error'] : ''}
          disabled={disabled}
        />
        {data.length > 0 ? (
          <ul
            className={cls`dropdown-menu
                          ${cs['list']}
                          ${showList ? cs['show'] : ''}
                        `}
          >
            {data.map((item, index) => {
              return (
                <li
                  onClick={this.selectItem.bind(this, item)}
                  title={item.label}
                  key={index}
                >
                  <a href="javascript:;">{item.label}</a>
                </li>
              );
            })}
          </ul>
        ) : (
          undefined
        )}
      </div>
    );
  }
}
