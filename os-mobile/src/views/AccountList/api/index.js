import Ajax from "@/ajax";
// 查询租户
export const searchRent = data => {
  return Ajax.post("/v1/ops/tenants/page", data);
};
