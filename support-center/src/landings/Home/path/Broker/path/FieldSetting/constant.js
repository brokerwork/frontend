import i18n from "utils/i18n";

export const SENSITIVE_FIELD_TYPE = [
  "select",
  "date",
  "datestring",
  "country",
  "city",
  "radio",
  "checkbox"
];

export const FIELD_COLUMN = [
  { label: "1", value: "1" },
  { label: "2", value: "2" }
];

export const FIELD_OPTIONS = [
  {
    label: i18n["field.setting.field.required"],
    value: "required",
    default: true,
    disabledFields: {}
  },
  {
    label: i18n["field.setting.field.overuse"],
    value: "overuse",
    default: false,
    disabledFields: {
      t_account_account: ["login"],
      t_account_profiles: [
        "field1",
        "field2",
        "field3",
        "field4",
        "field5",
        "select1",
        "select2",
        "select3",
        "select4",
        "select5"
      ],
      t_account_finacial: [
        "field1",
        "field2",
        "field3",
        "field4",
        "field5",
        "select1",
        "select2",
        "select3",
        "select4",
        "select5"
      ],
      t_account_id_info: [
        "field1",
        "field2",
        "field3",
        "field4",
        "field5",
        "select1",
        "select2",
        "select3",
        "select4",
        "select5"
      ]
    }
  },
  {
    label: i18n["field.setting.field.sensitive"],
    value: "sensitive",
    default: false,
    disabledFields: {}
  },
  {
    label: i18n["field.setting.field.longField"],
    value: "longField",
    default: false,
    disabledFields: {}
  },
  {
    label: i18n["broker.field_setting.addMulti"],
    value: "addMulti",
    disabledFields: {}
  },
  {
    label: i18n['field.setting.field.letters'],
    value: "alphabet",
    default: false,
    disabledFields: {}
  },
  {
    label: i18n['field.setting.field.numbers'],
    value: "numeric",
    default: false,
    disabledFields: {}
  }
];
// "text",
//       "select",
//       "radio",
//       "checkbox",
//       "country",
//       "city",
//       "textarea",
//       "tin",
//       "file"

export const OPTIONS_FIELD = ["select", "checkbox", "radio", "singleCheckbox"];

export const CAN_NOT_BE_DISABLED_FIELDS = {
  t_customer_profiles: ["customSource"]
};

export const MODULE_NAME = {
  t_account_profiles: i18n["field.setting.field.form.account1.basic"],
  t_account_finacial: i18n["field.setting.field.form.account1.financial"],
  t_account_id_info: i18n["field.setting.field.form.account1.certificate"],
  t_account_classification:
    i18n["field.setting.field.form.account1.classification"]
};

export const CUSTOMIZE_FIELD_TYPE_LIST = [
  { label: i18n["broker.field_setting.customize_field_type.text"], value: "text" },
  { label: i18n["broker.field_setting.customize_field_type.select"], value: "select" },
  { label: i18n["broker.field_setting.customize_field_type.radio"], value: "radio" },
  { label: i18n["broker.field_setting.customize_field_type.checkbox"], value: "checkbox" },
  { label: i18n["broker.field_setting.customize_field_type.country"], value: "country" },
  { label: i18n["broker.field_setting.customize_field_type.city"], value: "city" },
  { label: i18n["broker.field_setting.customize_field_type.textarea"], value: "textarea" },
  { label: i18n["broker.field_setting.customize_field_type.tin"], value: "tin" },
  { label: i18n["broker.field_setting.customize_field_type.image"], value: "image" }
];

export const CUSTOMIZE_FIELD_OPTIONS = [
  {
    label: i18n["field.setting.field.required"],
    value: "required",
    disabledFieldTypes: []
  },
  {
    label: i18n["field.setting.field.overuse"],
    value: "overuse",
    disabledFieldTypes: ["tin", "file"]
  },
  {
    label: i18n["field.setting.field.sensitive"],
    value: "sensitive",
    disabledFieldTypes: [
      "select",
      "radio",
      "checkbox",
      "country",
      "city",
      "file"
    ]
  },
  {
    label: i18n["field.setting.field.longField"],
    value: "longField",
    disabledFieldTypes: []
  },
  {
    label: i18n["broker.field_setting.addMulti"],
    value: "addMulti",
    disabledFieldTypes: [
      "select",
      "radio",
      "checkbox",
      "country",
      "city",
      "file"
    ]
  }
];

export const showCustomEditList = ['t_account_profiles', 't_account_finacial', 't_account_id_info'];

export const overuseNoTypes = [
  "text",
  "select",
  "radio",
  "checkbox",
  "country",
  "city",
  "textarea",
  "singleCheckbox",
  "phone",
  "multiFile",
  "datestring",
  "money",
  "date"
];

export const hintTypes = ["text", "textarea"];
