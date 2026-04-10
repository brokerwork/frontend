const defaultValueMap = {
  city: 'defaultCity',
  checkbox: 'defaultCheckbox'
};
export default class FormWraper extends PureComponent {
  constructor(props) {
    super(props);
    const { values, showFields } = this.getInitialValuesAndFields(this.props);
    this.state = {
      initValues: values,
      showFields,
      currentValues: values,
      ignoreChange: false
    };
  }
  static defaultProps = {
    fieldsPropKey: 'fields'
  };
  componentWillReceiveProps(nextProps) {
    const { fieldsPropKey, initialValues } = nextProps;
    const fields = nextProps[fieldsPropKey || 'fields'];
    const that = this;
    if (
      JSON.stringify(nextProps.initialValues) ===
        JSON.stringify(this.props.initialValues) &&
      JSON.stringify(nextProps.fields) === JSON.stringify(this.props.fields)
    )
      return;
    // setTimeout(() => {
    const { values, showFields } = that.getInitialValuesAndFields(nextProps);
    that.setState({
      initValues: values,
      showFields,
      currentValues: values,
      ignoreChange: true
    });
    // });
  }
  getFieldsInitialValues = (props, _fields) => {
    //将fields中的defaultValue置入initialValues中
    const { initialValues, fieldsPropKey, setDefaultValue } = props;
    const fields = props[fieldsPropKey];
    const showFields = _fields; //未来减少遍历，field允许传入
    let initialValuesFromFields = {};
    if (typeof fields === 'object' && !Array.isArray(fields)) {
      for (let i in fields) {
        if (Array.isArray(fields[i])) {
          const tempValues = fields[i].reduce((obj, item) => {
            if (
              setDefaultValue &&
              typeof item[defaultValueMap[item.fieldType] || 'defaultValue'] !==
                'undefined'
            ) {
              obj[item.key] =
                item[defaultValueMap[item.fieldType] || 'defaultValue'];
            }
            return obj;
          }, {});
          initialValuesFromFields = Object.assign(
            {},
            initialValuesFromFields,
            tempValues
          );
        }
      }
    } else {
      initialValuesFromFields = showFields.reduce((obj, item) => {
        if (
          setDefaultValue &&
          typeof item[defaultValueMap[item.fieldType] || 'defaultValue'] !==
            'undefined'
        ) {
          obj[item.key] =
            item[defaultValueMap[item.fieldType] || 'defaultValue'];
        }
        return obj;
      }, {});
    }

    return Object.assign({}, initialValuesFromFields, initialValues);
  };

  getInitialValuesAndFields = (props, currentValues) => {
    let _values = currentValues;
    const { fieldsPropKey, initialValues } = props;
    const fields = props[fieldsPropKey];
    if (!_values) {
      //获取所有初始值，包括不展示的field的默认值，用于field展示使用
      _values = this.getFieldsInitialValues(props, fields);
    }
    //根据值获取应该展示的field（根据值寻找下级关联）；
    const showFields = this.getRelationFields(fields, _values);
    //根据展示的field获得初始值（values可能中不包含找到的下级默认值， 这里再次遍历得到默认值）
    const values = this.getFieldsInitialValues(props, showFields);
    return { values, showFields };
  };

  onChange = (data, dispatch, props) => {
    const { currentValues, ignoreChange } = this.state;
    if (ignoreChange) {
      this.setState({
        ignoreChange: false
      });
      return;
    }
    if (JSON.stringify(data) === JSON.stringify(currentValues)) return;
    const { values, showFields } = this.getInitialValuesAndFields(
      this.props,
      data
    );
    const newData = { ...values, ...data };
    this.setState(
      {
        currentValues: data,
        showFields
      },
      () => {
        props.onChange(newData, dispatch, props);
      }
    );
  };

  getRelationFields = (fields, values) => {
    if (typeof fields === 'object' && !Array.isArray(fields)) {
      const temp = {};
      for (let i in fields) {
        if (Array.isArray(fields[i])) {
          temp[i] = this.getRelationFields(fields[i], values);
        }
      }
      return temp;
    }
    const { topRelations, fieldMap } = fields.reduce(
      (res, item) => {
        const { topRelations: _top, fieldMap: _map } = res;
        const isTop = !item.relation;
        // relation表示无父级别 但是数据目前不可靠。
        // const isTop = !subRelationFieldMap[item.key];
        if (isTop) _top.push(item);
        _map[item.key] = item;
        return {
          topRelations: _top,
          fieldMap: _map
        };
      },
      {
        topRelations: [],
        fieldMap: {}
      }
    );
    return this.getMatchRelationFields(values, topRelations, fieldMap);
  };

  getMatchRelationFields = (values, fields, map) => {
    return fields.reduce((array, item) => {
      array.push(item);
      const key = item.key;
      const hasChildrenRelation = item.relationFunc;
      if (hasChildrenRelation) {
        const value = values[key];
        const matchOption =
          item.optionList && item.optionList.find(item => item.value === value);
        const relationField = matchOption && matchOption.relationField;
        const matchRelation = relationField && map[relationField];
        if (matchRelation) {
          array = array.concat(
            this.getMatchRelationFields(values, [map[relationField]], map)
          );
        }
      }
      return array;
    }, []);
  };

  render() {
    const {
      reduxForm,
      onChange,
      initialValues,
      fieldsPropKey,
      ...otherProps
    } = this.props;
    const { initValues, showFields } = this.state;
    return React.createElement(reduxForm, {
      ...otherProps,
      initialValues: initValues,
      [fieldsPropKey]: showFields,
      onChange: this.onChange,
      setDefaultValue: false //跟这里的初始值设置有冲突， 在这里通过initialvalues的整理处理了。
      //本身setDefaultValue通过setTimeout来设置初始值遇到异步就有问题
    });
  }
}
