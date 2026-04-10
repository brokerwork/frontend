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
  confirm = (item, index, subIndex, isSub) => {
    this.props.onConfirm(item, this.edit.bind(this, false, index, subIndex, isSub));
  };
  // 控制排序显示
  isSortAble = (item, list, index) => {
    let result = {
      sortAble: false,
      derection: ''
    };
    if (item.parent === '0') {
      result.sortAble = false;
    } else {
      const beforeItem = list[index - 1];
      const totalLengh = list.length;
      if (index === totalLengh - 1) {
        if (beforeItem.parent === '0') {
          result.sortAble = false;
        } else {
          result.sortAble = true;
          result.derection = 'up';
        }
      } else {
        const nextItem = list[index + 1];
        if (nextItem.parent === '0' && beforeItem.parent === '0') {
          result.sortAble = false;
        } else if (nextItem.parent === '0' && beforeItem.parent !== '0') {
          result.sortAble = true;
          result.derection = 'up';
        } else if (nextItem.parent !== '0' && beforeItem.parent === '0') {
          result.sortAble = true;
          result.derection = 'down';
        } else {
          result.sortAble = true;
          result.derection = 'both';
        }
      }
      // const nextItem = list[index+1];
      // const totalLengh = list.length;
      // if (beforeItem.parent === '0') {

      // }
    }
    return result;
  };
  render() {
    const { headerData, data, editNav, operateMenu, setAuth, sortSetting } = this.props;
    return (
      <div className={cs.table_container}>
        <Table>
          <Table.Header fixHeader data={headerData}>
            {headerData.map(el => {
              return (
                <th key={el.key} className={el.key === 'opterate' ? cs.width_150 : ''} title={el.value}>
                  {el.value}
                </th>
              );
            })}
          </Table.Header>
          <Table.Body>
            {data.map((el, index) => {
              let list = [...headerData];
              const keyFilters = ['type', 'enabled', 'source'];
              // 排序按钮显示和向上或者向下显示
              const { sortAble, derection } = this.isSortAble(el, data, index);
              let rows = [
                <tr key={el.id}>
                  {list.map((item, i) => {
                    if (i === list.length - 1) {
                      return (
                        <td key={`${el.id}_${i}`} className={cs.width_150} style={{ textAlign: 'left' }}>
                          {this.state[`edit_${index}`] ? (
                            <Button style="primary" icon onClick={this.confirm.bind(this, el, index, '', false)}>
                              <i className="fa fa-check-circle" />
                            </Button>
                          ) : (
                            <Button style="primary" icon onClick={this.edit.bind(this, true, index, '', false)}>
                              <i className="fa fa-pencil" />
                            </Button>
                          )}
                          <Button style="primary" icon onClick={editNav.bind(this, el)}>
                            <i className={`${cs.edit_icon}`} />
                          </Button>
                          {el.enabled ? (
                            <Button style="primary" icon onClick={operateMenu.bind(this, false, el)}>
                              <i className="fa fa-ban" />
                            </Button>
                          ) : (
                            <Button style="primary" icon onClick={operateMenu.bind(this, true, el)}>
                              <i className="fa fa-check-circle" />
                            </Button>
                          )}
                          <Button style="primary" icon onClick={setAuth.bind(this, el)}>
                            <i className="fa fa-cog" />
                          </Button>
                          {sortAble && derection !== 'both' && (
                            <Button style="primary" icon onClick={sortSetting.bind(this, el, derection)}>
                              <i className={`fa fa-long-arrow-down ${derection === 'up' ? cs['rotate_up'] : ''}`} />
                            </Button>
                          )}
                          {sortAble && derection === 'both' && (
                            <Button style="primary" icon onClick={sortSetting.bind(this, el, 'down')}>
                              <i className={`fa fa-long-arrow-down`} />
                            </Button>
                          )}
                          {sortAble && derection === 'both' && (
                            <Button style="primary" icon onClick={sortSetting.bind(this, el, 'up')}>
                              <i className={`fa fa-long-arrow-down ${cs['rotate_up']}`} />
                            </Button>
                          )}
                          {/* <Button style="primary" icon>
                          <i className="fa fa-ban" />
                        </Button> */}
                        </td>
                      );
                    }
                    if (i === 0) {
                      return <td key={`${el.id}_${i}`}>{el.parent === '0' && el.message && el.message['zh-CN']}</td>;
                    }
                    if (i === 1) {
                      return <td key={`${el.id}_${i}`}>{el.parent !== '0' && el.message && el.message['zh-CN']}</td>;
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
