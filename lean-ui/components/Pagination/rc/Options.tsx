import * as React from 'react';
import * as PropTypes from 'prop-types';
import KEYCODE from './KeyCode';
import Input from "../../Input";
import Icon from "../../Icon";
import Button from "../../Button";
import ButtonGroup from '../../Button/ButtonGroup';
import Message from '../../Message';
import messageParse from '../../utils/messageParse';

export interface OptionsProps {
  current?:number;
  locale?: any;
  // last?: boolean;
  // rootPrefixCls?: string;
  // page?: number;
  // active?: boolean;
  // className?: any;
  // onClick?: (page: number) => void;
  // onKeyPress?: (
  //   event: any,
  //   onClick: (page: number) => void,
  //   page: number
  // ) => void;
  // showTitle?: boolean;
  // itemRender?: (
  //   page: number,
  //   type: "page" | "prev" | "next" | "jump-prev" | "jump-next",
  //   element?: React.ReactNode
  // ) => React.ReactNode;
  rootPrefixCls?: string;
  selectPrefixCls?:string;
  changeSize?: (value?: string | number) => void;
  maxSize?: number;
  quickGo?: (value?: string | number) => number;
  goButton: boolean | React.ReactNode;
  buildOptionText?: (opt:string) => React.ReactNode;
  selectComponentClass?: any;
  pageSize?:number;
  pageSizeOptions?: string[];
}

export interface OptionsState {
  current?:number;
  goInputText?: string,
  sizeInputVisible?: boolean,
  sizeCustom?: number,
  sizeCustomError?: boolean
}

class Options extends React.Component <OptionsProps, OptionsState> {
  static propTypes = {
    maxSize: PropTypes.number,
    changeSize: PropTypes.func,
    quickGo: PropTypes.func,
    selectComponentClass: PropTypes.func,
    current: PropTypes.number,
    pageSizeOptions: PropTypes.arrayOf(PropTypes.string),
    pageSize: PropTypes.number,
    buildOptionText: PropTypes.func,
    locale: PropTypes.object,
  };

  static defaultProps = {
    maxSize: 500,
    pageSizeOptions: ['10', '20', '30', '40'],
  };

  constructor(props:OptionsProps) {
    super(props);

    this.state = {
      current: props.current,
      goInputText: '',
      sizeInputVisible: false,
      sizeCustom: 0,
      sizeCustomError: false
    };
  }

  buildOptionText = (value: string) => {
    return `${value} ${this.props.locale.items_per_page}`;
  }

  changeSize = (value: string | number) => {
    this.props.changeSize(Number(value));
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      goInputText: e.target.value,
    });
  }

  submitSizeInput = ()=>{
    if(this.state.sizeCustomError || this.state.sizeCustom <= 0) return;
    this.changeSize(this.state.sizeCustom);
    this.setState({
      sizeCustom: 0
    });
    this.toggleSizeInput();
    // 关闭list
    document.dispatchEvent(new MouseEvent('click'));
  }

  handleSizeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let iperror = false,value = Number(e.target.value);
    if(value <= 0 || value !== value) iperror = true;
    if(value > this.props.maxSize) {
      iperror = true;
      Message['warn'](messageParse(this.props.locale.custom_page_max, {maxSize: this.props.maxSize}))
    }
    this.setState({
      sizeCustomError: iperror
    });
    this.setState({
      sizeCustom: value
    })
  }

  toggleSizeInput = () => {
    if(this.state.sizeInputVisible) this.setState({
      sizeCustom: 0
    });
    this.setState({
      sizeInputVisible: !this.state.sizeInputVisible
    })
  }

  go = (e: any) => {
    let val:string | number = this.state.goInputText;
    if (val === '') {
      return;
    }
    val = Number(val);
    if (isNaN(val)) {
      val = this.state.current;
    }
    if (e.keyCode === KEYCODE.ENTER || e.type === 'click') {
      this.setState({
        goInputText: '',
        current: this.props.quickGo(val),
      });
    }
  }

  render() {
    const props = this.props;
    const state = this.state;
    const locale = props.locale;
    const prefixCls = `${props.rootPrefixCls}-options`;
    const changeSize = props.changeSize;
    const quickGo = props.quickGo;
    const goButton = props.goButton;
    const buildOptionText = props.buildOptionText || this.buildOptionText;
    const Select = props.selectComponentClass;
    let changeSelect = null;
    let goInput = null;
    let gotoButton = null;

    if (!(changeSize || quickGo)) {
      return null;
    }

    if (changeSize && Select) {
      const Option = Select.Option;
      const pageSize = props.pageSize || props.pageSizeOptions[0];
      // 判断是否为自定义的页码数量设置
      let customPageSize:string|React.ReactNode;
      if (!props.pageSizeOptions.some(psize=>psize == pageSize)) customPageSize = buildOptionText(pageSize.toString());
      const options = props.pageSizeOptions.map((opt, i) => (
        <Option key={i} value={opt}>{buildOptionText(opt)}</Option>
      ));

      changeSelect = (
        <div className={`${prefixCls}-size-changer`}>
          <Select
            prefixCls={props.selectPrefixCls}
            showSearch={false}
            optionLabelProp="children"
            dropdownMatchSelectWidth={false}
            value={customPageSize || pageSize.toString()}
            onChange={this.changeSize}
            getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentNode}
          >
            {options}
            <div key='size-input' className={`${prefixCls}-size-changer-input-box`}>
              {state.sizeInputVisible ?
              <div className={`${prefixCls}-size-changer-input-group`}>
                <Input
                  haserror={state.sizeCustomError}
                  onPressEnter={this.submitSizeInput}
                  placeholder={messageParse(locale.custom_page_max, {maxSize: this.props.maxSize})}
                  className={`${prefixCls}-size-changer-input`}
                  onChange={this.handleSizeInput}
                />
                <ButtonGroup>
                  <Button className={`${prefixCls}-size-changer-input-btn`} onClick={this.submitSizeInput}><Icon icon="check" /></Button>
                  <Button className={`${prefixCls}-size-changer-input-btn`} onClick={this.toggleSizeInput}><Icon icon="close" /></Button>
                </ButtonGroup>
              </div> :
              <div className={`${prefixCls}-size-changer-on`} onClick={this.toggleSizeInput}>
                {locale.custom_per_page}
              </div>
            }
            </div>
        </Select>
        </div>

      );
    }

    if (quickGo) {
      if (goButton) {
        if (typeof goButton === 'boolean') {
          gotoButton = (
            <button
              type="button"
              onClick={this.go}
              onKeyUp={this.go}
            >
            {locale.jump_to_confirm}
            </button>
          );
        } else {
          gotoButton = (
            <span
              onClick={this.go}
              onKeyUp={this.go}
            >{goButton}</span>
          );
        }
      }
      goInput = (
        <div className={`${prefixCls}-quick-jumper`}>
          {locale.jump_to}
          <input
            type="text"
            value={state.goInputText}
            onChange={this.handleChange}
            onKeyUp={this.go}
          />
          {locale.page}
          {gotoButton}
        </div>
      );
    }

    return (
      <li className={`${prefixCls}`}>
        {changeSelect}
        {goInput}
      </li>
    );
  }
}

export default Options;
