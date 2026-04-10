import { HttpClient } from '../http/httpclient';

let language = {
  // 语言
  'language.chinese.simplified': '简体中文',
  'language.english': 'English',
  'language.chinese.traditional.hk': '繁体中文（香港）',
  'language.chinese.traditional.tw': '繁体中文（台湾）',
  // 通用
  'general.save': '保存',
  'general.done': '完成',
  'general.clip': '复制',
  'general.clip_success': '复制成功!',
  'general.save_success': '保存成功!',
  'general.save_failure': '保存失败!',
  'general.remove_success': '删除成功!',
  'general.remove_failure': '删除失败!',
  'general.modify_success': '修改成功!',
  'general.modify_failure': '修改失败!',
  'general.create_success': '创建成功!',
  'general.create_failure': '创建失败!',
  'general.transfer_success': '划转成功!',
  'general.transfer_failure': '划转失败!',
  'general.set_master_success': '设定主联系人成功!',
  'general.delete_confirm': '确定要删除该项吗，不可恢复。',
  'general.delete_confirm_recyle': '您可在回收站还原或者彻底删除该消息',
  'general.confirm': '确认',
  'general.apply': '确定',
  'general.close': '关闭',
  'general.create': '创建',
  'general.submit': '提交',
  'general.cancel': '取消',
  'general.delete': '删除',
  'general.reject': '拒绝',
  'general.edit': '编辑',
  'general.view': '查看',
  'general.remarks': '备注',
  'general.comment': '评论',
  'general.log': '日志',
  'general.release': '发布',
  'general.modify': '修改',
  'general.default_select': '请选择',
  'general.default_phone_select': '选择国家代码',
  'general.date_range_picker.option.all': '全部',
  'general.date_range_picker.option.today': '今天',
  'general.date_range_picker.option.yestoday': '昨天',
  'general.date_range_picker.option.last7days': '最近 7 天',
  'general.date_range_picker.option.last30days': '最近 30 天',
  'general.date_range_picker.option.currentMonth': '当月',
  'general.date_range_picker.option.lastMonth': '上月',
  'general.date_range_picker.option.clear': '清除',
  'general.date_range_picker.apply_btn': '确定',
  'general.date_range_picker.cancel_btn': '取消',
  'general.date_picker.option.weeks.monday': '一',
  'general.date_picker.option.weeks.tuesday': '二',
  'general.date_picker.option.weeks.wednesday': '三',
  'general.date_picker.option.weeks.thursday': '四',
  'general.date_picker.option.weeks.friday': '五',
  'general.date_picker.option.weeks.saturday': '六',
  'general.date_picker.option.weeks.sunday': '日',
  'general.date_picker.option.months.january': '1月',
  'general.date_picker.option.months.february': '2月',
  'general.date_picker.option.months.march': '3月',
  'general.date_picker.option.months.april': '4月',
  'general.date_picker.option.months.may': '5月',
  'general.date_picker.option.months.june': '6月',
  'general.date_picker.option.months.july': '7月',
  'general.date_picker.option.months.august': '8月',
  'general.date_picker.option.months.september': '9月',
  'general.date_picker.option.months.october': '10月',
  'general.date_picker.option.months.november': '11月',
  'general.date_picker.option.months.december': '12月',
  'general.date_picker.option.current_day.dayFormat': 'M月，YYYY',
  'general.confirm_remove': '确认删除吗？',
  'general.next_step': '下一步',
  'general.page_info': '共 {total} 条, 当前第 {page} 页',
  'general.page_perpage': ' 条/页',
  'general.page_jump_text1': '跳至',
  'general.page_jump_text2': '页',

  // header 导航
  'navigation.user.module_name': '用户管理',
  'navigation.user.user_managment': '用户管理',
  'navigation.user.sales_target': '用户管理',
  'navigation.customer.module_name': '客户管理',
  'navigation.customer.sales_opportunity': '销售机会',
  'navigation.customer.contacts_mgmt': '联系人',
  'navigation.task.module_name': '任务管理',
  'navigation.account.module_name': '账户管理',
  'navigation.account.mt4': 'mt4',
  'navigation.account.mt5': 'mt5',
  'navigation.report.module_name': '统计报表',
  'navigation.user_tools.reset_password': '修改密码',
  'navigation.user_tools.user_data': '个人资料',
  'navigation.user_tools.user_introducelink': '推广链接',
  'navigation.user_tools.email_setting': '邮箱设置',
  'navigation.user_tools.logout': '退出登录',
  'navigation.report.accountreport_managment': '账户报表',
  'navigation.report.commissionreport_managment': '佣金报表',
  'navigation.ta_user_management': 'TW用户管理',
  'navigation.setting.module_name': '设置',
  'navigation.message.module_name': '消息',
  'navigation.personal_center.module_name': '个人中心',

  // 未读消息
  'message.unread_message_title': '消息通知',
  'message.unread_message_all': '查看全部',
  'message.no_message': '没有消息',

  // 设置左侧导航
  'setting.siderbar.message': '消息设置',
  'setting.siderbar.message.template': '消息模板设置',
  'setting.siderbar.log': '操作日志',
  'setting.siderbar.log.basic': '基础模块操作日志',
  'setting.siderbar.log.user': '用户模块操作日志',
  'setting.siderbar.log.message': '消息模块操作日志',
  'setting.siderbar.log.customer': '客户模块操作日志',
  'setting.siderbar.log.account': '账户模块操作日志',
  'setting.siderbar.log.system': '系统模块操作日志',
  'setting.siderbar.log.task': '任务模块操作日志',
  'setting.siderbar.user': '用户管理',
  'setting.siderbar.user.rights': '角色权限设置',
  'setting.siderbar.user.link': '推广链接设置',
  'setting.siderbar.account': '账户管理',
  'setting.siderbar.account.group': '账户组设置',
  'setting.siderbar.commission': '返佣管理',
  'setting.siderbar.commission.level': '返佣层级设置',
  'setting.siderbar.commission.symbol': '品种组设置',
  'setting.siderbar.commission.transaction': '交易返佣设置',
  'setting.siderbar.commission.deposit': '入金返佣设置',
  'setting.siderbar.commission.profit': '盈利分成返佣设置',

  // 消息设置
  'setting.message.template.title': '消息模版设置',
  'setting.message.template.message_type': '消息类型',
  'setting.message.template.message_type.all': '全部',
  'setting.message.template.message_type.email': '邮件推送',
  'setting.message.template.message_type.web_alert': '弹窗推送',
  'setting.message.template.message_type.web': '系统通知',
  'setting.message.template.subject': '主题',
  'setting.message.template.send_by': '发件人名称',
  'setting.message.template.content': '正文内容',
  'setting.message.template.template_id': '模版编号',
  'setting.message.template.create_time': '创建时间',
  'setting.message.template.operation': '操作',
  'setting.message.template.edit_template': '编辑模版',
  'setting.message.template.add_template': '添加新模版',
  'setting.message.template.error_null': '主题或发件人名称或正文不能为空',
  'setting.message.template.preview': '预览',
  'setting.message.template.add_success': '增加成功',
  'setting.message.template.filter_type': '筛选条件',

  // 日志
  'setting.log.add': '新增',
  'setting.log.delete': '删除',
  'setting.log.login': '登录系统',
  'setting.log.update': '更新',
  'setting.log.logout': '退出系统',
  'setting.log.send': '发送',
  'setting.log.enabled': '启用／禁用',
  'setting.log.claim': '领取',
  'setting.log.reject': '拒绝',
  'setting.log.process': '处理',
  'setting.log.transfer': '划转',
  'setting.log.registe': '邀请注册TA',
  'setting.log.operator': '操作者',
  'setting.log.time': '时间',
  'setting.log.ip': 'ip',
  'setting.log.opType': '操作类型',
  'setting.log.opTime': '操作时间',
  'setting.log.opObj': '操作对象',
  'setting.log.objId': '对象ID',
  'setting.log.opName': '对象名称',
  'setting.log.extraInfo': '附加信息',
  'setting.log.filter_type': '筛选条件',
  'setting.log.search': '搜索',

  // 推广链接设置
  'setting.augold.name': '推广名称',
  'setting.augold.number': '推广编号',
  'setting.augold.type': '参数类型',
  'setting.augold.url': '推广网址',
  'setting.augold.url_tips': '推广网址中请勿出现（id、pid、eid）当中的任一参数',
  'setting.augold.add': '添加推广链接',
  'setting.augold.error_name_null': '名称不能为空',
  'setting.augold.error_url_null': '推广链接不能为空',
  'setting.augold.add_success': '添加成功',
  'setting.augold.edit': '编辑推广链接',
  'setting.augold.edit_success': '更新成功',
  'setting.augold.operator': '操作',

  // 账户组设置
  'setting.account_group.add_success': '添加成功',
  'setting.account_group.add': '添加账户组',
  'setting.account_group.null_name': '账户组名称不能为空',
  'setting.account_group.edit': '编辑账户组',
  'setting.account_group.id': '账户组ID',
  'setting.account_group.name': '账户组名称',
  'setting.account_group.operator': '操作',

  // 返佣层级设置
  'setting.commission.level': '返佣层级',
  'setting.commission.level_font': '层级',
  'setting.commission.name': '层级名称',
  'setting.commission.operator': '操作',
  'setting.commission.associated_user': '已关联用户',
  'setting.commission.associated_user_number': '已关联用户（个数）',
  'setting.commission.associated_user_details': '已关联用户明细',
  'setting.commission.tips': '返佣层级',
  'setting.commission.add': '添加返佣层级',
  'setting.commission.edit': '编辑返佣层级',
  'setting.commission.edit_success': '更新层级成功',
  'setting.commission.remove_success': '删除层级成功',
  'setting.commission.error_min_level': '层级必须大于0',
  'setting.commission.error_max_level': '最大层级不能超过15级',
  'setting.commission.error_scope': '限大于0且小于等于{value}的整数',
  'setting.commission.error_int': '层级必须为整数',
  'setting.commission.error_natual_int': '层级必须为正整数！',
  'setting.commission.error_null': '层级名称不能为空',

  // 个人设置
  'user_setting.change_pwd.title': '修改密码',
  'user_setting.change_pwd.origin_pwd': '原密码',
  'user_setting.change_pwd.new_pwd': '新密码',
  'user_setting.change_pwd.confirm_pwd': '确认密码',
  'user_setting.change_pwd.change_pwd': '修改密码',
  'user_setting.change_pwd.pwd_not_same': '两次输入的新密码不一致',
  'user_setting.change_pwd.origin_pwd_placeholder': '请输入原密码',
  'user_setting.change_pwd.new_pwd_placeholder': '请输入新密码',
  'user_setting.change_pwd.confirm_pwd_placeholder': '请再输入新密码',

  'user_setting.basic_info.real_name': '姓名',
  'user_setting.basic_info.entity_no': '用户编号',
  'user_setting.basic_info.header_img': '头像',
  'user_setting.basic_info.phone': '手机',
  'user_setting.basic_info.email': '邮箱',
  'user_setting.basic_info.gender': '性别',
  'user_setting.basic_info.man': '男',
  'user_setting.basic_info.woman': '女',
  'user_setting.basic_info.user_name': '用户名',
  'user_setting.basic_info.birthday': '生日',
  'user_setting.basic_info.address': '国家／省／市',
  'user_setting.basic_info.basic_info': '个人资料',
  'user_setting.basic_info.detail_address': '详细地址',
  'user_setting.basic_info.self_intro': '个人描述',
  'user_setting.basic_info.role': '角色',
  'user_setting.basic_info.parent_name': '上级用户',
  'user_setting.basic_info.server': '账号服务器',
  'user_setting.basic_info.account_info': '账号',
  'user_setting.basic_info.upload_header_img': '上传头像',
  'user_setting.basic_info.default_server_select': '请选择服务器',

  'user_setting.email_setting.email_setting': '邮箱设置',
  'user_setting.email_setting.origin_email': '当前邮箱',
  'user_setting.email_setting.new_email': '新邮箱',
  'user_setting.email_setting.send_success_tips': '验证邮件已下发，请点击邮箱内链接重新激活登录',

  // 登录页
  'login.validate_error': '请先完成验证',
  'login.no_available_entry': '没有可用的入口！',
  'login.user': '邮箱',
  'login.password': '密码',
  'login.remember_me': '记住我',
  'login.forget_pwd': '忘记密码？',
  'login.login': '登录',
  'login.register': '免费注册',
  'login.login_choice': '使用以下方式登录',
  'login.browser_warning': '当前浏览器不兼容，可能会影响系统功能使用，建议您使用以下浏览器: IE10+、Chrome、Firefox、Safari',
  'login.language.china': '中国',

  'login.forget_pwd.login': '想起密码？直接登录',
  'login.forget_pwd.email_placeholder': '请输入邮箱地址',
  'login.forget_pwd.send_email': '发送验证邮件',
  'login.forget_pwd.error_message': '您的邮箱输入有误',
  'login.forget_pwd.new_pwd': '新密码',
  'login.forget_pwd.confirm_pwd': '再次输入',
  'login.forget_pwd.send_success': '验证邮件发送成功，请进入邮箱重置密码',
  'login.forget_pwd.send_fail': '验证邮件发送失败',
  'login.forget_pwd.find_pwd': '找回密码',

  'login.register.user': '手机号',
  'login.register.password': '密码',
  'login.register.error_message': '您输入的用户名或密码有误',
  'login.register.remember_me': '记住我',
  'login.register.forget_pwd': '忘记密码？',
  'login.register.login': '登录',
  'login.register.login_choice': '使用以下方式登录',
  'login.register.get_check_code': '获取验证码',
  'login.register.agree': '同意',
  'login.register.use_terms': '使用条款',
  'login.register.has_account': '已有账户，立即登录',
  'login.register.register': '注册',
  'login.register.email': '邮箱',
  'login.register.login_success': '登录成功',
  'login.register.login_fail': '登录失败',
  'login.register.phone_register': '手机注册',
  'login.register.email_register': '邮箱注册',

  'login.reset_password.login': '想起密码？直接登录',
  'login.reset_password.error_message': '您的邮箱输入有误',
  'login.reset_password.new_pwd': '新密码',
  'login.reset_password.confirm_pwd': '再次输入',
  'login.reset_password.next_step': '下一步',
  'login.reset_password.reset_fail': '重置失败',
  'login.reset_password.reset_pwd': '重置密码',

  // 消息
  'message.send': '发送',
  'message.back': '返回',
  'message.send_group': '发送对象',
  'message.send_message_type': '消息类型',
  'message.broker_user': 'Broker用户',
  'message.send_success': '发送成功',
  'message.send_fail': '发送失败',
  'message.add': '添加消息',
  'message.inbox': '收件箱',
  'message.outbox': '发件箱',
  'message.draft_box': '草稿箱',
  'message.recycle_bin': '回收站',
  'message.all_user': '所有用户',
  'message.draft_box_save_success': '成功保存至草稿箱',
  'message.draft_box_save_fail': '保存至草稿箱失败',
  'message.draft_box_update_success': '草稿更新成功',
  'message.draft_box_update_fail': '草稿更新失败',
  'message.error.subject_null': '主题不能为空',
  'message.type.all': '所有类型',
  'message.type.web': '系统通知',
  'message.type.web_alert': '弹窗推送',
  'message.type.email': '邮件推送',
  'message.select_templete': '选择模板',
  'message.select_templete_please': '请选择模板',
  'message.subject': '主题',
  'message.time': '时间',
  'message.sender': '发件人',
  'message.recipient': '收件人',
  'message.status': '状态',
  'message.operation': '操作',
  'message.select_outbox': '选择发件箱',
  'message.select_outbox_please': '请选择发件箱',
  'message.recipient_type.bw_user': 'BW所有用户',
  'message.recipient_type.tw_user': 'TW所有用户',
  'message.recipient_type.all_accounts': '所有账户',
  'message.recipient_type.all_customers': '所有客户',
  'message.processing': '正在处理',
  'message.failure_reason': '失败原因',
  'message.resend': '重发邮件',
  'message.content': '正文',
  'message.send_to': '发送给',
  'message.move_to_recycle_bind': '文件已移至回收站',
  'message.reduction_success': '文件已还原',
  'message.reduction_fail': '文件还原失败',
  'message.reduction': '还原',
  'message.clear_success': '文件已清空',
  'message.clear_fail': '文件清空失败',
  'message.remove_completely': '彻底删除',
  'message.remove_tips': '确定要删除该消息吗? 删除后您可以在回收站进行恢复',
};

