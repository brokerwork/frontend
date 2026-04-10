import Ajax from "@/ajax";
export const submitRenew = data => {
  return Ajax.post("/v1/os/products/renew", data);
};
