import React from "react";
import Table, { TTd, TTh, TBody } from "../components/Table";
import { action } from "@storybook/addon-actions";

const data = [
  { key1: "124211", key2: "12fa11", key3: "1hr211" },
  { key1: "12f11", key2: "12gr11", key3: "121fhs1" },
  { key1: "1h211", key2: "12gr11", key3: "121fhf1" },
  { key1: "1jt211", key2: "12fw11", key3: "12hf11" },
  { key1: 1, key2: 5, key3: 3 },
  { key1: 1, key2: 67, key3: 3 },
  { key1: 1, key2: 7, key3: 3 },
  { key1: 1, key2: 8, key3: 3 },
  { key1: 1, key2: 9, key3: 3 },
  { key1: 1, key2: 10, key3: 3 }
];

const expandFieldData = [
  { key1: "124211", key2: "12fa11", key3: "1hr211" },
  { key1: "12f11", key2: "12gr11", key3: "121fhs1" },
  { key1: "1h211", key2: "12gr11", key3: "121fhf1" },
  { key1: "1jt211", key2: "12fw11", key3: "12hf11" }
];

const columns = [
  { key: "key1", name: "表头1" },
  {
    key: "key2",
    name: "表头2",
    icon: "sorting-down",
    onClick: function() {
      console.log("ssssssssssss");
    }
  },
  { key: "key3", name: "表头3" }
];

const renderCell = ({ key, data, index }) => {
  return <TTd key={index}>{`${key}-${data}`}</TTd>;
};

const lastRow = columns => {
  return (
    <tr>
      <TTd key="0">总计：</TTd>
      {columns.map((col, index) => (
        <TTd key={index + 1}>{`${col.key}`}</TTd>
      ))}
    </tr>
  );
};

class ExpanedTableCustom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowExpandOptions: {
        expandedKeys: [],
        onChange: this.onExpand,
        expandFieldKey: "key3"
      }
    };
  }

  onExpand = ({ expandedKeys }) => {
    console.log(expandedKeys);
    this.setState({
      rowExpandOptions: {
        ...this.state.rowExpandOptions,
        expandedKeys
      }
    });
  };

  renderExpanedRow = d => {
    return (
      <tr key={d.index} style={{ background: "#ccc" }}>
        <TTd colSpan={columns.length + 1}>
          <div>这是一个DIV</div>
          {d.index}
        </TTd>
      </tr>
    );
  };

  render() {
    const { rowExpandOptions } = this.state;
    return (
      <Table
        data={expandFieldData}
        columns={columns}
        rowExpandOptions={rowExpandOptions}
        renderExpanedRowCustom={this.renderExpanedRow}
        renderCell={renderCell}
      />
    );
  }
}

class ExpanedTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowExpandOptions: {
        expandedKeys: [],
        onChange: this.onExpand,
        expandFieldKey: "key3"
      }
    };
  }

  onExpand = ({ expandedKeys }) => {
    console.log(expandedKeys);
    this.setState({
      rowExpandOptions: {
        ...this.state.rowExpandOptions,
        expandedKeys
      }
    });
  };

  renderExpanedRow = d => {
    return d.index;
  };

  render() {
    const { rowExpandOptions } = this.state;
    return (
      <Table
        data={expandFieldData}
        columns={columns}
        rowClassName={() => {
          return "abc";
        }}
        rowExpandOptions={rowExpandOptions}
        renderExpanedRow={this.renderExpanedRow}
        renderCell={renderCell}
      />
    );
  }
}

class RenderRowTable extends React.Component {
  _renderTbody = () => {
    return (
      <tbody>
        <tr>
          <TTd>哈哈哈</TTd>
          <TTd>哈哈哈</TTd>
          <TTd>哈哈哈</TTd>
        </tr>
        <tr>
          <TTd>1</TTd>
          <TTd>2</TTd>
          <TTd>3</TTd>
        </tr>
        <tr>
          <TTd>4</TTd>
          <TTd>5</TTd>
          <TTd>6</TTd>
        </tr>
      </tbody>
    );
  };
  render() {
    return (
      <Table data={data} columns={columns} renderTbody={this._renderTbody} />
    );
  }
}

