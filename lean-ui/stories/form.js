import React from "react";
import Form, { FormItem, FormControl, FormLabel } from "../components/Form";
import Input from "../components/Input";

export default {
  chapters: [
    {
      sections: [
        {
          title: "Form 平行排列",
          info: "表单",
          sectionFn: () => {
            const errorMsg = "验证错误展示";
            return (
              <Form className="form-demo" horizontal>
                <FormItem required col={1} errorMsg={errorMsg}>
                  <FormLabel>客户状态</FormLabel>
                  <FormControl>
                    <Input haserror={Boolean(errorMsg)} />
                  </FormControl>
                </FormItem>
                <FormItem required col={2}>
                  <FormLabel>客户状态</FormLabel>
                  <FormControl errorMsg={errorMsg}>
                    <Input haserror={Boolean(errorMsg)} />
                  </FormControl>
                </FormItem>
                <FormItem required col={2}>
                  <FormLabel>客户状态</FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                </FormItem>
                <FormItem required col={2}>
                  <FormLabel>客户状态</FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                </FormItem>
                <FormItem required col={2}>
                  <FormLabel>客户状态</FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                </FormItem>
                <FormItem required col={1}>
                  <FormLabel>客户状态</FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                </FormItem>
              </Form>
            );
          }
        },
        {
          title: "Form",
          info: "表单",
          sectionFn: () => {
            const errorMsg = "验证错误展示";
            return (
              <Form className="form-demo">
                <FormItem required col={1} errorMsg={errorMsg}>
                  <FormLabel>客户状态</FormLabel>
                  <FormControl>
                    <Input haserror={Boolean(errorMsg)} />
                  </FormControl>
                </FormItem>
                <FormItem required col={2}>
                  <FormLabel>客户状态</FormLabel>
                  <FormControl errorMsg={errorMsg}>
                    <Input haserror={Boolean(errorMsg)} />
                  </FormControl>
                </FormItem>
                <FormItem required col={2}>
                  <FormLabel>客户状态</FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                </FormItem>
                <FormItem required col={2}>
                  <FormLabel>客户状态</FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                </FormItem>
                <FormItem required col={2}>
                  <FormLabel>客户状态</FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                </FormItem>
                <FormItem required col={1}>
                  <FormLabel>客户状态</FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                </FormItem>
              </Form>
            );
          }
        }
      ]
    }
  ]
};
