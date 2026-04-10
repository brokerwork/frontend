export const MENUS = [
  {
    id: "1",
    section: "personal",
    style: "wodeziliao01",
    name: "menu.personal.name",
    children: [
      {
        id: "101",
        name: "menu.personal.overview",
        url: "/personal/overview"
      },
      {
        id: "102",
        name: "menu.personal.basicinfo",
        url: "/personal/userinfo"
      },
      {
        id: "103",
        name: "menu.personal.acctinfo",
        url: "/personal/accountInfo"
      },
      { id: "104", name: "menu.personal.test", url: "/personal/test" }
    ]
  },
  {
    id: "6",
    section: "spread",
    style: "promotion",
    name: "menu.spread.center",
    children: [
      {
        id: "601",
        name: "menu.spread.friend",
        url: "/spread/recommendDetail"
      },
      {
        id: "602",
        name: "menu.spread.agent",
        url: "/spread/agencyDetail"
      },
      {
        id: "603",
        name: "menu.spread.commission",
        url: "/spread/commissionreport"
      }
    ]
  },
  {
    id: "2",
    section: "account",
    style: "zhanghuguanli01",
    name: "menu.accountmgmt.name",
    children: [
      {
        id: "201",
        name: "menu.accountmgmt.openaccount",
        url: "/account/open"
      },
      {
        id: "202",
        name: "menu.modify.password",
        url: "/account/modifypwd"
      },
      // {id:"203",name:"menu.forget.password",url:"/app/accountmgmt/forgetpassword"},
      {
        id: "203",
        name: "menu.forget.password",
        url: "/account/forgotpwd"
      },
      {
        id: "204",
        name: "menu.adjust.leverage",
        url: "/account/adjustLever"
      },
      {
        id: "205",
        name: "menu.trade.report",
        url: "/account/transactionReports"
      }
    ]
  },
  {
    id: "3",
    section: "fund",
    style: "zijinguanli01",
    name: "menu.fundmgmt.name",
    children: [
      { id: "301", name: "menu.fundmgmt.deposit", url: "/fund/deposit" },
      {
        id: "302",
        name: "menu.fundmgmt.withdraw",
        url: "/fund/withdraw"
      },
      {
        id: "303",
        name: "menu.fundmgmt.transfer",
        url: "/fund/transfer"
      },
      // {id:"304",name:"menu.fundmgmt.telegraphic",url:"/app/fundmgmt/telegraphic"},
      {
        id: "304",
        name: "menu.fundmgmt.telegraphic",
        url: "/fund/telegraphic"
      },
      {
        id: "305",
        name: "menu.fundmgmt.fundflow",
        url: "/fund/tradingFlow"
      }
    ]
  },
  {
    id: "4",
    section: "training",
    style: "sidebar_live",
    name: "menu.online.training",
    children: [
      { id: "401", name: "menu.broadcast", url: "/training/live" },
      { id: "402", name: "menu.vod", url: "/training/vod" }
    ]
  },
  {
    id: "5",
    section: "related",
    style: "xiangguan01",
    name: "menu.relatedmgmt.name",
    children: [
      {
        id: "501",
        name: "menu.relatedmgmt.loadcenter",
        url: "/related/link"
      }
    ]
  },
  {
    id: "7",
    section: "viewpoint",
    style: "analyze",
    name: "menu.view.point",
    children: [
      {
        id: "701",
        name: "menu.viewpoint.man",
        url: "/viewpoint/artificial"
      },
      { id: "702", name: "menu.viewpoint.robot", url: "/viewpoint/robot" }
    ]
  }
];
