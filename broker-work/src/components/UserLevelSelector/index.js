import ColumnSelector, { ColumnPicker } from 'components/ColumnSelector';
import Modal from 'components/Modal';
import { Button } from 'react-bootstrap';
import Radio from 'components/Radio';
import cs from './UserLevelSelector.less';
import i18n from 'utils/i18n';

export default class UserLevelSelector extends PureComponent {
  constructor(props) {
    super(props);
    const { initialData, defaultValue } = this.props;
    const columnData = initialData ? [initialData] : [];
    this.state = {
      userIds: [],
      columnData,
      subClumnData: null,
      parentValue: defaultValue,
      currentValue: defaultValue,
      isDirect: false,
      isSelf: !!this.props.multiple
    };
  }
  componentDidMount() {
    const { currentValue, columnData } = this.state;
    this.getData(currentValue, columnData);
  }
  getData = (selected = {}, data) => {
    const {
      getData,
      showDirect = true,
      multiple,
      hasAllUserRight
    } = this.props;
    getData(selected.value).then(res => {
      const __data = data.concat();
      let __subData = null;
      if (!res.result) return Promise.resolve(res);
      if (Array.isArray(res.data) && res.data.length > 0) {
        const __d = res.data.concat();
        if (__data.length >= 1 && showDirect) {
          if (multiple) {
            __d.push({
              child: false,
              label: i18n['user_level_selector.direct'],
              value: selected.value,
              direct: true
            });
            __subData = __d;
          } else {
            __d.push({
              child: false,
              label: i18n['user_level_selector.direct'],
              value: '-1'
            });
          }
        }
        if (__data.length === 0 && hasAllUserRight) {
          __d.unshift({
            child: false,
            label: i18n['user_level_selector.all_user'],
            value: 'all'
          });
        }
        if (multiple) {
          __data.push(res.data.concat());
        } else {
          __data.push(__d);
        }
      }
      this.setState({
        columnData: __data,
        subClumnData: __subData,
        parentValue: selected,
        currentValue: selected,
        isDirect: false,
        userIds: this.getDefaultSubValues(__subData)
      });
    });
  };
  onSubmit = () => {
    const { onSubmit } = this.props;
    const { subClumnData } = this.state;
    const { currentValue, parentValue, isDirect, userIds, isSelf } = this.state;
    const result = isDirect ? parentValue : currentValue;
    let __data = userIds;
    if (!subClumnData) {
      __data = null;
    } else if (subClumnData && !subClumnData.length) {
      __data = null;
    } else if (subClumnData && subClumnData.length === userIds.length) {
      __data = null;
    }
    if (onSubmit) {
      onSubmit(result, isDirect, __data, isSelf);
    }
  };
  onPick = (data, values) => {
    this.setState({ userIds: values });
  };
  onSelect = (selected, data) => {
    const { multiple } = this.props;
    if (selected.child) {
      return this.getData(selected, data);
    } else {
      // else if (multiple) {
      //   if (selected.direct) {
      //     return;
      //   }
      //   const __data = data.concat();
      //   const __subData = [{ child: false, label: i18n['user_level_selector.direct'], value: selected.value, direct: true  }];
      //   __data.push(__subData);
      //   this.setState({
      //     columnData: __data,
      //     subClumnData: __subData,
      //     parentValue: selected,
      //     currentValue: selected,
      //     isDirect: false,
      //     userIds: this.getDefaultSubValues(__subData)
      //   });
      //   return;
      // }
      this.setState({
        userIds: [],
        columnData: data.concat(),
        subClumnData: null,
        currentValue: selected,
        isDirect: selected.value == -1
      });
    }
  };
  changeIsSelf = bool => {
    this.setState({
      isSelf: bool
    });
  };
  getDefaultSubValues = subClumnData => {
    return subClumnData ? subClumnData.map(item => item.value) : [];
  };
  render() {
    const { columnData, isSelf, subClumnData, userIds } = this.state;
    const { defaultValue, onHide, title, type = 'view', multiple } = this.props;
    const defaultSubValues = this.getDefaultSubValues(subClumnData);
    const disabledSubmit =
      isSelf && !userIds.length && subClumnData && subClumnData.length;
    return (
      <Modal onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className={`${cs['column-container']} ${isSelf &&
              !!subClumnData &&
              cs['column-group']}`}
          >
            <div>
              {multiple && (
                <div>{i18n['user_level_selector.target_title']}</div>
              )}
              <ColumnSelector
                className={cs['selector']}
                onChange={this.onSelect}
                defaultValue={
                  defaultValue ? { 0: defaultValue.value } : undefined
                }
                data={columnData}
              />
            </div>

            {isSelf &&
              !!subClumnData && (
                <div className={cs['sub-picker']}>
                  {multiple && (
                    <div>{i18n['user_level_selector.range_title']}</div>
                  )}
                  <ColumnPicker
                    className={cs['selector']}
                    defaultValues={defaultSubValues}
                    onChange={this.onPick}
                    data={subClumnData}
                  />
                </div>
              )}
          </div>
          {multiple === 'toggle' ? (
            <div className={cs['grid-control']}>
              <span>{i18n['user_level_selector.select_range']}</span>
              {[true, false].map(bool => {
                return (
                  <span key={bool}>
                    <Radio
                      name="isSelf"
                      className={cs['radio']}
                      checked={isSelf === bool}
                      inline
                      onChange={this.changeIsSelf.bind(this, bool)}
                    >
                      {i18n[`user_level_selector.is_self_${bool}`]}
                    </Radio>
                  </span>
                );
              })}
            </div>
          ) : (
            undefined
          )}
        </Modal.Body>
        {type === 'view' ? (
          <Modal.Footer>
            <Button onClick={onHide} bsStyle="primary">
              {i18n['general.confirm']}
            </Button>
          </Modal.Footer>
        ) : (
          <Modal.Footer>
            <Button
              onClick={this.onSubmit}
              bsStyle="primary"
              disabled={disabledSubmit}
            >
              {i18n['general.confirm']}
            </Button>
            <Button onClick={onHide}>{i18n['general.cancel']}</Button>
          </Modal.Footer>
        )}
      </Modal>
    );
  }
}