class SelectionTable extends React.Component {
  state = {
    selectedKeys: [1]
  };
  onChange = ({ index, item, selectedKeys, key }) => {
    this.setState({
      selectedKeys
    });
  };
  render() {
    const { selectedKeys } = this.state;
    const { fixedHeader } = this.props;
    return (
      <Table
        rowSelectOptions={{
          onChange: this.onChange,
          selectedKeys: selectedKeys,
          selectFieldKey: "key2",
          selectedHeader: (
            <div style={{ marginLeft: "15px" }}>
              这里是可选表格选中后才有的东西
            </div>
          )
        }}
        data={data}
        columns={columns}
        className={fixedHeader ? "tablel-demo-fixed-header" : ""}
        fixedHeader={fixedHeader}
        renderCell={renderCell}
        lastRow={lastRow(columns)}
      />
    );
  }
}

export default {
  chapters: [
    {
      sections: [
        {
          title: "Table",
          info: "表格",
          sectionFn: () => {
            return (
              <div>
                <h3>renderRow表格</h3>
                <RenderRowTable />
                <h3>自定义展开column</h3>
                <ExpanedTableCustom />
                <h3>展开column</h3>
                <ExpanedTable />
                <h3>默认表格</h3>
                <Table data={data} columns={columns} renderCell={renderCell} />
                <h3>可选择表格</h3>
                <SelectionTable />
                <h3>条纹表格</h3>
                <Table
                  data={data}
                  columns={columns}
                  striped
                  renderCell={renderCell}
                />
                <h3>边框表格</h3>
                <Table
                  data={data}
                  columns={columns}
                  bordered
                  renderCell={renderCell}
                />
                <h3>固定表头</h3>
                <Table
                  data={data}
                  columns={columns}
                  className="tablel-demo-fixed-header"
                  fixedHeader
                  renderCell={renderCell}
                  pager={<div>123123123</div>}
                />
                <h3>固定表头-边框表格</h3>
                <Table
                  data={data}
                  columns={columns}
                  onRowClick={(e, data) => {
                    console.log("eeeeeeeee", e, data);
                  }}
                  className="tablel-demo-fixed-header"
                  fixedHeader
                  bordered
                  renderCell={renderCell}
                />
                <h3>可选择表格 固定表头</h3>
                <SelectionTable fixedHeader />
                <h3>自定义表头内容</h3>
                <Table
                  data={data}
                  columns={columns}
                  renderHeadCell={({ item, index, fixed }) => {
                    const { key, name } = item;
                    if (key === "key3")
                      return (
                        <TTh
                          key={index}
                          fixed={fixed}
                        >{`${name}: from renderHeadCell`}</TTh>
                      );
                  }}
                  renderCell={renderCell}
                />
                <h3>可编辑表格</h3>
                <Table
                  data={data}
                  columns={columns}
                  renderHeadCell={({ item, index, fixed }) => {
                    const { key, name } = item;
                    if (key === "key3")
                      return (
                        <TTh
                          key={index}
                          fixed={fixed}
                        >{`${name}: from renderHeadCell`}</TTh>
                      );
                  }}
                  renderCell={({ key, data, index }) => {
                    const fieldConfigs = [
                      {
                        type: "inputNumber",
                        name: "abc",
                        defaultValue: 1,
                        onSubmit: (args, cb) => {
                          action("submit")(args);
                          console.log(args);
                          cb();
                        },
                        okText: "确认",
                        cancelText: "取消"
                      },
                      {
                        type: "inputNumber",
                        name: "abc",
                        defaultValue: 1,
                        options: [
                          { label: "label 1", value: 1 },
                          { label: "label 2", value: 2 },
                          { label: "label 3", value: 3 }
                        ],
                        onSubmit: (args, cb) => {
                          action("submit")(args);
                          console.log(args);
                          cb();
                        }
                      },
                      {
                        type: "checkbox",
                        name: "abc",
                        defaultValue: 1,
                        onSubmit: (args, cb) => {
                          action("submit")(args);
                          console.log(args);
                          cb();
                        }
                      }
                    ];
                    return (
                      <TTd
                        editable
                        key={index}
                        fieldConfig={fieldConfigs[index]}
                      >
                        {key}
                      </TTd>
                    );
                  }}
                />
              </div>
            );
          }
        }
      ]
    }
  ]
};
