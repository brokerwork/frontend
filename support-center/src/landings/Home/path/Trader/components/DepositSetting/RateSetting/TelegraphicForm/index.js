import Form from 'components/Form';
import { Field, arrayRemove } from 'redux-form';
import { default as FormField } from 'components/FormField';
import { telegraphicEnabledList } from '../../constant';
import Button from 'components/Button';

import i18n from 'utils/i18n';
import cs from './index.less';
import Tab from 'components/Tab';
import _ from 'lodash';

export default class TelegraphicForm extends PureComponent {
  constructor(p) {
    super(p);
    const infos = _.compact(this.props.list).map(el => {
      el.activeKey = 'zh-CN';
      return el;
    });
    this.state = {
      infos
    };
  }
  addInfo = () => {
    const infos = [...this.state.infos];
    infos.push({
      activeKey: 'zh-CN'
    });
    this.setState({
      infos
    });
  };
  delInfo = index => {
    const infos = _.cloneDeep(this.state.infos);
    infos.splice(index, 1);
    console.log('formArray', this.props);
    this.props.formArray.remove('telegraphicsList', index);
    this.setState({
      infos
    });
  };
  onChangeTab = (index, key) => {
    // this.riskDescEditor = this.editors[key];
    const infos = [...this.state.infos];
    infos.find((el, i) => i === index).activeKey = key;
    this.setState({
      infos
    });
  };
  editors = {};
  riskDescEditor = null;
  // componentWillReceiveProps(nextP) {
  //   console.log('21', nextP.list.length !== this.state.infos.length);
  //   if (nextP.list.length !== this.state.infos.length) {
  //     const infos = _.compact(nextP.list).map(el => {
  //       el.activeKey = 'zh-CN';
  //       return el;
  //     });
  //     this.setState({
  //       infos
  //     });
  //   }
  // }
  render() {
    const { type, languages, plat } = this.props;
    const { infos } = this.state;
    console.log('indofr', infos);
    return (
      <Form style={{ paddingTop: 12 }} showHelpText>
        {type ? (
          <Form.Item>
            <Form.Label>
              {type === 'public'
                ? i18n['platform.tab.deposit.telegraphic.public']
                : i18n['platform.tab.deposit.telegraphic.personal']}
              ：
            </Form.Label>
            <Form.Control className={cs['rem-group']}>
              <Field name="enable" fieldType="radio" component={FormField} options={telegraphicEnabledList} />
            </Form.Control>
          </Form.Item>
        ) : null}
        <Form.Item>
          <Form.Label>{i18n['platform.tab.deposit.poundage']}：</Form.Label>
          <Form.Control>
            <Field
              label={i18n['platform.tab.deposit.poundage']}
              name="charges"
              fieldType="number"
              component={FormField}
            />
          </Form.Control>
          <Form.HelpText>%</Form.HelpText>
        </Form.Item>
        <Form.Item>
          <Form.Label />
          <Form.Control>
            <Field
              label={i18n['platform.tab.deposit.poundage.show']}
              name="showCharge"
              fieldType="checkbox"
              component={FormField}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>{i18n['platform.tab.deposit.min.amount']}：</Form.Label>
          <Form.Control>
            <Field
              label={i18n['platform.tab.deposit.min.amount']}
              name="minDeposit"
              fieldType="number"
              component={FormField}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>{i18n['platform.tab.deposit.max.amount']}：</Form.Label>
          <Form.Control>
            <Field
              label={i18n['platform.tab.deposit.max.amount']}
              name="maxDeposit"
              fieldType="number"
              component={FormField}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label />
          <Form.Control>
            <Field
              label={i18n['platform.tab.deposit.telegraphic.exchange']}
              name="telegraphicShowExchange"
              fieldType="checkbox"
              component={FormField}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>{i18n['trader.plat.setting.deposit.telegraphic.infor.title']}</Form.Label>
          <div>
            {plat === 'CTRADER' ? (
              <Field name="telegraphic" fieldType="editor" component={FormField} />
            ) : (
              infos.map((el, index) => {
                return [
                  <Tab
                    className={cs.tab}
                    key={index}
                    activeKey={el.activeKey}
                    onChange={this.onChangeTab.bind(this, index)}
                  >
                    {languages.map(el => {
                      return (
                        <Tab.Panel key={el.value} title={el.label} eventKey={el.value} className={cs['tab']}>
                          <Field
                            name={`telegraphicsList[${index}].${el.value}`}
                            fieldType="editor"
                            component={FormField}
                            // getInstance={instance => {
                            //   this.editors[index + el.value] = instance;
                            // }}
                          />
                        </Tab.Panel>
                      );
                    })}
                  </Tab>,
                  infos.length !== 1 ? (
                    <Button className={cs.button} onClick={this.delInfo.bind(this, index)}>
                      {i18n['general.delete']}
                    </Button>
                  ) : null
                ];
              })
            )}
          </div>
          {infos.length !== 5 && (
            <Form.HelpText>
              <Button style="primary" onClick={this.addInfo}>
                添加电汇入金信息
              </Button>
            </Form.HelpText>
          )}
        </Form.Item>
      </Form>
    );
  }
}
