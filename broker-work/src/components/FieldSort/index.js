import Modal from 'components/Modal';
import cs from './FieldSort.less';
import i18n from 'utils/i18n';
import { Button } from 'react-bootstrap';
import Checkbox from 'components/Checkbox';
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from 'react-sortable-hoc';
import { FormattedMessage } from 'react-intl';

/**
 * 传入参数：data(全部字段,每个字段带有标记是否显示，根据这个标记在一开始会整理数据),
 * 需注意传入的data里单个item必须具有{label, key, show}字段
 */

const isEquivalent = (a, b) => {
  let aProps = Object.keys(a);
  let bProps = Object.keys(b);

  if (aProps.length !== bProps.length) {
    return false;
  }

  if (!aProps.every(prop => bProps.some(_prop => prop === _prop))) {
    return false;
  }

  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i];

    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  return true;
};
const compareValue = (a, b) => {
  if (typeof a !== 'object') {
    return a === b;
  }

  return isEquivalent(a, b);
};

export default class FieldSort extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hideField: [],
      value: [],
      selectedHideField: [],
      selectedValue: [],
      selectedShowAll: false,
      selectedHideAll: false
    };
  }
  componentDidMount() {
    this.classifyData();
  }

  changeSort = ({ oldIndex, newIndex }) => {
    const { value } = this.state;
    this.setState({
      value: arrayMove(value, oldIndex, newIndex)
    });
  };
  classifyData = () => {
    const { data } = this.props;
    const copyHideData = [];
    const copyShowData = [];
    data.forEach(item => {
      if (item.show) {
        copyShowData.push(item);
      } else {
        copyHideData.push(item);
      }
    });
    this.setState({
      value: copyShowData,
      hideField: copyHideData
    });
  };
  toggleSelectAll = (type, evt) => {
    const checked = evt.target.checked;
    const { value, hideField } = this.state;
    const copyValue = value.concat();
    const copyHideData = hideField.concat();
    if (type === 'Hide') {
      hideField.forEach(data => {
        if (checked) {
          if (!copyHideData.some(_v => compareValue(_v.key, data.key))) {
            copyHideData.push(data);
          }
        } else {
          const idx = copyHideData.findIndex(_v =>
            compareValue(_v.key, data.key)
          );
          copyHideData.splice(idx, 1);
        }
      });
      this.setState({
        selectedHideField: copyHideData,
        selectedHideAll: checked
      });
      return;
    }
    value.forEach(data => {
      if (checked) {
        if (!copyValue.some(_v => compareValue(_v.key, data.key))) {
          copyValue.push(data);
        }
      } else {
        const idx = copyValue.findIndex(_v => compareValue(_v.key, data.key));
        copyValue.splice(idx, 1);
      }
    });

    this.setState({
      selectedValue: copyValue,
      selectedShowAll: checked
    });
  };
  onSubmit = () => {
    const { value, hideField } = this.state;
    const { onSubmit } = this.props;
    const copyValue = [];
    value.forEach(item => {
      let copyItem = {
        key: item.key,
        label: item.label,
        show: true
      };
      copyValue.push(copyItem);
    });

    hideField.forEach(item => {
      let copyItem = {
        key: item.key,
        label: item.label,
        show: false
      };
      copyValue.push(copyItem);
    });
    onSubmit(copyValue);
  };
  onFieldChange = (item, type, evt) => {
    const { selectedHideField, selectedValue, hideField, value } = this.state;
    const copyValue = selectedValue.concat();
    const copyHideData = selectedHideField.concat();
    const checked = evt.target.checked;
    if (type === 'Hide') {
      if (checked) {
        copyHideData.push(item);
      } else {
        const idx = copyHideData.findIndex(_v =>
          compareValue(_v.key, item.key)
        );
        copyHideData.splice(idx, 1);
      }
      const selectedHideAll = hideField.every(_v =>
        copyHideData.some(__v => compareValue(_v.key, __v.key))
      );
      this.setState({
        selectedHideField: copyHideData,
        selectedHideAll: selectedHideAll
      });
    }

    if (type === 'Show') {
      if (checked) {
        copyValue.push(item);
      } else {
        const idx = copyValue.findIndex(_v => compareValue(_v.key, item.key));
        copyValue.splice(idx, 1);
      }
      const selectedShowAll = value.every(_v =>
        copyValue.some(__v => compareValue(_v.key, __v.key))
      );
      this.setState({
        selectedValue: copyValue,
        selectedShowAll: selectedShowAll
      });
    }
  };

  fieldAlter = type => {
    const { selectedHideField, selectedValue, hideField, value } = this.state;
    const copyHideField = hideField.concat();
    const copyValue = value.concat();
    if (type === 'Add') {
      selectedHideField.forEach(item => {
        const idx = copyHideField.findIndex(_v =>
          compareValue(_v.key, item.key)
        );
        copyHideField.splice(idx, 1);
      });
      this.setState({
        value: selectedHideField.concat(value),
        hideField: copyHideField,
        selectedHideField: [],
        selectedHideAll: false
      });
    } else {
      selectedValue.forEach(item => {
        const idx = copyValue.findIndex(_v => compareValue(_v.key, item.key));
        copyValue.splice(idx, 1);
      });
      this.setState({
        hideField: selectedValue.concat(hideField),
        value: copyValue,
        selectedValue: [],
        selectedShowAll: false
      });
    }
  };
  renderHideData = (item, index) => {
    const { selectedHideField } = this.state;
    const checked = selectedHideField.some(_v =>
      compareValue(_v.key, item.key)
    );
    return (
      <li key={index}>
        <Checkbox
          inline
          className={cs['sort-item']}
          checked={checked}
          onChange={this.onFieldChange.bind(this, item, 'Hide')}
        >
          {item.label}
        </Checkbox>
      </li>
    );
  };
  getwrapper = () => {
    const { selectedValue } = this.state;
    const SortableItem = SortableElement(({ value }) => {
      const checked = selectedValue.some(_v => compareValue(_v.key, value.key));
      return (
        <li
          title={i18n['general.data.table_sort_tips']}
          className={cs['li-drag']}
        >
          <Checkbox
            inline
            className={cs['sort-item']}
            checked={checked}
            onChange={this.onFieldChange.bind(this, value, 'Show')}
          >
            {value.label}
          </Checkbox>
        </li>
      );
    });
    const SortableList = SortableContainer(({ items }) => {
      return (
        <ul className={cs['column']}>
          {items.map((item, index) => (
            <SortableItem key={`item-${index}`} index={index} value={item} />
          ))}
        </ul>
      );
    });
    return (
      <SortableList
        pressDelay={150}
        items={this.state.value}
        onSortEnd={this.changeSort}
      />
    );
  };

  render() {
    const { title, onHide } = this.props;
    const {
      selectedHideAll,
      selectedShowAll,
      hideField,
      value,
      selectedHideField,
      selectedValue
    } = this.state;
    return (
      <Modal onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={cs['grid-content']}>
          <div className={cs['item-left']} id="sortLeft">
            <div className={cs['header']}>{i18n['sort.hide_field']}</div>
            <div className={cs['content-wapper']}>
              <div className={cs['content-wapper-title']}>
                <Checkbox
                  inline
                  className={cs['sort-item-title']}
                  checked={selectedHideAll}
                  onChange={this.toggleSelectAll.bind(this, 'Hide')}
                />
                <FormattedMessage
                  id="sort.field.selected_number"
                  defaultMessage={i18n['sort.field.selected_number']}
                  values={{
                    selected: `${selectedHideField.length}`,
                    all: `${hideField.length}`
                  }}
                />
              </div>
              <ul className={cs['column']}>
                {hideField && hideField.map(this.renderHideData)}
              </ul>
            </div>
          </div>
          <div className={cs['item-middle']} id="sortMiddle">
            <Button
              bsStyle={selectedHideField.length === 0 ? undefined : 'primary'}
              className={cs['middle-top-icon']}
              onClick={this.fieldAlter.bind(this, 'Add')}
              disabled={selectedHideField.length === 0}
            >
              <i className={'fa fa-angle-right'} />
            </Button>
            <Button
              bsStyle={selectedValue.length === 0 ? undefined : 'primary'}
              className={cs['middle-bottom-icon']}
              onClick={this.fieldAlter.bind(this, 'Del')}
              disabled={selectedValue.length === 0}
            >
              <i className={'fa fa-angle-left'} />
            </Button>
          </div>
          <div className={cs['item-right']} id="sortRight">
            <div className={cs['header']}>{i18n['sort.show_field']}</div>
            <div className={cs['content-wapper']}>
              <div className={cs['content-wapper-title']}>
                <Checkbox
                  inline
                  className={cs['sort-item-title']}
                  checked={selectedShowAll}
                  onChange={this.toggleSelectAll.bind(this, 'Show')}
                />
                <FormattedMessage
                  id="sort.field.selected_number"
                  defaultMessage={i18n['sort.field.selected_number']}
                  values={{
                    selected: `${selectedValue.length}`,
                    all: `${value.length}`
                  }}
                />
              </div>
              <div className={cs['sort-clumns']}>{this.getwrapper()}</div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.onSubmit} bsStyle="primary">
            {i18n['general.confirm']}
          </Button>
          <Button onClick={onHide}>{i18n['general.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
