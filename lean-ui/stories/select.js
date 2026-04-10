import React from "react";
import Select from "../components/Select";
import { action } from "@storybook/addon-actions";
const Option = Select.Option;
const OptGroup = Select.OptGroup;

const labelShow = () => (
  <img
    width="18"
    height="12"
    src="http://pic3.16pic.com/00/05/68/16pic_568031_b.jpg"
  />
);
class Demo extends React.Component {
  state = {
    val: "",
    ele: null
  };
  onSelect = (val, item) => {
    this.setState({
      val: val
    });
  };
  onChange = (val, item) => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        this.setState({
          ele: this.renderEle()
        });
        res();
      }, 1200);
    });
  };
  renderEle = () => {
    return [1, 2, 3].map((item, index) => {
      return (
        <Option key={index} value={item}>
          {item}
        </Option>
      );
    });
  };
  renderValue = () => {
    const { val } = this.state;
    return (
      <img
        width="18"
        height="12"
        src="http://image.baidu.com/search/detail?ct=503316480&z=undefined&tn=baiduimagedetail&ipn=d&word=%E8%9C%A1%E7%AC%94%E5%B0%8F%E6%96%B0&step_word=&ie=utf-8&in=&cl=2&lm=-1&st=undefined&cs=400464372,1081589624&os=2216616217,1868900399&simid=1947357247,767885215&pn=0&rn=1&di=14025081530&ln=1926&fr=&fmq=1533113891064_R&fm=&ic=undefined&s=undefined&se=&sme=&tab=0&width=undefined&height=undefined&face=undefined&is=0,0&istype=0&ist=&jit=&bdtype=13&spn=0&pi=0&gsm=0&objurl=http%3A%2F%2Fpic3.16pic.com%2F00%2F05%2F68%2F16pic_568031_b.jpg&rpstart=0&rpnum=0&adpicid=0"
        alt={val}
      />
    );
  };
  render() {
    return (
      <div className="story-select">
        <Select
          value={this.state.val}
          labelShow={this.renderValue}
          onSelect={this.onSelect}
          isSearch
          onChange={this.onChange}
          placeholder="异步获取下拉数据"
        >
          {this.state.ele}
        </Select>
      </div>
    );
  }
}

export default {
  chapters: [
    {
      sections: [
        {
          title: "Select",
          info: "Select选择器",
          sectionFn: () => {
            return (
              <div className="story-panel">
                <div className="story-select">
                  <div>在列表外添加选项 dropdownRender</div>
                  <Select
                    isSearch
                    placeholder="placeholder"
                    searchPlaceholder="searchPlaceholder"
                    dropdownRender={item => {
                      return (
                        <div className="123">
                          {item}
                          <div>11111111</div>
                        </div>
                      );
                    }}
                  >
                    <Option value="chengdu">成都</Option>
                    <Option value="shanghai">上海</Option>
                    <Option value="beijing">北京</Option>
                    <Option value="shenzhen">深圳</Option>
                    <Option value="guangzhou">广州</Option>
                    <Option value="hangzhou">杭州</Option>
                    <Option value="chengdu">成都</Option>
                    <Option value="chengdu">成都</Option>
                    <Option value="shanghai">上海</Option>
                    <Option value="beijing">北京</Option>
                    <Option value="shenzhen">深圳</Option>
                    <Option value="guangzhou">广州</Option>
                    <Option value="hangzhou">杭州</Option>
                    <Option value="shanghai">上海</Option>
                    <Option value="beijing">北京</Option>
                    <Option value="shenzhen">深圳</Option>
                    <Option value="guangzhou">广州</Option>
                    <Option value="hangzhou">杭州</Option>
                  </Select>
                </div>
                <div className="story-select">
                  <div>各种判断为false的情况测试</div>
                  <Select
                    isSearch
                    value={""}
                    placeholder="placeholder"
                    searchPlaceholder="searchPlaceholder"
                  >
                    <Option>没有value</Option>
                    <Option value={undefined}>value 为 undefined</Option>
                    <Option value={null}>null</Option>
                    <Option value={false}>false</Option>
                    <Option value={0}>0</Option>
                    <Option value="">空字符</Option>
                  </Select>
                </div>
                <div className="story-select">
                  <Select
                    value="Tesla"
                    labelShow={labelShow}
                    allowClear
                    placeholder="placeholder"
                    onFocus={e => console.log("onFocus", e)}
                    onBlur={e => console.log("onBlur", e)}
                  >
                    <Option value="Tesla">特斯拉</Option>
                    <Option value="Denza">腾势</Option>
                    <Option value="Byd">比亚迪</Option>
                  </Select>
                </div>
                <div className="story-select">
                  <Select allowClear defaultValue="Byd" placeholder="电动车">
                    <Option value="Tesla">特斯拉</Option>
                    <Option value="Denza">腾势</Option>
                    <Option value="Byd">比亚迪</Option>
                  </Select>
                </div>
                <div className="story-select">
                  <Select value="benz" isSearch placeholder="牧马城市">
                    <OptGroup label="纯电动">
                      <Option value="Tesla">特斯拉</Option>
                      <Option value="Denza">腾势</Option>
                    </OptGroup>
                    <OptGroup label="汽油车">
                      <Option value="audi">奥迪</Option>
                      <Option value="benz">奔驰</Option>
                      <Option value="bmw">宝马</Option>
                    </OptGroup>
                    <OptGroup label="辣鸡城市">
                      <Option value="chengdu">成都</Option>
                      <Option value="shanghai">上海</Option>
                      <Option value="beijing">北京</Option>
                      <Option value="shenzhen">深圳</Option>
                      <Option value="guangzhou">广州</Option>
                      <Option value="hangzhou">杭州</Option>
                    </OptGroup>
                  </Select>
                </div>
                <div className="story-select">
                  <Select isSearch value="Tesla" placeholder="placeholder">
                    <Option>没有value</Option>
                    <Option value={undefined}>undefined</Option>
                    <Option value={null}>null</Option>
                    <Option value="">空字符</Option>
                    <Option value="Tesla">特斯拉</Option>
                    <Option value="Denza">腾势</Option>
                    <Option value="Byd">比亚迪</Option>
                  </Select>
                </div>
                <div className="story-select">
                  <Select size="small" value="Tesla" placeholder="placeholder">
                    <Option value="Tesla">特斯拉</Option>
                    <Option value="Denza">腾势</Option>
                    <Option value="Byd">比亚迪</Option>
                  </Select>
                </div>
                <div className="story-select">
                  <Select size="large" value="Tesla" placeholder="placeholder">
                    <Option value="Tesla">特斯拉</Option>
                    <Option disabled value="Denza">
                      腾势
                    </Option>
                    <Option value="Byd">比亚迪</Option>
                  </Select>
                </div>
                <Demo />
              </div>
            );
          }
        }
      ]
    }
  ]
};
