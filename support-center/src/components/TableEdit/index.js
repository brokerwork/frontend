import Table from 'components/FixTable';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import cs from './index.less';
/**
 * headerData:渲染头部【数组】
 * data: 渲染body【对象数组：必须参数-(key,listObj),多级渲染添加children属性】
 *
 */
export default class TabelEdit extends PureComponent {
  state = {};
  paramsMap = {};
  onInput = (id, type, e) => {
    if (this.paramsMap[id]) {
      this.paramsMap[id][type] = e.target.value;
    } else {
      this.paramsMap[id] = {
        [type]: e.target.value
      };
    }
    this.props.onChange(this.paramsMap);
  };
  edit = (isEdit, index, subIndex, isSub, e) => {
    if (isSub) {
      this.setState({
        [`edit_${index}_${subIndex}`]: isEdit
      });
    } else {
      this.setState({
        [`edit_${index}`]: isEdit
      });
    }
  };
  componentWillReceiveProps = props => {
    if (props.reset) {
      let keys = Object.keys(this.state);
      keys.forEach(el => {
        this.setState({
          [el]: false
        });
      });
    }
  };
  confirm = (id, index, subIndex, isSub) => {
    this.props.onConfirm(id, this.edit.bind(this, false, index, subIndex, isSub));
  };
  render() {
    const { headerData, data, editNav, operateMenu, currentOption } = this.props;
    return (
      <div className={cs.table_container}>
        <Table>
          <Table.Header fixHeader>
            {headerData.map(el => (
              <th key={el.key} title={el.value}>
                {el.value}
              </th>
            ))}
          </Table.Header>
          <Table.Body>
            {data.map((el, index) => {
              let list = [...headerData];
              const keyFilters = ['type', 'enabled', 'source'];
              const notSetEnableKeys = ['mobile.accounts.list.key']; //移动端禁止启禁用key
              let rows = [
                <tr key={el.id}>
                  {list.map((item, i) => {
                    if (i === list.length - 1) {
                      return (
                        <td key={`${el.id}_${i}`}>
                          {currentOption === 'web' &&
                            (this.state[`edit_${index}`] ? (
                              <Button style="primary" icon onClick={this.confirm.bind(this, el.id, index, '', false)}>
                                <i className="fa fa-check-circle" />
                              </Button>
                            ) : (
                              <Button style="primary" icon onClick={this.edit.bind(this, true, index, '', false)}>
                                <i className="fa fa-pencil" />
                              </Button>
                            ))}
                          {currentOption === 'web' && (
                            <Button style="primary" icon onClick={editNav.bind(this, el)}>
                              <i className={`${cs.edit_icon}`} />
                            </Button>
                          )}
                          {!notSetEnableKeys.includes(el.key) ? (
                            el.enabled ? (
                              <Button style="primary" icon onClick={operateMenu.bind(this, 'disable', el)}>
                                <i className="fa fa-ban" />
                              </Button>
                            ) : (
                              <Button style="primary" icon onClick={operateMenu.bind(this, 'enable', el)}>
                                <i className="fa fa-check-circle" />
                              </Button>
                            )
                          ) : null}
                          {/* <Button style="primary" icon>
                          <i className="fa fa-ban" />
                        </Button> */}
                        </td>
                      );
                    }
                    if (i === 0) {
                      return <td key={`${el.id}_${i}`}>{el.parent === '0' && el.message['zh-CN']}</td>;
                    }
                    if (i === 1) {
                      return <td key={`${el.id}_${i}`}>{el.parent !== '0' && el.message['zh-CN']}</td>;
                    }
                    // if (keyFilters.includes(item.key)) {
                    //   return <td key={item.key}>{el[item.key]}</td>;
                    // }
                    if (item.key === 'type') {
                      return <td key={item.key}>{i18n[`twapp.brand_setting.nav_type.${el[item.key]}`]}</td>;
                    }
                    if (item.key === 'source') {
                      return <td key={item.key}>{i18n[`twapp.brand_setting.nav_source.${el[item.key]}`]}</td>;
                    }
                    if (item.key === 'enabled') {
                      const content = el[item.key]
                        ? i18n['twapp.brand_setting.nav_status.enabled']
                        : i18n['twapp.brand_setting.nav_status.disabled'];
                      return <td key={item.key}>{content}</td>;
                    }
                    return (
                      <td key={`${el.id}_${i}`}>
                        {this.state[`edit_${index}`] ? (
                          <input
                            type="text"
                            defaultValue={el.message && el.message[headerData[i].key]}
                            onChange={this.onInput.bind(this, el.id, headerData[i].key)}
                          />
                        ) : (
                          el.message && el.message[headerData[i].key]
                        )}
                      </td>
                    );
                  })}
                </tr>
              ];
              return rows;
            })}
          </Table.Body>
        </Table>
      </div>
    );
  }
}
