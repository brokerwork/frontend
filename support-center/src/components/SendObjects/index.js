import { DropdownForCode } from 'components/Dropdown';
import Checkbox from 'components/Checkbox';
import cs from './index.less';
import i18n from 'utils/i18n';

/**
 * PropsList:
 * data: 已有数据列表[{id: 1, name: '显示名称'}]
 * onHide: 当搜索框被收起时触发
 * getReceiverList: 获取搜索列表的搜索Promise action，传入search字段
 * onChange: 当选择数据发生变化时触发
 */

export default class SendObjects extends PureComponent {
  constructor(props) {
    super(props);
    const selectedOptions = props.data || [];
    this.state = {
      searchText: '',
      searchOptions: [],
      selectedOptions,
      selectedIds: selectedOptions.map(s => s.id),
      showSearch: false
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.hideSearch = this.hideSearch.bind(this);
  }
  componentWillReceiveProps({data = []}) {
    this.setState({
      selectedOptions: data,
      selectedIds: data.map(s => s.id)
    });
  }
  componentDidMount() {
    document.body.addEventListener('click', this.hideSearch);
  }
  componentWillUnmount() {
    document.body.removeEventListener('click', this.hideSearch);
  }
  hideSearch(e) {
    const { onHide = () => {} } = this.props;
    const { showSearch } = this.state;
    const tag = e.target.dataset['tag'];
    if (tag === 'show') {
      return false;
    }
    if (showSearch) {
      onHide();
      this.setState({
        searchText: '',
        showSearch: false
      });
    }
  }
  onInputChange(e) {
    const { getReceiverList } = this.props;
    const { selectedIds } = this.state;
    const val = e.target.value;
    this.setState({
      searchText: val
    });
    getReceiverList({
      search: val
    }).then(res => {
      if (res.result) {
        const { data = [] } = res;
        const searchOptions = data.map(d => {
          return Object.assign({}, d, {
            id: d.pubUserId,
            checked: selectedIds.includes(d.pubUserId)
          });
        });
        this.setState({
          searchOptions
        });
      }
    });
  }
  onItemClick(item) {
    const {
      selectedOptions = [],
      selectedIds = [],
      searchOptions = []
    } = this.state;
    if (selectedOptions.length > 256 && !item.checked) {
      return;
    }
    let selectedTemp = [];
    if (item.checked) {
      selectedTemp = selectedOptions.filter(s => s.id !== item.id);
    } else {
      selectedTemp = [...selectedOptions];
      delete item.checked;
      selectedTemp.push(item);
    }
    this.itemOptionProcess(item, selectedTemp);
  }
  onItemRemove(item) {
    const { selectedOptions = [], searchOptions = [] } = this.state;
    let selectedTemp = [];
    selectedTemp = selectedOptions.filter(s => s.id !== item.id);
    this.itemOptionProcess(item, selectedTemp);
  }
  itemOptionProcess(item, selectedItem) {
    const { onChange } = this.props;
    const { searchOptions = [] } = this.state;
    let selectedIdsTemp = [];
    let selectedData = [];
    const searchOptionsTemp = searchOptions.map(s => {
      if (s.id === item.id) {
        return Object.assign({}, s, {
          checked: !s.checked
        });
      } else {
        return s;
      }
    });
    selectedItem.forEach(e => {
      selectedIdsTemp.push(e.id);
      selectedData.push({ name: e.name, id: e.id });
    });
    onChange(selectedData);
    this.setState({
      selectedOptions: selectedItem,
      selectedIds: selectedIdsTemp,
      searchOptions: searchOptionsTemp
    });
  }
  searchOptionsRender(searchOptions) {
    const { showSearch } = this.state;
    return showSearch ? (
      searchOptions && searchOptions.length ? (
        <ul data-tag="show" className={`${cs['options']}`}>
          {searchOptions.map(r => (
            <li data-tag="show" key={r.id}>
              <label data-tag="show">
                <input
                  data-test={`optionCheck${r.id}`}
                  data-tag="show"
                  type="checkbox"
                  name="receiverList"
                  checked={r.checked}
                  onChange={this.onItemClick.bind(this, r)}
                />
                {r.name}
              </label>
            </li>
          ))}
        </ul>
      ) : null
    ) : null;
  }
  selectedOptionsRender(selectedOptions) {
    return selectedOptions && selectedOptions.length
      ? selectedOptions.map(o => (
          <div className={cs['selected-item']} key={o.id}>
            {o.name}
            <i
              data-test={`selectedOptions${o.id}`}
              onClick={this.onItemRemove.bind(this, o)}
              className="fa fa-times"
            />
          </div>
        ))
      : null;
  }
  onInputFocus(e) {
    this.setState({
      showSearch: true
    });
  }
  render() {
    const { searchText, searchOptions, selectedOptions = [] } = this.state;
    return (
      <div className={cs['send-obj']} data-test="container">
        <label>
          <div data-tag="show" className={cs['search-bar']}>
            {this.selectedOptionsRender(selectedOptions)}
            <input
              placeholder={i18n['settings.notify_center.placeholder']}
              data-tag="show"
              data-test="input"
              onFocus={this.onInputFocus}
              className={cs['search-input']}
              type="text"
              onChange={this.onInputChange}
              value={searchText}
            />
          </div>
        </label>
        {this.searchOptionsRender(searchOptions)}
      </div>
    );
  }
}
