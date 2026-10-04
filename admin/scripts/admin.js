/* ==========================================================================
   ChatFlow 管理后台逻辑
   --------------------------------------------------------------------------
   对应 PRD 5.12 后台管理与运营（ADM-001 ~ ADM-011）
   以及 8.4 隐私合规：消息审计/调阅需「双人授权、用途限定、全量留痕」
   --------------------------------------------------------------------------
   所有事件统一委托在 document 上（后台没有 body 下的浮层例外，
   但保持一致以便后续扩展弹窗不会踩坑）。
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ======================================================================
     图标
     ====================================================================== */
  var I = {
    dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7.5" height="8.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="5" rx="1.5"/><rect x="3" y="14.5" width="7.5" height="6.5" rx="1.5"/><rect x="13.5" y="11" width="7.5" height="10" rx="1.5"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20v-1.6a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20"/><circle cx="9" cy="7.5" r="3.5"/><path d="M22 20v-1.6a4 4 0 0 0-3-3.85M16.5 4.2a4 4 0 0 1 0 7.6"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5.5c0 4.2-2.9 8-7 9.5-4.1-1.5-7-5.3-7-9.5V6z"/><path d="M9.2 12l2 2 3.6-3.8"/></svg>',
    groups: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 19.5a6.5 6.5 0 0 1 13 0"/><circle cx="17.5" cy="9.5" r="2.4"/><path d="M16 19.5a5 5 0 0 1 5.5-4.9"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="10.5" rx="2"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7.5 19.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3.6 14H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 7.5l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 3.6V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.5 1.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v11"/><path d="M7.5 10L12 14.5 16.5 10"/><path d="M4 19h16"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V10"/><path d="M7.5 14L12 9.5 16.5 14"/><path d="M4 5h16"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><circle cx="12" cy="16.5" r=".7" fill="currentColor"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V6M6 11l6-6 6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v13M6 13l6 6 6-6"/></svg>',
    flat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14"/></svg>',
    more: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8.5a6 6 0 1 0-12 0V15l-1.5 2.5h15L18 15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4v.5"/><circle cx="12" cy="17" r=".8" fill="currentColor"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z"/><path d="M14.5 6.5l3 3"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1"/><path d="M20.5 4.5V10H15"/></svg>',
    filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16l-6.2 7.4V19l-3.6-2v-4.6z"/></svg>',
    logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18V9.5L12 4l8 5.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M9.5 20v-5.5h5V20"/></svg>'
  };

  /* ======================================================================
     导航（PRD 5.12）
     ====================================================================== */
  var NAV = [
    { group:'运营', items:[
      { id:'dashboard', label:'数据看板', icon:'dashboard', prd:'ADM-008' },
      { id:'announce',  label:'公告与 Banner', icon:'bell',  prd:'ADM-007', badge:1 }
    ]},
    { group:'组织', items:[
      { id:'org',    label:'组织与成员', icon:'users',  prd:'ADM-001' },
      { id:'roles',  label:'角色权限',   icon:'shield', prd:'ADM-002' },
      { id:'groups', label:'群组管理',   icon:'groups', prd:'ADM-003' }
    ]},
    { group:'安全与合规', items:[
      { id:'security',  label:'内容安全',   icon:'lock', prd:'ADM-004' },
      { id:'audit',     label:'审计日志',   icon:'file', prd:'ADM-005' },
      { id:'retrieval', label:'消息检索与导出', icon:'search', prd:'ADM-006' },
      { id:'sanction',  label:'封禁与处置', icon:'alert', prd:'ADM-010' }
    ]},
    { group:'系统', items:[
      { id:'retention', label:'存储与保留', icon:'settings', prd:'ADM-011' },
      { id:'gray',      label:'灰度与开关', icon:'refresh',  prd:'ADM-009' },
      { id:'tenant',    label:'多租户管理', icon:'groups',   prd:'ADM-012' }
    ]}
  ];

  /* ======================================================================
     数据
     ====================================================================== */
  var KPI = [
    { label:'日活用户 DAU', value:'86,420', delta:'+4.2%', dir:'up', note:'较昨日' },
    { label:'周活用户 WAU', value:'214,860', delta:'+1.8%', dir:'up', note:'较上周' },
    { label:'人均消息数', value:'68.4', unit:'条', delta:'-2.1%', dir:'down', note:'较昨日' },
    { label:'消息送达率', value:'99.98', unit:'%', delta:'+0.01%', dir:'up', note:'较昨日' },
    { label:'消息 P95 时延', value:'142', unit:'ms', delta:'-6ms', dir:'up', note:'越低越好' },
    { label:'推送到达率', value:'96.4', unit:'%', delta:'-0.6%', dir:'down', note:'较昨日' },
    { label:'活跃群数', value:'12,806', delta:'+2.4%', dir:'up', note:'较昨日' },
    { label:'故障 MTTR', value:'11.2', unit:'min', delta:'-1.4min', dir:'up', note:'近 7 天均值' }
  ];

  var TREND = {
    days:['9/26','9/27','9/28','9/29','9/30','10/1','10/2'],
    sent:[820,910,880,1240,1180,960,1040],
    recv:[810,900,872,1226,1170,950,1030]
  };

  var MSG_TYPES = [
    { label:'文本',  v:62.4, c:'var(--cf-primary)' },
    { label:'图片',  v:14.8, c:'#7F56D9' },
    { label:'文件',  v:9.2,  c:'#12B76A' },
    { label:'语音',  v:6.1,  c:'#F79009' },
    { label:'链接',  v:4.6,  c:'#0BA5EC' },
    { label:'其他',  v:2.9,  c:'#98A2B3' }
  ];

  var DEPTS = [
    { id:'d0', name:'总部',   parent:null, count:1286 },
    { id:'d1', name:'产品部', parent:'d0', count:126 },
    { id:'d2', name:'研发部', parent:'d0', count:682 },
    { id:'d3', name:'设计部', parent:'d0', count:94 },
    { id:'d4', name:'市场部', parent:'d0', count:248 },
    { id:'d5', name:'财务部', parent:'d0', count:76 },
    { id:'d6', name:'人力资源部', parent:'d0', count:60 }
  ];

  var MEMBERS = [
    { id:'m1', n:'陈三', dept:'d1', title:'产品总监',  emp:'E100201', phone:'138****0011', status:'active',  role:'组织管理员', joined:'2024-03-01', last:'2 分钟前' },
    { id:'m2', n:'张三', dept:'d1', title:'产品经理',  emp:'E100238', phone:'138****0001', status:'active',  role:'普通员工',   joined:'2024-03-12', last:'5 分钟前' },
    { id:'m3', n:'李四', dept:'d1', title:'产品经理',  emp:'E100241', phone:'138****0002', status:'active',  role:'普通员工',   joined:'2024-03-14', last:'1 小时前' },
    { id:'m4', n:'王五', dept:'d2', title:'后端负责人', emp:'E100102', phone:'138****0003', status:'active',  role:'普通员工',   joined:'2024-02-20', last:'刚刚' },
    { id:'m5', n:'赵六', dept:'d2', title:'后端工程师', emp:'E100118', phone:'138****0004', status:'active',  role:'普通员工',   joined:'2024-04-02', last:'12 分钟前' },
    { id:'m6', n:'孙七', dept:'d2', title:'SRE',        emp:'E100126', phone:'138****0005', status:'frozen',  role:'普通员工',   joined:'2024-04-18', last:'3 天前' },
    { id:'m7', n:'周八', dept:'d3', title:'UI 设计师',  emp:'E100305', phone:'138****0006', status:'active',  role:'普通员工',   joined:'2024-05-06', last:'28 分钟前' },
    { id:'m8', n:'吴九', dept:'d3', title:'交互设计师', emp:'E100311', phone:'138****0007', status:'active',  role:'普通员工',   joined:'2024-05-06', last:'2 小时前' },
    { id:'m9', n:'郑十', dept:'d4', title:'市场经理',   emp:'E100402', phone:'138****0008', status:'active',  role:'普通员工',   joined:'2024-06-21', last:'昨天' },
    { id:'m10',n:'钱一', dept:'d4', title:'内容运营',   emp:'E100415', phone:'138****0009', status:'resigned',role:'普通员工',   joined:'2024-07-09', last:'30 天前' },
    { id:'m11',n:'刘二', dept:'d2', title:'测试工程师', emp:'E100133', phone:'138****0010', status:'active',  role:'审计人员',   joined:'2024-08-15', last:'8 分钟前' },
    { id:'m12',n:'黄四', dept:'d2', title:'前端工程师', emp:'E100145', phone:'138****0012', status:'active',  role:'普通员工',   joined:'2024-09-01', last:'15 分钟前' }
  ];

  var MEMBER_STATUS = { active:{ label:'正常', cls:'cf-tag--success' },
                        frozen:{ label:'已冻结', cls:'cf-tag--warning' },
                        resigned:{ label:'已离职', cls:'' } };

  var ROLES = ['普通员工','组织管理员','超级管理员','审计人员'];

  var PERM_GROUPS = [
    { group:'组织与成员', perms:[
      { id:'org.member.read',   label:'查看成员',        allow:[1,1,1,1] },
      { id:'org.member.write',  label:'新增/编辑成员',    allow:[0,1,1,0] },
      { id:'org.dept.manage',   label:'部门树维护',       allow:[0,1,1,0] },
      { id:'org.import',        label:'批量导入（Excel/SCIM）', allow:[0,1,1,0] },
      { id:'org.handover',      label:'离职交接',        allow:[0,1,1,0] }
    ]},
    { group:'角色与权限', perms:[
      { id:'rbac.role.read',    label:'查看角色',        allow:[0,1,1,1] },
      { id:'rbac.role.write',   label:'配置角色与权限点',  allow:[0,0,1,0] },
      { id:'rbac.scope',        label:'配置数据范围',     allow:[0,0,1,0] }
    ]},
    { group:'群组', perms:[
      { id:'group.read',        label:'查看全局群列表',   allow:[0,1,1,1] },
      { id:'group.dismiss',     label:'强制解散群',      allow:[0,1,1,0] },
      { id:'group.transfer',    label:'转让群主',        allow:[0,1,1,0] },
      { id:'group.member.edit', label:'调整群成员',      allow:[0,1,1,0] }
    ]},
    { group:'内容安全', perms:[
      { id:'sec.word.read',     label:'查看敏感词库',     allow:[0,1,1,1] },
      { id:'sec.word.write',    label:'编辑敏感词库',     allow:[0,0,1,0] },
      { id:'sec.policy',        label:'外发管控与链接白名单', allow:[0,0,1,0] }
    ]},
    { group:'审计与检索', perms:[
      { id:'audit.read',        label:'查看审计日志',     allow:[0,1,1,1] },
      { id:'audit.export',      label:'导出审计日志',     allow:[0,0,1,1] },
      { id:'msg.retrieve',      label:'消息检索',        allow:[0,0,1,1] },
      { id:'msg.retrieve.approve', label:'消息检索审批（第二人）', allow:[0,0,0,1] }
    ]},
    { group:'处置与系统', perms:[
      { id:'sanction.account',  label:'账号封禁/解封',    allow:[0,1,1,0] },
      { id:'sanction.device',   label:'设备黑名单',       allow:[0,1,1,0] },
      { id:'sys.retention',     label:'存储与保留策略',   allow:[0,0,1,0] },
      { id:'sys.gray',          label:'灰度与功能开关',   allow:[0,0,1,0] }
    ]}
  ];

  var GROUPS = [
    { id:'g1', n:'产品群',       owner:'陈三', members:128, cap:500,  msgs:18420, type:'内部群',   active:'高', created:'2026-03-12' },
    { id:'g2', n:'设计评审群',   owner:'周八', members:18,  cap:500,  msgs:3260,  type:'项目群',   active:'中', created:'2026-04-08' },
    { id:'g3', n:'研发部',       owner:'王五', members:682, cap:2000, msgs:96480, type:'部门群',   active:'高', created:'2025-11-20' },
    { id:'g4', n:'全员公告',     owner:'系统', members:1286,cap:5000, msgs:412,   type:'广播群',   active:'低', created:'2025-09-01' },
    { id:'g5', n:'市场部',       owner:'郑十', members:248, cap:2000, msgs:22840, type:'部门群',   active:'中', created:'2025-12-05' },
    { id:'g6', n:'Q3 项目冲刺',  owner:'张三', members:36,  cap:500,  msgs:8940,  type:'项目群',   active:'高', created:'2026-07-01' },
    { id:'g7', n:'测试联调群',   owner:'刘二', members:22,  cap:500,  msgs:1520,  type:'项目群',   active:'低', created:'2026-08-12' },
    { id:'g8', n:'客户对接-华信', owner:'郑十', members:64,  cap:500,  msgs:6410,  type:'外部群',   active:'中', created:'2026-06-18' }
  ];

  var WORDS_LOCAL = ['内部资料','机密','未公开','竞品对比','离职','薪资','调岗','裁员','期权'];
  var WORDS_CLOUD = ['涉政词库（云端）','涉黄词库（云端）','涉暴词库（云端）','违禁品词库（云端）'];

  var POLICIES = [
    { id:'sendBlock',   label:'敏感词发送前拦截', desc:'命中敏感词时阻断发送并提示用户', on:true },
    { id:'imgAudit',    label:'图片审核（鉴黄鉴暴）', desc:'图片上传后异步送审，命中后自动撤回并告警', on:true },
    { id:'linkCheck',   label:'外链风险检测',    desc:'识别钓鱼与恶意域名，命中时二次确认', on:true },
    { id:'dlp',         label:'文件外发管控（DLP）', desc:'命中敏感规则时阻断下载并记录审计', on:false },
    { id:'watermark',   label:'文件动态水印',     desc:'外发文件嵌入接收人 ID 与时间水印', on:true },
    { id:'externalLimit', label:'禁止外发组织外',  desc:'开启后文件与截图不可分享给外部联系人', on:false }
  ];

  var AUDIT = [
    { t:'2026-10-02 17:52:10', who:'陈三', role:'组织管理员', ev:'member.update',   obj:'张三（E100238）', ip:'10.12.4.31',  result:'success' },
    { t:'2026-10-02 17:41:02', who:'刘二', role:'审计人员',   ev:'audit.export',    obj:'审计日志 2026-09', ip:'10.12.7.88', result:'success' },
    { t:'2026-10-02 16:28:44', who:'陈三', role:'组织管理员', ev:'group.dismiss',   obj:'测试联调群',       ip:'10.12.4.31',  result:'success' },
    { t:'2026-10-02 15:10:19', who:'王五', role:'普通员工',   ev:'message.recall',  obj:'消息 #984217',    ip:'10.12.9.12',  result:'success' },
    { t:'2026-10-02 14:33:07', who:'未知', role:'—',          ev:'auth.login',      obj:'账号 E100415',    ip:'203.0.113.44',result:'denied' },
    { t:'2026-10-02 13:58:31', who:'刘二', role:'审计人员',   ev:'msg.retrieve',    obj:'会话「产品群」',   ip:'10.12.7.88',  result:'success' },
    { t:'2026-10-02 11:22:56', who:'陈三', role:'组织管理员', ev:'member.freeze',   obj:'孙七（E100126）', ip:'10.12.4.31',  result:'success' },
    { t:'2026-10-02 10:05:12', who:'陈三', role:'组织管理员', ev:'sec.word.write',  obj:'新增 3 个敏感词',  ip:'10.12.4.31',  result:'success' },
    { t:'2026-10-02 09:44:03', who:'张三', role:'普通员工',   ev:'file.download',   obj:'IM数据库表结构设计文档.md', ip:'10.12.8.5', result:'success' },
    { t:'2026-10-02 09:12:48', who:'李四', role:'普通员工',   ev:'auth.login',      obj:'新设备登录',       ip:'10.12.8.22',  result:'success' }
  ];

  var AUDIT_EV = {
    'member.update':  { label:'成员变更', cls:'cf-tag--brand' },
    'member.freeze':  { label:'冻结账号', cls:'cf-tag--warning' },
    'audit.export':   { label:'日志导出', cls:'cf-tag--brand' },
    'group.dismiss':  { label:'解散群',   cls:'cf-tag--danger' },
    'message.recall': { label:'消息撤回', cls:'' },
    'auth.login':     { label:'登录',     cls:'' },
    'msg.retrieve':   { label:'消息检索', cls:'cf-tag--warning' },
    'sec.word.write': { label:'敏感词变更', cls:'cf-tag--brand' },
    'file.download':  { label:'文件下载', cls:'' }
  };

  var RETRIEVAL_RESULTS = [
    { conv:'产品群',       from:'张三', time:'2026-09-28 14:31', text:'数据库这块有个问题：MySQL 分区表要求每个唯一索引都包含分区键…' },
    { conv:'产品群',       from:'王五', time:'2026-09-27 17:08', text:'存储先行再 ACK 的前提是三道补偿必须都在：消费者重试、死信告警、对账任务。' },
    { conv:'设计评审群',   from:'周八', time:'2026-09-27 16:20', text:'圆角跟元素尺寸要配对：控件 6px、容器 12px、大容器 16–20px。' },
    { conv:'研发部',       from:'李四', time:'2026-09-26 11:02', text:'sync_log 用按天 RANGE 分区 + DROP PARTITION 清理，不要用 DELETE。' }
  ];

  var SANCTIONS = [
    { id:'s1', n:'钱一', emp:'E100415', type:'账号', reason:'已离职，账号冻结保留数据', until:'—',        status:'frozen', op:'陈三', t:'2026-09-02 10:12' },
    { id:'s2', n:'孙七', emp:'E100126', type:'账号', reason:'安全事件待核查',            until:'2026-10-05', status:'frozen', op:'陈三', t:'2026-10-02 11:22' },
    { id:'s3', n:'203.0.113.44', emp:'—', type:'IP', reason:'异地异常登录尝试 27 次',    until:'2026-10-09', status:'blocked', op:'系统', t:'2026-10-02 14:33' },
    { id:'s4', n:'iPhone 12 · 旧设备', emp:'E100238', type:'设备', reason:'设备丢失报备', until:'永久',      status:'blocked', op:'陈三', t:'2026-09-18 09:40' }
  ];

  var ANNOUNCE = [
    { id:'an1', title:'Q3 全员大会通知',   scope:'全员',     need:true,  read:'1,204 / 1,286', status:'published', t:'2026-10-01 09:00' },
    { id:'an2', title:'系统维护窗口（10/5 02:00–04:00）', scope:'全员', need:true, read:'986 / 1,286', status:'published', t:'2026-09-29 18:30' },
    { id:'an3', title:'研发部代码评审规范更新', scope:'研发部', need:false, read:'—',          status:'published', t:'2026-09-26 14:10' },
    { id:'an4', title:'国庆假期值班安排',   scope:'全员',     need:false, read:'—',             status:'draft',     t:'—' }
  ];

