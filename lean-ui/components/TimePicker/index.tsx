import * as React from 'react';
import RcTimePicker from 'rc-time-picker';
const prefix = 'lean';
import * as moment from 'moment';

export interface TimePickerProps {
  placement?: string;
  showHour?: boolean;
  showMinute?: boolean;
  showSecond?: boolean;
  className?: string;
  size?: 'large' | 'default' | 'small';
  value?: moment.Moment;
  defaultValue?: moment.Moment | moment.Moment[];
  open?: boolean;
  format?: string;
  onChange?: (time: moment.Moment, timeString: string) => void;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
  prefixCls?: string;
  hideDisabledOptions?: boolean;
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
  style?: React.CSSProperties;
  getPopupContainer?: (triggerNode: Element) => HTMLElement;
  addon?: Function;
  use12Hours?: boolean;
  focusOnOpen?: boolean;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  allowEmpty?: boolean;
  inputReadOnly?: boolean;
  clearText?: string;
  defaultOpenValue?: moment.Moment;
  popupClassName?: string;
}

export default class Tabs extends React.Component<TimePickerProps, any> {

  static defaultProps = {
    disabled: false,
    placeholder: '选择时间',
    placement: 'bottomLeft'
  };
  static propTypes = {

  }

  getPopupContainer = (trigger:any)=> {

    return trigger
  };

  
  render() {
    let {
      addon
    } = this.props;
    const addonFunc = (panel: React.ReactElement<any>) => (
      <div className={`${prefix}-panel-addon`}>
        {addon(panel)}
      </div>
    );
    
    
    
    return (
      <RcTimePicker {...this.props} getPopupContainer={this.getPopupContainer} prefixCls={`${prefix}-time-picker`} addon={typeof addon === 'function'?addonFunc:()=>{}} hideDisabledOptions={true} />
    );
  }
}