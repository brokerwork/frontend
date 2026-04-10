import React, { PureComponent } from 'react';
import cs from './index.less';
import language from 'utils/language';
import { LANGUAGES_MAP } from 'utils/config';
import i18n from 'utils/i18n';
import Tab from 'components/Tab';

export class MultiLanguageInput extends PureComponent {
  state = {
    activeKey: 'zh-CN',
    message: this.props.value || {}
  };
  onChangeTab = value => {
    this.setState({
      activeKey: value
    });
  };
  onChangeName = (type, e) => {
    const value = e.target.value;
    this.setState(
      {
        message: {
          ...this.state.message,
          [type]: value
        }
      },
      () => {
        console.log('me', this.state.message);
        this.props.onChange(this.state.message);
      }
    );
  };
  checkInput = () => {
    return !!this.state.message[this.state.activeKey];
  };
  render() {
    const { languages } = this.props;
    return (
      <Tab activeKey={this.state.activeKey} onChange={this.onChangeTab}>
        {languages &&
          languages.length &&
          languages.map((el, index) => {
            return (
              <Tab.Panel key={index} title={el.label} eventKey={el.value} className={cs['tab']}>
                <textarea
                  className={cs['textarea']}
                  onChange={this.onChangeName.bind(this, el.value)}
                  value={this.state.message[el.value]}
                />
              </Tab.Panel>
            );
          })}
      </Tab>
    );
  }
}

export default MultiLanguageInput;