const getVersion = () => {
  return HttpClient.doGet('/v1/static/version');
};

const getLanguage = (lang: string) => {
  return HttpClient.doGet('/v1/static/language?', {
    project: 'PUB',
    lang
  });
};

export let I18nLoader = {
  load(cb: Function) {
    const lang = I18nLoader.getLang();
  
    getLanguage(lang).then((res) => {
      if (!res.result) return res;

      const result = {};
      res.data.forEach((item) => {
        result[item.code] = item.value;
      });
      language = Object.assign(language, result);

      if (cb) cb();
      return res;
    });
  },
  getErrorText(code: string) {
    return language[code] || code;
  },
  get(code: string) {
    return language[code] || code;
  },
  getLang() {
    let lang = window.localStorage.getItem('LANGUAGE_DATA_TYPE');
    if (!lang) {
      let l = window.navigator.language || window.navigator.browserLanguage;
      l = l.split('-');
      if (l[1]) l[1] = l[1].toUpperCase();
      lang = l.join('-');
      window.localStorage.setItem('LANGUAGE_DATA_TYPE', lang);
    }
    if (['zh-CN', 'en-US', 'zh-TW'].indexOf(lang) === -1) {
      lang = 'en-US';
      window.localStorage.setItem('LANGUAGE_DATA_TYPE', lang);
    }
    
    return lang;
  },
  setLang(lang: string) {
    window.localStorage.clear();
    window.sessionStorage.removeItem('USER_INFO');
    window.localStorage.setItem('LANGUAGE_DATA_TYPE', lang);
    HttpClient.doGet(`/v1/user/language/${lang}`)
      .then(() => {
        window.location.reload();    
      });
  }
};