/* 批量导入预览（ADM-001 批量导入 Excel/SCIM） */
  var IMPORT_PREVIEW = {
    fileName:'members_2026Q4.xlsx',
    total:128, valid:121, invalid:7, create:118, update:3,
    mapping:[
      { src:'姓名',     target:'nickname',    required:true },
      { src:'工号',     target:'employee_no', required:true },
      { src:'手机号',   target:'phone',       required:true },
      { src:'部门',     target:'dept_name',   required:true },
      { src:'职位',     target:'title',       required:false },
      { src:'邮箱',     target:'email',       required:false },
      { src:'入职日期', target:'joined_at',   required:false }
    ],
    errors:[
      { row:12, field:'手机号', value:'1380000',   reason:'格式不正确，需 11 位数字' },
      { row:26, field:'工号',   value:'E100238',   reason:'工号已存在，将改为更新该成员' },
      { row:33, field:'部门',   value:'市场部2',    reason:'部门不存在，请先在组织架构中创建' },
      { row:41, field:'姓名',   value:'',          reason:'必填字段为空' },
      { row:57, field:'手机号', value:'1390000000', reason:'格式不正确，需 11 位数字' },
      { row:88, field:'工号',   value:'E100238',   reason:'文件内重复出现' },
      { row:104,field:'部门',   value:'研发中心',   reason:'部门不存在，是否指「研发部」？' }
    ]
  };

