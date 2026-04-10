import * as React from 'react';

export default class SelectTree extends React.Component {
  select(pid, id, e) {
    const {selected, onChange, originData} = this.props;
    let a = selected.concat();
    if (e.target.checked) {
      [].push.apply(a, pid);
      const __obj = {};
      const dd = [];
      a.forEach(item => {
        __obj[item] = true;
      });
      for (let k in __obj) {
        dd.push(Number(k));
      }
      onChange(dd);
    } else {
      const __obj = {};
      const itemHasValue = this.findChildrenList(id, originData);
      a.forEach(item => {
        __obj[item] = true;
      });
      delete __obj[itemHasValue.id];
      a = this.clearValueInSelectedList(__obj, itemHasValue.children);
      onChange(a);
    }
  }
  clearValueInSelectedList(selected, clearArray) {
    const __obj = {...selected};
    clean(clearArray);
    const __arr = [];
    for (let k in __obj) {
      __arr.push(Number(k));
    }
    return __arr;

    function clean(arr) {
      arr.forEach((item) => {
        if (__obj[item.id]) {
          delete __obj[item.id];
        }
        if (item.children && item.children.length > 0) {
          clean(item.children);
        }
      })
    }
  }
  findChildrenList(value, originData) {
    let isFind = false;
    let __data;
    dataFind(originData, value);
    return __data;

    function dataFind(data, value) {
      for (let i = 0, l = data.length; i < l; i++) {
        let v = data[i];
        if (isFind) break;
        if (v.id == value) {
          isFind = true;
          __data = v;
        } else {
          if (v.children) {
            dataFind(v.children, value);
          } else {
            break;
          }
        }
      }
    }
    
  }
  render() {
    let {data, pid, selected, onChange, originData} = this.props;
    return (
      <ul>
      {data.map((item, index) => {
        const checked = selected.indexOf(item.id) !== -1;
        const p = pid ? pid.concat() : [];
        p.push(item.id);
        return (
          <li key={index}>
            <label>
              <input
                value={item.id}
                type="checkbox"
                checked={checked}
                onChange={this.select.bind(this, p, item.id)}
              />
              {item.name}
            </label>
            {item.children && item.children.length > 0
            ? <SelectTree
                data={item.children}
                selected={selected}
                onChange={onChange}
                originData={originData}
                pid={p}
              />
            : undefined}
          </li>
        );
      })}
      </ul>
    );
  }
}
