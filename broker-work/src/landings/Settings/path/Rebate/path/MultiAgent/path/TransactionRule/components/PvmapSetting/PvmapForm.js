import { Field, reduxForm } from 'redux-form';
import { renderField } from 'utils/renderField';
import NumberInput from 'components/NumberInput';
import DropdownForCode from 'components/v2/DropdownForCode';
import Dropdown from 'components/v2/Dropdown';
import cs from './PvmapSetting.less';
import i18n from 'utils/i18n';
import { Table as UiTable, Button, InputNumber, Icon } from 'lean-ui';
const { Td } = UiTable;

export const PVMAP_FORM = 'SETTING_REBATE_PVMAP_FORM';

const renderPointValue = ({
  input,
  name,
  type,
  label,
  options,
  pointValueSymbols,
  disabled,
  meta: { touched, error }
}) => {
  const isError = touched && error;
  const onChange = (key, value) => {
    const result = {
      ...input.value,
      [key]: value
    };

    input.onChange(result);
  };
  const onBlur = (key, value) => {
    const result = {
      ...input.value,
      [key]: value
    };

    input.onBlur(result);
  };
  return (
    <div className={`${cs['point-value']} ${isError ? 'has-error' : ''}`}>
      <NumberInput
        {...input}
        value={input.value && input.value.factor1}
        className={cs['point-value-input']}
        onChange={onChange.bind(this, 'factor1')}
        onBlur={onBlur.bind(this, 'factor1')}
        decimal={'{1,5}'}
      />
      <span>* contract_size</span>
      <DropdownForCode
        value={input.value && input.value.variable2Power}
        data={options}
        className={cs['point-value-dropdown-short']}
        onChange={onChange.bind(this, 'variable2Power')}
      />
      <DropdownForCode
        searchable
        value={input.value && input.value.variable2}
        data={pointValueSymbols}
        className={cs['point-value-dropdown']}
        onChange={onChange.bind(this, 'variable2')}
      />
      <DropdownForCode
        value={input.value && input.value.variable3Power}
        data={options}
        className={cs['point-value-dropdown-short']}
        onChange={onChange.bind(this, 'variable3Power')}
      />
      <DropdownForCode
        searchable
        value={input.value && input.value.variable3}
        data={pointValueSymbols.filter(item => item.value !== 'market_price')}
        className={cs['point-value-dropdown']}
        onChange={onChange.bind(this, 'variable3')}
      />
      {isError ? (
        <div className={`validate-error-msg ${cs['help-text']}`}>
          {typeof error === 'function' ? error(label) : error}
        </div>
      ) : (
        undefined
      )}
    </div>
  );
};

const renderServerSymbols = ({
  input,
  name,
  type,
  label,
  options,
  serverSymbols,
  disabled,
  meta: { touched, error }
}) => {
  const isError = touched && error;
  const onChange = (serverId, value) => {
    const result = {
      ...input.value,
      [serverId]: value
    };

    input.onChange(result);
  };

  return (
    <div className={isError ? 'has-error' : ''}>
      {serverSymbols.length === 1 ? (
        <Dropdown
          className={cs['dropdown']}
          searchable
          checkbox
          selectAllButton
          value={input.value[serverSymbols[0].serverId]}
          data={serverSymbols[0].symbols}
          onSelect={onChange.bind(this, serverSymbols[0].serverId)}
        />
      ) : (
        <tbody className={cs['dropdown-group']}>
          {serverSymbols.map((server, idx) => {
            return (
              <tr key={idx}>
                <td>{server.serverName}</td>
                <td>
                  <Dropdown
                    className={cs['dropdown']}
                    searchable
                    checkbox
                    selectAllButton
                    value={input.value[server.serverId]}
                    data={server.symbols}
                    onSelect={onChange.bind(this, server.serverId)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      )}
      {isError ? (
        <div className={`validate-error-msg ${cs['help-text']}`}>
          {typeof error === 'function' ? error(label) : error}
        </div>
      ) : (
        undefined
      )}
    </div>
  );
};

class PvmapForm extends PureComponent {
  parsePointValueSymbols = () => {
    const { serverSymbols } = this.props;
    const result = [
      { label: '1', value: '1' },
      { label: 'market_price', value: 'market_price' }
    ];

    serverSymbols.forEach(server => {
      server.symbols.forEach(symbol => {
        result.push({
          label: `${server.serverName}-${symbol}`,
          value: symbol
        });
      });
    });

    return result;
  };

  parseServerSymbols = () => {
    const { serverSymbols, pvmapList, initialValues } = this.props;
    const copyData = JSON.parse(JSON.stringify(serverSymbols));

    return copyData.map(server => {
      return {
        ...server,
        symbols: server.symbols
          .filter(symbol => {
            // 过滤已选择的品种组
            return pvmapList
              .filter(pvmap => {
                return pvmap.id !== initialValues.id;
              })
              .every(pvmap => {
                return !pvmap.symbols.some(item => {
                  return (
                    item.serverId === server.serverId &&
                    item.symbols.includes(symbol)
                  );
                });
              });
          })
          .map(symbol => {
            return {
              label: symbol,
              value: symbol
            };
          })
      };
    });
  };

  render() {
    const { initialValues, onCancel, onSubmitClick } = this.props;

    return (
      <tr className={cs.container}>
        <td className={cs['map-name-input']}>
          {!!initialValues.canDelete ? (
            <Field
              name="mapName"
              columns={10}
              component={renderField}
              type="textField"
            />
          ) : (
            initialValues.mapName
          )}
        </td>
        <td>
          {!!initialValues.canDelete ? (
            <Field
              name="pointValueGroup"
              options={[
                { label: '*', value: '1' },
                { label: '/', value: '-1' }
              ]}
              pointValueSymbols={this.parsePointValueSymbols()}
              component={renderPointValue}
            />
          ) : (
            initialValues.pointValue
          )}
        </td>
        <td>
          <Field
            name="symbols"
            serverSymbols={this.parseServerSymbols()}
            component={renderServerSymbols}
          />
        </td>
        <td className={`${cs.table_operate} ${cs.operate_td}`}>
          <Icon
            icon="save-outline"
            fontType={'bw'}
            className="main-color"
            onClick={onSubmitClick}
          />
          <Icon
            icon={initialValues.id ? 'reload' : 'close'}
            className="main-color"
            onClick={onCancel}
          />
        </td>
      </tr>
    );
  }
}

export default reduxForm({
  form: PVMAP_FORM,
  onSubmitFail: errors => {
    setTimeout(() => {
      let errorDom = document
        .querySelectorAll('[class*=error]')[0]
        .querySelector('input');
      errorDom
        ? errorDom.focus()
        : document.querySelectorAll('[class*=error]')[0].focus();
    }, 0);
  },
  validate: (values, props) => {
    const errors = {};
    const { pvmapList } = props;

    if (!values.mapName) {
      errors.mapName = i18n['settings.rebate_setting.pvmap_rule.null_error'];
    } else if (
      pvmapList.some(
        item => item.mapName === values.mapName && item.id !== values.id
      )
    ) {
      errors.mapName =
        i18n['settings.rebate_setting.pvmap_rule.duplicate_error'];
    }

    if (values.pointValueGroup && !values.pointValueGroup.factor1) {
      errors.pointValueGroup =
        i18n['settings.rebate_setting.pvmap_balance_type.null_error'];
    }

    const servers = Object.keys(values.symbols);

    if (servers.every(server => !values.symbols[server].length)) {
      errors.symbols =
        i18n['settings.rebate_setting.transaction_symbol.null_error'];
    }

    return errors;
  }
})(PvmapForm);
