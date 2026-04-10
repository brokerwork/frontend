import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs } from "@storybook/addon-knobs/react";
import "../less/index.less";
import "./story.less";

import buttonStory from "./button";
import radioStory from "./radio";
import tooltipStory from "./tooltip";
import buttonGroupStory from "./buttonGroup";
import switchStory from "./switch";
import inputStory from "./input";
import inputNumberStory from "./inputNumber";
import selectStory from "./select";
import iconStory from "./icon";
import badgeStory from "./badge";
import tagStory from "./tag";
import transferStory from "./transfer";
import paginationStory from "./pagination";
import notificationStory from "./notification";
import uploadStory from "./upload";
import treeStory from "./tree";
import timePickerStory from "./timePicker";
import datePickerStory from "./datePicker";
import "../less/index.less";
import "./story.less";
import checkboxStory from "./checkbox";
import popoverStory from "./popover";
import containerStory from "./container";
import dropdownStory from "./dropdown";
import dialogStory from "./dialog";
import confirmStory from "./confirm";
import dialogShowStory from "./dialogShow";
import stepsStory from "./steps";
import tabsStory from "./tabs";
import AlertStory from "./alert";
import MessageStory from "./message";
import CollapseStory from "./collapse";
import MenuStory from "./menu";
import BreadcrumbStory from "./breadcrumb";
import tableStory from "./table";
import cardStory from "./card";
import formStory from "./form";
import loadingStory from "./loading";
import picklistStory from "./picklist";
import progressStory from "./progress";
import treeSelectStory from "./treeSelect";

storiesOf("Alert提示", module).addWithChapters("Alert", AlertStory);
storiesOf("Badge徽标", module).addWithChapters("Badge", badgeStory);
storiesOf("Button and ButtonGroup按钮", module)
  .addWithChapters("Button", buttonStory)
  .addWithChapters("ButtonGroup", buttonGroupStory);
storiesOf("Breadcrumb面包屑", module).addWithChapters(
  "Breadcrumb",
  BreadcrumbStory
);
storiesOf("Card卡片", module).addWithChapters("Card", cardStory);
storiesOf("Checkbox多选框", module).addWithChapters("Checkbox", checkboxStory);
storiesOf("Collapse折叠面板", module).addWithChapters(
  "Collapse",
  CollapseStory
);
storiesOf("Dialog对话框", module)
  .addDecorator(withKnobs)
  .addWithChapters("Dialog", dialogStory)
  .addWithChapters("Dialog 演示，居中对其", dialogShowStory)
  .addWithChapters("Confirm", confirmStory);
storiesOf("Dropdown下拉菜单", module).addWithChapters(
  "Dropdown",
  dropdownStory
);
storiesOf("Form表单", module).addWithChapters("Form", formStory);
storiesOf("Icon图标", module).addWithChapters("Icon", iconStory);
storiesOf("Input输入框", module).addWithChapters("Input", inputStory);
storiesOf("InputNumber数字输入框", module).addWithChapters(
  "InputNumber",
  inputNumberStory
);
storiesOf("Layout布局和容器", module).addWithChapters(
  "Layout/Container",
  containerStory
);
storiesOf("LoadingStory加载", module).addWithChapters(
  "LoadingStory",
  loadingStory
);
storiesOf("Message提示", module).addWithChapters("Message", MessageStory);
storiesOf("Menu导航菜单", module).addWithChapters("Menu", MenuStory);
storiesOf("Notification", module).addWithChapters(
  "Notification",
  notificationStory
);
storiesOf("Pagination分页", module).addWithChapters(
  "Pagination",
  paginationStory
);
storiesOf("Picklist", module).addWithChapters("Picklist", picklistStory);
storiesOf("Popover", module).addWithChapters("Popover", popoverStory);
storiesOf("Progress进度条", module).addWithChapters("Progress", progressStory);
storiesOf("Radio单选框", module).addWithChapters("Radio", radioStory);
storiesOf("Select选择器", module).addWithChapters("Select", selectStory);
storiesOf("Steps步骤条", module).addWithChapters("Steps", stepsStory);
storiesOf("Switch开关", module).addWithChapters("Switch", switchStory);
storiesOf("Table表格", module).addWithChapters("Table", tableStory);
storiesOf("Tabs标签页", module).addWithChapters("Tabs", tabsStory);
storiesOf("Tag标签", module).addWithChapters("Tag", tagStory);
storiesOf("Transfer穿梭框", module).addWithChapters("Transfer", transferStory);
storiesOf("Tree树形控件", module).addWithChapters("Tree", treeStory);
storiesOf("TreeSelect树形选择", module).addWithChapters("TreeSelect", treeSelectStory);
storiesOf("TimePicker and DatePicker时间日期选择器", module)
  .addWithChapters("TimePicker", timePickerStory)
  .addWithChapters("DatePicker", datePickerStory);
storiesOf("Tooltip文字提示", module).addWithChapters("Tooltip", tooltipStory);

storiesOf("Upload上传", module).addWithChapters("Upload", uploadStory);