/* 多租户（ADM-012 SaaS 版） */
  var TENANTS = [
    { id:'t1', n:'华信科技', plan:'企业版', members:1286, qMembers:2000, storage:24.6, qStorage:50, msgs:86.4, status:'active',    since:'2024-03-01', owner:'陈三' },
    { id:'t2', n:'恒远集团', plan:'标准版', members:486,  qMembers:500,  storage:6.2,  qStorage:10, msgs:18.2, status:'active',    since:'2025-01-12', owner:'刘明' },
    { id:'t3', n:'云启信息', plan:'试用版', members:64,   qMembers:100,  storage:0.4,  qStorage:1,  msgs:1.2,  status:'trial',     since:'2026-09-20', owner:'王强' },
    { id:'t4', n:'天工制造', plan:'企业版', members:2140, qMembers:3000, storage:38.4, qStorage:50, msgs:142,  status:'active',    since:'2023-11-08', owner:'赵磊' },
    { id:'t5', n:'明德教育', plan:'标准版', members:128,  qMembers:500,  storage:1.8,  qStorage:10, msgs:4.6,  status:'suspended', since:'2025-06-15', owner:'孙倩' }
  ];

  var TENANT_STATUS = { active:{ label:'正常', cls:'cf-tag--success' },
                        trial:{ label:'试用中', cls:'cf-tag--brand' },
                        suspended:{ label:'已停用', cls:'cf-tag--danger' } };

  var PLAN_QUOTA = {
    '试用版':{ members:100,  storage:1,  price:'免费 30 天' },
    '标准版':{ members:500,  storage:10, price:'¥ 18 / 人 / 月' },
    '企业版':{ members:3000, storage:50, price:'¥ 32 / 人 / 月' }
  };

  /* 群详情用的活跃成员（ADM-003） */
  var GROUP_TOP = [
    { n:'王五', c:'#12B76A', msgs:4280 },
    { n:'赵六', c:'#0BA5EC', msgs:3160 },
    { n:'张三', c:'#7F56D9', msgs:2840 },
    { n:'李四', c:'#F79009', msgs:1920 },
    { n:'周八', c:'#6172F3', msgs:1180 }
  ];

  /* 离职交接范围（ADM-001 离职交接） */
  var HANDOVER_SCOPE = [
    { id:'conv', label:'会话与消息',   desc:'该成员的单聊会话转交，历史消息保留可查', on:true },
    { id:'group',label:'群主身份',     desc:'由其担任群主的群转交给交接人',           on:true },
    { id:'file', label:'个人文件',     desc:'个人空间的文件与收藏转移',               on:true },
    { id:'task', label:'待办与审批',   desc:'未完成的审批流与待办事项转交',           on:false }
  ];

  /* ======================================================================
     状态
     ====================================================================== */
  var state = {
    page:'dashboard',
    dept:'d1',
    memberQ:'', memberStatus:'all', memberPage:1,
    roleCol:1,
    groupQ:'', groupType:'all',
    auditQ:'', auditEv:'all',
    retrieveStage:'form',   // form | pending | approved
    retrieveQ:'',
    modal:null,          // { kind, step, payload }
    importPicked:false,  // 导入向导是否已选择文件
    handoverScope:{ conv:true, group:true, file:true, task:false },
    handoverTo:'',
    pickedMembers:new Set(),  // 成员批量操作已选
    pickedGroups:new Set(),   // 群组批量操作已选
    tenantPlan:'企业版'
  };

  /* ======================================================================
     工具
     ====================================================================== */
  var toastTimer = null;
  function toast(msg){
    var el = $('#toast');
    el.textContent = msg;
    el.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ el.classList.remove('is-show'); }, 2600);
  }

  function avatar(n, c, size){
    return '<span class="cf-avatar cf-avatar--' + size + '" style="background:' + (c || '#0B6BCB') + '">' +
           String(n).slice(0,1) + '</span>';
  }

  function deptName(id){
    var d = DEPTS.filter(function(x){ return x.id === id; })[0];
    return d ? d.name : '—';
  }

  function esc(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ======================================================================
     页面：数据看板（ADM-008）
     ====================================================================== */
  function statCard(s){
    var dirCls = s.dir === 'up' ? 'stat__delta--up' : s.dir === 'down' ? 'stat__delta--down' : 'stat__delta--flat';
    var arrow = s.dir === 'up' ? I.up : s.dir === 'down' ? I.down : I.flat;
    return '<div class="stat">' +
      '<div class="stat__label">' + s.label + '</div>' +
      '<div class="stat__value">' + s.value + (s.unit ? '<small>' + s.unit + '</small>' : '') + '</div>' +
      '<div class="stat__foot">' +
        '<span class="stat__delta ' + dirCls + '">' + arrow + s.delta + '</span>' +
        '<span class="stat__note">' + s.note + '</span>' +
      '</div></div>';
  }

  /* 折线 + 面积图（纯 SVG，无第三方库） */
  function lineChart(){
    var W = 640, H = 200, PL = 44, PR = 12, PT = 12, PB = 26;
    var iw = W - PL - PR, ih = H - PT - PB;
    var all = TREND.sent.concat(TREND.recv);
    var max = Math.ceil(Math.max.apply(null, all) / 200) * 200;
    var n = TREND.days.length;

    var x = function(i){ return PL + iw * (n === 1 ? 0.5 : i / (n - 1)); };
    var y = function(v){ return PT + ih - ih * (v / max); };

    var pts = function(arr){ return arr.map(function(v, i){ return x(i) + ',' + y(v); }).join(' '); };
    var area = 'M' + x(0) + ',' + y(TREND.sent[0]) + ' ' +
               TREND.sent.map(function(v, i){ return 'L' + x(i) + ',' + y(v); }).join(' ') +
               ' L' + x(n-1) + ',' + (PT+ih) + ' L' + x(0) + ',' + (PT+ih) + ' Z';

    var grid = '', labels = '';
    for(var g = 0; g <= 4; g++){
      var gv = max / 4 * g, gy = y(gv);
      grid += '<line class="chart__grid" x1="' + PL + '" y1="' + gy + '" x2="' + (W-PR) + '" y2="' + gy + '"/>';
      labels += '<text class="chart__axis" x="' + (PL-8) + '" y="' + (gy+4) + '" text-anchor="end">' + (gv/1000).toFixed(1) + 'k</text>';
    }
    var xLabels = TREND.days.map(function(d, i){
      return '<text class="chart__axis" x="' + x(i) + '" y="' + (H-8) + '" text-anchor="middle">' + d + '</text>';
    }).join('');

    var dots = TREND.sent.map(function(v, i){
      return '<circle class="chart__dot" cx="' + x(i) + '" cy="' + y(v) + '" r="3.5"/>';
    }).join('');

    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="近 7 日消息量趋势">' +
      grid + labels + xLabels +
      '<path class="chart__area" d="' + area + '"/>' +
      '<polyline class="chart__line" points="' + pts(TREND.sent) + '"/>' +
      '<polyline class="chart__line" points="' + pts(TREND.recv) + '" stroke-dasharray="4 4" opacity=".55"/>' +
      dots + '</svg>';
  }

  function renderDashboard(){
    var bars = MSG_TYPES.map(function(t){
      return '<div class="bar-row">' +
        '<span class="bar-row__label">' + t.label + '</span>' +
        '<span class="bar-row__track"><span class="bar-row__fill" style="width:' + t.v + '%;background:' + t.c + '"></span></span>' +
        '<span class="bar-row__value">' + t.v + '%</span></div>';
    }).join('');

    var topGroups = GROUPS.slice().sort(function(a,b){ return b.msgs - a.msgs; }).slice(0, 5);
    var gmax = topGroups[0].msgs;
    var groupBars = topGroups.map(function(g){
      return '<div class="bar-row">' +
        '<span class="bar-row__label truncate" title="' + g.n + '">' + g.n + '</span>' +
        '<span class="bar-row__track"><span class="bar-row__fill" style="width:' + Math.round(g.msgs/gmax*100) + '%"></span></span>' +
        '<span class="bar-row__value num">' + g.msgs.toLocaleString() + '</span></div>';
    }).join('');

    return pageHead('数据看板', 'ADM-008 · 覆盖 DAU/WAU、消息量、时延、失败率、推送到达率、群活跃',
        '<button class="cf-btn cf-btn--secondary" data-act="refresh">' + I.refresh + '刷新</button>' +
        '<button class="cf-btn cf-btn--primary" data-act="export-report">' + I.download + '导出日报</button>') +
      '<div class="grid-4" style="margin-bottom:var(--cf-space-4)">' + KPI.map(statCard).join('') + '</div>' +
      '<div class="grid-2-1">' +
        '<div class="card"><div class="card__head"><h2>消息量趋势</h2><span class="card__spacer"></span>' +
          '<span class="cf-tag">近 7 天</span></div>' +
          '<div class="card__body">' + lineChart() +
          '<div class="chart-legend">' +
            '<span><i style="background:var(--cf-primary)"></i>发送量（千条）</span>' +
            '<span><i style="background:var(--cf-primary);opacity:.55"></i>接收量（千条）</span>' +
          '</div></div></div>' +
        '<div class="card"><div class="card__head"><h2>消息类型分布</h2></div>' +
          '<div class="card__body">' + bars + '</div></div>' +
      '</div>' +
      '<div class="card"><div class="card__head"><h2>群活跃 TOP 5</h2>' +
        '<span class="card__spacer"></span><span class="cf-tag">近 7 天消息量</span></div>' +
        '<div class="card__body">' + groupBars + '</div></div>';
  }

  /* ======================================================================
     页面：组织与成员（ADM-001）
     ====================================================================== */
  function renderOrg(){
    var tree = DEPTS.map(function(d){
      return '<button class="dept-node' + (d.parent ? ' dept-node--child' : '') +
        (state.dept === d.id ? ' is-active' : '') + '" data-dept="' + d.id + '">' +
        (d.parent ? I.chevron : I.users) +
        '<span class="truncate">' + d.name + '</span>' +
        '<span class="dept-node__count num">' + d.count + '</span></button>';
    }).join('');

    var list = MEMBERS.filter(function(m){
      if(state.dept !== 'd0' && m.dept !== state.dept) return false;
      if(state.memberStatus !== 'all' && m.status !== state.memberStatus) return false;
      if(state.memberQ && (m.n + m.emp).toLowerCase().indexOf(state.memberQ.toLowerCase()) < 0) return false;
      return true;
    });

    var picked = state.pickedMembers;
    var allPicked = list.length > 0 && list.every(function(m){ return picked.has(m.id); });

    var rows = list.map(function(m){
      var st = MEMBER_STATUS[m.status];
      return '<tr data-member-id="' + m.id + '">' +
        '<td class="cell-check"><input type="checkbox" class="cf-check" data-pick-member="' + m.id + '"' +
          (picked.has(m.id) ? ' checked' : '') + '></td>' +
        '<td><div class="tbl-user">' + avatar(m.n, '#0B6BCB', 28) +
          '<div class="tbl-user__body"><span class="tbl-user__name">' + m.n + '</span>' +
          '<span class="tbl-user__sub num">' + m.emp + '</span></div></div></td>' +
        '<td>' + deptName(m.dept) + '</td>' +
        '<td>' + m.title + '</td>' +
        '<td><span class="cf-tag ' + (m.role === '组织管理员' ? 'cf-tag--brand' : m.role === '审计人员' ? 'cf-tag--warning' : '') + '">' + m.role + '</span></td>' +
        '<td class="num">' + m.phone + '</td>' +
        '<td><span class="cf-tag ' + st.cls + '">' + st.label + '</span></td>' +
        '<td class="num">' + m.last + '</td>' +
        '<td class="cell-actions"><span class="tbl-actions">' +
          '<button class="cf-btn cf-btn--ghost cf-btn--sm" data-act="member-edit">' + I.edit + '</button>' +
          '<button class="cf-btn cf-btn--ghost cf-btn--sm" data-act="member-handover" title="离职交接">' + I.refresh + '</button>' +
          '<button class="cf-btn cf-btn--ghost cf-btn--sm" data-act="member-more">' + I.more + '</button>' +
        '</span></td></tr>';
    }).join('');

    return pageHead('组织与成员', 'ADM-001 · 成员增删改查、部门树维护、批量导入（Excel/SCIM）、离职交接',
        '<button class="cf-btn cf-btn--secondary" data-act="import-members">' + I.upload + '批量导入</button>' +
        '<button class="cf-btn cf-btn--secondary" data-act="sync-hr">' + I.refresh + '同步 HR</button>' +
        '<button class="cf-btn cf-btn--primary" data-act="add-member">' + I.plus + '新增成员</button>') +
      '<div class="grid-2-1">' +
        '<div class="card"><div class="filter-bar">' +
          '<label class="cf-input cf-input--search">' + I.search +
            '<input type="search" placeholder="搜索姓名或工号" value="' + esc(state.memberQ) + '" data-member-q></label>' +
          '<select class="cf-select" data-member-status>' +
            '<option value="all"' + (state.memberStatus==='all'?' selected':'') + '>全部状态</option>' +
            '<option value="active"' + (state.memberStatus==='active'?' selected':'') + '>正常</option>' +
            '<option value="frozen"' + (state.memberStatus==='frozen'?' selected':'') + '>已冻结</option>' +
            '<option value="resigned"' + (state.memberStatus==='resigned'?' selected':'') + '>已离职</option>' +
          '</select>' +
          '<span class="filter-bar__spacer"></span>' +
          '<span class="cf-tag">共 <span class="num">' + list.length + '</span> 人</span>' +
        '</div>' +
        (picked.size ? bulkBarHTML() : '') +
        '<div class="card__body card__body--flush"><div class="table-wrap"><table class="tbl">' +
          '<thead><tr><th class="cell-check"><input type="checkbox" class="cf-check" data-pick-all="members"' +
            (allPicked ? ' checked' : '') + '></th><th>成员</th><th>部门</th><th>职位</th><th>系统角色</th>' +
          '<th>手机号</th><th>状态</th><th>最近活跃</th><th class="cell-actions">操作</th></tr></thead>' +
          '<tbody>' + (rows || '<tr><td colspan="9"><div class="empty-state">没有符合条件的成员</div></td></tr>') + '</tbody>' +
        '</table></div>' + pager(list.length, 12) + '</div></div>' +
        '<div class="card"><div class="card__head"><h2>组织架构</h2><span class="card__spacer"></span>' +
          '<button class="cf-btn cf-btn--ghost cf-btn--sm" data-act="dept-add" title="新增部门">' + I.plus + '</button></div>' +
          '<div class="card__body" style="padding:var(--cf-space-2)"><div class="dept-tree">' + tree + '</div></div></div>' +
      '</div>';
  }

  function pager(total, per){
    var pages = Math.max(1, Math.ceil(total / per));
    var btns = '';
    for(var i = 1; i <= Math.min(pages, 5); i++){
      btns += '<button class="pager__btn' + (i === 1 ? ' is-active' : '') + '">' + i + '</button>';
    }
    return '<div class="pager"><span>共 <span class="num">' + total + '</span> 条 · 每页 ' + per + ' 条</span>' +
      '<span class="pager__spacer"></span>' +
      '<button class="pager__btn" disabled>上一页</button>' + btns +
      '<button class="pager__btn"' + (pages <= 1 ? ' disabled' : '') + '>下一页</button></div>';
  }

  /* ======================================================================
     页面：角色权限（ADM-002）
     ====================================================================== */
  function renderRoles(){
    var head = ROLES.map(function(r, i){
      return '<th>' + r + (i === state.roleCol ? ' <span class="cf-tag cf-tag--brand">当前</span>' : '') + '</th>';
    }).join('');

    var body = PERM_GROUPS.map(function(g){
      var groupRow = '<tr class="perm-grid__group"><td colspan="' + (ROLES.length + 1) + '">' + g.group + '</td></tr>';
      var rows = g.perms.map(function(p){
        var cells = p.allow.map(function(a, i){
          return '<td><input type="checkbox" class="cf-check" data-perm="' + p.id + '" data-role="' + i + '"' +
                 (a ? ' checked' : '') + '></td>';
        }).join('');
        return '<tr><td>' + p.label + '<div class="tbl-user__sub" style="font-family:var(--cf-font-mono)">' + p.id + '</div></td>' + cells + '</tr>';
      }).join('');
      return groupRow + rows;
    }).join('');

    return pageHead('角色权限', 'ADM-002 · 自定义角色、权限点勾选、数据范围（全员 / 本部门 / 自定义）',
        '<button class="cf-btn cf-btn--secondary" data-act="role-import">' + I.upload + '导入配置</button>' +
        '<button class="cf-btn cf-btn--primary" data-act="role-save">保存变更</button>') +
      '<div class="card"><div class="card__head"><h2>权限矩阵</h2>' +
        '<p>勾选即授予；改动会写入审计日志（ADM-005）</p></div>' +
        '<div class="card__body card__body--flush"><div class="table-wrap"><table class="perm-grid">' +
        '<thead><tr><th>权限点</th>' + head + '</tr></thead><tbody>' + body + '</tbody></table></div></div></div>' +
      '<div class="card"><div class="card__head"><h2>数据范围</h2></div>' +
        '<div class="card__body"><div class="grid-3">' +
          roleScope('普通员工', '仅本人', '只能查看与操作自己的数据', false) +
          roleScope('组织管理员', '本部门及下级', '可见所辖部门及其子部门的成员与群组', true) +
          roleScope('审计人员', '全员（只读）', '可读全量审计与消息，但无任何写权限', true) +
        '</div></div></div>';
  }

  function roleScope(name, scope, desc, locked){
    return '<div class="stat" style="padding:var(--cf-space-3)">' +
      '<div class="stat__label">' + name + '</div>' +
      '<div style="margin:6px 0 4px"><span class="cf-tag cf-tag--brand">' + scope + '</span></div>' +
      '<div class="stat__note" style="font-size:12px;line-height:1.6">' + desc + '</div>' +
      (locked ? '' : '<button class="cf-btn cf-btn--ghost cf-btn--sm" style="margin-top:6px" data-act="scope-edit">调整范围</button>') +
    '</div>';
  }

  /* ======================================================================
     页面：群组管理（ADM-003）
     ====================================================================== */
  function renderGroups(){
    var list = GROUPS.filter(function(g){
      if(state.groupType !== 'all' && g.type !== state.groupType) return false;
      if(state.groupQ && (g.n + g.owner).toLowerCase().indexOf(state.groupQ.toLowerCase()) < 0) return false;
      return true;
    });

    var gpicked = state.pickedGroups;
    var gall = list.length > 0 && list.every(function(g){ return gpicked.has(g.id); });
    var rows = list.map(function(g){
      var pct = Math.round(g.members / g.cap * 100);
      var capCls = pct >= 90 ? 'cf-tag--danger' : pct >= 70 ? 'cf-tag--warning' : '';
      var actCls = g.active === '高' ? 'cf-tag--success' : g.active === '低' ? '' : 'cf-tag--warning';
      return '<tr data-group-id="' + g.id + '">' +
        '<td class="cell-check"><input type="checkbox" class="cf-check" data-pick-group="' + g.id + '"' +
          (gpicked.has(g.id) ? ' checked' : '') + '></td>' +
        '<td><div class="tbl-user">' + avatar(g.n, '#7F56D9', 28) +
          '<div class="tbl-user__body"><span class="tbl-user__name">' + g.n + '</span>' +
          '<span class="tbl-user__sub">群主 ' + g.owner + '</span></div></div></td>' +
        '<td><span class="cf-tag">' + g.type + '</span></td>' +
        '<td class="cell-num"><span class="cf-tag ' + capCls + '"><span class="num">' + g.members + '</span> / ' + g.cap + '</span>' +
          '<div class="bar-row__track" style="margin-top:4px;height:4px"><div class="bar-row__fill" style="width:' + pct + '%"></div></div></td>' +
        '<td class="cell-num num">' + g.msgs.toLocaleString() + '</td>' +
        '<td><span class="cf-tag ' + actCls + '">' + g.active + '</span></td>' +
        '<td class="num">' + g.created + '</td>' +
        '<td class="cell-actions"><span class="tbl-actions">' +
          '<button class="cf-btn cf-btn--ghost cf-btn--sm" data-act="group-detail">查看</button>' +
          '<button class="cf-btn cf-btn--ghost cf-btn--sm" data-act="group-transfer">' + I.refresh + '</button>' +
          '<button class="cf-btn cf-btn--ghost cf-btn--sm" data-act="group-dismiss" title="强制解散">' + I.trash + '</button>' +
        '</span></td></tr>';
    }).join('');

    var overCap = GROUPS.filter(function(g){ return g.members / g.cap >= 0.7; }).length;

    return pageHead('群组管理', 'ADM-003 · 全局群列表、强制解散、转让、成员调整、群容量监控',
        '<button class="cf-btn cf-btn--secondary" data-act="group-export">' + I.download + '导出列表</button>') +
      '<div class="grid-4" style="margin-bottom:var(--cf-space-4)">' +
        statCard({ label:'群总数', value:'12,806', delta:'+2.4%', dir:'up', note:'较昨日' }) +
        statCard({ label:'容量告警群', value:String(overCap), delta:'需关注', dir:'flat', note:'人数达上限 70%' }) +
        statCard({ label:'近 30 天新建', value:'486', delta:'+8.1%', dir:'up', note:'较上月' }) +
        statCard({ label:'僵尸群（30 天无消息）', value:'1,204', delta:'-3.2%', dir:'up', note:'较上月' }) +
      '</div>' +
      '<div class="card"><div class="filter-bar">' +
        '<label class="cf-input cf-input--search">' + I.search +
          '<input type="search" placeholder="搜索群名或群主" value="' + esc(state.groupQ) + '" data-group-q></label>' +
        '<select class="cf-select" data-group-type>' +
          ['all','内部群','部门群','项目群','外部群','广播群'].map(function(t){
            return '<option value="' + t + '"' + (state.groupType===t?' selected':'') + '>' +
                   (t === 'all' ? '全部类型' : t) + '</option>';
          }).join('') +
        '</select>' +
        '<span class="filter-bar__spacer"></span>' +
        '<span class="cf-tag">共 <span class="num">' + list.length + '</span> 个群</span>' +
      '</div>' +
      '<div class="card__body card__body--flush"><div class="table-wrap"><table class="tbl">' +
        (gpicked.size ? bulkBarHTML('groups') : '') +
        '<thead><tr><th class="cell-check"><input type="checkbox" class="cf-check" data-pick-all="groups"' +
          (gall ? ' checked' : '') + '></th><th>群</th><th>类型</th><th>成员 / 上限</th>' +
        '<th class="cell-num">消息量</th><th>活跃度</th><th>创建时间</th><th class="cell-actions">操作</th></tr></thead>' +
        '<tbody>' + (rows || '<tr><td colspan="8"><div class="empty-state">没有符合条件的群</div></td></tr>') + '</tbody>' +
      '</table></div>' + pager(list.length, 20) + '</div></div>';
  }

  /* ======================================================================
     页面：内容安全（ADM-004）
     ====================================================================== */
  function renderSecurity(){
    var words = WORDS_LOCAL.map(function(w){
      return '<span class="word-chip">' + w + '<button data-word-remove="' + w + '" title="移除">×</button></span>';
    }).join('');

    var policies = POLICIES.map(function(p){
      return '<div style="display:flex;align-items:flex-start;gap:var(--cf-space-3);padding:var(--cf-space-3) 0;border-bottom:1px solid var(--cf-hairline)">' +
        '<div style="flex:1;min-width:0">' +
          '<div style="font-size:13px;line-height:1.5;color:var(--cf-text-primary)">' + p.label + '</div>' +
          '<div class="stat__note" style="font-size:12px;line-height:1.6">' + p.desc + '</div>' +
        '</div>' +
        '<button class="cf-switch' + (p.on ? ' is-on' : '') + '" data-policy="' + p.id + '" role="switch" aria-checked="' + p.on + '"></button>' +
      '</div>';
    }).join('');

    return pageHead('内容安全', 'ADM-004 · 敏感词库（本地/云端）、图片审核、外发管控、链接白名单',
        '<button class="cf-btn cf-btn--secondary" data-act="sync-cloud-words">' + I.refresh + '同步云端词库</button>' +
        '<button class="cf-btn cf-btn--primary" data-act="add-word">' + I.plus + '新增敏感词</button>') +
      '<div class="grid-2">' +
        '<div class="card"><div class="card__head"><h2>本地敏感词库</h2>' +
          '<p>发送前拦截命中词</p><span class="card__spacer"></span>' +
          '<span class="cf-tag">' + WORDS_LOCAL.length + ' 个</span></div>' +
          '<div class="word-list">' + words + '</div></div>' +
        '<div class="card"><div class="card__head"><h2>云端词库</h2>' +
          '<p>平台侧同步，只读</p></div>' +
          '<div class="card__body">' +
            WORDS_CLOUD.map(function(w){
              return '<div style="display:flex;align-items:center;gap:var(--cf-space-3);padding:6px 0">' +
                '<span style="flex:1;font-size:13px">' + w + '</span>' +
                '<span class="cf-tag cf-tag--success">已同步</span></div>';
            }).join('') +
          '</div></div>' +
      '</div>' +
      '<div class="card"><div class="card__head"><h2>审核与管控策略</h2>' +
        '<p>变更会写入审计日志</p></div>' +
        '<div class="card__body" style="padding-top:0">' + policies + '</div></div>';
  }

  /* ======================================================================
     页面：审计日志（ADM-005）
     ====================================================================== */
  function renderAudit(){
    var list = AUDIT.filter(function(a){
      if(state.auditEv !== 'all' && a.ev !== state.auditEv) return false;
      if(state.auditQ && (a.who + a.obj + a.ip).toLowerCase().indexOf(state.auditQ.toLowerCase()) < 0) return false;
      return true;
    });

    var rows = list.map(function(a){
      var ev = AUDIT_EV[a.ev] || { label:a.ev, cls:'' };
      return '<tr>' +
        '<td class="num">' + a.t + '</td>' +
        '<td><div class="tbl-user__body"><span class="tbl-user__name">' + a.who + '</span>' +
          '<span class="tbl-user__sub">' + a.role + '</span></div></td>' +
        '<td><span class="cf-tag ' + ev.cls + '">' + ev.label + '</span></td>' +
        '<td>' + a.obj + '</td>' +
        '<td class="num">' + a.ip + '</td>' +
        '<td>' + (a.result === 'success'
          ? '<span class="cf-tag cf-tag--success">成功</span>'
          : '<span class="cf-tag cf-tag--danger">已拒绝</span>') + '</td>' +
      '</tr>';
    }).join('');

    var evOptions = Object.keys(AUDIT_EV).map(function(k){
      return '<option value="' + k + '"' + (state.auditEv===k?' selected':'') + '>' + AUDIT_EV[k].label + '</option>';
    }).join('');

    return pageHead('审计日志', 'ADM-005 · 登录、敏感操作、消息撤回、文件外发、后台配置变更全量留痕（保留 ≥180 天）',
        '<button class="cf-btn cf-btn--secondary" data-act="audit-export">' + I.download + '导出（需双人授权）</button>') +
      '<div class="card"><div class="filter-bar">' +
        '<label class="cf-input cf-input--search">' + I.search +
          '<input type="search" placeholder="搜索操作人、对象或 IP" value="' + esc(state.auditQ) + '" data-audit-q></label>' +
        '<select class="cf-select" data-audit-ev><option value="all"' + (state.auditEv==='all'?' selected':'') + '>全部事件</option>' + evOptions + '</select>' +
        '<select class="cf-select"><option>近 24 小时</option><option>近 7 天</option><option>近 30 天</option><option>自定义</option></select>' +
        '<span class="filter-bar__spacer"></span>' +
        '<span class="cf-tag">命中 <span class="num">' + list.length + '</span> 条</span>' +
      '</div>' +
      '<div class="card__body card__body--flush"><div class="table-wrap"><table class="tbl">' +
        '<thead><tr><th>时间</th><th>操作人</th><th>事件类型</th><th>对象</th><th>来源 IP</th><th>结果</th></tr></thead>' +
        '<tbody>' + (rows || '<tr><td colspan="6"><div class="empty-state">没有符合条件的日志</div></td></tr>') + '</tbody>' +
      '</table></div>' + pager(list.length, 20) + '</div></div>';
  }

  /* ======================================================================
     页面：消息检索与导出（ADM-006）
     关键约束来自 PRD 8.4：双人授权、用途限定、全量留痕
     ====================================================================== */
  function renderRetrieval(){
    var notice = '<div class="authz-note">' + I.alert +
      '<div><h3>消息检索需双人授权</h3>' +
      '<p>依据《个人信息保护法》与 PRD 8.4：调阅消息须由两名授权人共同确认（申请 + 审批），' +
      '并填写用途。全过程写入审计日志，支持事后复核。</p></div></div>';

    var head = pageHead('消息检索与导出', 'ADM-006 · 授权角色按条件检索 / 导出（双人授权 + 操作留痕）',
        '<button class="cf-btn cf-btn--secondary" data-act="retrieve-history">' + I.file + '我的检索记录</button>');

    if(state.retrieveStage === 'form'){
      return head + notice +
        '<div class="card"><div class="card__head"><h2>检索条件</h2></div>' +
        '<div class="card__body">' +
          '<div class="grid-3">' +
            '<div class="form-row"><span class="form-row__label">会话 / 群</span>' +
              '<label class="cf-input">' + I.search + '<input type="text" placeholder="群名或会话 ID" value="产品群"></label></div>' +
            '<div class="form-row"><span class="form-row__label">发送人</span>' +
              '<label class="cf-input">' + I.search + '<input type="text" placeholder="姓名或工号"></label></div>' +
            '<div class="form-row"><span class="form-row__label">关键词</span>' +
              '<label class="cf-input">' + I.search + '<input type="text" placeholder="消息正文关键词" value="分区表"></label></div>' +
          '</div>' +
          '<div class="grid-3">' +
            '<div class="form-row"><span class="form-row__label">起始时间</span>' +
              '<label class="cf-input"><input type="text" value="2026-09-01 00:00"></label></div>' +
            '<div class="form-row"><span class="form-row__label">结束时间</span>' +
              '<label class="cf-input"><input type="text" value="2026-10-02 23:59"></label></div>' +
            '<div class="form-row"><span class="form-row__label">消息类型</span>' +
              '<select class="cf-select" style="width:100%"><option>全部类型</option><option>文本</option><option>图片</option><option>文件</option></select></div>' +
          '</div>' +
          '<div class="form-row"><span class="form-row__label">检索用途（必填，将写入审计日志）</span>' +
            '<textarea rows="2" placeholder="例如：处理员工举报，需核对 9 月 28 日产品群内的原始表述">处理员工举报，需核对 9 月 28 日产品群内的原始表述</textarea>' +
            '<span class="form-row__hint">用途限定原则：只能用于填写的事由，不得挪作他用</span></div>' +
          '<div style="display:flex;gap:var(--cf-space-2)">' +
            '<button class="cf-btn cf-btn--primary" data-act="retrieve-submit">提交检索申请</button>' +
            '<button class="cf-btn cf-btn--secondary" data-act="retrieve-reset">重置</button>' +
          '</div>' +
        '</div></div>';
    }

    if(state.retrieveStage === 'pending'){
      return head + notice +
        '<div class="card"><div class="card__head"><h2>待第二人审批</h2>' +
          '<span class="card__spacer"></span><span class="cf-tag cf-tag--warning">审批中</span></div>' +
        '<div class="card__body">' +
          '<div class="grid-3" style="margin-bottom:var(--cf-space-4)">' +
            statCard({ label:'申请人', value:'刘二', delta:'审计人员', dir:'flat', note:'10:12 提交' }) +
            statCard({ label:'审批人', value:'陈三', delta:'组织管理员', dir:'flat', note:'待处理' }) +
            statCard({ label:'申请单号', value:'RQ-20261002-014', delta:'用途已限定', dir:'flat', note:'超时 24h 自动失效' }) +
          '</div>' +
          '<div class="form-row"><span class="form-row__label">检索条件摘要</span>' +
            '<div class="cf-tag" style="height:auto;padding:8px 10px;line-height:1.6">会话「产品群」· 关键词「分区表」· 2026-09-01 ~ 2026-10-02 · 文本类型</div></div>' +
          '<div class="form-row"><span class="form-row__label">检索用途</span>' +
            '<div class="cf-tag" style="height:auto;padding:8px 10px;line-height:1.6">处理员工举报，需核对 9 月 28 日产品群内的原始表述</div></div>' +
          '<div style="display:flex;gap:var(--cf-space-2)">' +
            '<button class="cf-btn cf-btn--primary" data-act="retrieve-approve">模拟第二人审批通过</button>' +
            '<button class="cf-btn cf-btn--secondary" data-act="retrieve-cancel">撤销申请</button>' +
          '</div>' +
        '</div></div>';
    }

    var rows = RETRIEVAL_RESULTS.map(function(r){
      return '<tr>' +
        '<td>' + r.conv + '</td>' +
        '<td>' + r.from + '</td>' +
        '<td class="num">' + r.time + '</td>' +
        '<td>' + esc(r.text) + '</td>' +
      '</tr>';
    }).join('');

    return head +
      '<div class="card"><div class="card__head"><h2>检索结果</h2>' +
        '<span class="card__spacer"></span>' +
        '<span class="cf-tag cf-tag--success">已授权 · 单号 RQ-20261002-014</span></div>' +
      '<div class="card__body card__body--flush"><div class="table-wrap"><table class="tbl">' +
        '<thead><tr><th>会话</th><th>发送人</th><th>时间</th><th>内容</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table></div>' +
        '<div class="pager"><span>命中 <span class="num">' + RETRIEVAL_RESULTS.length + '</span> 条</span>' +
        '<span class="pager__spacer"></span>' +
        '<span class="cf-tag cf-tag--warning">导出需再次授权</span>' +
        '<button class="cf-btn cf-btn--secondary cf-btn--sm" data-act="retrieve-export">' + I.download + '导出结果</button>' +
        '<button class="cf-btn cf-btn--ghost cf-btn--sm" data-act="retrieve-reset">结束本次检索</button></div>' +
      '</div></div>';
  }

  /* ======================================================================
     页面：封禁与处置（ADM-010）
     ====================================================================== */
  function renderSanction(){
    var st = { frozen:{ label:'已冻结', cls:'cf-tag--warning' }, blocked:{ label:'已封禁', cls:'cf-tag--danger' } };
    var rows = SANCTIONS.map(function(s){
      return '<tr>' +
        '<td><div class="tbl-user__body"><span class="tbl-user__name">' + s.n + '</span>' +
          '<span class="tbl-user__sub num">' + s.emp + '</span></div></td>' +
        '<td><span class="cf-tag">' + s.type + '</span></td>' +
        '<td>' + s.reason + '</td>' +
        '<td class="num">' + s.until + '</td>' +
        '<td><span class="cf-tag ' + st[s.status].cls + '">' + st[s.status].label + '</span></td>' +
        '<td><div class="tbl-user__body"><span class="tbl-user__name">' + s.op + '</span>' +
          '<span class="tbl-user__sub num">' + s.t + '</span></div></td>' +
        '<td class="cell-actions"><button class="cf-btn cf-btn--ghost cf-btn--sm" data-act="sanction-lift">解除</button></td>' +
      '</tr>';
    }).join('');

    return pageHead('封禁与处置', 'ADM-010 · 账号封禁/解封、IP 限流、设备黑名单',
        '<button class="cf-btn cf-btn--secondary" data-act="sanction-device">' + I.plus + '加入设备黑名单</button>' +
        '<button class="cf-btn cf-btn--danger" data-act="sanction-account">封禁账号</button>') +
      '<div class="grid-4" style="margin-bottom:var(--cf-space-4)">' +
        statCard({ label:'当前封禁账号', value:'2', delta:'待核查 1', dir:'flat', note:'含离职冻结' }) +
        statCard({ label:'IP 限流规则', value:'14', delta:'+2', dir:'down', note:'近 7 天新增' }) +
        statCard({ label:'设备黑名单', value:'6', delta:'—', dir:'flat', note:'累计' }) +
        statCard({ label:'今日拦截登录', value:'27', delta:'+19', dir:'down', note:'异地异常尝试' }) +
      '</div>' +
      '<div class="card"><div class="card__head"><h2>处置记录</h2></div>' +
        '<div class="card__body card__body--flush"><div class="table-wrap"><table class="tbl">' +
        '<thead><tr><th>对象</th><th>类型</th><th>原因</th><th>到期时间</th><th>状态</th><th>操作人</th><th class="cell-actions">操作</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table></div></div></div>';
  }

  /* ======================================================================
     页面：存储与保留（ADM-011）
     ====================================================================== */
  function renderRetention(){
    return pageHead('存储与保留', 'ADM-011 · 消息保留期限、附件生命周期、冷热分层配置',
        '<button class="cf-btn cf-btn--primary" data-act="retention-save">保存策略</button>') +
      '<div class="card"><div class="card__head"><h2>保留期限</h2>' +
        '<p>依据 PRD 8.5：默认 180 天，金融/政务行业可延长至 3 年</p></div>' +
        '<div class="card__body"><div class="grid-2">' +
          retentionRow('消息保留期限', '180 天', '到期后自动清理或归档') +
          retentionRow('审计日志保留', '≥ 180 天', '合规要求，不可短于 180 天') +
          retentionRow('附件生命周期', '与消息同期', '孤儿附件 30 天后清理') +
          retentionRow('冷热分层', '热 30 天 / 冷 180 天', '冷数据转对象存储低频层') +
        '</div></div></div>' +
      '<div class="card"><div class="card__head"><h2>存储用量</h2></div>' +
        '<div class="card__body">' +
          '<div class="bar-row"><span class="bar-row__label">消息数据</span>' +
            '<span class="bar-row__track"><span class="bar-row__fill" style="width:68%"></span></span>' +
            '<span class="bar-row__value num">6.8 TB</span></div>' +
          '<div class="bar-row"><span class="bar-row__label">附件对象存储</span>' +
            '<span class="bar-row__track"><span class="bar-row__fill" style="width:82%"></span></span>' +
            '<span class="bar-row__value num">16.4 TB</span></div>' +
          '<div class="bar-row"><span class="bar-row__label">审计与日志</span>' +
            '<span class="bar-row__track"><span class="bar-row__fill" style="width:24%"></span></span>' +
            '<span class="bar-row__value num">1.2 TB</span></div>' +
        '</div></div>';
  }

  function retentionRow(label, value, desc){
    return '<div class="stat" style="padding:var(--cf-space-3)">' +
      '<div class="stat__label">' + label + '</div>' +
      '<div style="margin:4px 0"><span class="cf-tag cf-tag--brand">' + value + '</span></div>' +
      '<div class="stat__note" style="font-size:12px;line-height:1.6">' + desc + '</div></div>';
  }

  /* ======================================================================
     页面：灰度与开关（ADM-009）
     ====================================================================== */
  function renderGray(){
    var flags = [
      { id:'f1', label:'消息表情回应',      scope:'全员',       on:true,  rollout:100, desc:'MSG-014' },
      { id:'f2', label:'阅后即焚',          scope:'白名单 3 个部门', on:false, rollout:0,  desc:'MSG-015 · P2' },
      { id:'f3', label:'端到端加密（单聊）', scope:'白名单 12 人', on:false, rollout:5,  desc:'8.1 · Signal 双棘轮' },
      { id:'f4', label:'AI 会话摘要',       scope:'产品部',     on:true,  rollout:12, desc:'BOT-006 · P2' },
      { id:'f5', label:'群投票 / 接龙',      scope:'全员',       on:true,  rollout:100, desc:'GRP-014 · P2' },
      { id:'f6', label:'外部联系人',        scope:'未开放',     on:false, rollout:0,  desc:'二期能力' }
    ];
    var rows = flags.map(function(f){
      return '<tr>' +
        '<td><div class="tbl-user__body"><span class="tbl-user__name">' + f.label + '</span>' +
          '<span class="tbl-user__sub" style="font-family:var(--cf-font-mono)">' + f.desc + '</span></div></td>' +
        '<td><span class="cf-tag">' + f.scope + '</span></td>' +
        '<td style="min-width:160px"><div class="bar-row" style="padding:0">' +
          '<span class="bar-row__track"><span class="bar-row__fill" style="width:' + f.rollout + '%"></span></span>' +
          '<span class="bar-row__value num" style="width:44px">' + f.rollout + '%</span></div></td>' +
        '<td><button class="cf-switch' + (f.on ? ' is-on' : '') + '" data-flag="' + f.id + '" role="switch" aria-checked="' + f.on + '"></button></td>' +
        '<td class="cell-actions"><button class="cf-btn cf-btn--ghost cf-btn--sm" data-act="flag-rollback">' + I.refresh + '回滚</button></td>' +
      '</tr>';
    }).join('');

    return pageHead('灰度与开关', 'ADM-009 · 功能开关、按组织/部门/白名单灰度、一键回滚',
        '<button class="cf-btn cf-btn--secondary" data-act="gray-export">' + I.download + '导出配置</button>') +
      '<div class="card"><div class="card__head"><h2>功能开关</h2>' +
        '<p>灰度比例按用户哈希分桶，调整后 5 分钟内生效</p></div>' +
        '<div class="card__body card__body--flush"><div class="table-wrap"><table class="tbl">' +
        '<thead><tr><th>功能</th><th>生效范围</th><th>灰度比例</th><th>开关</th><th class="cell-actions">操作</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table></div></div></div>';
  }

  /* ======================================================================
     页面：公告与 Banner（ADM-007）
     ====================================================================== */
  function renderAnnounce(){
    var st = { published:{ label:'已发布', cls:'cf-tag--success' }, draft:{ label:'草稿', cls:'' } };
    var rows = ANNOUNCE.map(function(a){
      return '<tr data-announce-id="' + a.id + '">' +
        '<td><div class="tbl-user__body"><span class="tbl-user__name">' + a.title + '</span>' +
          '<span class="tbl-user__sub">' + (a.t === '—' ? '未发布' : a.t) + '</span></div></td>' +
        '<td><span class="cf-tag">' + a.scope + '</span></td>' +
        '<td>' + (a.need ? '<span class="cf-tag cf-tag--warning">需确认已读</span>' : '<span class="cf-tag">普通</span>') + '</td>' +
        '<td class="num">' + a.read + '</td>' +
        '<td><span class="cf-tag ' + st[a.status].cls + '">' + st[a.status].label + '</span></td>' +
        '<td class="cell-actions"><span class="tbl-actions">' +
          '<button class="cf-btn cf-btn--ghost cf-btn--sm" data-act="announce-edit">' + I.edit + '</button>' +
          '<button class="cf-btn cf-btn--ghost cf-btn--sm" data-act="announce-read-stat">查看已读</button>' +
        '</span></td></tr>';
    }).join('');

    return pageHead('公告与 Banner', 'ADM-007 · 全员公告、定向公告、强制阅读确认',
        '<button class="cf-btn cf-btn--secondary" data-act="banner-config">Banner 配置</button>' +
        '<button class="cf-btn cf-btn--primary" data-act="announce-new">' + I.plus + '新建公告</button>') +
      '<div class="card"><div class="card__head"><h2>公告列表</h2></div>' +
        '<div class="card__body card__body--flush"><div class="table-wrap"><table class="tbl">' +
        '<thead><tr><th>标题</th><th>范围</th><th>类型</th><th>已读 / 应读</th><th>状态</th><th class="cell-actions">操作</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table></div></div></div>';
  }

/* ======================================================================
     弹窗系统
     ====================================================================== */
  function openModal(kind, payload){
    state.modal = { kind:kind, step:1, payload:payload || {} };
    renderModal();
  }
  function closeModal(){
    state.modal = null;
    renderModal();
  }
  function renderModal(){
    var host = $('#modalHost');
    if(!host) return;
    host.innerHTML = state.modal ? modalHTML(state.modal) : '';
  }
  function modalHTML(m){
    if(m.kind === 'import')      return importModalHTML(m);
    if(m.kind === 'auditExport') return auditExportModalHTML(m);
    if(m.kind === 'handover')    return handoverModalHTML(m);
    if(m.kind === 'memberEdit')  return memberEditModalHTML(m);
    if(m.kind === 'groupDetail') return groupDetailModalHTML(m);
    if(m.kind === 'announceEdit') return announceEditModalHTML(m);
    if(m.kind === 'announceRead') return announceReadModalHTML(m);
    return '';
  }
  function modalShell(title, body, foot, width){
    return '<div class="modal-scrim" data-modal-scrim>' +
      '<div class="modal" role="dialog" aria-modal="true" aria-label="' + title + '"' +
        (width ? ' style="max-width:' + width + '"' : '') + '>' +
        '<div class="modal__head"><h2>' + title + '</h2>' +
          '<button class="cf-btn cf-btn--ghost" data-modal-close title="关闭" style="width:28px;padding:0">✕</button></div>' +
        '<div class="modal__body">' + body + '</div>' +
        '<div class="modal__foot">' + foot + '</div>' +
      '</div></div>';
  }

  /* ---------- 批量导入向导（ADM-001）三步 ---------- */
  function importModalHTML(m){
    var step = m.step || 1;
    var names = ['上传文件','字段映射与校验','导入结果'];
    var stepper = names.map(function(n, i){
      var idx = i + 1;
      return '<div class="step' + (idx === step ? ' is-active' : '') + (idx < step ? ' is-done' : '') + '">' +
        '<span class="step__num">' + (idx < step ? '✓' : idx) + '</span><span>' + n + '</span></div>';
    }).join('<div class="step__line"></div>');

    var body = '';

    if(step === 1){
      body = '<div class="steps">' + stepper + '</div>' +
        (state.importPicked
          ? '<div class="file-chip">' + I.file + '<span class="truncate">' + IMPORT_PREVIEW.fileName + '</span>' +
            '<span class="cf-tag num">' + IMPORT_PREVIEW.total + ' 行</span>' +
            '<button class="cf-btn cf-btn--ghost cf-btn--sm" data-act="import-repick">重新选择</button></div>'
          : '<div class="dropzone" data-act="import-pick">' + I.upload +
            '<p>把 Excel / CSV 文件拖到这里，或 <strong>点击选择文件</strong></p>' +
            '<p class="modal__hint">支持 .xlsx / .csv，单次最多 5000 行</p></div>') +
        '<div style="display:flex;gap:var(--cf-space-2);margin-top:var(--cf-space-3)">' +
          '<button class="cf-btn cf-btn--secondary" data-act="download-template">' + I.download + '下载导入模板</button>' +
          '<button class="cf-btn cf-btn--secondary" data-act="scim-sync">' + I.refresh + '改用 SCIM 同步</button>' +
        '</div>' +
        '<p class="modal__hint" style="margin-top:var(--cf-space-3)">' +
          '工号作为唯一键：已存在的工号会走「更新」，不存在的会新建成员。' +
          '部门需先在组织架构中存在，否则该行会校验失败。</p>';
    }

    if(step === 2){
      var mapRows = IMPORT_PREVIEW.mapping.map(function(r){
        return '<tr><td>' + r.src + '</td>' +
          '<td><code class="mono">' + r.target + '</code></td>' +
          '<td>' + (r.required ? '<span class="cf-tag cf-tag--warning">必填</span>' : '<span class="cf-tag">选填</span>') + '</td>' +
          '<td><span class="cf-tag cf-tag--success">已匹配</span></td></tr>';
      }).join('');
      var errRows = IMPORT_PREVIEW.errors.map(function(e){
        return '<tr><td class="num">第 ' + e.row + ' 行</td><td>' + e.field + '</td>' +
          '<td class="num">' + (e.value || '（空）') + '</td><td>' + e.reason + '</td></tr>';
      }).join('');

      body = '<div class="steps">' + stepper + '</div>' +
        '<div class="grid-4" style="margin-bottom:var(--cf-space-4)">' +
          statCard({ label:'总行数', value:String(IMPORT_PREVIEW.total), delta:'已解析', dir:'flat', note:IMPORT_PREVIEW.fileName }) +
          statCard({ label:'校验通过', value:String(IMPORT_PREVIEW.valid), delta:'可导入', dir:'up', note:'其中新建 118 / 更新 3' }) +
          statCard({ label:'校验失败', value:String(IMPORT_PREVIEW.invalid), delta:'需修正', dir:'down', note:'可下载明细后重传' }) +
          statCard({ label:'预计耗时', value:'12', unit:'秒', delta:'异步执行', dir:'flat', note:'导入过程可离开页面' }) +
        '</div>' +
        '<div class="card"><div class="card__head"><h2>字段映射</h2>' +
          '<p>系统已自动匹配，可手动调整</p></div>' +
          '<div class="card__body card__body--flush"><div class="table-wrap"><table class="tbl">' +
          '<thead><tr><th>文件列</th><th>系统字段</th><th>是否必填</th><th>状态</th></tr></thead>' +
          '<tbody>' + mapRows + '</tbody></table></div></div></div>' +
        '<div class="card"><div class="card__head"><h2>校验失败明细（' + IMPORT_PREVIEW.invalid + '）</h2>' +
          '<span class="card__spacer"></span>' +
          '<button class="cf-btn cf-btn--ghost cf-btn--sm" data-act="download-errors">' + I.download + '下载明细</button></div>' +
          '<div class="card__body card__body--flush"><div class="table-wrap"><table class="tbl">' +
          '<thead><tr><th>位置</th><th>字段</th><th>原始值</th><th>失败原因</th></tr></thead>' +
          '<tbody>' + errRows + '</tbody></table></div></div></div>';
    }

    if(step === 3){
      body = '<div class="steps">' + stepper + '</div>' +
        '<div class="import-done">' +
          '<span class="import-done__icon">' + I.check + '</span>' +
          '<h3>导入完成</h3>' +
          '<p>成功导入 <strong class="num">121</strong> 条（新建 118 / 更新 3），' +
          '跳过 <strong class="num">7</strong> 条校验失败记录</p>' +
        '</div>' +
        '<div class="grid-3" style="margin-top:var(--cf-space-4)">' +
          statCard({ label:'新建成员', value:'118', delta:'已激活', dir:'up', note:'初始密码已短信下发' }) +
          statCard({ label:'更新成员', value:'3', delta:'资料变更', dir:'up', note:'已写入审计日志' }) +
          statCard({ label:'跳过', value:'7', delta:'校验失败', dir:'down', note:'可修正后重新导入' }) +
        '</div>' +
        '<p class="modal__hint" style="margin-top:var(--cf-space-4)">' +
          '导入结果已写入审计日志（ADM-005）；新成员会收到含初始密码的短信，首次登录需强制改密。</p>';
    }

    var foot = '';
    if(step === 1){
      foot = '<span class="modal__spacer"></span>' +
        '<button class="cf-btn cf-btn--secondary" data-modal-close>取消</button>' +
        '<button class="cf-btn cf-btn--primary" data-import-next' + (state.importPicked ? '' : ' disabled') + '>下一步</button>';
    }else if(step === 2){
      foot = '<span class="cf-tag cf-tag--warning">7 条记录将被跳过</span>' +
        '<span class="modal__spacer"></span>' +
        '<button class="cf-btn cf-btn--secondary" data-import-back>上一步</button>' +
        '<button class="cf-btn cf-btn--primary" data-import-run>确认导入 121 条</button>';
    }else{
      foot = '<span class="modal__spacer"></span>' +
        '<button class="cf-btn cf-btn--secondary" data-act="download-errors">' + I.download + '下载失败明细</button>' +
        '<button class="cf-btn cf-btn--primary" data-modal-close>完成</button>';
    }

    return modalShell('批量导入成员', body, foot, '880px');
  }

  /* ---------- 审计日志导出：双人授权（ADM-006 + PRD 8.4） ---------- */
  function auditExportModalHTML(m){
    var step = m.step || 1;
    var notice = '<div class="authz-note">' + I.alert +
      '<div><h3>导出需双人授权</h3>' +
      '<p>依据 PRD 8.4：审计日志导出须由两名授权人共同确认，并填写用途。' +
      '导出文件带动态水印与下载凭证，全过程留痕可复核。</p></div></div>';

    var body = notice, foot = '';

    if(step === 1){
      body +=
        '<div class="form-row"><span class="form-row__label">导出范围</span>' +
          '<div class="cf-tag" style="height:auto;padding:8px 10px;line-height:1.6">' +
            '近 7 天 · 全部事件类型 · 命中 <strong class="num">10</strong> 条</div>' +
          '<span class="form-row__hint">如需调整范围，请先在列表页设置筛选条件</span></div>' +
        '<div class="form-row"><span class="form-row__label">导出格式</span>' +
          '<select class="cf-select" style="width:100%"><option>CSV（推荐，便于二次分析）</option><option>XLSX</option><option>JSON</option></select></div>' +
        '<div class="form-row"><span class="form-row__label">导出用途（必填，将写入审计日志）</span>' +
          '<textarea rows="2" placeholder="例如：配合季度合规审计，需归档 9 月登录与敏感操作记录">配合季度合规审计，需归档 9 月登录与敏感操作记录</textarea></div>';
      foot = '<span class="modal__spacer"></span>' +
        '<button class="cf-btn cf-btn--secondary" data-modal-close>取消</button>' +
        '<button class="cf-btn cf-btn--primary" data-export-submit>提交导出申请</button>';
    }

    if(step === 2){
      body +=
        '<div class="grid-3" style="margin-bottom:var(--cf-space-4)">' +
          statCard({ label:'申请人', value:'陈三', delta:'组织管理员', dir:'flat', note:'刚刚提交' }) +
          statCard({ label:'审批人', value:'刘二', delta:'审计人员', dir:'flat', note:'待处理' }) +
          statCard({ label:'凭证号', value:'EX-20261002-007', delta:'用途已限定', dir:'flat', note:'24h 内有效' }) +
        '</div>' +
        '<p class="modal__hint">授权通过后，下载链接会通过站内消息发送给你，链接 30 分钟后失效且仅可使用一次。</p>';
      foot = '<span class="modal__spacer"></span>' +
        '<button class="cf-btn cf-btn--secondary" data-export-cancel>撤销申请</button>' +
        '<button class="cf-btn cf-btn--primary" data-export-approve>模拟第二人审批通过</button>';
    }

    if(step === 3){
      body +=
        '<div class="import-done">' +
          '<span class="import-done__icon">' + I.check + '</span>' +
          '<h3>已授权</h3>' +
          '<p>凭证号 <strong class="mono">EX-20261002-007</strong> · 有效期至 2026-10-03 18:20</p>' +
        '</div>' +
        '<div class="form-row" style="margin-top:var(--cf-space-4)"><span class="form-row__label">下载</span>' +
          '<div class="file-chip">' + I.file +
            '<span class="truncate">audit_20260926-20261002.csv</span>' +
            '<span class="cf-tag num">86 KB</span>' +
            '<span class="cf-tag cf-tag--warning">含水印</span></div></div>' +
        '<p class="modal__hint">本次导出已写入审计日志：操作人、凭证号、用途、下载时间与 IP 均已记录。</p>';
      foot = '<span class="modal__spacer"></span>' +
        '<button class="cf-btn cf-btn--secondary" data-export-cancel>关闭</button>' +
        '<button class="cf-btn cf-btn--primary" data-act="export-download">' + I.download + '下载（仅一次）</button>';
    }

    return modalShell('导出审计日志', body, foot, '560px');
  }

  /* ---------- 离职交接（ADM-001） ---------- */
  function handoverModalHTML(m){
    var target = MEMBERS.filter(function(x){ return x.id === m.payload.memberId; })[0] || MEMBERS[0];
    var others = MEMBERS.filter(function(x){ return x.id !== target.id && x.status === 'active'; });
    var scopeRows = HANDOVER_SCOPE.map(function(s){
      return '<div class="scope-row">' +
        '<div style="flex:1;min-width:0">' +
          '<div class="scope-row__label">' + s.label + '</div>' +
          '<div class="modal__hint">' + s.desc + '</div>' +
        '</div>' +
        '<button class="cf-switch' + (state.handoverScope[s.id] ? ' is-on' : '') + '" data-scope="' + s.id + '" role="switch" aria-checked="' + !!state.handoverScope[s.id] + '"></button>' +
      '</div>';
    }).join('');

    var opts = others.map(function(o){
      return '<option value="' + o.id + '"' + (state.handoverTo === o.id ? ' selected' : '') + '>' +
             o.n + ' · ' + deptName(o.dept) + ' · ' + o.title + '</option>';
    }).join('');

    var body = '<div class="grid-2" style="margin-bottom:var(--cf-space-4)">' +
        statCard({ label:'离职成员', value:target.n, delta:target.emp, dir:'flat', note:deptName(target.dept) + ' · ' + target.title }) +
        statCard({ label:'最近活跃', value:target.last, delta:'状态 ' + MEMBER_STATUS[target.status].label, dir:'flat', note:'交接后账号转为已离职' }) +
      '</div>' +
      '<div class="form-row"><span class="form-row__label">交接给</span>' +
        '<select class="cf-select" style="width:100%" data-handover-to>' +
          '<option value="">请选择交接人</option>' + opts + '</select>' +
        '<span class="form-row__hint">交接人需为在职成员，且能访问原成员所在的部门</span></div>' +
      '<div class="form-row"><span class="form-row__label">交接范围</span>' +
        '<div class="scope-list">' + scopeRows + '</div></div>' +
      '<div class="authz-note" style="margin-bottom:0">' + I.alert +
        '<div><h3>交接不可逆</h3>' +
        '<p>确认后原成员的会话、群主身份与文件将立即转交，操作写入审计日志。' +
        '历史消息仍可被合规角色检索。</p></div></div>';

    var foot = '<span class="modal__spacer"></span>' +
      '<button class="cf-btn cf-btn--secondary" data-modal-close>取消</button>' +
      '<button class="cf-btn cf-btn--primary" data-handover-confirm>确认交接</button>';

    return modalShell('离职交接', body, foot, '600px');
  }

/* ======================================================================
     批量操作栏（ADM-001 / ADM-003）
     ====================================================================== */
  function bulkBarHTML(kind){
    var isGroup = kind === 'groups';
    var n = isGroup ? state.pickedGroups.size : state.pickedMembers.size;
    var acts = isGroup
      ? [['group-export-sel','导出所选'], ['group-transfer-sel','批量转让'], ['group-dismiss-sel','批量解散']]
      : [['member-freeze','批量冻结'], ['member-unfreeze','批量解冻'],
         ['member-dept','调整部门'], ['member-export-sel','导出所选']];
    return '<div class="bulk-bar">' +
      '<button class="cf-btn cf-btn--ghost cf-btn--sm" data-pick-clear="' + (kind || 'members') + '">取消选择</button>' +
      '<span class="bulk-bar__count">已选 <strong class="num">' + n + '</strong> ' + (isGroup ? '个群' : '人') + '</span>' +
      '<span class="filter-bar__spacer"></span>' +
      acts.map(function(a){
        return '<button class="cf-btn cf-btn--secondary cf-btn--sm" data-bulk="' + a[0] + '">' + a[1] + '</button>';
      }).join('') +
    '</div>';
  }

  /* ======================================================================
     页面：多租户管理（ADM-012 SaaS 版）
     ====================================================================== */
  function renderTenant(){
    var rows = TENANTS.map(function(t){
      var st = TENANT_STATUS[t.status];
      var mPct = Math.round(t.members / t.qMembers * 100);
      var sPct = Math.round(t.storage / t.qStorage * 100);
      var warn = function(p){ return p >= 90 ? 'cf-tag--danger' : p >= 70 ? 'cf-tag--warning' : ''; };
      return '<tr>' +
        '<td><div class="tbl-user">' + avatar(t.n, '#0B6BCB', 28) +
          '<div class="tbl-user__body"><span class="tbl-user__name">' + t.n + '</span>' +
          '<span class="tbl-user__sub">租户管理员 ' + t.owner + '</span></div></div></td>' +
        '<td><span class="cf-tag cf-tag--brand">' + t.plan + '</span></td>' +
        '<td class="cell-num"><span class="cf-tag ' + warn(mPct) + '"><span class="num">' + t.members.toLocaleString() +
          '</span> / ' + t.qMembers.toLocaleString() + '</span>' +
          '<div class="bar-row__track" style="margin-top:4px;height:4px"><div class="bar-row__fill" style="width:' + mPct + '%"></div></div></td>' +
        '<td class="cell-num"><span class="cf-tag ' + warn(sPct) + '"><span class="num">' + t.storage +
          '</span> / ' + t.qStorage + ' TB</span></td>' +
        '<td class="cell-num num">' + t.msgs + ' 万/日</td>' +
        '<td><span class="cf-tag ' + st.cls + '">' + st.label + '</span></td>' +
        '<td class="num">' + t.since + '</td>' +
        '<td class="cell-actions"><span class="tbl-actions">' +
          '<button class="cf-btn cf-btn--ghost cf-btn--sm" data-act="tenant-detail">查看</button>' +
          '<button class="cf-btn cf-btn--ghost cf-btn--sm" data-act="tenant-quota">' + I.edit + '</button>' +
          '<button class="cf-btn cf-btn--ghost cf-btn--sm" data-act="tenant-toggle">' +
            (t.status === 'suspended' ? I.refresh : I.lock) + '</button>' +
        '</span></td></tr>';
    }).join('');

    var plans = Object.keys(PLAN_QUOTA).map(function(k){
      var q = PLAN_QUOTA[k];
      var cnt = TENANTS.filter(function(t){ return t.plan === k; }).length;
      return '<div class="stat" style="padding:var(--cf-space-4)">' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          '<span class="cf-tag cf-tag--brand">' + k + '</span>' +
          '<span class="stat__note">' + cnt + ' 个租户</span></div>' +
        '<div style="margin-top:10px;font-size:13px;line-height:1.9;color:var(--cf-text-secondary)">' +
          '成员上限 <strong class="num">' + q.members.toLocaleString() + '</strong><br>' +
          '存储配额 <strong class="num">' + q.storage + ' TB</strong><br>' +
          '<span style="color:var(--cf-text-primary)">' + q.price + '</span>' +
        '</div></div>';
    }).join('');

    var totalMsg = TENANTS.reduce(function(s, t){ return s + t.msgs; }, 0).toFixed(1);

    return pageHead('多租户管理', 'ADM-012 · 租户开通、隔离、套餐配额、计费计量（SaaS 版）',
        '<button class="cf-btn cf-btn--secondary" data-act="tenant-export">' + I.download + '导出账单</button>' +
        '<button class="cf-btn cf-btn--primary" data-act="tenant-new">' + I.plus + '开通租户</button>') +
      '<div class="grid-4" style="margin-bottom:var(--cf-space-4)">' +
        statCard({ label:'租户总数', value:String(TENANTS.length), delta:'+1', dir:'up', note:'本月新开通' }) +
        statCard({ label:'总成员数', value:TENANTS.reduce(function(s,t){ return s + t.members; }, 0).toLocaleString(), delta:'+3.6%', dir:'up', note:'较上月' }) +
        statCard({ label:'日均消息量', value:totalMsg, unit:'万', delta:'+5.2%', dir:'up', note:'全部租户合计' }) +
        statCard({ label:'配额告警租户', value:String(TENANTS.filter(function(t){ return t.members / t.qMembers >= 0.7; }).length), delta:'需扩容', dir:'flat', note:'成员或存储达 70%' }) +
      '</div>' +
      '<div class="card"><div class="card__head"><h2>租户列表</h2>' +
        '<p>数据按 tenant_id 逻辑隔离，越权访问有专项测试覆盖</p></div>' +
        '<div class="card__body card__body--flush"><div class="table-wrap"><table class="tbl">' +
        '<thead><tr><th>租户</th><th>套餐</th><th>成员 / 上限</th><th>存储 / 配额</th>' +
        '<th class="cell-num">消息量</th><th>状态</th><th>开通时间</th><th class="cell-actions">操作</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table></div></div></div>' +
      '<div class="card"><div class="card__head"><h2>套餐与配额</h2>' +
        '<p>超出配额后自动降级为只读，需管理员扩容</p></div>' +
        '<div class="card__body"><div class="grid-3">' + plans + '</div></div></div>';
  }

  /* ======================================================================
     弹窗：新增 / 编辑成员（ADM-001）
     ====================================================================== */
  function memberEditModalHTML(m){
    var isNew = !m.payload.memberId;
    var mm = isNew ? null : MEMBERS.filter(function(x){ return x.id === m.payload.memberId; })[0];
    mm = mm || {};
    var deptOpts = DEPTS.filter(function(d){ return d.parent; }).map(function(d){
      return '<option value="' + d.id + '"' + (mm.dept === d.id ? ' selected' : '') + '>' + d.name + '</option>';
    }).join('');
    var roleOpts = ROLES.map(function(r){
      return '<option' + (mm.role === r ? ' selected' : '') + '>' + r + '</option>';
    }).join('');

    var body =
      '<div class="grid-2">' +
        '<div class="form-row"><span class="form-row__label">姓名 <span style="color:var(--cf-danger-text)">*</span></span>' +
          '<input type="text" value="' + esc(mm.n || '') + '" placeholder="真实姓名"></div>' +
        '<div class="form-row"><span class="form-row__label">工号 <span style="color:var(--cf-danger-text)">*</span></span>' +
          '<input type="text" value="' + esc(mm.emp || '') + '" placeholder="E1002XX" ' + (isNew ? '' : 'disabled') + '>' +
          (isNew ? '' : '<span class="form-row__hint">工号作为唯一键，创建后不可修改</span>') + '</div>' +
      '</div>' +
      '<div class="grid-2">' +
        '<div class="form-row"><span class="form-row__label">手机号 <span style="color:var(--cf-danger-text)">*</span></span>' +
          '<input type="text" value="' + esc(mm.phone || '') + '" placeholder="11 位手机号"></div>' +
        '<div class="form-row"><span class="form-row__label">邮箱</span>' +
          '<input type="text" placeholder="name@company.com"></div>' +
      '</div>' +
      '<div class="grid-2">' +
        '<div class="form-row"><span class="form-row__label">部门 <span style="color:var(--cf-danger-text)">*</span></span>' +
          '<select class="cf-select" style="width:100%"><option value="">请选择部门</option>' + deptOpts + '</select></div>' +
        '<div class="form-row"><span class="form-row__label">职位</span>' +
          '<input type="text" value="' + esc(mm.title || '') + '" placeholder="如：产品经理"></div>' +
      '</div>' +
      '<div class="grid-2">' +
        '<div class="form-row"><span class="form-row__label">系统角色</span>' +
          '<select class="cf-select" style="width:100%">' + roleOpts + '</select>' +
          '<span class="form-row__hint">角色决定后台权限点，详见「角色权限」</span></div>' +
        '<div class="form-row"><span class="form-row__label">' + (isNew ? '初始密码' : '密码') + '</span>' +
          (isNew
            ? '<select class="cf-select" style="width:100%"><option>短信下发随机密码（推荐）</option><option>手动设置</option></select>'
            : '<button class="cf-btn cf-btn--secondary" data-act="reset-password">' + I.refresh + '重置密码并短信通知</button>') +
        '</div>' +
      '</div>' +
      (isNew
        ? '<div class="authz-note" style="margin-bottom:0">' + I.alert +
          '<div><h3>首次登录强制改密</h3><p>新成员会收到含初始密码的短信，首次登录须修改密码；' +
          '创建动作写入审计日志。</p></div></div>'
        : '');

    var foot = '<span class="modal__spacer"></span>' +
      '<button class="cf-btn cf-btn--secondary" data-modal-close>取消</button>' +
      '<button class="cf-btn cf-btn--primary" data-member-save>' + (isNew ? '创建成员' : '保存变更') + '</button>';

    return modalShell(isNew ? '新增成员' : '编辑成员', body, foot, '640px');
  }

  /* ======================================================================
     弹窗：群详情（ADM-003）
     ====================================================================== */
  function groupDetailModalHTML(m){
    var g = GROUPS.filter(function(x){ return x.id === m.payload.groupId; })[0] || GROUPS[0];
    var pct = Math.round(g.members / g.cap * 100);
    var top = GROUP_TOP.map(function(t, i){
      return '<div class="bar-row">' +
        '<span class="bar-row__label" style="display:flex;align-items:center;gap:6px">' +
          avatar(t.n, t.c, 24) + t.n + '</span>' +
        '<span class="bar-row__track"><span class="bar-row__fill" style="width:' +
          Math.round(t.msgs / GROUP_TOP[0].msgs * 100) + '%"></span></span>' +
        '<span class="bar-row__value num">' + t.msgs.toLocaleString() + '</span></div>';
    }).join('');

    var body =
      '<div class="grid-4" style="margin-bottom:var(--cf-space-4)">' +
        statCard({ label:'群成员', value:g.members.toLocaleString(), delta:'上限 ' + g.cap, dir:'flat', note:'占用 ' + pct + '%' }) +
        statCard({ label:'累计消息', value:g.msgs.toLocaleString(), delta:'建群至今', dir:'flat', note:g.created + ' 创建' }) +
        statCard({ label:'群主', value:g.owner, delta:g.type, dir:'flat', note:'转让需群主确认' }) +
        statCard({ label:'活跃度', value:g.active, delta:'近 7 天', dir:'flat', note:'按消息量评级' }) +
      '</div>' +
      '<div class="card"><div class="card__head"><h2>活跃成员 TOP 5</h2>' +
        '<span class="card__spacer"></span><span class="cf-tag">近 7 天消息量</span></div>' +
        '<div class="card__body">' + top + '</div></div>' +
      '<div class="authz-note" style="margin-top:var(--cf-space-4);margin-bottom:0">' + I.alert +
        '<div><h3>管理操作会通知群主</h3>' +
        '<p>强制解散、转让群主、调整成员都会向群主与管理员发送系统通知，并写入审计日志（ADM-005）。' +
        '解散后会话转为只读并归档，不可恢复。</p></div></div>';

    var foot = '<button class="cf-btn cf-btn--danger" data-act="group-dismiss">' + I.trash + '强制解散</button>' +
      '<button class="cf-btn cf-btn--secondary" data-act="group-transfer">' + I.refresh + '转让群主</button>' +
      '<span class="modal__spacer"></span>' +
      '<button class="cf-btn cf-btn--primary" data-modal-close>关闭</button>';

    return modalShell('群详情 · ' + g.n, body, foot, '720px');
  }

  /* ======================================================================
     弹窗：公告新建 / 编辑（ADM-007）
     ====================================================================== */
  function announceEditModalHTML(m){
    var isNew = !m.payload.id;
    var a = isNew ? {} : (ANNOUNCE.filter(function(x){ return x.id === m.payload.id; })[0] || {});
    var deptOpts = DEPTS.filter(function(d){ return d.parent; }).map(function(d){
      return '<option>' + d.name + '</option>';
    }).join('');

    var body =
      '<div class="form-row"><span class="form-row__label">标题 <span style="color:var(--cf-danger-text)">*</span></span>' +
        '<input type="text" value="' + esc(a.title || '') + '" placeholder="如：Q4 全员大会通知"></div>' +
      '<div class="grid-2">' +
        '<div class="form-row"><span class="form-row__label">发布范围</span>' +
          '<select class="cf-select" style="width:100%">' +
            '<option' + (a.scope === '全员' ? ' selected' : '') + '>全员</option>' +
            '<option' + (a.scope && a.scope !== '全员' ? ' selected' : '') + '>指定部门</option>' +
            '<option>自定义白名单</option></select></div>' +
        '<div class="form-row"><span class="form-row__label">指定部门</span>' +
          '<select class="cf-select" style="width:100%"><option>不限定</option>' + deptOpts + '</select></div>' +
      '</div>' +
      '<div class="form-row"><span class="form-row__label">公告内容 <span style="color:var(--cf-danger-text)">*</span></span>' +
        '<textarea rows="5" placeholder="支持 Markdown 与 @全体成员">' + esc(a.title ? '（示例正文）本次大会将回顾 Q3 成果并公布 Q4 目标，请各部门提前准备汇报材料。' : '') + '</textarea></div>' +
      '<div class="scope-row">' +
        '<div style="flex:1;min-width:0"><div class="scope-row__label">需成员确认已读</div>' +
          '<div class="modal__hint">开启后可统计未读名单，并对未读成员一键提醒</div></div>' +
        '<button class="cf-switch' + (a.need ? ' is-on' : '') + '" data-announce-need role="switch" aria-checked="' + !!a.need + '"></button>' +
      '</div>' +
      '<div class="scope-row">' +
        '<div style="flex:1;min-width:0"><div class="scope-row__label">同时发布为 Banner</div>' +
          '<div class="modal__hint">在客户端会话列表顶部展示 3 天</div></div>' +
        '<button class="cf-switch" data-announce-banner role="switch" aria-checked="false"></button>' +
      '</div>' +
      '<div class="form-row" style="margin-top:var(--cf-space-3)"><span class="form-row__label">定时发布</span>' +
        '<input type="text" value="立即发布" placeholder="留空则立即发布"></div>';

    var foot = '<span class="modal__spacer"></span>' +
      '<button class="cf-btn cf-btn--secondary" data-modal-close>取消</button>' +
      '<button class="cf-btn cf-btn--secondary" data-act="announce-save-draft">存为草稿</button>' +
      '<button class="cf-btn cf-btn--primary" data-announce-publish>' + (isNew ? '立即发布' : '保存并重新发布') + '</button>';

    return modalShell(isNew ? '新建公告' : '编辑公告', body, foot, '640px');
  }

  /* ======================================================================
     弹窗：公告已读名单（ADM-007）
     ====================================================================== */
  function announceReadModalHTML(m){
    var a = ANNOUNCE.filter(function(x){ return x.id === m.payload.id; })[0] || ANNOUNCE[0];
    var total = 1286;
    var read = a.id === 'an1' ? 1204 : 986;
    var unread = total - read;
    var unreadPeople = MEMBERS.slice(0, 5).map(function(x, i){
      return '<div class="modal-row" style="cursor:default">' +
        avatar(x.n, '#7F56D9', 28) +
        '<span class="modal-row__body"><span class="modal-row__name">' + x.n + '</span>' +
        '<span class="modal-row__sub">' + deptName(x.dept) + ' · ' + x.title + '</span></span>' +
        '<span class="cf-tag">未读</span></div>';
    }).join('');

    var body =
      '<div class="read-stat">' +
        '<div class="read-stat__num"><span class="num">' + read.toLocaleString() + '</span><span>已读</span></div>' +
        '<div class="read-stat__num read-stat__num--warn"><span class="num">' + unread + '</span><span>未读</span></div>' +
        '<div class="read-stat__num"><span class="num">' + total.toLocaleString() + '</span><span>应读人数</span></div>' +
      '</div>' +
      '<div class="card"><div class="card__head"><h2>未读名单（示例 ' + unread + ' 人）</h2>' +
        '<span class="card__spacer"></span>' +
        '<button class="cf-btn cf-btn--secondary cf-btn--sm" data-act="announce-remind">提醒未读</button></div>' +
        '<div class="card__body" style="padding:var(--cf-space-2)">' + unreadPeople + '</div></div>' +
      '<p class="modal__hint" style="margin-top:var(--cf-space-3)">' +
        '未读成员下次打开客户端时会看到强提醒（ADM-007 强制阅读确认）。' +
        '「需确认已读」的公告会计入部门合规统计。</p>';

    var foot = '<span class="modal__spacer"></span>' +
      '<button class="cf-btn cf-btn--secondary" data-act="announce-export-read">' + I.download + '导出已读明细</button>' +
      '<button class="cf-btn cf-btn--primary" data-modal-close>关闭</button>';

    return modalShell('已读情况 · ' + a.title, body, foot, '600px');
  }

  /* ======================================================================
     通用
     ====================================================================== */
  function pageHead(title, desc, actions){
    return '<div class="page-head"><div class="page-head__body">' +
      '<h1>' + title + '</h1><p>' + desc + '</p></div>' +
      '<div class="page-head__actions">' + (actions || '') + '</div></div>';
  }

  var PAGES = {
    dashboard: renderDashboard,
    org: renderOrg,
    roles: renderRoles,
    groups: renderGroups,
    security: renderSecurity,
    audit: renderAudit,
    retrieval: renderRetrieval,
    sanction: renderSanction,
    retention: renderRetention,
    gray: renderGray,
    announce: renderAnnounce,
    tenant: renderTenant
  };

  /* ======================================================================
     渲染
     ====================================================================== */
  function navLabel(id){
    for(var i = 0; i < NAV.length; i++){
      for(var j = 0; j < NAV[i].items.length; j++){
        if(NAV[i].items[j].id === id) return NAV[i].items[j];
      }
    }
    return null;
  }

  function renderNav(){
    return NAV.map(function(g){
      return '<div class="adm-nav__group">' + g.group + '</div>' +
        g.items.map(function(it){
          return '<button class="adm-nav__item' + (state.page === it.id ? ' is-active' : '') +
            '" data-nav="' + it.id + '" title="' + it.label + ' · ' + it.prd + '">' +
            I[it.icon] + '<span>' + it.label + '</span>' +
            (it.badge ? '<span class="cf-badge adm-nav__badge">' + it.badge + '</span>' : '') +
          '</button>';
        }).join('');
    }).join('');
  }

  function render(){
    $('#nav').innerHTML = renderNav();
    var item = navLabel(state.page) || { label:'', prd:'' };
    $('#crumb').innerHTML = '控制台 ' + I.chevron + ' <strong>' + item.label + '</strong>' +
      '<span class="cf-tag" style="margin-left:6px">' + item.prd + '</span>';
    $('#content').innerHTML = PAGES[state.page]();
    $('#content').scrollTop = 0;
  }

  function go(page){
    state.page = page;
    state.retrieveStage = 'form';
    render();
  }

  /* ======================================================================
     事件
     ====================================================================== */
  document.addEventListener('click', function(e){
    var hit = function(s){ return e.target.closest(s); };

    var nav = hit('[data-nav]');
    if(nav){ go(nav.dataset.nav); return; }

    var dept = hit('[data-dept]');
    if(dept){ state.dept = dept.dataset.dept; render(); return; }

    // 开关类
    var sw = hit('[data-switch]'); void sw;
    var policy = hit('[data-policy]');
    if(policy){
      var p = POLICIES.filter(function(x){ return x.id === policy.dataset.policy; })[0];
      if(p){ p.on = !p.on; toast('已' + (p.on ? '开启' : '关闭') + '「' + p.label + '」，变更已写入审计日志'); render(); }
      return;
    }
    var flag = hit('[data-flag]');
    if(flag){
      var f = [].concat.apply([], []); void f;
      toast('原型演示：功能开关已切换，5 分钟内生效');
      render();
      return;
    }

    // 权限勾选
    var perm = hit('[data-perm]');
    if(perm){
      var g = PERM_GROUPS.filter(function(x){
        return x.perms.some(function(y){ return y.id === perm.dataset.perm; });
      })[0];
      var pv = g && g.perms.filter(function(y){ return y.id === perm.dataset.perm; })[0];
      if(pv){ pv.allow[+perm.dataset.role] = perm.checked ? 1 : 0; }
      return;
    }

    // 敏感词
    var wrm = hit('[data-word-remove]');
    if(wrm){
      var w = wrm.dataset.wordRemove;
      WORDS_LOCAL.splice(WORDS_LOCAL.indexOf(w), 1);
      toast('已移除敏感词「' + w + '」');
      render();
      return;
    }

    // 检索流程
    if(hit('[data-act="retrieve-submit"]')){ state.retrieveStage = 'pending'; render(); toast('检索申请已提交，等待第二人审批'); return; }
    if(hit('[data-act="retrieve-approve"]')){ state.retrieveStage = 'approved'; render(); toast('审批通过，本次调阅已留痕'); return; }
    if(hit('[data-act="retrieve-cancel"]') || hit('[data-act="retrieve-reset"]')){ state.retrieveStage = 'form'; render(); return; }

    // 批量操作栏
    if(hit('[data-pick-clear]')){
      if(hit('[data-pick-clear]').dataset.pickClear === 'groups') state.pickedGroups = new Set();
      else state.pickedMembers = new Set();
      render();
      return;
    }
    var bulk = hit('[data-bulk]');
    if(bulk){
      var ba = bulk.dataset.bulk;
      var bn = state.pickedMembers.size || state.pickedGroups.size;
      if(ba === 'member-freeze'){
        MEMBERS.forEach(function(mm){ if(state.pickedMembers.has(mm.id)) mm.status = 'frozen'; });
        state.pickedMembers = new Set();
        render();
      }
      var BMAP = {
        'member-freeze':    '已冻结 ' + bn + ' 个账号，对方将无法登录',
        'member-unfreeze':  '已解冻 ' + bn + ' 个账号',
        'member-dept':      '原型演示：批量调整部门（需选择目标部门）',
        'member-export-sel':'已导出所选 ' + bn + ' 名成员',
        'group-export-sel': '已导出所选 ' + bn + ' 个群',
        'group-transfer-sel':'批量转让需各群群主逐一确认',
        'group-dismiss-sel':'批量解散需二次确认，操作不可恢复'
      };
      if(BMAP[ba]) toast(BMAP[ba]);
      return;
    }

    // 公告弹窗内的本地开关
    var anSw = hit('[data-announce-need]') || hit('[data-announce-banner]');
    if(anSw){ anSw.classList.toggle('is-on'); return; }

    // 打开弹窗
    if(hit('[data-act="add-member"]')){ openModal('memberEdit', {}); return; }
    if(hit('[data-act="member-edit"]')){
      var mtr = hit('[data-act="member-edit"]').closest('tr');
      openModal('memberEdit', { memberId: mtr && mtr.dataset.memberId });
      return;
    }
    if(hit('[data-act="group-detail"]')){
      var gtr = hit('[data-act="group-detail"]').closest('tr');
      openModal('groupDetail', { groupId: gtr && gtr.dataset.groupId });
      return;
    }
    if(hit('[data-act="announce-new"]')){ openModal('announceEdit', {}); return; }
    if(hit('[data-act="announce-edit"]')){
      var atr = hit('[data-act="announce-edit"]').closest('tr');
      openModal('announceEdit', { id: atr && atr.dataset.announceId });
      return;
    }
    if(hit('[data-act="announce-read-stat"]')){
      var rtr = hit('[data-act="announce-read-stat"]').closest('tr');
      openModal('announceRead', { id: rtr && rtr.dataset.announceId });
      return;
    }

    // 弹窗内保存
    if(hit('[data-member-save]')){ closeModal(); toast('成员已保存，变更写入审计日志'); return; }
    if(hit('[data-announce-publish]')){ closeModal(); toast('公告已发布，未读成员将收到强提醒'); return; }
    if(hit('[data-act="announce-save-draft"]')){ closeModal(); toast('已存为草稿'); return; }
    if(hit('[data-act="announce-remind"]')){ toast('已向未读成员发送强提醒'); return; }
    if(hit('[data-act="reset-password"]')){ toast('已重置密码，新密码已短信通知本人'); return; }

    // 弹窗
    if(hit('[data-modal-close]')){ closeModal(); return; }
    if(hit('[data-modal-scrim]') && !hit('.modal')){ closeModal(); return; }

    // 导入向导
    if(hit('[data-act="import-members"]')){ state.importPicked = false; openModal('import'); return; }
    if(hit('[data-act="import-pick"]')){ state.importPicked = true; renderModal(); return; }
    if(hit('[data-act="import-repick"]')){ state.importPicked = false; renderModal(); return; }
    if(hit('[data-import-next]')){
      if(!state.importPicked){ toast('请先选择要导入的文件'); return; }
      state.modal.step = 2; renderModal(); return;
    }
    if(hit('[data-import-back]')){ state.modal.step = 1; renderModal(); return; }
    if(hit('[data-import-run]')){
      state.modal.step = 3; renderModal();
      toast('已开始导入，成功 121 条 / 跳过 7 条');
      return;
    }

    // 审计导出双人授权
    if(hit('[data-act="audit-export"]')){ openModal('auditExport'); return; }
    if(hit('[data-export-submit]')){ state.modal.step = 2; renderModal(); toast('导出申请已提交，等待第二人审批'); return; }
    if(hit('[data-export-approve]')){ state.modal.step = 3; renderModal(); toast('审批通过，下载链接已生成'); return; }
    if(hit('[data-export-cancel]')){ closeModal(); return; }

    // 离职交接
    if(hit('[data-act="member-handover"]')){
      state.handoverScope = { conv:true, group:true, file:true, task:false };
      state.handoverTo = '';
      var tr = hit('[data-act="member-handover"]').closest('tr');
      openModal('handover', { memberId: (tr && tr.dataset.memberId) || 'm1' });
      return;
    }
    var sc = hit('[data-scope]');
    if(sc){
      state.handoverScope[sc.dataset.scope] = !state.handoverScope[sc.dataset.scope];
      renderModal();
      return;
    }
    if(hit('[data-handover-confirm]')){
      if(!state.handoverTo){ toast('请先选择交接人'); return; }
      var who = MEMBERS.filter(function(x){ return x.id === state.handoverTo; })[0];
      closeModal();
      toast('已将该成员的会话、群主身份与文件交接给「' + (who ? who.n : '') + '」，操作已留痕');
      return;
    }

    // 主题
    if(hit('[data-theme-toggle]')){
      var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('cf-theme', next); } catch(err) {}
      syncThemeIcon();
      toast('已切换为' + (next === 'dark' ? '深色' : '浅色') + '主题');
      return;
    }

    // 演示动作
    var act = hit('[data-act]');
    if(act){
      var MAP = {
        'refresh':'原型演示：数据已刷新',
        'export-report':'原型演示：日报已生成并发送到你的邮箱',
        'import-members':'原型演示：支持 Excel 导入与 SCIM 同步',
        'sync-hr':'原型演示：已从 HR 系统同步 3 条变更',
        'add-member':'原型演示：打开新增成员表单',
        'dept-add':'原型演示：新增部门',
        'member-edit':'原型演示：编辑成员资料',
        'member-handover':'原型演示：离职交接 —— 将该成员的会话与文件转交指定人',
        'member-more':'原型演示：更多操作',
        'role-import':'原型演示：导入角色权限配置',
        'role-save':'原型演示：权限变更已保存并写入审计日志',
        'scope-edit':'原型演示：调整数据范围',
        'group-export':'原型演示：群列表已导出',
        'group-detail':'原型演示：打开群详情',
        'group-transfer':'原型演示：转让群主需群主确认',
        'group-dismiss':'原型演示：强制解散需二次确认，解散后会话转为只读并归档',
        'sync-cloud-words':'原型演示：云端词库已同步（4 类）',
        'add-word':'原型演示：新增敏感词',
        'audit-export':'原型演示：导出需双人授权，已发起审批',
        'retrieve-history':'原型演示：打开我的检索记录',
        'retrieve-export':'原型演示：导出需再次授权',
        'sanction-lift':'原型演示：已解除处置',
        'sanction-account':'原型演示：封禁账号需填写原因并二次确认',
        'sanction-device':'原型演示：加入设备黑名单',
        'retention-save':'原型演示：保留策略已保存',
        'gray-export':'原型演示：灰度配置已导出',
        'flag-rollback':'原型演示：已一键回滚该功能开关',
        'announce-new':'原型演示：新建公告',
        'announce-edit':'原型演示：编辑公告',
        'announce-read-stat':'原型演示：打开已读名单（未读成员可一键提醒）',
        'banner-config':'原型演示：Banner 配置',
        'download-template':'原型演示：导入模板已下载',
        'download-errors':'原型演示：失败明细已下载',
        'scim-sync':'原型演示：切换到 SCIM 自动同步（需配置 IdP 端点）',
        'export-download':'原型演示：文件已下载，该链接已失效'
      };
      if(MAP[act.dataset.act]) toast(MAP[act.dataset.act]);
      return;
    }
  });

  document.addEventListener('input', function(e){
    if(e.target.matches('[data-member-q]')){
      state.memberQ = e.target.value; render();
      var el = $('[data-member-q]');
      if(el){ el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
      return;
    }
    if(e.target.matches('[data-group-q]')){
      state.groupQ = e.target.value; render();
      var g = $('[data-group-q]');
      if(g){ g.focus(); g.setSelectionRange(g.value.length, g.value.length); }
      return;
    }
    if(e.target.matches('[data-audit-q]')){
      state.auditQ = e.target.value; render();
      var a = $('[data-audit-q]');
      if(a){ a.focus(); a.setSelectionRange(a.value.length, a.value.length); }
    }
  });

  document.addEventListener('change', function(e){
    // 表格复选框（用 change 而非 click，语义更准确）
    if(e.target.matches('[data-pick-member]')){
      var mid = e.target.dataset.pickMember;
      if(state.pickedMembers.has(mid)) state.pickedMembers.delete(mid); else state.pickedMembers.add(mid);
      render(); return;
    }
    if(e.target.matches('[data-pick-group]')){
      var gid = e.target.dataset.pickGroup;
      if(state.pickedGroups.has(gid)) state.pickedGroups.delete(gid); else state.pickedGroups.add(gid);
      render(); return;
    }
    if(e.target.matches('[data-pick-all]')){
      var kind = e.target.dataset.pickAll;
      var sel = kind === 'groups' ? 'tr[data-group-id]' : 'tr[data-member-id]';
      var bag = kind === 'groups' ? state.pickedGroups : state.pickedMembers;
      var ids = $$('#content tbody ' + sel).map(function(tr){
        return kind === 'groups' ? tr.dataset.groupId : tr.dataset.memberId;
      });
      var allOn = ids.length > 0 && ids.every(function(id){ return bag.has(id); });
      ids.forEach(function(id){ allOn ? bag.delete(id) : bag.add(id); });
      render(); return;
    }

    if(e.target.matches('[data-handover-to]')){ state.handoverTo = e.target.value; return; }
    if(e.target.matches('[data-member-status]')){ state.memberStatus = e.target.value; render(); return; }
    if(e.target.matches('[data-group-type]')){ state.groupType = e.target.value; render(); return; }
    if(e.target.matches('[data-audit-ev]')){ state.auditEv = e.target.value; render(); return; }
  });

  /* 主题图标：深色时显示太阳（切回浅色），浅色时显示月亮 */
  var SUN = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
  var MOON = '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';
  function syncThemeIcon(){
    var b = document.getElementById('themeBtn');
    if(!b) return;
    var dark = document.documentElement.dataset.theme === 'dark';
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round">' + (dark ? SUN : MOON) + '</svg>';
    b.title = dark ? '切换到浅色主题' : '切换到深色主题';
  }

  /* 启动：读取已保存的主题 */
  try {
    var savedTheme = localStorage.getItem('cf-theme');
    if(savedTheme === 'dark' || savedTheme === 'light') document.documentElement.dataset.theme = savedTheme;
  } catch(err) {}
  syncThemeIcon();
  render();

})();
