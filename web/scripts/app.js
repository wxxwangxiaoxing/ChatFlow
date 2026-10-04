/* ==========================================================================
   ChatFlow 用户端主应用逻辑
   --------------------------------------------------------------------------
   视图：消息 / 联系人 / 文件 / 收藏 / 设置 / 群设置
   事件统一委托在 #app 上，因此视图可以整体重渲染而不必重复绑定。
   ========================================================================== */
/* ==========================================================================
   图标（内联 SVG，无外部依赖）
   ========================================================================== */
const ICON = {
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  checkDouble:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 12.5L6 17l9-9.5"/><path d="M9 16.5l1.5 1.5L22 6.5"/></svg>',
  alert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><circle cx="12" cy="16.5" r=".6" fill="currentColor"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4h6l-.8 6.2 3.3 3.3H6.5l3.3-3.3z"/><path d="M12 13.5V21"/></svg>',
  bellOff:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.7 5.4A5.5 5.5 0 0 1 17.5 9v3.5l1.5 2.5H9M6.5 9v3.5L5 15h7"/><path d="M3 3l18 18"/></svg>',
  bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8.5a6 6 0 1 0-12 0V15l-1.5 2.5h15L18 15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg>',
  file:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
  image:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5-5-6 6"/></svg>',
  video:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="12" height="12" rx="2"/><path d="M15 10.5l5-3v9l-5-3z"/></svg>',
  link:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',
  download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v11"/><path d="M7.5 10L12 14.5 16.5 10"/><path d="M4 19h16"/></svg>',
  down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',
  phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16.9v2.6a1.6 1.6 0 0 1-1.8 1.6 17 17 0 0 1-7.4-2.6 16.6 16.6 0 0 1-5.1-5.1A17 17 0 0 1 4.1 5.9 1.6 1.6 0 0 1 5.7 4.1h2.6a1.6 1.6 0 0 1 1.6 1.4 10 10 0 0 0 .6 2.2 1.6 1.6 0 0 1-.4 1.7l-1.1 1.1a13.4 13.4 0 0 0 5 5l1.1-1.1a1.6 1.6 0 0 1 1.7-.4 10 10 0 0 0 2.2.6A1.6 1.6 0 0 1 21 16.9z"/></svg>',
  panel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/></svg>',
  smile:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0"/><circle cx="9" cy="10" r=".7" fill="currentColor"/><circle cx="15" cy="10" r=".7" fill="currentColor"/></svg>',
  clip:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11.5l-8 8a5 5 0 0 1-7-7l8-8a3.4 3.4 0 0 1 4.8 4.8l-8 8a1.7 1.7 0 0 1-2.4-2.4l7.2-7.2"/></svg>',
  at:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="3.5"/><path d="M15.5 12v1.8a2.4 2.4 0 0 0 4.8 0V12a8.3 8.3 0 1 0-3.3 6.6"/></svg>',
  send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3L10.5 13.5"/><path d="M21 3l-6.8 18-3.7-7.5L3 9.8z"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.2 9.2 0 0 1-3.2-.6L3 21l1.8-5a8.4 8.4 0 0 1-.8-3.5 8.4 8.4 0 0 1 9-8.4 8.4 8.4 0 0 1 8 7.4z"/></svg>',
  users:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20v-1.6a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20"/><circle cx="9" cy="7.5" r="3.5"/><path d="M22 20v-1.6a4 4 0 0 0-3-3.85M16.5 4.2a4 4 0 0 1 0 7.6"/></svg>',
  folder:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6a2 2 0 0 1 2-2h3.2l1.8 2H18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/></svg>',
  starFill:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/></svg>',
  settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7.5 19.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3.6 14H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 7.5l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 3.6V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.5 1.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>',
  sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  more:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>',
  upload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V10"/><path d="M7.5 14L12 9.5 16.5 14"/><path d="M4 5h16"/></svg>',
  chevron:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
  grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>',
  list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6.5h16M4 12h16M4 17.5h16"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5.5c0 4.2-2.9 8-7 9.5-4.1-1.5-7-5.3-7-9.5V6z"/><path d="M9.2 12l2 2 3.6-3.8"/></svg>',
  monitor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8.5 20.5h7M12 17v3.5"/></svg>',
  phoneSmall:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.5 18.5h3"/></svg>',
  user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/></svg>',
  logo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18V9.5L12 4l8 5.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M9.5 20v-5.5h5V20"/></svg>'
};

/* ==========================================================================
   演示数据
   ========================================================================== */
const conversations = [
  { id:'g1', kind:'group', name:'产品群', members:128,
    colors:['#0B6BCB','#7F56D9','#12B76A','#F79009'],
    last:'李四：撤回时间窗确认一下', time:'14:32', unread:12, mention:true, pinned:true, muted:false, online:true },
  { id:'u1', kind:'single', name:'张三', color:'#7F56D9',
    last:'好的，我下午同步给测试同学', time:'14:08', unread:0, pinned:true, muted:false, online:true,
    draft:'那我把评审时间改到周四？' },
  { id:'g2', kind:'group', name:'设计评审群', members:18,
    colors:['#12B76A','#0BA5EC','#EE46BC','#6172F3'],
    last:'王五：新版的间距体系已经对齐了', time:'昨天', unread:0, pinned:false, muted:true, online:false },
  { id:'b1', kind:'bot', name:'系统通知', color:'#0B6BCB',
    last:'你的账号已在新设备登录', time:'昨天', unread:2, pinned:false, muted:false, online:false },
  { id:'u2', kind:'single', name:'李四', color:'#F79009',
    last:'[文件] IM数据库表结构设计文档.md', time:'周三', unread:0, pinned:false, muted:false, online:false,
    offlineAt:'3 分钟前在线' }
];

const messages = {
  g1: [
    {type:'day', text:'今天'},
    {type:'sys', text:'王五 邀请 赵六 加入了群聊'},
    {type:'group', from:'张三', color:'#7F56D9', online:true, items:[
      {type:'text', text:'需求文档我更新了，第 5 章的功能清单重新排了优先级。'},
      {type:'text', text:'另外 @李四 你确认一下消息撤回的时间窗是 2 分钟还是 5 分钟？', time:'14:26'}
    ]},
    {type:'group', self:true, items:[
      {type:'quote', quoteWho:'张三', quoteText:'需求文档我更新了，第 5 章的功能清单重新排了优先级。',
       text:'我看了。撤回窗默认 2 分钟，管理员可以配到 24 小时。', time:'14:28', status:'read'}
    ]},
    {type:'group', from:'李四', color:'#F79009', offlineAt:'3 分钟前在线', items:[
      {type:'file', name:'IM数据库表结构设计文档.md', size:'55.4 KB', time:'14:30'}
    ]},
    {type:'group', from:'张三', color:'#7F56D9', online:true, items:[
      {type:'text', text:'数据库这块有个问题：MySQL 分区表要求每个唯一索引都包含分区键，按月分区跟 uk_client_msg 冲突。', time:'14:31'},
      {type:'link', title:'MySQL 分区表限制 · 官方文档', desc:'Partitioning Keys, Primary Keys, and Unique Keys — 每个唯一键必须使用分区表达式中的所有列。', time:'14:31'}
    ]},
    {type:'group', self:true, items:[
      {type:'text', text:'对，所以消息表取消了分区，只保留 conv_id 分片。', time:'14:32', status:'sending'}
    ]},
    {type:'group', self:true, items:[
      {type:'text', text:'这条是发送失败的样子，可以点重试。', time:'14:33', status:'failed'}
    ]},
    {type:'group', from:'周八', color:'#6172F3', online:true, items:[
      {type:'image', time:'14:34'},
      {type:'text', text:'会话页的间距标注，点击可看大图。', time:'14:34'}
    ]},
    {type:'group', self:true, items:[
      {type:'call', callType:'audio', status:'answered', dur:'03:24', time:'14:40'}
    ]},
    {type:'typing', from:'张三'}
  ],
  u1: [
    {type:'day', text:'今天'},
    {type:'group', from:'张三', color:'#7F56D9', online:true, items:[
      {type:'text', text:'设计系统文档我看了，三层 token 那部分很实用。', time:'13:52'},
      {type:'text', text:'不过有个疑问：中文为什么不做负字距？我们之前的规范里一直有 -0.02em。', time:'13:53'}
    ]},
    {type:'group', self:true, items:[
      {type:'text', text:'汉字是等宽方块，负字距会让笔画粘连，尤其是小字号下。', time:'13:58', status:'read'},
      {type:'text', text:'英文和数字用 Inter，拉丁字形本身偏宽，负字距是给它们做视觉补偿的。', time:'13:58', status:'read'}
    ]},
    {type:'group', from:'张三', color:'#7F56D9', online:true, items:[
      {type:'text', text:'明白了，那我们只对纯拉丁文案保留负字距。', time:'14:05'}
    ]},
    {type:'group', self:true, items:[
      {type:'text', text:'对，我把这条写进规范了。', time:'14:08', status:'read'}
    ]},
    {type:'group', from:'张三', color:'#7F56D9', online:true, items:[
      {type:'call', callType:'video', status:'missed', dur:'', time:'14:12'}
    ]}
  ],
  g2: [
    {type:'day', text:'昨天'},
    {type:'group', from:'王五', color:'#12B76A', items:[
      {type:'text', text:'新版的间距体系已经对齐了，统一 4px 基数。', time:'昨天 16:20'}
    ]},
    {type:'group', self:true, items:[
      {type:'text', text:'收到，我这边同步更新组件库。', time:'昨天 16:24', status:'read'}
    ]}
  ],
  b1: [
    {type:'day', text:'昨天'},
    {type:'sys', text:'系统通知 · 机器人'},
    {type:'group', from:'系统通知', color:'#0B6BCB', items:[
      {type:'text', text:'你的账号于 10 月 1 日 09:12 在新设备（Windows · Chrome）登录。若非本人操作，请立即修改密码。', time:'昨天 09:12'}
    ]}
  ],
  u2: [
    {type:'day', text:'周三'},
    {type:'group', from:'李四', color:'#F79009', offlineAt:'3 分钟前在线', items:[
      {type:'text', text:'数据库设计文档我转成 SQL 了，你看一下建表语句。', time:'周三 17:40'},
      {type:'file', name:'IM数据库表结构设计文档.md', size:'55.4 KB', time:'周三 17:40'}
    ]},
    {type:'group', self:true, items:[
      {type:'text', text:'好，我跑一遍验证语法。', time:'周三 17:52', status:'read'}
    ]}
  ]
};

const groupMembers = [
  {n:'张三', c:'#7F56D9', on:true},  {n:'李四', c:'#F79009', on:false},
  {n:'王五', c:'#12B76A', on:true},  {n:'赵六', c:'#0BA5EC', on:true},
  {n:'孙七', c:'#EE46BC', on:false}, {n:'周八', c:'#6172F3', on:true},
  {n:'吴九', c:'#0B6BCB', on:false}, {n:'郑十', c:'#F04438', on:true},
  {n:'钱一', c:'#7F56D9', on:false}, {n:'刘二', c:'#12B76A', on:true}
];

const DEPTS = [
  { id:'d0', name:'总部', parent:null, count:81 },
  { id:'d1', name:'产品部', parent:'d0', count:12 },
  { id:'d2', name:'研发部', parent:'d0', count:46 },
  { id:'d3', name:'设计部', parent:'d0', count:8 },
  { id:'d4', name:'市场部', parent:'d0', count:15 }
];

const PEOPLE = [
  { id:'p1', n:'张三', dept:'d1', title:'产品经理',      c:'#7F56D9', on:true,  emp:'E100238', phone:'138****0001', sig:'把复杂的事情说清楚' },
  { id:'p2', n:'李四', dept:'d1', title:'产品经理',      c:'#F79009', on:false, emp:'E100241', phone:'138****0002', sig:'先跑通，再优化' },
  { id:'p3', n:'王五', dept:'d2', title:'后端负责人',    c:'#12B76A', on:true,  emp:'E100102', phone:'138****0003', sig:'消息不丢、不重、不乱序' },
  { id:'p4', n:'赵六', dept:'d2', title:'后端工程师',    c:'#0BA5EC', on:true,  emp:'E100118', phone:'138****0004', sig:'' },
  { id:'p5', n:'孙七', dept:'d2', title:'SRE',           c:'#EE46BC', on:false, emp:'E100126', phone:'138****0005', sig:'容量水位 ≤ 60%' },
  { id:'p6', n:'周八', dept:'d3', title:'UI 设计师',     c:'#6172F3', on:true,  emp:'E100305', phone:'138****0006', sig:'圆角是节奏，不是装饰' },
  { id:'p7', n:'吴九', dept:'d3', title:'交互设计师',    c:'#0B6BCB', on:false, emp:'E100311', phone:'138****0007', sig:'' },
  { id:'p8', n:'郑十', dept:'d4', title:'市场经理',      c:'#F04438', on:true,  emp:'E100402', phone:'138****0008', sig:'' },
  { id:'p9', n:'钱一', dept:'d4', title:'内容运营',      c:'#7F56D9', on:false, emp:'E100415', phone:'138****0009', sig:'' },
  { id:'p10', n:'刘二', dept:'d2', title:'测试工程师',   c:'#12B76A', on:true,  emp:'E100133', phone:'138****0010', sig:'弱网下也要能收到' },
  { id:'p11', n:'陈三', dept:'d1', title:'产品总监',     c:'#0BA5EC', on:true,  emp:'E100201', phone:'138****0011', sig:'' },
  { id:'p12', n:'黄四', dept:'d2', title:'前端工程师',   c:'#F79009', on:true,  emp:'E100145', phone:'138****0012', sig:'中文不加负字距' }
];

const FILES = [
  { id:'f1', n:'IM数据库表结构设计文档.md', ext:'MD',   size:'55.4 KB', type:'doc',   from:'李四',   conv:'产品群',     time:'今天 14:30' },
  { id:'f2', n:'DESIGN.md',                ext:'MD',   size:'44.5 KB', type:'doc',   from:'周八',   conv:'设计评审群', time:'今天 11:20' },
  { id:'f3', n:'会话页原型截图.png',        ext:'PNG',  size:'1.2 MB',  type:'image', from:'周八',   conv:'设计评审群', time:'今天 11:24' },
  { id:'f4', n:'IM总体架构设计文档.md',     ext:'MD',   size:'52.4 KB', type:'doc',   from:'王五',   conv:'产品群',     time:'昨天 17:02' },
  { id:'f5', n:'建表脚本 01_im_schema.sql', ext:'SQL',  size:'44.4 KB', type:'doc',   from:'李四',   conv:'产品群',     time:'昨天 16:41' },
  { id:'f6', n:'评审录屏.mp4',              ext:'MP4',  size:'86.7 MB', type:'video', from:'张三',   conv:'产品群',     time:'昨天 15:10' },
  { id:'f7', n:'MySQL 分区表限制',          ext:'URL',  size:'链接',     type:'link',  from:'张三',   conv:'产品群',     time:'今天 14:31' },
  { id:'f10', n:'会话页间距标注.png',        ext:'PNG',  size:'1.2 MB',  type:'image', from:'周八',   conv:'产品群',     time:'今天 14:34' },
  { id:'f11', n:'设计系统规范 V1.0.md',      ext:'MD',   size:'44.5 KB', type:'doc',   from:'张三',   conv:'张三',       time:'今天 13:52' },
  { id:'f12', n:'中文排版注意事项.md',       ext:'MD',   size:'12.6 KB', type:'doc',   from:'李四',   conv:'李四',       time:'周三 17:45' },
  { id:'f8', n:'间距体系对照图.png',        ext:'PNG',  size:'684 KB',  type:'image', from:'周八',   conv:'设计评审群', time:'昨天 16:22' },
  { id:'f9', n:'需求文档 V1.0.md',          ext:'MD',   size:'51.3 KB', type:'doc',   from:'张三',   conv:'产品群',     time:'周一 10:05' }
];

const FAVS = [
  { id:'v1', who:'张三', c:'#7F56D9', conv:'产品群',     time:'今天 14:31',
    text:'数据库这块有个问题：MySQL 分区表要求每个唯一索引都包含分区键，按月分区跟 uk_client_msg 冲突。' },
  { id:'v2', who:'王五', c:'#12B76A', conv:'产品群',     time:'昨天 17:08',
    text:'存储先行再 ACK 的前提是三道补偿必须都在：消费者重试、死信告警、对账任务。缺一个「不丢」的链条就断了。' },
  { id:'v3', who:'周八', c:'#6172F3', conv:'设计评审群', time:'昨天 16:20',
    text:'圆角跟元素尺寸要配对：控件 6px、容器 12px、大容器 16–20px。32px 高的按钮配 12px 圆角会显得松垮。' },
  { id:'v4', who:'李四', c:'#F79009', conv:'产品群',     time:'周三 17:44',
    text:'sync_log 用按天 RANGE 分区 + DROP PARTITION 清理，不要用 DELETE —— 高频写入表上大范围 DELETE 会造成主从延迟和 binlog 膨胀。' }
];

const DEVICES = [
  { id:'dv1', name:'Windows · Chrome 128', where:'上海', time:'当前在线', now:true,  icon:'monitor' },
  { id:'dv2', name:'iPhone 15 Pro',         where:'上海', time:'2 小时前',  now:false, icon:'phoneSmall' },
  { id:'dv3', name:'macOS · 桌面端 1.4.2',  where:'上海', time:'昨天 21:30', now:false, icon:'monitor' }
];

/* 可交互的设置状态 */
const settings = {
  theme:'light', fontSize:'default', density:'comfortable',
  desktopNotify:true, sound:true, dndEnabled:true, lockPrivacy:'summary',
  phoneVisible:false, externalSearch:true, friendVerify:true
};

/* ==========================================================================
   消息操作相关数据
   ========================================================================== */

/* 常用表情（对应 PRD MSG-014 消息表情回应） */
const QUICK_EMOJI = ['👍','❤️','😄','🎉','👀','🙏'];

/* 表情选择器分组（对应 PRD MSG-014） */
const EMOJI_GROUPS = [
  { name:'常用', list:['👍','👎','❤️','😄','😅','🎉','👀','🙏','✅','❌','🔥','💡','📌','⚠️','🤔','😭'] },
  { name:'表情', list:['😀','😃','😄','😁','😆','😊','🙂','😉','😍','🤩','😘','😗','😙','😚','😋','😛','🤪','😝','🤗','🤭','🤫','🤔','🤐','😐','😑','😶','😏','😒','🙄','😬','😮','😯','😲','😳','🥺','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','🤬','😈','💀','💩','🤡','👻','👽','🤖'] },
  { name:'手势', list:['👋','🤚','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','👇','☝️','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','💪','🦾','✍️','💅'] },
  { name:'符号', list:['✅','☑️','✔️','❌','❎','⭕','❗','❓','⚠️','🚫','💯','🔥','⭐','🌟','✨','⚡','💥','📌','📍','🔔','🔕','📎','🔗','📊','📈','📉','🗓️','⏰','⌛','🎯'] }
];

/* 消息表情回应：key -> [{ emoji, users:[], mine:bool }] */
const reactions = {
  'g1:2:1': [{ emoji:'👍', users:['李四','王五'], mine:false }],
  'g1:4:0': [{ emoji:'👀', users:['张三'], mine:true }, { emoji:'🔥', users:['李四'], mine:false }]
};

/* 群设置数据（对应 PRD GRP 系列） */
const groupSettings = {
  notice:'本周目标：完成消息链路端到端联调。@全体成员 周四 14:00 评审，请提前看 PRD 第 5 章。',
  noticeRequireConfirm:false,
  muteAll:false,
  inviteApproval:false,
  inviteEnabled:true,
  allowMemberAddFriend:true,
  showMemberList:true,
  roamDays:30,
  adminIds:['p3'],
  ownerId:'p1',
  members:[
    { id:'p1', n:'张三', c:'#7F56D9', on:true,  role:3, title:'产品经理',   joined:'2026-03-12' },
    { id:'p3', n:'王五', c:'#12B76A', on:true,  role:2, title:'后端负责人', joined:'2026-03-12' },
    { id:'p2', n:'李四', c:'#F79009', on:false, role:1, title:'产品经理',   joined:'2026-03-14' },
    { id:'p4', n:'赵六', c:'#0BA5EC', on:true,  role:1, title:'后端工程师', joined:'2026-04-02' },
    { id:'p5', n:'孙七', c:'#EE46BC', on:false, role:1, title:'SRE',        joined:'2026-04-18' },
    { id:'p6', n:'周八', c:'#6172F3', on:true,  role:1, title:'UI 设计师',  joined:'2026-05-06' },
    { id:'p7', n:'吴九', c:'#0B6BCB', on:false, role:1, title:'交互设计师', joined:'2026-05-06' },
    { id:'p8', n:'郑十', c:'#F04438', on:true,  role:1, title:'市场经理',   joined:'2026-06-21' },
    { id:'p9', n:'钱一', c:'#7F56D9', on:false, role:1, title:'内容运营',   joined:'2026-07-09' },
    { id:'p10',n:'刘二', c:'#12B76A', on:true,  role:1, title:'测试工程师', joined:'2026-08-15' },
    { id:'p11',n:'陈三', c:'#0BA5EC', on:true,  role:1, title:'产品总监',   joined:'2026-08-15' },
    { id:'p12',n:'黄四', c:'#F79009', on:true,  role:1, title:'前端工程师', joined:'2026-09-01' }
  ]
};

/* 单聊的会话级关系数据（对应 REL-004 备注标签、REL-005 黑名单、REL-002 共同群聊） */
const relations = {
  u1: { remark:'张三（产品）', tags:['产品组','核心成员'], blocked:false, roamDays:30, commonGroups:['g1','g2'] },
  u2: { remark:'',            tags:['研发'],             blocked:false, roamDays:30, commonGroups:['g1'] },
  b1: { remark:'',            tags:[],                  blocked:false, roamDays:30, commonGroups:[] }
};

/* 可选的标签池（REL-004 好友分组/标签） */
const TAG_POOL = ['产品组','研发','设计','市场','核心成员','项目 A','外部联系人','待跟进'];

function relOf(convId){
  if(!relations[convId]){
    relations[convId] = { remark:'', tags:[], blocked:false, roamDays:30, commonGroups:[] };
  }
  return relations[convId];
}

/* 会话的子页面：返回时应回到会话本身 */
function isConvSubView(v){ return v === 'peer' || v === 'group' || v === 'groupFiles' || v === 'groupAlbum'; }

function convName(id){
  const c = conversations.find(x => x.id === id);
  return c ? c.name : id;
}

/* 群相册（GRP-013 相册部分：按时间归档的图片集合） */
const ALBUM = [
  { id:'a01', n:'会话页间距标注.png',   size:'1.2 MB', from:'周八', day:'今天', time:'14:34',    c:'#6172F3' },
  { id:'a02', n:'消息气泡圆角对照.png',  size:'684 KB', from:'周八', day:'今天', time:'11:24',    c:'#7F56D9' },
  { id:'a03', n:'群设置权限分级.png',    size:'892 KB', from:'吴九', day:'今天', time:'10:48',    c:'#0B6BCB' },
  { id:'a04', n:'输入框聚焦态.png',      size:'420 KB', from:'周八', day:'今天', time:'10:12',    c:'#0BA5EC' },
  { id:'a05', n:'会话列表四态.png',      size:'760 KB', from:'吴九', day:'今天', time:'09:36',    c:'#12B76A' },
  { id:'a06', n:'间距体系对照图.png',    size:'684 KB', from:'周八', day:'昨天', time:'16:22',    c:'#0BA5EC' },
  { id:'a07', n:'架构图-消息链路.png',   size:'1.8 MB', from:'王五', day:'昨天', time:'17:10',    c:'#12B76A' },
  { id:'a08', n:'消息投递时序.png',      size:'1.1 MB', from:'王五', day:'昨天', time:'15:40',    c:'#7F56D9' },
  { id:'a09', n:'分片路由示意.png',      size:'640 KB', from:'赵六', day:'昨天', time:'14:05',    c:'#F79009' },
  { id:'a10', n:'灰度发布方案.png',      size:'980 KB', from:'孙七', day:'昨天', time:'11:20',    c:'#6172F3' },
  { id:'a11', n:'数据库 ER 草图.png',    size:'920 KB', from:'李四', day:'本周', time:'周三 17:40', c:'#F79009' },
  { id:'a12', n:'登录页改版对比.png',    size:'1.1 MB', from:'周八', day:'本周', time:'周三 10:12', c:'#EE46BC' },
  { id:'a13', n:'群文件页原型.png',      size:'1.3 MB', from:'周八', day:'本周', time:'周二 16:48', c:'#0B6BCB' },
  { id:'a14', n:'群相册页原型.png',      size:'1.4 MB', from:'吴九', day:'本周', time:'周二 15:20', c:'#12B76A' },
  { id:'a15', n:'通话记录页原型.png',    size:'870 KB', from:'周八', day:'本周', time:'周二 10:05', c:'#F04438' },
  { id:'a16', n:'旧版会话页.png',        size:'780 KB', from:'吴九', day:'更早', time:'9 月 24 日', c:'#0B6BCB' },
  { id:'a17', n:'需求评审白板.png',      size:'2.3 MB', from:'张三', day:'更早', time:'9 月 20 日', c:'#F04438' },
  { id:'a18', n:'登录页旧版.png',        size:'690 KB', from:'周八', day:'更早', time:'9 月 18 日', c:'#7F56D9' },
  { id:'a19', n:'消息气泡旧版.png',      size:'520 KB', from:'吴九', day:'更早', time:'9 月 15 日', c:'#0BA5EC' },
  { id:'a20', n:'组织架构草图.png',      size:'1.1 MB', from:'陈三', day:'更早', time:'9 月 12 日', c:'#12B76A' }
];

/* 通话记录（CALL-005：含时长与接通状态） */
const callLog = [
  { id:'c1', type:'audio', peer:'张三',       kind:'single', status:'answered', dur:'03:24', time:'今天 14:40', dir:'out' },
  { id:'c2', type:'video', peer:'产品群',     kind:'group',  status:'missed',   dur:'',      time:'今天 11:02', dir:'in'  },
  { id:'c3', type:'audio', peer:'李四',       kind:'single', status:'answered', dur:'12:08', time:'昨天 16:35', dir:'in'  },
  { id:'c4', type:'audio', peer:'张三',       kind:'single', status:'canceled', dur:'',      time:'昨天 09:20', dir:'out' },
  { id:'c5', type:'video', peer:'设计评审群', kind:'group',  status:'answered', dur:'26:41', time:'周三 15:00', dir:'out' },
  { id:'c6', type:'audio', peer:'李四',       kind:'single', status:'missed',   dur:'',      time:'周三 10:05', dir:'in'  }
];

/* 通话状态文案 */
const CALL_STATUS = { answered:'已接通', missed:'未接听', canceled:'已取消' };

/* 群公告已读名单（GRP-008 强公告：统计未读名单） */
const noticeReadIds = ['p1','p3','p4','p6','p8','p10','p11'];

/* 入群申请队列（GRP-003 需审批邀请，由群主或管理员处理） */
const joinRequests = [
  { id:'jr1', n:'孙七', c:'#EE46BC', dept:'d2', title:'SRE',     from:'王五', time:'今天 15:20', reason:'参与消息链路联调，需要同步接口变更' },
  { id:'jr2', n:'钱一', c:'#7F56D9', dept:'d4', title:'内容运营', from:'张三', time:'今天 14:02', reason:'需要接收运营排期通知' }
];

/* 入群欢迎语（GRP-017 模板 + 变量） */
const welcome = {
  enabled: true,
  template: '欢迎 {昵称} 加入「{群名}」！我是{邀请人}，有任何问题随时在群里说。群公告里有本群的协作约定，建议先看一眼。'
};

/* 群文件共享空间配额（GRP-012 / GRP-013） */
const groupQuota = { used: 3.2, total: 10 };

/* 公告已读统计 */
function noticeStat(){
  const ms = groupSettings.members;
  const readIds = noticeReadIds.filter(id => ms.some(m => m.id === id));
  return { total: ms.length, readIds: readIds, unread: ms.filter(m => readIds.indexOf(m.id) < 0) };
}

/* 欢迎语变量替换预览 */
function welcomePreview(){
  const conv = conversations.find(c => c.id === state.activeConv) || conversations[0];
  return welcome.template
    .replace(/\{昵称\}/g, '李四')
    .replace(/\{群名\}/g, conv.name)
    .replace(/\{邀请人\}/g, '张三');
}

function groupFilesOf(name){ return FILES.filter(f => f.conv === name); }

/* ==========================================================================
   权限模型（PRD 3.2 权限矩阵）
   --------------------------------------------------------------------------
   角色：1 普通成员 / 2 群管理员 / 3 群主
   关键差异（易错点）：解散群仅群主，管理员不行；移除成员与改群名公告群主+管理员都行。
   ========================================================================== */
const myRole = { g1:1, g2:1 };

const ROLE_NAME = { 1:'成员', 2:'管理员', 3:'群主' };

function myRoleIn(convId){ return myRole[convId] || 1; }

function can(perm, convId){
  const role = myRoleIn(convId || state.activeConv);
  switch(perm){
    case 'group.invite':         return groupSettings.inviteEnabled;          // 普通成员受开关控制
    case 'group.qr':             return role >= 2 || groupSettings.inviteEnabled;
    case 'group.info.edit':      return role >= 2;                            // 群名/群头像
    case 'group.notice.edit':    return role >= 2;                            // 群公告
    case 'group.notice.require': return role >= 2;
    case 'group.member.remove':  return role >= 2;                            // 移除成员
    case 'group.admin.manage':   return role >= 3;                            // 设/取消管理员
    case 'group.transfer':       return role >= 3;                            // 转让群主
    case 'group.dismiss':        return role >= 3;                            // 解散群：管理员也不行
    case 'group.muteAll':        return role >= 2;                            // 全员禁言
    case 'group.policy':         return role >= 2;                            // 群级策略开关
    case 'msg.recall.others':    return role >= 2;                            // 撤回他人消息
    default: return true;
  }
}

/* 无权限时统一在描述后追加说明，而不是直接隐藏 —— 让用户知道有这项、为什么不能用 */
function permNote(perm, need, convId){
  return can(perm, convId) ? '' : `<span class="perm-note">仅${need}可操作</span>`;
}
function lock(perm, convId){ return can(perm, convId) ? '' : 'disabled'; }

/* 演示动作文案表：浮层挂在 document.body 下（不在 #app 内），
   app 级处理器覆盖不到，因此这份表被 app 级与 document 级两处共用 */
const ACT_MSGS = {
      'new-conv':'原型演示：新建会话',
      'more':'原型演示：更多操作',
      'filter':'原型演示：按未读 / @我 筛选',
      'download':'原型演示：开始下载',
      'retry':'原型演示：重新发送这条消息',
      'add-friend':'原型演示：添加好友',
      'tab-groups':'原型演示：切换到我的群聊',
      'profile-full':'原型演示：打开完整资料页',
      'say-hi':'原型演示：发起单聊',
      'upload':'原型演示：选择文件上传',
      'jump':'原型演示：跳转到原文所在会话',
      'unfav':'原型演示：已取消收藏',
      'edit-profile':'原型演示：编辑个人资料',
      'kick':'原型演示：已远程下线该设备',
      'delete-account':'原型演示：账号注销需 7 天冷静期',
      'clear-history':'原型演示：已清空本机聊天记录（对方与漫游消息不受影响）',
      'share-card':'原型演示：已生成名片，可选择分享到会话',
      'report-user':'原型演示：举报已提交，管理员会尽快处理',
      'delete-friend':'原型演示：已删除好友，聊天记录仍保留在本机',
      'remind-unread':'已向未读成员发送强提醒',
      'call-back':'原型演示：正在回拨…'
};

/* ==========================================================================
   全局状态
   ========================================================================== */
const app = document.getElementById('app');
const rail = document.getElementById('rail');
const listPane = document.getElementById('listPane');
const mainPane = document.getElementById('mainPane');
const detailPane = document.getElementById('detailPane');
const toastEl = document.getElementById('toast');

const state = {
  view:'chat',
  activeConv:'g1',
  activeDept:'d1',
  activePerson:null,
  activeFileSource:'all',
  fileType:'all',
  fileLayout:'grid',
  favFilter:'all',
  emptyChat:false,
  showDetail:false,

  /* —— 消息操作 —— */
  multi:false,          // 多选模式
  picked:new Set(),     // 已选中的消息 key
  ctx:null,             // 当前右键菜单上下文 { kind, ... }
  modal:null,           // 当前弹窗 { kind, payload }
  lightbox:null,        // 大图预览
  search:{ open:false, q:'', scope:'all', type:'all' },
  groupTab:'notice',    // 群设置页当前分页
  newGroupPicked:new Set(),
  invitePicked:new Set(),  // 邀请入群已选人员
  groupFileType:'all',     // 群文件类型筛选
  groupFileLayout:'grid',
  callFilter:'all',        // 通话记录筛选
};

/* ==========================================================================
   工具
   ========================================================================== */
function avatarHTML(o, size, opts){
  opts = opts || {};
  if(o.kind === 'group'){
    const cells = (o.colors || []).map(c => `<span style="background:${c}"></span>`).join('');
    return `<span class="cf-avatar cf-avatar--${size} cf-avatar--group">${cells}</span>`;
  }
  const initial = String(o.name || '?').slice(0, 1);
  const dot = o.online
    ? '<span class="cf-presence"></span>'
    : (opts.showOffline ? '<span class="cf-presence cf-presence--off"></span>' : '');
  const square = opts.square ? ' cf-avatar--square' : '';
  return `<span class="cf-avatar cf-avatar--${size}${square}" style="background:${o.color || '#0B6BCB'}">${initial}${dot}</span>`;
}

function personAvatar(p, size, opts){
  return avatarHTML({name:p.n, color:p.c, online:p.on}, size, Object.assign({showOffline:true}, opts));
}

let toastTimer;
function showToast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 2400);
}

function deptName(id){ const d = DEPTS.find(x => x.id === id); return d ? d.name : ''; }
function peopleOf(deptId){
  if(deptId === 'd0') return PEOPLE;
  return PEOPLE.filter(p => p.dept === deptId);
}

/* ==========================================================================
   视图：导航栏
   ========================================================================== */
const NAV = [
  { id:'chat',      icon:'chat',     label:'消息' },
  { id:'contacts',  icon:'users',    label:'联系人' },
  { id:'files',     icon:'folder',   label:'文件' },
  { id:'favorites', icon:'star',     label:'收藏' },
  { id:'settings',  icon:'settings', label:'设置' }
];

function renderRail(){
  const dark = document.documentElement.dataset.theme === 'dark';
  // 会话详情（单聊 / 群聊）都是消息视图的子页面，导航高亮仍落在「消息」上
  const active = isConvSubView(state.view) ? 'chat' : state.view;
  const nav = NAV.map(n => `
    <button class="cf-icon-btn rail__btn${active === n.id ? ' is-active' : ''}"
            data-nav="${n.id}" title="${n.label}" aria-label="${n.label}">
      ${ICON[n.icon]}${n.id === 'chat' ? '<span class="rail__dot"></span>' : ''}
    </button>`).join('');

  rail.innerHTML = `
    <button class="cf-avatar cf-avatar--40" style="background:var(--cf-blue-500)" title="我的账号" data-nav="settings">
      林<span class="cf-presence"></span>
    </button>
    ${nav}
    <div class="rail__spacer"></div>
    <button class="cf-icon-btn rail__btn" data-theme-toggle title="切换主题">${dark ? ICON.sun : ICON.moon}</button>`;
}

/* ==========================================================================
   视图：消息
   ========================================================================== */
function convListHTML(){
  return conversations.filter(c => !c.hidden).map(c => {
    const cls = ['conv'];
    if(c.id === state.activeConv && !state.emptyChat) cls.push('is-active');
    if(c.unread > 0) cls.push('is-unread');
    const flags = [];
    if(c.pinned) flags.push(`<span class="conv__flag" title="已置顶">${ICON.pin}</span>`);
    if(c.muted)  flags.push(`<span class="conv__flag" title="免打扰">${ICON.bellOff}</span>`);

    let summary = c.last;
    if(c.draft) summary = `<span class="conv__draft">[草稿] ${c.draft}</span>`;
    else if(c.mention) summary = `<span class="at">[有人@我]</span> ${summary}`;

    const badge = c.unread > 0
      ? `<span class="cf-badge${c.muted ? ' cf-badge--muted' : ''}">${c.unread > 99 ? '99+' : c.unread}</span>` : '';
    const count = c.kind === 'group' ? ` <span class="conv__count">(${c.members})</span>` : '';
    return `
      <button class="${cls.join(' ')}" data-conv="${c.id}">
        ${avatarHTML(c, 40)}
        <span class="conv__body">
          <span class="conv__row">
            <span class="conv__name">${c.name}${count}</span>
            <span class="conv__time">${c.time}</span>
          </span>
          <span class="conv__summary">${summary}</span>
        </span>
        <span class="conv__tail">${flags.join('')}${badge}</span>
      </button>`;
  }).join('');
}

function renderChatList(){
  listPane.innerHTML = `
    <div class="list-pane__head">
      <div class="list-pane__title">
        <h1>消息</h1>
        <div style="display:flex;gap:2px">
          <button class="cf-icon-btn cf-icon-btn--sm" data-open-new-group title="发起群聊">${ICON.plus}</button>
          <button class="cf-icon-btn cf-icon-btn--sm" data-act="more" title="更多">${ICON.more}</button>
        </div>
      </div>
      <div class="cf-input" data-open-search>${ICON.search}<input type="search" placeholder="搜索会话、联系人或消息" aria-label="搜索" readonly></div>
      <div class="list-pane__tabs">
        <button class="cf-tab is-active">全部</button>
        <button class="cf-tab" data-act="filter">未读</button>
        <button class="cf-tab" data-act="filter">@我</button>
      </div>
    </div>
    <div class="list-pane__body scroll">${convListHTML()}</div>`;
}

function bubbleHTML(item, self){
  const side = self ? 'self' : 'other';
  if(item.type === 'quote'){
    return `<div class="bubble bubble--${side}">
      <div class="quote"><span class="quote__who">${item.quoteWho}</span>
      <span class="quote__text">${item.quoteText}</span></div>${item.text}</div>`;
  }
  if(item.type === 'file'){
    return `<div class="file-card">
      <span class="file-card__icon">${ICON.file}</span>
      <span class="file-card__body">
        <span class="file-card__name">${item.name}</span>
        <span class="file-card__meta">${item.size} · Markdown</span>
      </span>
      <button class="cf-icon-btn cf-icon-btn--sm" data-act="download" title="下载">${ICON.download}</button>
    </div>`;
  }
  if(item.type === 'link'){
    return `<a class="link-card" href="#" onclick="return false">
      <span class="link-card__thumb">${ICON.link}</span>
      <span class="link-card__body">
        <span class="link-card__title">${item.title}</span>
        <span class="link-card__desc">${item.desc}</span>
      </span></a>`;
  }
  if(item.type === 'image') return `<div class="img-msg">${ICON.image}</div>`;
  if(item.type === 'call'){
    const isVideo = item.callType === 'video';
    const label = item.status === 'answered' ? '通话时长 ' + item.dur : CALL_STATUS[item.status];
    return `<div class="msg-call">
      <span class="msg-call__icon">${isVideo ? ICON.video : ICON.phone}</span>
      <span class="msg-call__body">
        <span class="msg-call__title">${isVideo ? '视频通话' : '语音通话'}</span>
        <span class="msg-call__meta${item.status === 'answered' ? '' : ' is-missed'}">${label}</span>
      </span>
      <button class="cf-btn cf-btn--ghost cf-btn--sm" data-act="call-back">回拨</button>
    </div>`;
  }
  return `<div class="bubble bubble--${side}">${item.text}</div>`;
}

function statusHTML(item){
  if(item.status === 'sending') return `<span class="msg-meta"><span class="spinner"></span><span>发送中</span></span>`;
  if(item.status === 'failed')  return `<span class="msg-meta"><span class="fail">${ICON.alert}</span><span class="fail">发送失败</span><button class="msg-retry" data-act="retry">重试</button></span>`;
  if(item.status === 'read')    return `<span class="msg-meta"><span class="read">${ICON.checkDouble}</span><span>已读</span></span>`;
  if(item.status === 'sent')    return `<span class="msg-meta">${ICON.check}<span>已送达</span></span>`;
  return '';
}

/* 表情回应条（PRD MSG-014） */
function reactionRowHTML(key){
  const list = reactions[key];
  if(!list || !list.length) return '';
  return `<div class="reaction-bar">${list.map(r => `
    <button class="reaction${r.mine ? ' is-mine' : ''}" data-react-toggle="${key}" data-emoji="${r.emoji}"
            title="${r.users.join('、')}">
      <span class="reaction__emoji">${r.emoji}</span><span class="num">${r.users.length}</span>
    </button>`).join('')}
    <button class="reaction reaction--add" data-react="${key}" title="添加回应">+</button>
  </div>`;
}

function renderMessages(conv){
  const list = messages[conv.id] || [];
  return list.map((g, gi) => {
    if(g.type === 'day') return `<div class="day-split"><span>${g.text}</span></div>`;
    if(g.type === 'sys') return `<div class="sys-msg"><span>${g.text}</span></div>`;
    if(g.type === 'typing'){
      return `<div class="msg-group">
        ${avatarHTML({name:g.from, color:'#7F56D9', online:true}, 32)}
        <span class="msg-group__col"><span class="typing">
          <span class="typing__dots"><i></i><i></i><i></i></span>
          <span class="typing__text">${g.from} 正在输入…</span>
        </span></span></div>`;
    }
    const self = !!g.self;
    const av = self
      ? avatarHTML({name:'林', color:'#0B6BCB'}, 32)
      : avatarHTML({name:g.from, color:g.color, online:!!g.online}, 32, {showOffline:true});
    const who = (!self && g.from)
      ? `<span class="msg-group__who"><span>${g.from}</span>${g.offlineAt ? `<span>· ${g.offlineAt}</span>` : ''}</span>` : '';

    const items = g.items.map((it, i) => {
      const key = conv.id + ':' + gi + ':' + i;
      const isLast = i === g.items.length - 1;
      const meta = [];
      if(isLast && it.time) meta.push(`<span class="msg-meta"><span>${it.time}</span></span>`);
      if(isLast && it.status) meta.push(statusHTML(it));
      const picked = state.picked.has(key);
      return `<div class="msg-item${picked ? ' is-picked' : ''}" data-msgkey="${key}">
        ${state.multi ? `<span class="msg-item__check" aria-hidden="true"></span>` : ''}
        <div class="msg-item__inner">
          ${bubbleHTML(it, self)}
          ${reactionRowHTML(key)}
          ${meta.join('')}
        </div>
        ${state.multi ? '' : `<button class="msg-item__react" data-react="${key}" title="添加表情回应">${ICON.smile}</button>`}
      </div>`;
    }).join('');

    return `<div class="msg-group${self ? ' msg-group--self' : ''}">
      <span class="msg-group__avatar">${av}</span>
      <span class="msg-group__col">${who}${items}</span></div>`;
  }).join('');
}

function renderChatMain(){
  if(state.emptyChat){
    mainPane.innerHTML = `
      <div class="empty">
        <span class="empty__icon">${ICON.chat}</span>
        <h2>选择一个会话开始沟通</h2>
        <p>左侧列表里的会话会实时同步到你的所有设备。未读消息与 @我 会在列表上标出。</p>
        <button class="cf-btn cf-btn--primary" data-act="pick-conv">打开「产品群」</button>
      </div>`;
    detailPane.innerHTML = '';
    return;
  }
  const conv = conversations.find(c => c.id === state.activeConv) || conversations[0];
  const meta = conv.kind === 'group' ? `${conv.members} 名成员` : (conv.online ? '在线' : (conv.offlineAt || '离线'));
  const sub = conv.kind === 'group' ? '产品群 · ' + meta : meta;

  const picked = state.picked.size;

  const headBody = state.multi
    ? `<span class="pane-head__body">
         <span class="pane-head__title">已选择 <span class="num">${picked}</span> 条</span>
         <span class="pane-head__meta">点击消息可继续选择</span>
       </span>`
    : `<span class="pane-head__body">
        <span class="pane-head__title"><span class="truncate">${conv.name}</span></span>
        <span class="pane-head__meta">${sub}</span>
      </span>`;

  const headActions = state.multi
    ? `<span class="pane-head__actions">
         <button class="cf-btn cf-btn--ghost cf-btn--sm" data-multi-cancel>取消</button>
       </span>`
    : `<span class="pane-head__actions">
        <button class="cf-icon-btn" data-open-search title="搜索会话与消息">${ICON.search}</button>
        <button class="cf-icon-btn" data-call="audio" title="语音通话">${ICON.phone}</button>
        <button class="cf-icon-btn" data-call="video" title="视频通话">${ICON.video}</button>
        <button class="cf-icon-btn${state.showDetail ? ' is-on' : ''}" data-toggle-detail title="会话详情">${ICON.panel}</button>
      </span>`;

  const bottom = state.multi
    ? `<div class="multi-bar">
         <button class="cf-btn cf-btn--ghost cf-btn--sm" data-multi-all>${picked === allMsgKeys(conv).length ? '取消全选' : '全选'}</button>
         <span class="multi-bar__spacer"></span>
         <button class="cf-btn cf-btn--secondary cf-btn--sm" data-multi-forward ${picked ? '' : 'disabled'}>转发</button>
         <button class="cf-btn cf-btn--secondary cf-btn--sm" data-multi-fav ${picked ? '' : 'disabled'}>收藏</button>
         <button class="cf-btn cf-btn--danger cf-btn--sm" data-multi-delete ${picked ? '' : 'disabled'}>删除</button>
       </div>`
    : `<button class="to-bottom" id="toBottom">${ICON.down}<span>回到底部</span></button>
      <div class="composer"><div class="composer__inner"><div class="composer__box" id="composerBox">
        <textarea class="composer__input" id="composerInput" rows="2" placeholder="输入消息，Enter 发送，Shift + Enter 换行"></textarea>
        <div class="composer__bar">
          <button class="cf-icon-btn cf-icon-btn--sm" data-open-emoji title="插入表情">${ICON.smile}</button>
          <button class="cf-icon-btn cf-icon-btn--sm" data-act="attach-file" title="发送文件">${ICON.clip}</button>
          <button class="cf-icon-btn cf-icon-btn--sm" data-act="attach-image" title="插入图片">${ICON.image}</button>
          <button class="cf-icon-btn cf-icon-btn--sm" data-open-mention title="提及成员">${ICON.at}</button>
          <span class="composer__hint"><kbd>Enter</kbd> 发送 · <kbd>Shift</kbd>+<kbd>Enter</kbd> 换行</span>
          <button class="cf-btn cf-btn--primary" id="sendBtn" disabled>${ICON.send}<span>发送</span></button>
        </div>
      </div></div></div>`;

  mainPane.innerHTML = `
    <header class="pane-head">
      <button class="cf-icon-btn pane-head__back" data-mobile-back title="返回">${ICON.back}</button>
      ${headBody}
      ${headActions}
    </header>
    <div class="chat-scroll scroll" id="chatScroll"><div class="chat-body">${renderMessages(conv)}</div></div>
    ${bottom}`;

  renderChatDetail(conv);
  if(!state.multi) bindComposer();
}

function renderChatDetail(conv){
  if(!state.showDetail){ detailPane.innerHTML = ''; return; }
  if(conv.kind === 'group'){
    detailPane.innerHTML = `
      <div class="detail__head"><h2>群详情</h2>
        <button class="cf-icon-btn cf-icon-btn--sm" data-close-detail title="收起">✕</button></div>
      <div class="detail__body scroll">
        <div class="detail__profile">${avatarHTML(conv, 48)}
          <h3>${conv.name}</h3><p>${conv.members} 名成员 · 群主 张三</p></div>
        <div class="detail__section">
          <div class="detail__label"><span>群公告</span><a href="#" onclick="return false">编辑</a></div>
          <div class="notice-box">本周目标：完成消息链路端到端联调。@全体成员 周四 14:00 评审，请提前看 PRD 第 5 章。</div>
        </div>
        <div class="detail__section">
          <div class="detail__label"><span>群成员</span><a href="#" onclick="return false">查看全部</a></div>
          <div class="member-grid">${groupMembers.map(m => `
            <button class="member" data-goto-person="${m.n}">
              <span class="cf-avatar cf-avatar--32" style="background:${m.c}">
                ${m.n.slice(0,1)}${m.on ? '<span class="cf-presence"></span>' : ''}</span>
              <span>${m.n}</span></button>`).join('')}</div>
        </div>
        <div class="detail__section">
          <div class="detail__label"><span>共享文件</span><a href="#" onclick="return false">全部</a></div>
          <div class="notice-box" style="display:flex;align-items:center;gap:var(--cf-space-2)">
            <span style="color:var(--cf-primary);display:flex">${ICON.file}</span>
            <span class="truncate" style="flex:1">IM数据库表结构设计文档.md</span></div>
        </div>
        <button class="cf-btn cf-btn--secondary" style="width:100%" data-open-group-settings>查看完整会话详情</button>
      </div>`;
  }else{
    const p = PEOPLE.find(x => x.n === conv.name) || PEOPLE[0];
    const r = relOf(conv.id);
    const status = p.on ? '在线' : (conv.offlineAt || '离线');
    const groups = r.commonGroups.length
      ? r.commonGroups.map(id => `<button class="link-chip" data-goto-conv="${id}">${convName(id)}</button>`).join('')
      : '<span style="color:var(--cf-text-tertiary)">暂无共同群聊</span>';

    detailPane.innerHTML = `
      <div class="detail__head"><h2>会话详情</h2>
        <button class="cf-icon-btn cf-icon-btn--sm" data-close-detail title="收起">✕</button></div>
      <div class="detail__body scroll">
        <div class="detail__profile">
          ${personAvatar(p, 64)}
          <h3>${r.remark || p.n}</h3>
          <p>${status} · ${deptName(p.dept)} · ${p.title}</p>
          ${p.sig ? `<p style="margin-top:4px">“${p.sig}”</p>` : ''}
        </div>

        <div class="peer-actions">
          <button class="peer-action" data-act="say-hi">${ICON.chat}<span>发消息</span></button>
          <button class="peer-action" data-call="audio">${ICON.phone}<span>语音</span></button>
          <button class="peer-action" data-call="video">${ICON.video}<span>视频</span></button>
        </div>

        <div class="detail__section">
          <div class="detail__label"><span>会话设置</span></div>
          <div class="quick-row"><span>置顶会话</span>${switchHTML(conv.pinned, 'convPin')}</div>
          <div class="quick-row"><span>消息免打扰</span>${switchHTML(conv.muted, 'convMute')}</div>
        </div>

        <div class="detail__section">
          <div class="detail__label"><span>共同群聊</span></div>
          <div class="link-chips">${groups}</div>
        </div>

        <button class="cf-btn cf-btn--secondary" style="width:100%" data-open-peer-detail>查看完整会话详情</button>
      </div>`;
  }
}

function bindComposer(){
  const input = document.getElementById('composerInput');
  const sendBtn = document.getElementById('sendBtn');
  const scroll = document.getElementById('chatScroll');
  const box = document.getElementById('composerBox');
  if(!input) return;

  input.addEventListener('input', () => {
    sendBtn.disabled = input.value.trim() === '';
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 200) + 'px';
  });
  input.addEventListener('keydown', e => {
    if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); if(!sendBtn.disabled) sendBtn.click(); }
  });
  sendBtn.addEventListener('click', () => {
    if(sendBtn.disabled) return;
    showToast('原型演示：消息已进入本地 Outbox，等待服务端 ACK');
    input.value = ''; input.style.height = 'auto'; sendBtn.disabled = true;
  });

  if(scroll){
    scroll.scrollTop = scroll.scrollHeight;
    const toBottom = document.getElementById('toBottom');
    const sync = () => {
      const near = scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight < 120;
      toBottom.style.opacity = near ? '0' : '1';
      toBottom.style.pointerEvents = near ? 'none' : 'auto';
    };
    scroll.addEventListener('scroll', sync);
    toBottom.addEventListener('click', () => scroll.scrollTo({top: scroll.scrollHeight, behavior:'smooth'}));
    sync();
  }
  ['dragenter','dragover'].forEach(ev => box.addEventListener(ev, e => { e.preventDefault(); box.classList.add('is-drag'); }));
  ['dragleave','drop'].forEach(ev => box.addEventListener(ev, e => {
    e.preventDefault(); box.classList.remove('is-drag');
    if(ev === 'drop') showToast('原型演示：文件已加入上传队列');
  }));
}

/* ==========================================================================
   视图：联系人
   ========================================================================== */
function renderContactsList(){
  const tree = DEPTS.map(d => `
    <button class="tree__node${d.parent ? ' tree__node--child' : ''}${state.activeDept === d.id ? ' is-active' : ''}"
            data-dept="${d.id}">
      ${d.parent ? ICON.chevron : ICON.folder}
      <span class="truncate">${d.name}</span>
      <span class="tree__count">${d.count}</span>
    </button>`).join('');

  listPane.innerHTML = `
    <div class="list-pane__head">
      <div class="list-pane__title">
        <h1>联系人</h1>
        <div style="display:flex;gap:2px">
          <button class="cf-icon-btn cf-icon-btn--sm" data-act="add-friend" title="添加好友">${ICON.plus}</button>
          <button class="cf-icon-btn cf-icon-btn--sm" data-act="more" title="更多">${ICON.more}</button>
        </div>
      </div>
      <div class="cf-input">${ICON.search}<input type="search" placeholder="搜索姓名、工号或部门" aria-label="搜索联系人"></div>
      <div class="list-pane__tabs">
        <button class="cf-tab is-active">组织架构</button>
        <button class="cf-tab" data-act="tab-groups">我的群聊</button>
      </div>
    </div>
    <div class="list-pane__body scroll">
      <div class="tree">${tree}</div>
      <div class="tree__group">我的群聊</div>
      <div class="tree">
        ${conversations.filter(c => c.kind === 'group').map(c => `
          <button class="tree__node" data-dept="${c.id}">
            ${avatarHTML(c, 24)}
            <span class="truncate">${c.name}</span>
            <span class="tree__count">${c.members}</span>
          </button>`).join('')}
      </div>
    </div>`;
}

function renderContactsMain(){
  const dept = DEPTS.find(d => d.id === state.activeDept);
  const people = dept ? peopleOf(dept.id) : PEOPLE;
  const title = dept ? dept.name : '总部';
  const sub = dept && dept.parent ? `${people.length} 名成员` : `${PEOPLE.length} 名成员 · 含下级部门`;

  mainPane.innerHTML = `
    <header class="pane-head">
      <button class="cf-icon-btn pane-head__back" data-mobile-back title="返回">${ICON.back}</button>
      <span class="pane-head__body">
        <span class="pane-head__title"><span class="truncate">${title}</span></span>
        <span class="pane-head__meta">${sub}</span>
      </span>
      <span class="pane-head__actions">
        <button class="cf-icon-btn" title="搜索">${ICON.search}</button>
        <button class="cf-icon-btn" title="新建群聊">${ICON.plus}</button>
      </span>
    </header>
    <div class="pane-scroll scroll">
      <div class="pane-body" style="padding-top:var(--cf-space-3)">
        ${people.map(p => `
          <button class="member-row${state.activePerson === p.id ? ' is-active' : ''}" data-person="${p.id}">
            ${personAvatar(p, 32)}
            <span class="member-row__body">
              <span class="member-row__name">${p.n}
                ${p.on ? '' : '<span class="cf-tag">离线</span>'}
              </span>
              <span class="member-row__sub">${deptName(p.dept)} · ${p.title} · <span class="num">${p.emp}</span></span>
            </span>
            <span class="member-row__act">
              <span class="cf-icon-btn cf-icon-btn--sm" title="发消息">${ICON.chat}</span>
            </span>
          </button>`).join('')}
      </div>
    </div>`;

  renderPersonDetail();
}

function renderPersonDetail(){
  const p = PEOPLE.find(x => x.id === state.activePerson);
  if(!p || !state.showDetail){ detailPane.innerHTML = ''; return; }
  detailPane.innerHTML = `
    <div class="detail__head"><h2>个人资料</h2>
      <button class="cf-icon-btn cf-icon-btn--sm" data-close-detail title="收起">✕</button></div>
    <div class="detail__body scroll">
      <div class="detail__profile">${personAvatar(p, 64)}
        <h3>${p.n}</h3>
        <p>${p.on ? '在线' : '离线'}</p>
        ${p.sig ? `<p style="margin-top:4px">“${p.sig}”</p>` : ''}
      </div>
      <div class="detail__section">
        <dl class="info-list">
          <div class="info-row"><dt>部门</dt><dd>${deptName(p.dept)}</dd></div>
          <div class="info-row"><dt>职位</dt><dd>${p.title}</dd></div>
          <div class="info-row"><dt>工号</dt><dd class="num">${p.emp}</dd></div>
          <div class="info-row"><dt>手机号</dt><dd class="num">${settings.phoneVisible ? p.phone : p.phone.replace(/^(\d{3}).*(\d{4})$/, '$1****$2')}</dd></div>
        </dl>
      </div>
      <div class="detail__section">
        <div class="detail__label"><span>共同群聊</span></div>
        <div class="notice-box">产品群、设计评审群</div>
      </div>
      <div style="display:flex;gap:var(--cf-space-2)">
        <button class="cf-btn cf-btn--primary" style="flex:1" data-act="say-hi">发消息</button>
        <button class="cf-btn cf-btn--secondary" data-act="more">${ICON.more}</button>
      </div>
    </div>`;
}

/* ==========================================================================
   视图：文件
   ========================================================================== */
function renderFilesList(){
  const sources = [
    { id:'all', name:'全部文件', count:FILES.length, icon:ICON.folder },
    ...conversations.map(c => ({
      id:c.id, name:c.name, count:FILES.filter(f => f.conv === c.name).length,
      avatar:c
    }))
  ];
  listPane.innerHTML = `
    <div class="list-pane__head">
      <div class="list-pane__title">
        <h1>文件</h1>
        <button class="cf-icon-btn cf-icon-btn--sm" data-act="upload" title="上传文件">${ICON.upload}</button>
      </div>
      <div class="cf-input">${ICON.search}<input type="search" placeholder="搜索文件名" aria-label="搜索文件"></div>
    </div>
    <div class="list-pane__body scroll">
      ${sources.map(s => `
        <button class="tree__node${state.activeFileSource === s.id ? ' is-active' : ''}" data-source="${s.id}">
          ${s.avatar ? avatarHTML(s.avatar, 24) : s.icon}
          <span class="truncate">${s.name}</span>
          <span class="tree__count">${s.count}</span>
        </button>`).join('')}
    </div>`;
}

function filteredFiles(){
  return FILES.filter(f => {
    const src = state.activeFileSource;
    const okSrc = src === 'all' || f.conv === (conversations.find(c => c.id === src) || {}).name;
    const okType = state.fileType === 'all' || f.type === state.fileType;
    return okSrc && okType;
  });
}

function fileThumbIcon(type){
  if(type === 'image') return ICON.image;
  if(type === 'video') return ICON.video;
  if(type === 'link')  return ICON.link;
  return ICON.file;
}

function renderFilesMain(){
  const src = state.activeFileSource === 'all'
    ? '全部文件'
    : (conversations.find(c => c.id === state.activeFileSource) || {}).name;
  const files = filteredFiles();
  const used = 12.4, total = 20, pct = Math.round(used / total * 100);

  const typeTabs = [
    { id:'all',   label:'全部' }, { id:'image', label:'图片' },
    { id:'video', label:'视频' }, { id:'doc',   label:'文档' },
    { id:'link',  label:'链接' }
  ];

  const body = files.length === 0
    ? `<div class="empty"><span class="empty__icon">${ICON.folder}</span>
         <h2>这里还没有文件</h2><p>换一个类型筛选，或从其他会话里查看共享文件。</p></div>`
    : (state.fileLayout === 'grid'
      ? `<div class="file-grid">${files.map(f => `
          <button class="file-tile" data-file="${f.id}">
            <span class="file-tile__thumb">${fileThumbIcon(f.type)}
              <span class="file-tile__ext">${f.ext}</span></span>
            <span class="file-tile__body">
              <span class="file-tile__name">${f.n}</span>
              <span class="file-tile__meta">${f.size} · ${f.conv} · ${f.time}</span>
            </span>
          </button>`).join('')}</div>`
      : `<div class="file-list">${files.map(f => `
          <button class="file-row" data-file="${f.id}">
            <span class="file-card__icon">${fileThumbIcon(f.type)}</span>
            <span class="member-row__body">
              <span class="member-row__name truncate">${f.n}</span>
              <span class="member-row__sub">${f.size} · ${f.from} · ${f.conv} · ${f.time}</span>
            </span>
            <span class="cf-icon-btn cf-icon-btn--sm" title="下载">${ICON.download}</span>
          </button>`).join('')}</div>`);

  mainPane.innerHTML = `
    <header class="pane-head">
      <button class="cf-icon-btn pane-head__back" data-mobile-back title="返回">${ICON.back}</button>
      <span class="pane-head__body">
        <span class="pane-head__title"><span class="truncate">${src}</span></span>
        <span class="pane-head__meta">${files.length} 个文件 · 已用 <span class="num">${used} GB</span> / <span class="num">${total} GB</span></span>
      </span>
      <span class="pane-head__actions">
        <button class="cf-icon-btn${state.fileLayout === 'grid' ? ' is-on' : ''}" data-layout="grid" title="网格视图">${ICON.grid}</button>
        <button class="cf-icon-btn${state.fileLayout === 'list' ? ' is-on' : ''}" data-layout="list" title="列表视图">${ICON.list}</button>
      </span>
    </header>
    <div class="pane-scroll scroll">
      <div class="pane-body">
        <div class="quota" style="margin-bottom:var(--cf-space-5)">
          <div class="quota__top"><span>存储配额</span><span class="num">${pct}%</span></div>
          <div class="quota__bar"><div class="quota__fill" style="width:${pct}%"></div></div>
        </div>
        <div class="list-pane__tabs" style="margin-bottom:var(--cf-space-4)">
          ${typeTabs.map(t => `<button class="cf-tab${state.fileType === t.id ? ' is-active' : ''}" data-filetype="${t.id}">${t.label}</button>`).join('')}
        </div>
        ${body}
      </div>
    </div>`;
  detailPane.innerHTML = '';
}

/* ==========================================================================
   视图：收藏
   ========================================================================== */
function renderFavorites(){
  const filters = [
    { id:'all',  label:'全部' }, { id:'msg',  label:'消息' },
    { id:'file', label:'文件' }, { id:'link', label:'链接' }
  ];
  mainPane.innerHTML = `
    <header class="pane-head">
      <span class="pane-head__inner">
        <span class="pane-head__body">
          <span class="pane-head__title">收藏</span>
          <span class="pane-head__meta">${FAVS.length} 条收藏 · 跨会话保存</span>
        </span>
        <span class="pane-head__actions">
          <div class="cf-input" style="width:220px">${ICON.search}<input type="search" placeholder="搜索收藏" aria-label="搜索收藏"></div>
        </span>
      </span>
    </header>
    <div class="pane-scroll scroll">
      <div class="pane-body">
        <div class="list-pane__tabs" style="margin-bottom:var(--cf-space-4)">
          ${filters.map(f => `<button class="cf-tab${state.favFilter === f.id ? ' is-active' : ''}" data-favfilter="${f.id}">${f.label}</button>`).join('')}
        </div>
        <div class="fav-list">
          ${FAVS.map(v => `
            <div class="fav">
              ${avatarHTML({name:v.who, color:v.c, online:false}, 32)}
              <div class="fav__body">
                <div class="fav__head">
                  <strong>${v.who}</strong><span>·</span><span>${v.conv}</span><span>·</span>
                  <span class="num">${v.time}</span>
                </div>
                <div class="fav__text">${v.text}</div>
                <div class="fav__foot">
                  <button class="cf-btn cf-btn--ghost cf-btn--sm" data-act="jump">跳转到原文</button>
                  <button class="cf-btn cf-btn--ghost cf-btn--sm" data-act="unfav">取消收藏</button>
                </div>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
  detailPane.innerHTML = '';
}

/* ==========================================================================
   视图：设置
   ========================================================================== */
function switchHTML(on, key, disabled){
  return `<button class="cf-switch${on ? ' is-on' : ''}" data-switch="${key}"
    role="switch" aria-checked="${on}" aria-label="${key}"${disabled ? ' disabled' : ''}></button>`;
}
function segmentHTML(options, current, key){
  return `<div class="cf-segment">${options.map(o =>
    `<button class="${o.id === current ? 'is-active' : ''}" data-seg="${key}" data-val="${o.id}">${o.label}</button>`
  ).join('')}</div>`;
}

function renderSettings(){
  mainPane.innerHTML = `
    <header class="pane-head">
      <span class="pane-head__inner">
        <span class="pane-head__body">
          <span class="pane-head__title">设置</span>
          <span class="pane-head__meta">账号、外观、通知与隐私</span>
        </span>
      </span>
    </header>
    <div class="pane-scroll scroll">
      <div class="set-wrap">

        <div class="set-card">
          <div class="set-profile">
            <span class="cf-avatar cf-avatar--64" style="background:var(--cf-blue-500)">林<span class="cf-presence"></span></span>
            <span class="set-profile__body">
              <span class="set-profile__name">林一</span>
              <span class="set-profile__desc">产品部 · 产品经理 · 工号 <span class="num">E100201</span></span>
              <span class="set-profile__desc">把复杂的事情说清楚</span>
            </span>
            <button class="cf-btn cf-btn--secondary" data-act="edit-profile">编辑</button>
          </div>
        </div>

        <div class="set-card">
          <div class="set-card__head">外观</div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">主题</div>
              <div class="set-row__desc">跟随系统时会读取操作系统的深浅色设置</div>
            </div>
            <div class="set-row__control">
              ${segmentHTML([{id:'light',label:'浅色'},{id:'dark',label:'深色'},{id:'auto',label:'跟随系统'}], settings.theme, 'theme')}
            </div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">消息字号</div>
              <div class="set-row__desc">影响消息正文与列表摘要</div>
            </div>
            <div class="set-row__control">
              ${segmentHTML([{id:'small',label:'小'},{id:'default',label:'标准'},{id:'large',label:'大'}], settings.fontSize, 'fontSize')}
            </div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">紧凑密度</div>
              <div class="set-row__desc">缩小间距与行高，同屏显示更多内容</div>
            </div>
            <div class="set-row__control">
              ${segmentHTML([{id:'comfortable',label:'舒适'},{id:'compact',label:'紧凑'}], settings.density, 'density')}
            </div>
          </div>
        </div>

        <div class="set-card">
          <div class="set-card__head">通知</div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">桌面通知</div>
              <div class="set-row__desc">应用在后台时推送系统通知</div>
            </div>
            <div class="set-row__control">${switchHTML(settings.desktopNotify, 'desktopNotify')}</div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">通知声音</div>
              <div class="set-row__desc">免打扰会话不受影响</div>
            </div>
            <div class="set-row__control">${switchHTML(settings.sound, 'sound')}</div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">免打扰时段</div>
              <div class="set-row__desc">22:00 – 08:00 期间不产生任何通知，消息照常接收</div>
            </div>
            <div class="set-row__control">${switchHTML(settings.dndEnabled, 'dndEnabled')}</div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">锁屏消息内容</div>
              <div class="set-row__desc">控制锁屏与系统通知里显示的信息量</div>
            </div>
            <div class="set-row__control">
              ${segmentHTML([{id:'summary',label:'显示摘要'},{id:'title',label:'仅显示新消息'},{id:'hidden',label:'隐藏内容'}], settings.lockPrivacy, 'lockPrivacy')}
            </div>
          </div>
        </div>

        <div class="set-card">
          <div class="set-card__head">隐私</div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">手机号可见</div>
              <div class="set-row__desc">关闭后其他成员只能看到脱敏手机号</div>
            </div>
            <div class="set-row__control">${switchHTML(settings.phoneVisible, 'phoneVisible')}</div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">允许组织外搜索到我</div>
              <div class="set-row__desc">关闭后仅本组织成员可通过工号或姓名找到你</div>
            </div>
            <div class="set-row__control">${switchHTML(settings.externalSearch, 'externalSearch')}</div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">加好友需要验证</div>
              <div class="set-row__desc">关闭后任何人可直接添加你为好友</div>
            </div>
            <div class="set-row__control">${switchHTML(settings.friendVerify, 'friendVerify')}</div>
          </div>
        </div>

        <div class="set-card">
          <div class="set-card__head">账号安全</div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">修改密码</div>
              <div class="set-row__desc">上次修改：3 个月前</div>
            </div>
            <div class="set-row__control">
              <span class="cf-icon-btn cf-icon-btn--sm" style="opacity:1">${ICON.chevron}</span>
            </div>
          </div>
          <div class="set-row" style="align-items:flex-start;flex-direction:column;gap:var(--cf-space-3)">
            <div class="set-row__body" style="width:100%">
              <div class="set-row__label">登录设备</div>
              <div class="set-row__desc">同账号最多同时登录 4 端，可远程下线</div>
            </div>
            <div style="width:100%;display:flex;flex-direction:column;gap:var(--cf-space-2)">
              ${DEVICES.map(d => `
                <div style="display:flex;align-items:center;gap:var(--cf-space-3);
                     padding:var(--cf-space-2) var(--cf-space-3);
                     background:var(--cf-surface-2);border-radius:var(--cf-radius-sm)">
                  <span style="color:var(--cf-text-tertiary);display:flex">${ICON[d.icon]}</span>
                  <span style="flex:1;min-width:0">
                    <span style="display:block;font-size:13px;line-height:1.5">${d.name}</span>
                    <span style="display:block;font-size:12px;line-height:1.5;color:var(--cf-text-tertiary)">
                      ${d.where} · <span class="num">${d.time}</span></span>
                  </span>
                  ${d.now
                    ? '<span class="cf-tag cf-tag--brand">当前设备</span>'
                    : `<button class="cf-btn cf-btn--ghost cf-btn--sm" data-act="kick">下线</button>`}
                </div>`).join('')}
            </div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label" style="color:var(--cf-danger-text)">注销账号</div>
              <div class="set-row__desc">注销后 7 天冷静期内登录可撤销，到期后数据按合规策略删除</div>
            </div>
            <div class="set-row__control">
              <button class="cf-btn cf-btn--danger cf-btn--sm" data-act="delete-account">注销</button>
            </div>
          </div>
        </div>

        <div class="set-card">
          <div class="set-card__head">关于</div>
          <div class="set-row">
            <div class="set-row__body"><div class="set-row__label">版本</div></div>
            <div class="set-row__control"><span class="num" style="font-size:13px;color:var(--cf-text-tertiary)">1.0.0 (2026.10.01)</span></div>
          </div>
          <div class="set-row">
            <div class="set-row__body"><div class="set-row__label">隐私政策</div></div>
            <div class="set-row__control"><a href="#" onclick="return false">查看</a></div>
          </div>
          <div class="set-row">
            <div class="set-row__body"><div class="set-row__label">用户协议</div></div>
            <div class="set-row__control"><a href="#" onclick="return false">查看</a></div>
          </div>
        </div>

      </div>
    </div>`;
  detailPane.innerHTML = '';
}

/* ==========================================================================
   路由
   ========================================================================== */
const VIEWS = {
  chat:      { list: renderChatList,      main: renderChatMain },
  peer:      { list: renderChatList,      main: renderPeerDetail },      // 单聊会话详情
  group:     { list: renderChatList,      main: renderGroupSettings },   // 群聊会话详情
  groupFiles:{ list: renderChatList,      main: renderGroupFiles },      // 群文件分类页
  groupAlbum:{ list: renderChatList,      main: renderGroupAlbum },      // 群相册
  contacts:  { list: renderContactsList,  main: renderContactsMain },
  files:     { list: renderFilesList,     main: renderFilesMain },
  favorites: { list: null,                main: renderFavorites },
  settings:  { list: null,                main: renderSettings }
};

function render(){
  app.dataset.view = state.view;
  app.classList.toggle('detail-open', state.showDetail && (state.view === 'chat' || state.view === 'contacts'));
  app.classList.toggle('mobile-list', app.dataset.mobile === 'list');
  app.classList.toggle('mobile-main', app.dataset.mobile === 'main');
  app.classList.toggle('is-multi', !!state.multi);

  renderRail();
  const v = VIEWS[state.view];
  if(v.list) v.list(); else listPane.innerHTML = '';
  v.main();

  // 详情面板仅在有内容时才占位
  const detailHasContent = detailPane.innerHTML.trim() !== '';
  app.classList.toggle('detail-open', state.showDetail && detailHasContent);
  syncProto();
}

function go(view){
  state.view = view;
  state.showDetail = (view === 'chat' || view === 'contacts') && window.innerWidth >= 1440;
  // 离开消息视图时退出多选，避免状态残留
  if(view !== 'chat'){ state.multi = false; state.picked = new Set(); }
  closeCtx(); closeEmojiPop();
  // 收藏与设置没有列表面板，移动态直接进主区
  app.dataset.mobile = (view === 'favorites' || view === 'settings') ? 'main' : 'list';
  render();
}

function syncProto(){
  const d = document.querySelector('[data-proto="detail"]');
  const e = document.querySelector('[data-proto="empty"]');
  const n = document.querySelector('[data-proto="dense"]');
  const t = document.querySelector('[data-proto="dark"]');
  if(d){
    d.classList.toggle('is-on', state.showDetail);
    d.disabled = !(state.view === 'chat' || state.view === 'contacts');
  }
  if(e){
    e.classList.toggle('is-on', state.emptyChat);
    e.disabled = state.view !== 'chat';
  }
  if(n) n.classList.toggle('is-on', settings.density === 'compact');
  if(t) t.classList.toggle('is-on', document.documentElement.dataset.theme === 'dark');
  const role = myRoleIn(state.activeConv);
  document.querySelectorAll('[data-role]').forEach(b => b.classList.toggle('is-on', +b.dataset.role === role));
}

function applyDensity(){
  const compact = settings.density === 'compact';
  document.documentElement.style.setProperty('--cf-space-3', compact ? '8px' : '12px');
  document.documentElement.style.setProperty('--cf-space-4', compact ? '12px' : '16px');
}

function applyTheme(){
  let t = settings.theme;
  if(t === 'auto'){
    t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.dataset.theme = t;
}

/* ==========================================================================
   事件（统一委托在 .app 上）
   ========================================================================== */
app.addEventListener('click', e => {
  const hit = sel => e.target.closest(sel);

  // 导航
  const nav = hit('[data-nav]');
  if(nav){ go(nav.dataset.nav); return; }

  // 主题切换（导航栏底部）
  if(hit('[data-theme-toggle]')){
    settings.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(); render();
    showToast('主题已切换为「' + (settings.theme === 'dark' ? '深色' : '浅色') + '」');
    return;
  }

  // 详情面板
  if(hit('[data-toggle-detail]')){ state.showDetail = !state.showDetail; render(); return; }
  if(hit('[data-close-detail]')){ state.showDetail = false; render(); return; }

  // 移动端返回
  if(hit('[data-mobile-back]')){
    // 会话详情（单聊/群聊）是会话的子页面，返回应回到会话本身
    if(state.view === 'groupFiles' || state.view === 'groupAlbum'){
      state.view = 'group';        // 群文件/群相册是从群详情进来的，返回应回群详情
      app.dataset.mobile = 'main';
    }else if(isConvSubView(state.view)){
      state.view = 'chat';
      app.dataset.mobile = 'main';
    }else{
      app.dataset.mobile = 'list';
    }
    render();
    return;
  }

  // 会话
  const conv = hit('[data-conv]');
  if(conv){
    state.activeConv = conv.dataset.conv;
    state.emptyChat = false;
    // 在会话详情页点列表里的会话，应回到会话本身而不是另一个详情页
    if(isConvSubView(state.view)) state.view = 'chat';
    app.dataset.mobile = 'main';
    const c = conversations.find(x => x.id === state.activeConv);
    if(c){ c.unread = 0; c.mention = false; }
    render();
    return;
  }

  // 部门 / 群聊
  const dept = hit('[data-dept]');
  if(dept){
    const isGroup = conversations.some(c => c.id === dept.dataset.dept);
    if(isGroup){
      state.activeConv = dept.dataset.dept;
      state.view = 'chat';
      app.dataset.mobile = 'main';
      render();
    }else{
      state.activeDept = dept.dataset.dept;
      state.activePerson = null;
      app.dataset.mobile = 'main';
      render();
    }
    return;
  }

  // 联系人
  const person = hit('[data-person]');
  if(person){
    state.activePerson = person.dataset.person;
    if(window.innerWidth < 1440) state.showDetail = true;
    app.dataset.mobile = 'main';
    render();
    return;
  }
  const gotoPerson = hit('[data-goto-person]');
  if(gotoPerson){
    const p = PEOPLE.find(x => x.n === gotoPerson.dataset.gotoPerson);
    if(p){ state.view = 'contacts'; state.activePerson = p.id; state.activeDept = p.dept; state.showDetail = true; app.dataset.mobile = 'main'; render(); }
    return;
  }

  // 文件来源 / 类型 / 布局
  const src = hit('[data-source]');
  if(src){ state.activeFileSource = src.dataset.source; render(); return; }
  const ft = hit('[data-filetype]');
  if(ft){ state.fileType = ft.dataset.filetype; render(); return; }
  const lay = hit('[data-layout]');
  if(lay){ state.fileLayout = lay.dataset.layout; render(); return; }

  // 收藏筛选
  const ff = hit('[data-favfilter]');
  if(ff){ state.favFilter = ff.dataset.favfilter; render(); return; }

  // 设置：开关（主设置页走 settings，群设置页走 groupSettings）
  const sw = hit('[data-switch]');
  if(sw){
    const k = sw.dataset.switch;
    if(k === 'peerBlock'){
      const rel = relOf(state.activeConv);
      rel.blocked = !rel.blocked;
      showToast(rel.blocked ? '已加入黑名单，不再接收对方消息' : '已移出黑名单');
    }else if(k === 'convMute' || k === 'convPin'){
      const c = conversations.find(x => x.id === state.activeConv);
      if(c) c[k === 'convMute' ? 'muted' : 'pinned'] = !c[k === 'convMute' ? 'muted' : 'pinned'];
    }else if(k === 'welcomeEnabled'){
      welcome.enabled = !welcome.enabled;
      showToast(welcome.enabled ? '已开启入群欢迎语' : '已关闭入群欢迎语');
    }else if(k in groupSettings){
      groupSettings[k] = !groupSettings[k];
    }else{
      settings[k] = !settings[k];
    }
    render();
    return;
  }

  // 设置：分段
  const seg = hit('[data-seg]');
  if(seg){
    const k = seg.dataset.seg;
    if(k === 'peerRoam') relOf(state.activeConv).roamDays = +seg.dataset.val;
    else if(k in groupSettings) groupSettings[k] = +seg.dataset.val;
    else settings[k] = seg.dataset.val;
    if(k === 'theme') applyTheme();
    if(k === 'density') applyDensity();
    render();
    return;
  }

  // 原型控制条
  const proto = hit('[data-proto]');
  if(proto){
    const k = proto.dataset.proto;
    if(k === 'detail' && !proto.disabled){ state.showDetail = !state.showDetail; render(); }
    if(k === 'empty' && !proto.disabled){ state.emptyChat = !state.emptyChat; render(); }
    if(k === 'dense'){
      settings.density = settings.density === 'compact' ? 'comfortable' : 'compact';
      applyDensity(); render();
    }
    if(k === 'dark'){
      settings.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(); render();
    }
    return;
  }

  // 空状态里的按钮
  if(hit('[data-act="pick-conv"]')){
    state.emptyChat = false;
    state.activeConv = 'g1';
    app.dataset.mobile = 'main';
    render();
    return;
  }

  // 其他演示动作
  const act = hit('[data-act]');
  if(act){
    const a = act.dataset.act;
    if(ACT_MSGS[a]) showToast(ACT_MSGS[a]);
  }
});

window.addEventListener('resize', () => {
  // 仅在跨越 1440 断点时调整详情面板默认态，不干扰用户手动开关
  if(state.view === 'chat' || state.view === 'contacts') render();
});

/* ==========================================================================
   扩展：消息操作 / 会话菜单 / 全局搜索 / 群设置 / 弹窗
   ========================================================================== */

/* ---------- 消息 key ---------- */
function allMsgKeys(conv){
  const list = messages[conv.id] || [];
  const keys = [];
  list.forEach((g, gi) => {
    if(!g.items) return;
    g.items.forEach((it, i) => keys.push(conv.id + ':' + gi + ':' + i));
  });
  return keys;
}

function msgByKey(key){
  const parts = String(key).split(':');
  const cid = parts[0], gi = +parts[1], ii = +parts[2];
  const g = (messages[cid] || [])[gi];
  if(!g || !g.items) return null;
  return { convId:cid, gi:gi, ii:ii, group:g, item:g.items[ii], self:!!g.self, from:g.from };
}

function msgText(key){
  const m = msgByKey(key);
  if(!m) return '';
  const it = m.item;
  if(it.text) return it.text;
  if(it.name) return '[文件] ' + it.name;
  if(it.title) return '[链接] ' + it.title;
  if(it.type === 'image') return '[图片]';
  return '[消息]';
}

/* ==========================================================================
   右键菜单
   ========================================================================== */
const CTX_MESSAGE = [
  { id:'reply',   label:'回复',     icon:'chat' },
  { id:'forward', label:'转发',     icon:'send' },
  { id:'fav',     label:'收藏',     icon:'star' },
  { id:'react',   label:'表情回应', icon:'smile' },
  { id:'copy',    label:'复制',     icon:'file' },
  { sep:true },
  { id:'recall',  label:'撤回',     icon:'back' },
  { id:'delete',  label:'删除',     icon:'trash', danger:true },
  { sep:true },
  { id:'multi',   label:'多选',     icon:'list' }
];

function openCtx(kind, payload, x, y){
  const items = ctxItems(kind, payload);
  if(!items.length){ showToast('你没有执行该操作的权限'); return; }
  closeCtx();
  state.ctx = { kind:kind, payload:payload };
  renderCtxMenu(items, x, y);
}

function renderCtxMenu(items, x, y){
  const menu = document.createElement('div');
  menu.className = 'ctx-menu';
  menu.id = 'ctxMenu';
  menu.setAttribute('role', 'menu');
  menu.innerHTML = items.map(it => it.sep
    ? '<div class="ctx-sep"></div>'
    : `<button class="ctx-item${it.danger ? ' ctx-item--danger' : ''}" role="menuitem" data-ctx="${it.id}">
         ${ICON[it.icon] || ''}<span>${it.label}</span></button>`).join('');
  document.body.appendChild(menu);
  const r = menu.getBoundingClientRect();
  menu.style.left = Math.max(8, Math.min(x, window.innerWidth - r.width - 8)) + 'px';
  menu.style.top  = Math.max(8, Math.min(y, window.innerHeight - r.height - 8)) + 'px';
}

function closeCtx(){
  const m = document.getElementById('ctxMenu');
  if(m) m.remove();
  state.ctx = null;
}

function ctxItems(kind, payload){
  if(kind === 'message'){
    const m = msgByKey(payload.key);
    return CTX_MESSAGE.filter(it => {
      // 撤回他人消息需管理员及以上（PRD 3.2：群主不限、管理员 24h 内）
      if(it.id === 'recall' && m && !m.self) return can('msg.recall.others', m.convId);
      return true;
    });
  }
  if(kind === 'member') return payload.items;
  const c = payload.conv;
  return [
    { id:'top',  label:c.pinned ? '取消置顶' : '置顶会话', icon:'pin' },
    { id:'mute', label:c.muted ? '取消免打扰' : '消息免打扰', icon:'bellOff' },
    { id:'read', label:'标记为已读', icon:'check' },
    { sep:true },
    { id:'hide', label:'删除会话', icon:'trash', danger:true }
  ];
}

/* 成员操作菜单：按当前用户在群里的角色过滤（GRP-005/006/016） */
function openMemberMenu(member, x, y){
  const role = myRoleIn(state.activeConv);
  const items = [];
  if(role >= 3 && member.role < 3){
    items.push({ id:'transfer', label:'转让群主', icon:'users' });
    if(member.role === 1) items.push({ id:'setAdmin',   label:'设为管理员', icon:'shield' });
    if(member.role === 2) items.push({ id:'unsetAdmin', label:'取消管理员', icon:'shield' });
  }
  if(role >= 2 && member.role < 3){
    if(items.length) items.push({ sep:true });
    items.push({ id:'remove', label:'移出群聊', icon:'trash', danger:true });
  }
  if(!items.length){ showToast('你没有管理该成员的权限'); return; }
  openCtx('member', { member:member, items:items }, x, y);
}

/* ==========================================================================
   表情回应
   ========================================================================== */
function toggleReaction(key, emoji){
  const list = reactions[key] || (reactions[key] = []);
  const hit = list.find(r => r.emoji === emoji);
  if(hit){
    if(hit.mine){
      hit.mine = false;
      hit.users = hit.users.filter(u => u !== '我');
      if(!hit.users.length) reactions[key] = list.filter(r => r !== hit);
    }else{
      hit.mine = true;
      hit.users.push('我');
    }
  }else{
    list.push({ emoji:emoji, users:['我'], mine:true });
  }
  if(reactions[key] && !reactions[key].length) delete reactions[key];
  closeEmojiPop();
  closeModal();
  render();
}

function openEmojiPop(key, anchor){
  closeEmojiPop();
  const pop = document.createElement('div');
  pop.className = 'emoji-pop';
  pop.id = 'emojiPop';
  pop.innerHTML = QUICK_EMOJI.map(e =>
      `<button class="emoji-pop__btn" data-emoji-pick="${key}" data-emoji="${e}">${e}</button>`).join('') +
    `<button class="emoji-pop__btn emoji-pop__btn--more" data-emoji-full="${key}" title="更多表情">${ICON.plus}</button>`;
  document.body.appendChild(pop);

  const a = anchor.getBoundingClientRect();
  const r = pop.getBoundingClientRect();
  let left = a.left + a.width / 2 - r.width / 2;
  let top = a.bottom + 6;
  if(top + r.height > window.innerHeight - 8) top = a.top - r.height - 6;
  pop.style.left = Math.max(8, Math.min(left, window.innerWidth - r.width - 8)) + 'px';
  pop.style.top = Math.max(8, top) + 'px';
}

function closeEmojiPop(){
  const p = document.getElementById('emojiPop');
  if(p) p.remove();
}

/* ==========================================================================
   弹窗系统
   ========================================================================== */
function openModal(kind, payload){
  state.modal = { kind:kind, payload:payload || {} };
  if(kind === 'forward') state.forwardTargets = new Set();
  renderModal();
}

function closeModal(){
  state.modal = null;
  renderModal();
}

function renderModal(){
  let host = document.getElementById('modalHost');
  if(!host){
    host = document.createElement('div');
    host.id = 'modalHost';
    document.body.appendChild(host);
  }
  host.innerHTML = state.modal ? modalHTML(state.modal) : '';
  if(state.modal && state.modal.kind === 'groupQr') drawGroupQr();
}

/* 群二维码：确定性伪随机 SVG，无外部图片依赖 */
function drawGroupQr(){
  const box = document.getElementById('qrCode');
  const status = document.getElementById('qrStatus');
  if(!box) return;

  const N = 25;
  let seed = Math.floor(Math.random() * 1e9);
  const rnd = function(){
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const reserved = {};
  const reserve = function(x, y, w, h){
    for(let i = 0; i < w; i++) for(let j = 0; j < h; j++) reserved[(x + i) + ',' + (y + j)] = 1;
  };
  [[0,0],[N-7,0],[0,N-7]].forEach(p => reserve(p[0]-1, p[1]-1, 9, 9));
  reserve(N-6, N-6, 6, 6);

  let cells = '';
  for(let y = 0; y < N; y++){
    for(let x = 0; x < N; x++){
      if(reserved[x + ',' + y]) continue;
      if(rnd() > 0.52) cells += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
    }
  }
  const finder = (fx, fy) =>
    '<rect x="' + fx + '" y="' + fy + '" width="7" height="7" rx="1.6"/>' +
    '<rect x="' + (fx+1) + '" y="' + (fy+1) + '" width="5" height="5" rx="1" fill="var(--cf-surface-1)"/>' +
    '<rect x="' + (fx+2) + '" y="' + (fy+2) + '" width="3" height="3" rx=".6"/>';

  box.innerHTML = '<svg viewBox="-1 -1 ' + (N+2) + ' ' + (N+2) + '" xmlns="http://www.w3.org/2000/svg" ' +
    'fill="var(--cf-text-primary)" shape-rendering="crispEdges">' + cells +
    finder(0,0) + finder(N-7,0) + finder(0,N-7) +
    '<rect x="' + (N-5) + '" y="' + (N-5) + '" width="5" height="5" rx="1"/>' +
    '<rect x="' + (N-4) + '" y="' + (N-4) + '" width="3" height="3" rx=".6" fill="var(--cf-surface-1)"/>' +
    '<rect x="' + (N-3) + '" y="' + (N-3) + '" width="1" height="1" rx=".2"/>' +
    '</svg>';

  if(status){
    let left = 7 * 24 * 3600;   // 7 天后失效（PRD GRP-004）
    const render = function(){
      const d = Math.floor(left / 86400), h = Math.floor(left % 86400 / 3600);
      status.innerHTML = '有效期剩余 <strong class="num">' + d + '</strong> 天 <strong class="num">' + h + '</strong> 小时';
    };
    render();
    clearInterval(drawGroupQr._t);
    drawGroupQr._t = setInterval(function(){
      left -= 3600;
      if(left <= 0){ clearInterval(drawGroupQr._t); if(status) status.innerHTML = '二维码已失效'; return; }
      render();
    }, 3600000);
  }
}

function modalHTML(m){
  if(m.kind === 'forward')  return forwardModalHTML();
  if(m.kind === 'emoji')    return emojiModalHTML(m.payload.key);
  if(m.kind === 'call')     return callModalHTML(m.payload.type);
  if(m.kind === 'newGroup') return newGroupModalHTML();
  if(m.kind === 'groupQr')  return groupQrModalHTML();
  if(m.kind === 'remark')   return remarkModalHTML();
  if(m.kind === 'tags')     return tagsModalHTML();
  if(m.kind === 'invite')   return inviteModalHTML();
  if(m.kind === 'noticeRead') return noticeReadModalHTML();
  if(m.kind === 'joinRequests') return joinRequestsModalHTML();
  if(m.kind === 'welcome')  return welcomeModalHTML();
  if(m.kind === 'callLog')  return callLogModalHTML();
  return '';
}

/* ---------- 转发选择器（PRD MSG-008 合并转发） ---------- */
function forwardModalHTML(){
  const picked = state.forwardTargets || new Set();
  return `<div class="modal-scrim" data-modal-scrim>
    <div class="modal" role="dialog" aria-modal="true" aria-label="转发到">
      <div class="modal__head">
        <h2>转发到</h2>
        <button class="cf-icon-btn cf-icon-btn--sm" data-modal-close title="关闭">✕</button>
      </div>
      <div class="modal__search">
        <div class="cf-input">${ICON.search}<input type="search" placeholder="搜索会话或联系人" data-forward-search aria-label="搜索转发目标"></div>
      </div>
      <div class="modal__body">
        <div class="modal__group-title">最近会话</div>
        ${conversations.map(c => `
          <button class="modal-row${picked.has(c.id) ? ' is-picked' : ''}" data-forward-to="${c.id}">
            ${avatarHTML(c, 32)}
            <span class="modal-row__body"><span class="modal-row__name">${c.name}</span></span>
            <span class="modal-row__check">${ICON.check}</span>
          </button>`).join('')}
        <div class="modal__group-title">联系人</div>
        ${PEOPLE.slice(0, 6).map(p => `
          <button class="modal-row${picked.has('p:' + p.id) ? ' is-picked' : ''}" data-forward-to="p:${p.id}">
            ${personAvatar(p, 32)}
            <span class="modal-row__body">
              <span class="modal-row__name">${p.n}</span>
              <span class="modal-row__sub">${deptName(p.dept)} · ${p.title}</span>
            </span>
            <span class="modal-row__check">${ICON.check}</span>
          </button>`).join('')}
      </div>
      <div class="modal__foot">
        <span class="modal__hint">已选 <span class="num">${picked.size}</span> 个会话 · <span class="num">${state.picked.size || 1}</span> 条消息</span>
        <span class="modal__spacer"></span>
        <button class="cf-btn cf-btn--secondary" data-modal-close>取消</button>
        <button class="cf-btn cf-btn--primary" data-forward-confirm ${picked.size ? '' : 'disabled'}>转发</button>
      </div>
    </div>
  </div>`;
}

/* ---------- 表情选择器 ---------- */
function emojiModalHTML(key){
  return `<div class="modal-scrim" data-modal-scrim>
    <div class="modal modal--emoji" role="dialog" aria-modal="true" aria-label="选择表情">
      <div class="modal__head">
        <h2>选择表情</h2>
        <button class="cf-icon-btn cf-icon-btn--sm" data-modal-close title="关闭">✕</button>
      </div>
      <div class="modal__body">
        ${EMOJI_GROUPS.map(g => `
          <div class="emoji-group">
            <div class="emoji-group__title">${g.name}</div>
            <div class="emoji-grid">
              ${g.list.map(e => `<button class="emoji-cell" data-emoji-pick="${key || ''}" data-emoji="${e}">${e}</button>`).join('')}
            </div>
          </div>`).join('')}
      </div>
    </div>
  </div>`;
}

/* ---------- 通话界面（PRD CALL-001 / CALL-004） ---------- */
function callModalHTML(type){
  const conv = conversations.find(c => c.id === state.activeConv) || conversations[0];
  const isVideo = type === 'video';
  return `<div class="call-scrim">
    <div class="call-card">
      ${avatarHTML(conv, 64)}
      <h2>${conv.name}</h2>
      <p class="call-status"><span class="spinner"></span> 正在呼叫…</p>
      <p class="call-hint">${isVideo ? '720P 视频通话' : '语音通话'} · 振铃 60 秒未接将自动挂断</p>
      <div class="call-actions">
        <button class="call-btn" data-act="call-mute" title="静音">${ICON.phone}</button>
        <button class="call-btn call-btn--end" data-modal-close title="挂断">${ICON.phone}</button>
        <button class="call-btn" data-act="call-video" title="${isVideo ? '关闭摄像头' : '开启视频'}">${ICON.video}</button>
      </div>
    </div>
  </div>`;
}

/* ---------- 新建群聊（PRD GRP-001） ---------- */
function newGroupModalHTML(){
  const picked = state.newGroupPicked;
  return `<div class="modal-scrim" data-modal-scrim>
    <div class="modal" role="dialog" aria-modal="true" aria-label="发起群聊">
      <div class="modal__head">
        <h2>发起群聊</h2>
        <button class="cf-icon-btn cf-icon-btn--sm" data-modal-close title="关闭">✕</button>
      </div>
      <div class="modal__search">
        <div class="cf-input">${ICON.search}<input type="search" placeholder="搜索联系人" aria-label="搜索联系人"></div>
      </div>
      <div class="modal__body">
        ${picked.size ? `<div class="picked-row">${[...picked].map(id => {
            const p = PEOPLE.find(x => x.id === id);
            return p ? `<button class="picked-chip" data-newgroup-pick="${p.id}">${personAvatar(p, 24)}<span>${p.n}</span>✕</button>` : '';
          }).join('')}</div>` : ''}
        <div class="modal__group-title">选择成员（已选 <span class="num">${picked.size}</span>）</div>
        ${PEOPLE.map(p => `
          <button class="modal-row${picked.has(p.id) ? ' is-picked' : ''}" data-newgroup-pick="${p.id}">
            ${personAvatar(p, 32)}
            <span class="modal-row__body">
              <span class="modal-row__name">${p.n}</span>
              <span class="modal-row__sub">${deptName(p.dept)} · ${p.title}</span>
            </span>
            <span class="modal-row__check">${ICON.check}</span>
          </button>`).join('')}
      </div>
      <div class="modal__foot">
        <span class="modal__hint">创建后默认人数上限 500</span>
        <span class="modal__spacer"></span>
        <button class="cf-btn cf-btn--secondary" data-modal-close>取消</button>
        <button class="cf-btn cf-btn--primary" data-newgroup-confirm ${picked.size >= 2 ? '' : 'disabled'}>创建群聊</button>
      </div>
    </div>
  </div>`;
}

/* ---------- 群二维码（PRD GRP-004） ---------- */
function groupQrModalHTML(){
  const conv = conversations.find(c => c.id === state.activeConv) || conversations[0];
  return `<div class="modal-scrim" data-modal-scrim>
    <div class="modal modal--qr" role="dialog" aria-modal="true" aria-label="群二维码">
      <div class="modal__head">
        <h2>群二维码</h2>
        <button class="cf-icon-btn cf-icon-btn--sm" data-modal-close title="关闭">✕</button>
      </div>
      <div class="modal__body modal__body--center">
        <div class="qr-box" style="width:200px;height:200px;padding:12px">
          <div id="qrCode"></div>
        </div>
        <p class="qr-status" id="qrStatus"></p>
        <p class="modal__hint" style="text-align:center">扫码即可申请加入「${conv.name}」，二维码 7 天后失效</p>
      </div>
      <div class="modal__foot modal__foot--center">
        <button class="cf-btn cf-btn--secondary" data-act="copy-group-link">复制群链接</button>
        <button class="cf-btn cf-btn--primary" data-act="save-qr">保存二维码</button>
      </div>
    </div>
  </div>`;
}

/* ---------- 通话记录（CALL-005） ---------- */
function callLogModalHTML(){
  const filter = state.callFilter;
  const pass = c => filter === 'all' ? true
                  : filter === 'answered' ? c.status === 'answered'
                  : c.status !== 'answered';
  const list = callLog.filter(pass);
  const filters = [
    { id:'all',      label:'全部',   n: callLog.length },
    { id:'answered', label:'已接听', n: callLog.filter(c => c.status === 'answered').length },
    { id:'missed',   label:'未接听', n: callLog.filter(c => c.status !== 'answered').length }
  ];

  return `<div class="modal-scrim" data-modal-scrim>
    <div class="modal" role="dialog" aria-modal="true" aria-label="通话记录">
      <div class="modal__head">
        <h2>通话记录</h2>
        <button class="cf-icon-btn cf-icon-btn--sm" data-modal-close title="关闭">✕</button>
      </div>
      <div class="search-panel__tabs">
        ${filters.map(f => `<button class="cf-tab${filter === f.id ? ' is-active' : ''}" data-call-filter="${f.id}">${f.label} <span class="num">${f.n}</span></button>`).join('')}
      </div>
      <div class="modal__body">
        ${list.length ? list.map(c => `
          <div class="calllog-row">
            <span class="calllog-row__icon${c.status === 'answered' ? '' : ' is-missed'}">
              ${c.type === 'video' ? ICON.video : ICON.phone}
            </span>
            <span class="calllog-row__body">
              <span class="calllog-row__title">${c.peer}
                <span class="cf-tag">${c.kind === 'group' ? '群通话' : '单人'}</span>
              </span>
              <span class="calllog-row__meta">
                ${c.dir === 'out' ? '呼出' : '呼入'} ·
                <span class="${c.status === 'answered' ? '' : 'is-missed'}">${CALL_STATUS[c.status]}</span>
                ${c.dur ? ' · <span class="num">' + c.dur + '</span>' : ''} · ${c.time}
              </span>
            </span>
            <button class="cf-btn cf-btn--ghost cf-btn--sm" data-act="call-back">回拨</button>
          </div>`).join('') : '<div class="search-hint">没有符合条件的通话记录</div>'}
      </div>
      <div class="modal__foot">
        <span class="modal__hint">通话记录保留 90 天，超过后自动清理</span>
        <span class="modal__spacer"></span>
        <button class="cf-btn cf-btn--primary" data-modal-close>完成</button>
      </div>
    </div>
  </div>`;
}

/* ==========================================================================
   视图：群相册（GRP-013 相册部分）
   ========================================================================== */
function renderGroupAlbum(){
  const conv = conversations.find(c => c.id === state.activeConv) || conversations[0];
  const groups = [];
  ALBUM.forEach(a => {
    let g = groups.find(x => x.day === a.day);
    if(!g){ g = { day:a.day, items:[] }; groups.push(g); }
    g.items.push(a);
  });
  const total = ALBUM.reduce((s, a) => s + (parseFloat(a.size) || 0) * (/KB/.test(a.size) ? 0.001 : 1), 0).toFixed(1);

  mainPane.innerHTML = `
    <header class="pane-head">
      <button class="cf-icon-btn pane-head__back" data-mobile-back title="返回会话">${ICON.back}</button>
      <span class="pane-head__body">
        <span class="pane-head__title">群相册</span>
        <span class="pane-head__meta">${conv.name} · <span class="num">${ALBUM.length}</span> 张图片 · 占用约 <span class="num">${total} MB</span></span>
      </span>
      <span class="pane-head__actions">
        <button class="cf-icon-btn" data-act="upload" title="上传图片">${ICON.upload}</button>
      </span>
    </header>
    <div class="pane-scroll scroll">
      <div class="pane-body" style="max-width:1000px">
        ${groups.map(g => `
          <div class="album-group">
            <div class="album-group__title">${g.day} · <span class="num">${g.items.length}</span> 张</div>
            <div class="album-grid">
              ${g.items.map(a => `
                <button class="album-tile" data-album-open="${a.id}" title="${a.n}">
                  <span class="album-tile__ph" style="background:${a.c}1F;color:${a.c}">${ICON.image}</span>
                  <span class="album-tile__name">${a.n}</span>
                  <span class="album-tile__meta">${a.from} · ${a.time} · <span class="num">${a.size}</span></span>
                </button>`).join('')}
            </div>
          </div>`).join('')}
      </div>
    </div>`;
  detailPane.innerHTML = '';
}

/* ---------- 备注名（REL-004） ---------- */
function remarkModalHTML(){
  const conv = conversations.find(c => c.id === state.activeConv) || conversations[0];
  const p = PEOPLE.find(x => x.n === conv.name) || PEOPLE[0];
  const r = relOf(conv.id);
  return `<div class="modal-scrim" data-modal-scrim>
    <div class="modal" style="max-width:400px" role="dialog" aria-modal="true" aria-label="设置备注名">
      <div class="modal__head">
        <h2>设置备注名</h2>
        <button class="cf-icon-btn cf-icon-btn--sm" data-modal-close title="关闭">✕</button>
      </div>
      <div class="modal__body">
        <input class="modal__input" id="remarkInput" maxlength="32"
               placeholder="${p.n}" value="${(r.remark || '').replace(/"/g, '&quot;')}">
        <p class="modal__hint" style="margin:var(--cf-space-2) 0 0">
          备注名仅你自己可见，最多 32 个字符。留空则显示对方的昵称。
        </p>
      </div>
      <div class="modal__foot">
        <span class="modal__spacer"></span>
        <button class="cf-btn cf-btn--secondary" data-modal-close>取消</button>
        <button class="cf-btn cf-btn--primary" data-remark-save>保存</button>
      </div>
    </div>
  </div>`;
}

/* ---------- 标签（REL-004） ---------- */
function tagsModalHTML(){
  const conv = conversations.find(c => c.id === state.activeConv) || conversations[0];
  const r = relOf(conv.id);
  return `<div class="modal-scrim" data-modal-scrim>
    <div class="modal" style="max-width:400px" role="dialog" aria-modal="true" aria-label="设置标签">
      <div class="modal__head">
        <h2>设置标签</h2>
        <button class="cf-icon-btn cf-icon-btn--sm" data-modal-close title="关闭">✕</button>
      </div>
      <div class="modal__body">
        <div class="modal__group-title">已选 <span class="num">${r.tags.length}</span> 个</div>
        <div class="tag-pool">
          ${TAG_POOL.map(t => `
            <button class="tag-option${r.tags.indexOf(t) >= 0 ? ' is-on' : ''}" data-tag-toggle="${t}">
              ${t}${r.tags.indexOf(t) >= 0 ? ' ✓' : ''}
            </button>`).join('')}
        </div>
        <p class="modal__hint" style="margin:var(--cf-space-3) 0 0">
          标签用于在联系人列表里快捷筛选与选人，仅在组织内可见。
        </p>
      </div>
      <div class="modal__foot">
        <span class="modal__spacer"></span>
        <button class="cf-btn cf-btn--primary" data-modal-close>完成</button>
      </div>
    </div>
  </div>`;
}

/* ---------- 邀请入群（GRP-003：选人 + 理由 + 审批） ---------- */
function inviteModalHTML(){
  const picked = state.invitePicked;
  const needApproval = groupSettings.inviteApproval;
  const inGroup = groupSettings.members.map(m => m.id);
  const candidates = PEOPLE.filter(p => inGroup.indexOf(p.id) < 0);

  return `<div class="modal-scrim" data-modal-scrim>
    <div class="modal" role="dialog" aria-modal="true" aria-label="邀请加入群聊">
      <div class="modal__head">
        <h2>邀请加入群聊</h2>
        <button class="cf-icon-btn cf-icon-btn--sm" data-modal-close title="关闭">✕</button>
      </div>
      <div class="modal__search">
        <div class="cf-input">${ICON.search}<input type="search" placeholder="搜索联系人" aria-label="搜索联系人"></div>
      </div>
      <div class="modal__body">
        ${picked.size ? `<div class="picked-row">${[...picked].map(id => {
          const p = PEOPLE.find(x => x.id === id);
          return p ? `<button class="picked-chip" data-invite-pick="${p.id}">${personAvatar(p, 24)}<span>${p.n}</span>✕</button>` : '';
        }).join('')}</div>` : ''}
        <div class="modal__group-title">选择联系人（已选 <span class="num">${picked.size}</span>）</div>
        ${candidates.length ? candidates.map(p => `
          <button class="modal-row${picked.has(p.id) ? ' is-picked' : ''}" data-invite-pick="${p.id}">
            ${personAvatar(p, 32)}
            <span class="modal-row__body">
              <span class="modal-row__name">${p.n}</span>
              <span class="modal-row__sub">${deptName(p.dept)} · ${p.title}</span>
            </span>
            <span class="modal-row__check">${ICON.check}</span>
          </button>`).join('') : '<div class="search-hint">组织内成员都已在本群</div>'}

        <div class="modal__group-title">邀请理由</div>
        <div style="padding:0 var(--cf-space-3)">
          <textarea class="modal__textarea" id="inviteReason" rows="3" maxlength="100"
            placeholder="说明邀请原因，便于群主或管理员审批">参与消息链路联调，需要同步接口变更</textarea>
          <p class="modal__hint" style="margin:var(--cf-space-2) 0 0">
            ${needApproval
              ? '本群已开启「邀请入群需审批」，提交后需群主或管理员同意'
              : '本群无需审批，邀请后对方会立即收到入群邀请'}
          </p>
        </div>
      </div>
      <div class="modal__foot">
        <span class="modal__spacer"></span>
        <button class="cf-btn cf-btn--secondary" data-modal-close>取消</button>
        <button class="cf-btn cf-btn--primary" data-invite-send ${picked.size ? '' : 'disabled'}>
          ${needApproval ? '提交审批' : '发送邀请'}
        </button>
      </div>
    </div>
  </div>`;
}

/* ---------- 群公告已读名单（GRP-008） ---------- */
function noticeReadModalHTML(){
  const s = noticeStat();
  const row = m => `
    <div class="modal-row" style="cursor:default">
      ${personAvatar({ n:m.n, c:m.c, on:m.on }, 32)}
      <span class="modal-row__body">
        <span class="modal-row__name">${m.n}</span>
        <span class="modal-row__sub">${m.title} · 加入于 <span class="num">${m.joined}</span></span>
      </span>
    </div>`;
  return `<div class="modal-scrim" data-modal-scrim>
    <div class="modal" role="dialog" aria-modal="true" aria-label="群公告已读情况">
      <div class="modal__head">
        <h2>群公告已读情况</h2>
        <button class="cf-icon-btn cf-icon-btn--sm" data-modal-close title="关闭">✕</button>
      </div>
      <div class="modal__body">
        <div class="read-stat">
          <div class="read-stat__num"><span class="num">${s.readIds.length}</span><span>已读</span></div>
          <div class="read-stat__num read-stat__num--warn"><span class="num">${s.unread.length}</span><span>未读</span></div>
          <div class="read-stat__num"><span class="num">${s.total}</span><span>群成员</span></div>
        </div>
        <div class="modal__group-title">未读名单（<span class="num">${s.unread.length}</span>）</div>
        ${s.unread.length ? s.unread.map(row).join('') : '<div class="search-hint">全部成员已读</div>'}
        <div class="modal__group-title">已读名单（<span class="num">${s.readIds.length}</span>）</div>
        ${s.readIds.map(id => {
          const m = groupSettings.members.find(x => x.id === id);
          return m ? row(m) : '';
        }).join('')}
      </div>
      <div class="modal__foot">
        <span class="modal__hint">未读成员会在下次打开会话时看到强提醒</span>
        <span class="modal__spacer"></span>
        <button class="cf-btn cf-btn--secondary" data-act="remind-unread">提醒未读成员</button>
        <button class="cf-btn cf-btn--primary" data-modal-close>知道了</button>
      </div>
    </div>
  </div>`;
}

/* ---------- 入群申请审批（GRP-003） ---------- */
function joinRequestsModalHTML(){
  return `<div class="modal-scrim" data-modal-scrim>
    <div class="modal" role="dialog" aria-modal="true" aria-label="入群申请">
      <div class="modal__head">
        <h2>入群申请</h2>
        <button class="cf-icon-btn cf-icon-btn--sm" data-modal-close title="关闭">✕</button>
      </div>
      <div class="modal__body">
        <div class="modal__group-title">待处理 <span class="num">${joinRequests.length}</span> 条</div>
        ${joinRequests.length ? joinRequests.map(r => `
          <div class="req-row">
            ${personAvatar({ n:r.n, c:r.c, on:false }, 32)}
            <div class="req-row__body">
              <div class="req-row__name">${r.n}<span class="cf-tag">${deptName(r.dept)} · ${r.title}</span></div>
              <div class="req-row__reason">「${r.reason}」</div>
              <div class="req-row__meta">由 ${r.from} 邀请 · ${r.time}</div>
            </div>
            <div class="req-row__act">
              <button class="cf-btn cf-btn--primary cf-btn--sm" data-req-accept="${r.id}">同意</button>
              <button class="cf-btn cf-btn--secondary cf-btn--sm" data-req-reject="${r.id}">拒绝</button>
            </div>
          </div>`).join('') : '<div class="search-hint">没有待处理的入群申请</div>'}
      </div>
      <div class="modal__foot">
        <span class="modal__hint">同意后对方立即入群，并按群设置发送欢迎语</span>
        <span class="modal__spacer"></span>
        <button class="cf-btn cf-btn--primary" data-modal-close>完成</button>
      </div>
    </div>
  </div>`;
}

/* ---------- 入群欢迎语（GRP-017 模板 + 变量） ---------- */
function welcomeModalHTML(){
  const vars = ['{昵称}','{群名}','{邀请人}'];
  return `<div class="modal-scrim" data-modal-scrim>
    <div class="modal" role="dialog" aria-modal="true" aria-label="入群欢迎语">
      <div class="modal__head">
        <h2>入群欢迎语</h2>
        <button class="cf-icon-btn cf-icon-btn--sm" data-modal-close title="关闭">✕</button>
      </div>
      <div class="modal__body">
        <div class="modal__group-title">模板内容</div>
        <div style="padding:0 var(--cf-space-3)">
          <textarea class="modal__textarea" id="welcomeTpl" rows="4" maxlength="200">${welcome.template}</textarea>
        </div>
        <div class="var-chips">
          <span class="var-chips__label">插入变量</span>
          ${vars.map(v => `<button class="var-chip" data-welcome-var="${v}">${v}</button>`).join('')}
          <span class="var-chips__label" style="margin-left:auto">最多 200 字</span>
        </div>
        <div class="modal__group-title">效果预览</div>
        <div class="welcome-preview" id="welcomePreview">${welcomePreview()}</div>
      </div>
      <div class="modal__foot">
        <span class="modal__spacer"></span>
        <button class="cf-btn cf-btn--secondary" data-modal-close>取消</button>
        <button class="cf-btn cf-btn--primary" data-welcome-save>保存</button>
      </div>
    </div>
  </div>`;
}

/* ==========================================================================
   视图：群文件分类页（GRP-013 按类型分页 + 容量配额）
   ========================================================================== */
function renderGroupFiles(){
  const conv = conversations.find(c => c.id === state.activeConv) || conversations[0];
  const all = groupFilesOf(conv.name);
  const type = state.groupFileType;
  const files = type === 'all' ? all : all.filter(f => f.type === type);
  const pct = Math.round(groupQuota.used / groupQuota.total * 100);
  const layout = state.groupFileLayout;

  const typeTabs = [
    { id:'all',   label:'全部', n: all.length },
    { id:'image', label:'图片', n: all.filter(f => f.type === 'image').length },
    { id:'video', label:'视频', n: all.filter(f => f.type === 'video').length },
    { id:'doc',   label:'文件', n: all.filter(f => f.type === 'doc').length },
    { id:'link',  label:'链接', n: all.filter(f => f.type === 'link').length }
  ];

  const body = files.length === 0
    ? `<div class="empty"><span class="empty__icon">${ICON.folder}</span>
         <h2>这个分类下还没有内容</h2><p>群成员发送的图片、视频、文件与链接会自动归档到这里。</p></div>`
    : (layout === 'grid'
      ? `<div class="file-grid">${files.map(f => `
          <button class="file-tile" data-file="${f.id}">
            <span class="file-tile__thumb">${fileThumbIcon(f.type)}<span class="file-tile__ext">${f.ext}</span></span>
            <span class="file-tile__body">
              <span class="file-tile__name">${f.n}</span>
              <span class="file-tile__meta">${f.size} · ${f.from} · ${f.time}</span>
            </span>
          </button>`).join('')}</div>`
      : `<div class="file-list">${files.map(f => `
          <button class="file-row" data-file="${f.id}">
            <span class="file-card__icon">${fileThumbIcon(f.type)}</span>
            <span class="member-row__body">
              <span class="member-row__name truncate">${f.n}</span>
              <span class="member-row__sub">${f.size} · ${f.from} · ${f.time}</span>
            </span>
            <span class="cf-icon-btn cf-icon-btn--sm" title="下载">${ICON.download}</span>
          </button>`).join('')}</div>`);

  mainPane.innerHTML = `
    <header class="pane-head">
      <button class="cf-icon-btn pane-head__back" data-mobile-back title="返回会话">${ICON.back}</button>
      <span class="pane-head__body">
        <span class="pane-head__title">群文件</span>
        <span class="pane-head__meta">${conv.name} · <span class="num">${all.length}</span> 个文件 · 共享空间已用 <span class="num">${groupQuota.used} GB</span> / <span class="num">${groupQuota.total} GB</span></span>
      </span>
      <span class="pane-head__actions">
        <button class="cf-icon-btn${layout === 'grid' ? ' is-on' : ''}" data-gf-layout="grid" title="网格视图">${ICON.grid}</button>
        <button class="cf-icon-btn${layout === 'list' ? ' is-on' : ''}" data-gf-layout="list" title="列表视图">${ICON.list}</button>
        <button class="cf-icon-btn" data-act="upload" title="上传文件">${ICON.upload}</button>
      </span>
    </header>
    <div class="pane-scroll scroll">
      <div class="pane-body" style="max-width:1000px">
        <div class="quota" style="margin-bottom:var(--cf-space-5)">
          <div class="quota__top">
            <span>群共享空间配额</span>
            <span class="num">${pct}% · 剩余 ${(groupQuota.total - groupQuota.used).toFixed(1)} GB</span>
          </div>
          <div class="quota__bar"><div class="quota__fill" style="width:${pct}%"></div></div>
          <div class="quota__top" style="margin-top:4px">
            <span>超出配额后需群主扩容，或将历史文件迁移至企业云盘</span>
          </div>
        </div>
        <div class="list-pane__tabs" style="margin-bottom:var(--cf-space-4)">
          ${typeTabs.map(t => `<button class="cf-tab${type === t.id ? ' is-active' : ''}" data-gf-type="${t.id}">${t.label} <span class="num">${t.n}</span></button>`).join('')}
        </div>
        ${body}
      </div>
    </div>`;
  detailPane.innerHTML = '';
}

/* ==========================================================================
   全局搜索面板（PRD SRCH-001 / SRCH-003）
   ========================================================================== */
function openSearch(){
  state.search.open = true;
  state.search.q = '';
  state.search.scope = 'all';
  state.search.type = 'all';
  renderSearch();
  setTimeout(() => {
    const i = document.querySelector('[data-search-input]');
    if(i) i.focus();
  }, 0);
}

function closeSearch(){
  state.search.open = false;
  state.search.scope = 'all';
  state.search.type = 'all';
  renderSearch();
}

/* 会话内查找聊天记录（SRCH-001/002/004） */
function openConvSearch(){
  state.search.open = true;
  state.search.q = '';
  state.search.scope = 'conv';
  state.search.type = 'all';
  renderSearch();
  setTimeout(function(){
    var i = document.querySelector('[data-search-input]');
    if(i) i.focus();
  }, 0);
}

function collectMessageHits(q){
  const hits = [];
  Object.keys(messages).forEach(cid => {
    const conv = conversations.find(c => c.id === cid);
    if(!conv) return;
    messages[cid].forEach((g, gi) => {
      if(!g.items) return;
      g.items.forEach((it, ii) => {
        const t = it.text || it.name || it.title || '';
        if(t && t.toLowerCase().indexOf(q) >= 0){
          hits.push({ conv:conv, key:cid + ':' + gi + ':' + ii, text:t, from:g.self ? '我' : (g.from || '') });
        }
      });
    });
  });
  return hits.slice(0, 8);
}

function renderSearch(){
  let host = document.getElementById('searchHost');
  if(!host){
    host = document.createElement('div');
    host.id = 'searchHost';
    document.body.appendChild(host);
  }
  if(!state.search.open){ host.innerHTML = ''; return; }
  if(state.search.scope === 'conv'){ host.innerHTML = convSearchHTML(); return; }

  const q = state.search.q.trim().toLowerCase();
  const convs  = q ? conversations.filter(c => c.name.toLowerCase().indexOf(q) >= 0) : conversations.slice(0, 3);
  const people = q ? PEOPLE.filter(p => p.n.toLowerCase().indexOf(q) >= 0 || p.emp.toLowerCase().indexOf(q) >= 0) : [];
  const msgs   = q ? collectMessageHits(q) : [];
  const total  = convs.length + people.length + msgs.length;

  host.innerHTML = `<div class="search-overlay" data-search-scrim>
    <div class="search-panel" role="dialog" aria-modal="true" aria-label="搜索">
      <div class="search-panel__head">
        <span class="search-panel__icon">${ICON.search}</span>
        <input class="search-panel__input" data-search-input type="search"
               placeholder="搜索会话、联系人或消息内容" value="${state.search.q.replace(/"/g, '&quot;')}">
        <button class="cf-icon-btn cf-icon-btn--sm" data-search-close title="关闭（Esc）">✕</button>
      </div>
      <div class="search-panel__body scroll">
        ${!q ? `<div class="search-hint">输入关键词开始搜索。支持会话名、联系人姓名 / 工号，以及消息正文。</div>` : ''}
        ${q && !total ? `<div class="search-empty">没有找到与「${state.search.q}」相关的结果</div>` : ''}

        ${convs.length ? `<div class="search-group">
          <div class="search-group__title">会话 · <span class="num">${convs.length}</span></div>
          ${convs.map(c => `<button class="search-item" data-search-conv="${c.id}">
            ${avatarHTML(c, 32)}
            <span class="search-item__body">
              <span class="search-item__title">${c.name}</span>
              <span class="search-item__sub">${c.kind === 'group' ? c.members + ' 名成员' : (c.online ? '在线' : '离线')}</span>
            </span>
          </button>`).join('')}
        </div>` : ''}

        ${people.length ? `<div class="search-group">
          <div class="search-group__title">联系人 · <span class="num">${people.length}</span></div>
          ${people.map(p => `<button class="search-item" data-search-person="${p.id}">
            ${personAvatar(p, 32)}
            <span class="search-item__body">
              <span class="search-item__title">${p.n}</span>
              <span class="search-item__sub">${deptName(p.dept)} · ${p.title} · <span class="num">${p.emp}</span></span>
            </span>
          </button>`).join('')}
        </div>` : ''}

        ${msgs.length ? `<div class="search-group">
          <div class="search-group__title">消息 · <span class="num">${msgs.length}</span></div>
          ${msgs.map(h => `<button class="search-item" data-search-msg="${h.key}">
            ${avatarHTML(h.conv, 32)}
            <span class="search-item__body">
              <span class="search-item__title">${h.from} · ${h.conv.name}</span>
              <span class="search-item__sub">${highlight(h.text, state.search.q)}</span>
            </span>
          </button>`).join('')}
        </div>` : ''}
      </div>
      <div class="search-panel__foot">
        <span><kbd>↑</kbd><kbd>↓</kbd> 选择</span>
        <span><kbd>Enter</kbd> 打开</span>
        <span><kbd>Esc</kbd> 关闭</span>
        <span class="search-panel__scope">范围：我参与的会话</span>
      </div>
    </div>
  </div>`;
}

/* 会话内搜索面板：按日期分组 + 类型筛选 */
function convSearchHTML(){
  const conv = conversations.find(c => c.id === state.activeConv) || conversations[0];
  const q = state.search.q.trim().toLowerCase();
  const type = state.search.type;
  const hits = [];
  let day = '更早';

  (messages[conv.id] || []).forEach(function(g, gi){
    if(g.type === 'day'){ day = g.text; return; }
    if(!g.items) return;
    g.items.forEach(function(it, ii){
      const t = it.text || it.name || it.title || '';
      const kind = it.type === 'file' ? 'file'
                 : it.type === 'link' ? 'link'
                 : it.type === 'image' ? 'image' : 'text';
      if(type !== 'all' && type !== kind) return;
      if(q && (!t || t.toLowerCase().indexOf(q) < 0)) return;
      if(!q && !t) return;
      hits.push({ key: conv.id + ':' + gi + ':' + ii, text: t, day: day,
                  from: g.self ? '我' : (g.from || ''), time: it.time || '', kind: kind });
    });
  });

  const typeTabs = [
    { id:'all',   label:'全部' },
    { id:'image', label:'图片' },
    { id:'file',  label:'文件' },
    { id:'link',  label:'链接' }
  ];

  const groups = [];
  hits.forEach(function(h){
    let g = groups.find(function(x){ return x.day === h.day; });
    if(!g){ g = { day: h.day, items: [] }; groups.push(g); }
    g.items.push(h);
  });

  return '<div class="search-overlay" data-search-scrim>' +
    '<div class="search-panel" role="dialog" aria-modal="true" aria-label="查找聊天记录">' +
      '<div class="search-panel__head">' +
        '<span class="search-panel__icon">' + ICON.search + '</span>' +
        '<input class="search-panel__input" data-search-input type="search" ' +
          'placeholder="在「' + conv.name + '」中查找" value="' + state.search.q.replace(/"/g, '&quot;') + '">' +
        '<button class="cf-icon-btn cf-icon-btn--sm" data-search-close title="关闭（Esc）">✕</button>' +
      '</div>' +
      '<div class="search-panel__tabs">' +
        typeTabs.map(function(t){
          return '<button class="cf-tab' + (type === t.id ? ' is-active' : '') + '" ' +
                 'data-search-type="' + t.id + '">' + t.label + '</button>';
        }).join('') +
      '</div>' +
      '<div class="search-panel__body scroll">' +
        (!q && type === 'all' ? '<div class="search-hint">输入关键词，或切换上方类型筛选，检索本会话的消息。</div>' : '') +
        (q && !hits.length ? '<div class="search-empty">本会话中没有找到与「' + state.search.q + '」相关的消息</div>' : '') +
        groups.map(function(g){
          return '<div class="search-group">' +
            '<div class="search-group__title">' + g.day + ' · <span class="num">' + g.items.length + '</span></div>' +
            g.items.map(function(h){
              return '<button class="search-item" data-search-msg="' + h.key + '">' +
                '<span class="search-item__body">' +
                  '<span class="search-item__title">' + h.from + (h.time ? ' · ' + h.time : '') + '</span>' +
                  '<span class="search-item__sub">' + highlight(h.text, state.search.q) + '</span>' +
                '</span>' +
              '</button>';
            }).join('') +
          '</div>';
        }).join('') +
      '</div>' +
      '<div class="search-panel__foot">' +
        '<span>范围：仅当前会话</span>' +
        '<span class="search-panel__scope"><span class="num">' + hits.length + '</span> 条结果</span>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function highlight(text, q){
  if(!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if(i < 0) return text;
  return text.slice(0, i) + '<mark>' + text.slice(i, i + q.length) + '</mark>' + text.slice(i + q.length);
}

/* ==========================================================================
   图片大图预览
   ========================================================================== */
function openLightbox(name, size){
  let host = document.getElementById('lightboxHost');
  if(!host){
    host = document.createElement('div');
    host.id = 'lightboxHost';
    document.body.appendChild(host);
  }
  host.innerHTML = `<div class="lightbox" data-lightbox-scrim>
    <div class="lightbox__bar">
      <span>${name || '会话页原型截图.png'} · ${size || '1.2 MB'}</span>
      <span class="lightbox__spacer"></span>
      <button class="cf-icon-btn" data-act="lightbox-download" title="下载">${ICON.download}</button>
      <button class="cf-icon-btn" data-lightbox-close title="关闭（Esc）">✕</button>
    </div>
    <div class="lightbox__stage">
      <div class="img-msg" style="width:min(880px,86vw);aspect-ratio:4/3">${ICON.image}</div>
    </div>
    <div class="lightbox__hint">滚轮缩放 · 拖拽移动 · Esc 关闭</div>
  </div>`;
}

function closeLightbox(){
  const host = document.getElementById('lightboxHost');
  if(host) host.innerHTML = '';
}

/* ==========================================================================
   群设置视图（PRD GRP-002 ~ GRP-016）
   ========================================================================== */
function renderGroupSettings(){
  const conv = conversations.find(c => c.id === state.activeConv) || conversations[0];
  const g = groupSettings;
  const role = myRoleIn(conv.id);
  const admins = g.members.filter(m => m.role >= 2);
  const roleName = { 1:'成员', 2:'管理员', 3:'群主' };

  const canInfo    = can('group.info.edit', conv.id);
  const canNotice  = can('group.notice.edit', conv.id);
  const canRequire = can('group.notice.require', conv.id);
  const canAdmin   = can('group.admin.manage', conv.id);
  const canPolicy  = can('group.policy', conv.id);
  const canMuteAll = can('group.muteAll', conv.id);
  const canQr      = can('group.qr', conv.id);
  const canDismiss = can('group.dismiss', conv.id);
  const canInvite  = can('group.invite', conv.id);
  const stat       = noticeStat();
  const readPct    = stat.total ? Math.round(stat.readIds.length / stat.total * 100) : 0;

  const banner = role === 3 ? '你可以修改全部设置，包括解散群聊'
               : role === 2 ? '你可以管理成员与群设置，但无法解散群聊'
               : '部分设置仅群主与管理员可操作';

  mainPane.innerHTML = `
    <header class="pane-head">
      <button class="cf-icon-btn pane-head__back" data-mobile-back title="返回会话">${ICON.back}</button>
      <span class="pane-head__body">
        <span class="pane-head__title">会话详情</span>
        <span class="pane-head__meta">${conv.name} · <span class="num">${g.members.length}</span> 名成员</span>
      </span>
      <span class="pane-head__actions">
        <button class="cf-icon-btn" data-act="more" title="更多">${ICON.more}</button>
      </span>
    </header>
    <div class="pane-scroll scroll">
      <div class="set-wrap">

        <div class="role-banner">
          <span class="cf-tag cf-tag--brand">我在本群：${roleName[role]}</span>
          <span class="role-banner__text">${banner}</span>
        </div>

        <div class="set-card">
          <div class="set-profile">
            ${avatarHTML(conv, 64)}
            <span class="set-profile__body">
              <span class="set-profile__name">${conv.name}</span>
              <span class="set-profile__desc">群号 <span class="num">8837 4120</span> · 创建于 2026-03-12</span>
            </span>
          </div>
        </div>

        <div class="set-card">
          <div class="set-card__head">群信息</div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">群名称</div>
              <div class="set-row__desc">变更会产生系统消息并记录操作日志　${permNote('group.info.edit','群主与管理员', conv.id)}</div>
            </div>
            <div class="set-row__control">
              <span class="set-row__value">${conv.name}</span>
              <button class="cf-btn cf-btn--secondary cf-btn--sm" data-act="edit-group-name" ${lock('group.info.edit', conv.id)}>编辑</button>
            </div>
          </div>
          <div class="set-row" style="flex-direction:column;align-items:stretch;gap:var(--cf-space-3)">
            <div class="set-row__body">
              <div class="set-row__label">群公告</div>
              <div class="set-row__desc">发布后以系统消息推送，并置顶在会话中　${permNote('group.notice.edit','群主与管理员', conv.id)}</div>
            </div>
            <textarea class="gs-textarea" data-group-notice rows="3" ${canNotice ? '' : 'readonly'}>${g.notice}</textarea>
            <div style="display:flex;align-items:center;gap:var(--cf-space-3);flex-wrap:wrap">
              <button class="cf-btn cf-btn--primary cf-btn--sm" data-act="save-notice" ${lock('group.notice.edit', conv.id)}>发布公告</button>
              <label class="check-row" style="font-size:13px">
                <input type="checkbox" data-group-flag="noticeRequireConfirm"
                       ${g.noticeRequireConfirm ? 'checked' : ''} ${canRequire ? '' : 'disabled'}>
                <span>需要成员确认已读</span>
              </label>
            </div>
          </div>
          ${g.noticeRequireConfirm ? `
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">公告已读情况</div>
              <div class="set-row__desc">
                <span class="num">${stat.readIds.length}</span> 人已读 ·
                <span class="num" style="color:var(--cf-warning-text)">${stat.unread.length}</span> 人未读
              </div>
              <div class="progress-mini"><div class="progress-mini__fill" style="width:${readPct}%"></div></div>
            </div>
            <div class="set-row__control">
              <button class="cf-btn cf-btn--secondary cf-btn--sm" data-open-notice-read>查看名单</button>
            </div>
          </div>` : ''}
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">群二维码</div>
              <div class="set-row__desc">扫码申请入群，7 天后自动失效　${permNote('group.qr','群主与管理员', conv.id)}</div>
            </div>
            <div class="set-row__control">
              <button class="cf-btn cf-btn--secondary cf-btn--sm" data-open-group-qr ${canQr ? '' : 'disabled'}>查看</button>
            </div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">群文件</div>
              <div class="set-row__desc">群共享空间，按类型分页　已用 <span class="num">${groupQuota.used} GB</span> / <span class="num">${groupQuota.total} GB</span></div>
            </div>
            <div class="set-row__control">
              <span class="cf-tag"><span class="num">${groupFilesOf(conv.name).length}</span> 个</span>
              <button class="cf-btn cf-btn--secondary cf-btn--sm" data-open-group-files>查看</button>
            </div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">群相册</div>
              <div class="set-row__desc">群内图片按时间归档　共 <span class="num">${ALBUM.length}</span> 张</div>
            </div>
            <div class="set-row__control">
              <button class="cf-btn cf-btn--secondary cf-btn--sm" data-open-group-album>查看</button>
            </div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">通话记录</div>
              <div class="set-row__desc">本会话的语音与视频通话　共 <span class="num">${callLog.length}</span> 条</div>
            </div>
            <div class="set-row__control">
              <button class="cf-btn cf-btn--secondary cf-btn--sm" data-open-call-log>查看</button>
            </div>
          </div>
        </div>

        <div class="set-card">
          <div class="set-card__head">成员管理</div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">邀请成员</div>
              <div class="set-row__desc">${g.inviteApproval ? '本群已开启审批，提交后需群主或管理员同意' : '邀请后对方会立即收到入群邀请'}　${permNote('group.invite','群主与管理员', conv.id)}</div>
            </div>
            <div class="set-row__control">
              <button class="cf-btn cf-btn--primary cf-btn--sm" data-open-invite ${canInvite ? '' : 'disabled'}>邀请</button>
            </div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">群成员</div>
              <div class="set-row__desc">普通群人数上限 500，可申请升级为超级大群</div>
            </div>
            <div class="set-row__control">
              <span class="cf-tag"><span class="num">${g.members.length}</span> 人</span>
            </div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">群管理员</div>
              <div class="set-row__desc">${admins.map(a => a.n).join('、')} · 最多 10 人　${permNote('group.admin.manage','群主', conv.id)}</div>
            </div>
            <div class="set-row__control">
              <button class="cf-btn cf-btn--secondary cf-btn--sm" data-act="add-admin" ${lock('group.admin.manage', conv.id)}>添加</button>
            </div>
          </div>
          ${role >= 2 ? `
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">入群申请</div>
              <div class="set-row__desc">成员邀请或扫码申请需你审批　<span class="perm-note">仅群主与管理员可见</span></div>
            </div>
            <div class="set-row__control">
              ${joinRequests.length ? `<span class="cf-badge">${joinRequests.length}</span>` : ''}
              <button class="cf-btn cf-btn--secondary cf-btn--sm" data-open-join-requests>处理</button>
            </div>
          </div>` : ''}
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">邀请入群需审批</div>
              <div class="set-row__desc">开启后成员邀请需群主或管理员同意　${permNote('group.policy','群主与管理员', conv.id)}</div>
            </div>
            <div class="set-row__control">${switchHTML(g.inviteApproval, 'inviteApproval', !canPolicy)}</div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">允许成员邀请他人</div>
              <div class="set-row__desc">关闭后仅管理员可邀请新成员　${permNote('group.policy','群主与管理员', conv.id)}</div>
            </div>
            <div class="set-row__control">${switchHTML(g.inviteEnabled, 'inviteEnabled', !canPolicy)}</div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">入群欢迎语</div>
              <div class="set-row__desc">新人入群后自动发送，支持模板与变量　${permNote('group.policy','群主与管理员', conv.id)}</div>
            </div>
            <div class="set-row__control">
              ${switchHTML(welcome.enabled, 'welcomeEnabled', !canPolicy)}
              <button class="cf-btn cf-btn--secondary cf-btn--sm" data-open-welcome ${canPolicy ? '' : 'disabled'}>编辑</button>
            </div>
          </div>
        </div>

        <div class="set-card">
          <div class="set-card__head">权限与安全</div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">全员禁言</div>
              <div class="set-row__desc">开启后仅群主与管理员可发言　${permNote('group.muteAll','群主与管理员', conv.id)}</div>
            </div>
            <div class="set-row__control">${switchHTML(g.muteAll, 'muteAll', !canMuteAll)}</div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">显示成员列表</div>
              <div class="set-row__desc">关闭后普通成员无法查看完整成员名单　${permNote('group.policy','群主与管理员', conv.id)}</div>
            </div>
            <div class="set-row__control">${switchHTML(g.showMemberList, 'showMemberList', !canPolicy)}</div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">允许成员互加好友</div>
              <div class="set-row__desc">关闭后群内成员无法通过群聊添加好友　${permNote('group.policy','群主与管理员', conv.id)}</div>
            </div>
            <div class="set-row__control">${switchHTML(g.allowMemberAddFriend, 'allowMemberAddFriend', !canPolicy)}</div>
          </div>
        </div>

        <div class="set-card">
          <div class="set-card__head">群成员（<span class="num">${g.members.length}</span>）</div>
          <div class="gs-members">
            ${g.members.map(m => `
              <div class="gs-member">
                ${personAvatar({ n:m.n, c:m.c, on:m.on }, 32)}
                <span class="gs-member__body">
                  <span class="gs-member__name">${m.n}
                    ${m.role >= 2 ? `<span class="cf-tag cf-tag--brand">${roleName[m.role]}</span>` : ''}
                  </span>
                  <span class="gs-member__sub">${m.title} · 加入于 <span class="num">${m.joined}</span></span>
                </span>
                <button class="cf-icon-btn cf-icon-btn--sm" data-member-more="${m.id}" title="成员操作">${ICON.more}</button>
              </div>`).join('')}
          </div>
        </div>

        <div class="set-card">
          <div class="set-card__head">危险操作</div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label" style="color:var(--cf-danger-text)">退出群聊</div>
              <div class="set-row__desc">${role === 3
                ? '群主需先转让群主或解散群聊　<span class="perm-note">群主不可直接退出</span>'
                : '退出后将不再接收该群消息，历史消息仍可在本机查看'}</div>
            </div>
            <div class="set-row__control">
              <button class="cf-btn cf-btn--secondary cf-btn--sm" data-act="leave-group" ${role === 3 ? 'disabled' : ''}>退出</button>
            </div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label" style="color:var(--cf-danger-text)">解散群聊</div>
              <div class="set-row__desc">解散后会话转为只读并归档，不可恢复　${permNote('group.dismiss','群主', conv.id)}</div>
            </div>
            <div class="set-row__control">
              <button class="cf-btn cf-btn--danger cf-btn--sm" data-act="dismiss-group" ${canDismiss ? '' : 'disabled'}>解散</button>
            </div>
          </div>
        </div>

      </div>
    </div>`;
  detailPane.innerHTML = '';
}

/* ==========================================================================
   视图：单聊会话详情（全屏）
   对应需求：REL-001/002/004/005/008/009、C2C-011/012/015、
             GRP-012、SRCH-001/002/004、CALL-001/002、PRE-001/003
   ========================================================================== */
function renderPeerDetail(){
  const conv = conversations.find(c => c.id === state.activeConv) || conversations[0];
  const p = PEOPLE.find(x => x.n === conv.name) || PEOPLE[0];
  const r = relOf(conv.id);
  const status = p.on ? '在线' : (conv.offlineAt || '离线');

  const groups = r.commonGroups.length
    ? r.commonGroups.map(id => `<button class="link-chip" data-goto-conv="${id}">${convName(id)}</button>`).join('')
    : '<span class="set-row__value">暂无共同群聊</span>';

  const tags = r.tags.length
    ? r.tags.map(t => `<span class="cf-tag cf-tag--brand">${t}</span>`).join('')
    : '<span class="set-row__value">未添加</span>';

  mainPane.innerHTML = `
    <header class="pane-head">
      <button class="cf-icon-btn pane-head__back" data-mobile-back title="返回会话">${ICON.back}</button>
      <span class="pane-head__body">
        <span class="pane-head__title">会话详情</span>
        <span class="pane-head__meta">${r.remark || p.n} · ${status}</span>
      </span>
      <span class="pane-head__actions">
        <button class="cf-icon-btn" data-act="more" title="更多">${ICON.more}</button>
      </span>
    </header>
    <div class="pane-scroll scroll">
      <div class="set-wrap">

        <div class="set-card">
          <div class="detail__profile peer-profile">
            ${personAvatar(p, 64)}
            <h3>${r.remark || p.n}</h3>
            <p>${status} · ${deptName(p.dept)} · ${p.title}</p>
            ${p.sig ? `<p>“${p.sig}”</p>` : ''}
          </div>
          <div class="peer-actions">
            <button class="peer-action" data-act="say-hi">${ICON.chat}<span>发消息</span></button>
            <button class="peer-action" data-call="audio">${ICON.phone}<span>语音通话</span></button>
            <button class="peer-action" data-call="video">${ICON.video}<span>视频通话</span></button>
          </div>
        </div>

        <div class="set-card">
          <div class="set-card__head">会话设置</div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">置顶会话</div>
              <div class="set-row__desc">置顶后常驻会话列表顶部，多端同步</div>
            </div>
            <div class="set-row__control">${switchHTML(conv.pinned, 'convPin')}</div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">消息免打扰</div>
              <div class="set-row__desc">不产生推送与声音，仅更新角标</div>
            </div>
            <div class="set-row__control">${switchHTML(conv.muted, 'convMute')}</div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">消息漫游</div>
              <div class="set-row__desc">可向上翻页查看的历史消息范围</div>
            </div>
            <div class="set-row__control">
              ${segmentHTML([{id:'30',label:'30 天'},{id:'90',label:'90 天'},{id:'180',label:'180 天'}], String(r.roamDays), 'peerRoam')}
            </div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">查找聊天记录</div>
              <div class="set-row__desc">按关键词或类型检索本会话消息</div>
            </div>
            <div class="set-row__control">
              <button class="cf-btn cf-btn--secondary cf-btn--sm" data-open-conv-search>查找</button>
            </div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label" style="color:var(--cf-danger-text)">清空聊天记录</div>
              <div class="set-row__desc">仅清除本机记录，对方与漫游消息不受影响</div>
            </div>
            <div class="set-row__control">
              <button class="cf-btn cf-btn--secondary cf-btn--sm" data-act="clear-history">清空</button>
            </div>
          </div>
        </div>

        <div class="set-card">
          <div class="set-card__head">关系</div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">备注名</div>
              <div class="set-row__desc">仅你自己可见，最多 32 个字符</div>
            </div>
            <div class="set-row__control">
              <span class="set-row__value">${r.remark || '未设置'}</span>
              <button class="cf-btn cf-btn--secondary cf-btn--sm" data-edit-remark>编辑</button>
            </div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">标签</div>
              <div class="set-row__desc">用于快捷选人与分组</div>
            </div>
            <div class="set-row__control">
              <span class="tag-row">${tags}</span>
              <button class="cf-btn cf-btn--secondary cf-btn--sm" data-edit-tags>编辑</button>
            </div>
          </div>
          <div class="set-row">
            <div class="set-row__body"><div class="set-row__label">共同群聊</div></div>
            <div class="set-row__control"><span class="link-chips">${groups}</span></div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">分享名片</div>
              <div class="set-row__desc">生成名片或分享到会话</div>
            </div>
            <div class="set-row__control">
              <button class="cf-btn cf-btn--secondary cf-btn--sm" data-act="share-card">分享</button>
            </div>
          </div>
        </div>

        <div class="set-card">
          <div class="set-card__head">共享内容</div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">聊天文件</div>
              <div class="set-row__desc">本会话的图片、文件与链接</div>
            </div>
            <div class="set-row__control">
              <span class="cf-tag"><span class="num">${FILES.filter(f => f.conv === conv.name).length}</span> 个</span>
              <button class="cf-btn cf-btn--secondary cf-btn--sm" data-open-conv-files>查看</button>
            </div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">通话记录</div>
              <div class="set-row__desc">本会话的语音与视频通话　共 <span class="num">${callLog.length}</span> 条</div>
            </div>
            <div class="set-row__control">
              <button class="cf-btn cf-btn--secondary cf-btn--sm" data-open-call-log>查看</button>
            </div>
          </div>
        </div>

        <div class="set-card">
          <div class="set-card__head">资料</div>
          <div class="set-row" style="flex-direction:column;align-items:stretch">
            <dl class="info-list">
              <div class="info-row"><dt>部门</dt><dd>${deptName(p.dept)}</dd></div>
              <div class="info-row"><dt>职位</dt><dd>${p.title}</dd></div>
              <div class="info-row"><dt>工号</dt><dd class="num">${p.emp}</dd></div>
              <div class="info-row"><dt>手机号</dt><dd class="num">${settings.phoneVisible ? p.phone : p.phone.replace(/^(\d{3}).*(\d{4})$/, '$1****$2')}</dd></div>
            </dl>
          </div>
        </div>

        <div class="set-card">
          <div class="set-card__head">隐私与安全</div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">加入黑名单</div>
              <div class="set-row__desc">加入后不再接收对方消息，对方也无法邀请你入群</div>
            </div>
            <div class="set-row__control">${switchHTML(r.blocked, 'peerBlock')}</div>
          </div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label">举报该用户</div>
              <div class="set-row__desc">举报内容会提交给组织管理员审核</div>
            </div>
            <div class="set-row__control">
              <button class="cf-btn cf-btn--secondary cf-btn--sm" data-act="report-user">举报</button>
            </div>
          </div>
        </div>

        <div class="set-card">
          <div class="set-card__head">危险操作</div>
          <div class="set-row">
            <div class="set-row__body">
              <div class="set-row__label" style="color:var(--cf-danger-text)">删除好友</div>
              <div class="set-row__desc">删除后聊天记录保留在本机，对方不会收到通知</div>
            </div>
            <div class="set-row__control">
              <button class="cf-btn cf-btn--danger cf-btn--sm" data-act="delete-friend">删除</button>
            </div>
          </div>
        </div>

      </div>
    </div>`;
  detailPane.innerHTML = '';
}

/* ==========================================================================
   多选
   ========================================================================== */
function enterMulti(key){
  state.multi = true;
  state.picked = new Set(key ? [key] : []);
  render();
}
function exitMulti(){
  state.multi = false;
  state.picked = new Set();
  render();
}

/* ==========================================================================
   扩展事件
   --------------------------------------------------------------------------
   注意：右键菜单、弹窗、搜索面板、大图预览都挂在 document.body 下（不在 #app 内），
   因此这里必须委托在 document 上，否则浮层内部的按钮点不到。
   ========================================================================== */
document.addEventListener('contextmenu', e => {
  const item = e.target.closest('.msg-item');
  if(item && !state.multi){
    e.preventDefault();
    openCtx('message', { key:item.dataset.msgkey }, e.clientX, e.clientY);
    return;
  }
  const conv = e.target.closest('[data-conv]');
  if(conv){
    e.preventDefault();
    const c = conversations.find(x => x.id === conv.dataset.conv);
    if(c) openCtx('conversation', { conv:c }, e.clientX, e.clientY);
  }
});

document.addEventListener('click', e => {
  const hit = s => e.target.closest(s);

  /* —— 多选：点消息切换选中 —— */
  const item = hit('.msg-item');
  if(item && state.multi){
    const k = item.dataset.msgkey;
    if(state.picked.has(k)) state.picked.delete(k); else state.picked.add(k);
    render();
    return;
  }

  /* —— 表情回应 —— */
  const reactBtn = hit('[data-react]');
  if(reactBtn){ openEmojiPop(reactBtn.dataset.react, reactBtn); return; }
  const reactToggle = hit('[data-react-toggle]');
  if(reactToggle){ toggleReaction(reactToggle.dataset.reactToggle, reactToggle.dataset.emoji); return; }

  /* —— 多选工具条 —— */
  if(hit('[data-multi-cancel]')){ exitMulti(); return; }
  if(hit('[data-multi-all]')){
    const conv = conversations.find(c => c.id === state.activeConv);
    const keys = allMsgKeys(conv);
    state.picked = state.picked.size === keys.length ? new Set() : new Set(keys);
    render();
    return;
  }
  if(hit('[data-multi-forward]')){ openModal('forward'); return; }
  if(hit('[data-multi-fav]')){ showToast('已收藏 ' + state.picked.size + ' 条消息到「我的收藏」'); exitMulti(); return; }
  if(hit('[data-multi-delete]')){ showToast('已删除 ' + state.picked.size + ' 条消息（仅本机）'); exitMulti(); return; }

  /* —— 搜索 —— */
  if(hit('[data-open-search]')){ openSearch(); return; }
  if(hit('[data-search-close]') || hit('[data-search-scrim]') && !hit('.search-panel')){ closeSearch(); return; }
  const sConv = hit('[data-search-conv]');
  if(sConv){
    state.view = 'chat';
    state.activeConv = sConv.dataset.searchConv;
    closeSearch(); app.dataset.mobile = 'main'; render();
    return;
  }
  const sPerson = hit('[data-search-person]');
  if(sPerson){
    const p = PEOPLE.find(x => x.id === sPerson.dataset.searchPerson);
    if(p){ state.view = 'contacts'; state.activeDept = p.dept; state.activePerson = p.id; state.showDetail = true; }
    closeSearch(); render();
    return;
  }
  const sMsg = hit('[data-search-msg]');
  if(sMsg){
    const m = msgByKey(sMsg.dataset.searchMsg);
    if(m){
      state.view = 'chat'; state.activeConv = m.convId;
      closeSearch(); render();
      setTimeout(() => {
        const el = document.querySelector('[data-msgkey="' + sMsg.dataset.searchMsg + '"]');
        if(el) el.scrollIntoView({ block:'center', behavior:'smooth' });
      }, 60);
    }
    return;
  }

  /* —— 通话 —— */
  const call = hit('[data-call]');
  if(call){ openModal('call', { type:call.dataset.call }); return; }

  /* —— 输入区：表情 / @ —— */
  if(hit('[data-open-emoji]')){ openModal('emoji', { key:null }); return; }
  if(hit('[data-open-mention]')){
    const input = document.getElementById('composerInput');
    if(input){ input.value += '@'; input.focus(); document.getElementById('sendBtn').disabled = false; }
    showToast('输入 @ 后可从成员列表中选择要提醒的人');
    return;
  }

  /* —— 图片预览（大图内的图片不再重复打开） —— */
  if(hit('.img-msg') && !hit('.lightbox')){ openLightbox(); return; }
  if(hit('[data-lightbox-close]')){ closeLightbox(); return; }

  /* —— 会话详情（单聊 / 群聊） —— */
  if(hit('[data-open-group-settings]')){ state.view = 'group'; app.dataset.mobile = 'main'; render(); return; }
  if(hit('[data-open-peer-detail]')){ state.view = 'peer'; app.dataset.mobile = 'main'; render(); return; }
  if(hit('[data-open-conv-search]')){ openConvSearch(); return; }
  if(hit('[data-open-group-qr]')){ openModal('groupQr'); return; }

  /* —— 会话内搜索：类型筛选 —— */
  const sType = hit('[data-search-type]');
  if(sType){ state.search.type = sType.dataset.searchType; renderSearch(); return; }

  /* —— 备注名 / 标签 —— */
  if(hit('[data-edit-remark]')){ openModal('remark'); return; }
  if(hit('[data-edit-tags]')){ openModal('tags'); return; }
  if(hit('[data-remark-save]')){
    const inp = document.getElementById('remarkInput');
    relOf(state.activeConv).remark = inp ? inp.value.trim() : '';
    closeModal();
    showToast('备注名已更新');
    render();
    return;
  }
  const tagBtn = hit('[data-tag-toggle]');
  if(tagBtn){
    const t = tagBtn.dataset.tagToggle;
    const r = relOf(state.activeConv);
    const i = r.tags.indexOf(t);
    if(i >= 0) r.tags.splice(i, 1); else r.tags.push(t);
    renderModal();
    return;
  }

  /* —— 成员操作菜单 —— */
  const memberMore = hit('[data-member-more]');
  if(memberMore){
    const id = memberMore.dataset.memberMore;
    const m = groupSettings.members.find(x => x.id === id);
    if(m){
      const r = memberMore.getBoundingClientRect();
      openMemberMenu(m, r.left, r.bottom + 6);
    }
    return;
  }

  /* —— 原型控制条：切换我在本群的角色 —— */
  const roleBtn = hit('[data-role]');
  if(roleBtn){
    myRole[state.activeConv] = +roleBtn.dataset.role;
    showToast('已切换为「' + ROLE_NAME[+roleBtn.dataset.role] + '」视角');
    render();
    return;
  }

  /* —— 群文件分类页（GRP-013） —— */
  if(hit('[data-open-group-files]')){ state.view = 'groupFiles'; app.dataset.mobile = 'main'; render(); return; }
  const gfType = hit('[data-gf-type]');
  if(gfType){ state.groupFileType = gfType.dataset.gfType; render(); return; }
  const gfLayout = hit('[data-gf-layout]');
  if(gfLayout){ state.groupFileLayout = gfLayout.dataset.gfLayout; render(); return; }

  /* —— 群相册（GRP-013） —— */
  if(hit('[data-open-group-album]')){ state.view = 'groupAlbum'; app.dataset.mobile = 'main'; render(); return; }
  const albumOpen = hit('[data-album-open]');
  if(albumOpen){
    const a = ALBUM.find(x => x.id === albumOpen.dataset.albumOpen);
    if(a){ openLightbox(a.n, a.size); }
    return;
  }

  /* —— 通话记录（CALL-005） —— */
  if(hit('[data-open-call-log]')){ state.callFilter = 'all'; openModal('callLog'); return; }
  const callFilter = hit('[data-call-filter]');
  if(callFilter){ state.callFilter = callFilter.dataset.callFilter; renderModal(); return; }

  /* —— 单聊的聊天文件 → 跳到文件视图并定位到该会话 —— */
  if(hit('[data-open-conv-files]')){
    state.activeFileSource = state.activeConv;
    state.view = 'files';
    app.dataset.mobile = 'main';
    render();
    return;
  }

  /* —— 群公告已读名单（GRP-008） —— */
  if(hit('[data-open-notice-read]')){ openModal('noticeRead'); return; }

  /* —— 邀请入群（GRP-003） —— */
  if(hit('[data-open-invite]')){
    if(!can('group.invite')){ showToast('本群已关闭成员邀请，请联系群主或管理员'); return; }
    state.invitePicked = new Set();
    openModal('invite');
    return;
  }
  const invitePick = hit('[data-invite-pick]');
  if(invitePick){
    const id = invitePick.dataset.invitePick;
    if(state.invitePicked.has(id)) state.invitePicked.delete(id); else state.invitePicked.add(id);
    renderModal();
    return;
  }
  if(hit('[data-invite-send]')){
    const n = state.invitePicked.size;
    const reason = ((document.getElementById('inviteReason') || {}).value || '').trim();
    if(!reason){ showToast('请填写邀请理由'); return; }
    showToast(groupSettings.inviteApproval
      ? '已提交 ' + n + ' 条入群申请，等待群主或管理员审批'
      : '已向 ' + n + ' 位成员发出入群邀请');
    state.invitePicked = new Set();
    closeModal();
    return;
  }

  /* —— 入群申请审批（GRP-003） —— */
  if(hit('[data-open-join-requests]')){ openModal('joinRequests'); return; }
  const reqOk = hit('[data-req-accept]');
  if(reqOk){
    const r = joinRequests.find(x => x.id === reqOk.dataset.reqAccept);
    if(r){
      joinRequests.splice(joinRequests.indexOf(r), 1);
      groupSettings.members.push({ id:'new_' + r.id, n:r.n, c:r.c, on:false, role:1, title:r.title, joined:'今天' });
      showToast('已同意「' + r.n + '」入群' + (welcome.enabled ? '，已发送欢迎语' : ''));
    }
    renderModal();
    render();
    return;
  }
  const reqNo = hit('[data-req-reject]');
  if(reqNo){
    const r = joinRequests.find(x => x.id === reqNo.dataset.reqReject);
    if(r){ joinRequests.splice(joinRequests.indexOf(r), 1); showToast('已拒绝「' + r.n + '」的入群申请'); }
    renderModal();
    return;
  }

  /* —— 入群欢迎语（GRP-017） —— */
  if(hit('[data-open-welcome]')){ openModal('welcome'); return; }
  const wVar = hit('[data-welcome-var]');
  if(wVar){
    const ta = document.getElementById('welcomeTpl');
    if(ta){
      const pos = ta.selectionStart == null ? ta.value.length : ta.selectionStart;
      ta.value = ta.value.slice(0, pos) + wVar.dataset.welcomeVar + ta.value.slice(ta.selectionEnd == null ? pos : ta.selectionEnd);
      ta.focus();
      ta.selectionStart = ta.selectionEnd = pos + wVar.dataset.welcomeVar.length;
      const pv = document.getElementById('welcomePreview');
      if(pv) pv.textContent = ta.value.replace(/\{昵称\}/g,'李四').replace(/\{群名\}/g, convName(state.activeConv)).replace(/\{邀请人\}/g,'张三');
    }
    return;
  }
  if(hit('[data-welcome-save]')){
    const ta = document.getElementById('welcomeTpl');
    if(ta && ta.value.trim()) welcome.template = ta.value.trim();
    closeModal();
    showToast('入群欢迎语已保存');
    render();
    return;
  }

  /* —— 跳转到共同群聊 —— */
  const gotoConv = hit('[data-goto-conv]');
  if(gotoConv){
    state.view = 'chat';
    state.activeConv = gotoConv.dataset.gotoConv;
    app.dataset.mobile = 'main';
    render();
    return;
  }

  /* —— 弹窗交互 —— */
  if(hit('[data-modal-close]')){ closeModal(); return; }
  if(hit('[data-modal-scrim]') && !hit('.modal')){ closeModal(); return; }
  if(hit('[data-forward-to]')){
    const id = hit('[data-forward-to]').dataset.forwardTo;
    if(state.forwardTargets.has(id)) state.forwardTargets.delete(id); else state.forwardTargets.add(id);
    renderModal();
    return;
  }
  if(hit('[data-forward-confirm]')){
    const n = state.forwardTargets.size;
    const cnt = state.picked.size || 1;
    showToast('已转发 ' + cnt + ' 条消息到 ' + n + ' 个会话');
    closeModal();
    if(state.multi) exitMulti();
    return;
  }
  if(hit('[data-emoji-full]')){ openModal('emoji', { key:hit('[data-emoji-full]').dataset.emojiFull }); return; }
  if(hit('[data-newgroup-pick]')){
    const id = hit('[data-newgroup-pick]').dataset.newgroupPick;
    if(state.newGroupPicked.has(id)) state.newGroupPicked.delete(id); else state.newGroupPicked.add(id);
    renderModal();
    return;
  }
  if(hit('[data-newgroup-confirm]')){
    showToast('已创建群聊，共 ' + state.newGroupPicked.size + ' 名成员');
    state.newGroupPicked = new Set();
    closeModal();
    return;
  }
  if(hit('[data-open-new-group]')){
    state.newGroupPicked = new Set();
    openModal('newGroup');
    return;
  }

  /* —— 浮层内的通用演示动作 ——
     弹窗/浮层都挂在 document.body 下（不在 #app 内），app 级处理器覆盖不到。
     这里对「不在 #app 内」的 data-act 兜底，避免出现「按钮点了没反应」。 */
  const actFloat = hit('[data-act]');
  if(actFloat && !app.contains(actFloat)){
    if(ACT_MSGS[actFloat.dataset.act]) showToast(ACT_MSGS[actFloat.dataset.act]);
    return;
  }

  /* —— 右键菜单项 —— */
  const ctxItem = hit('[data-ctx]');
  if(ctxItem && state.ctx){
    handleCtx(ctxItem.dataset.ctx);
    return;
  }
});

/* 表情快捷选择（在 document 上处理，因为浮层挂在 body 下） */
document.addEventListener('click', e => {
  const pick = e.target.closest('[data-emoji-pick]');
  if(pick){
    const key = pick.dataset.emojiPick;
    const emoji = pick.dataset.emoji;
    if(key){ toggleReaction(key, emoji); }
    else {
      const input = document.getElementById('composerInput');
      if(input){
        input.value += emoji;
        input.focus();
        const btn = document.getElementById('sendBtn');
        if(btn) btn.disabled = false;
      }
      closeModal();
    }
    return;
  }
  // 点击别处关闭浮层
  if(!e.target.closest('.emoji-pop') && !e.target.closest('[data-react]') && !e.target.closest('.modal')) closeEmojiPop();
  // 用左键打开菜单的入口也要白名单，否则同一次 click 冒泡过来会立刻把菜单关掉
  if(!e.target.closest('.ctx-menu') && !e.target.closest('[data-member-more]')) closeCtx();
});

/* 搜索输入 */
document.addEventListener('input', e => {
  if(e.target.id === 'welcomeTpl'){
    const pv = document.getElementById('welcomePreview');
    if(pv){
      pv.textContent = e.target.value
        .replace(/\{昵称\}/g, '李四')
        .replace(/\{群名\}/g, convName(state.activeConv))
        .replace(/\{邀请人\}/g, '张三');
    }
    return;
  }
  if(e.target.matches('[data-search-input]')){
    state.search.q = e.target.value;
    renderSearch();
    const i = document.querySelector('[data-search-input]');
    if(i){ i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
  }
});

/* 群设置里的开关与分段 */
document.addEventListener('change', e => {
  const flag = e.target.closest('[data-group-flag]');
  if(flag){
    groupSettings[flag.dataset.groupFlag] = flag.checked;
    // 勾选「需要成员确认已读」后要立刻显示已读统计行，因此需要重渲染
    render();
    return;
  }
});

/* Esc 关闭一切浮层 */
document.addEventListener('keydown', e => {
  if(e.key !== 'Escape') return;
  if(state.modal) closeModal();
  else if(state.search.open) closeSearch();
  else if(document.getElementById('lightboxHost') && document.getElementById('lightboxHost').innerHTML) closeLightbox();
  else if(state.multi) exitMulti();
  else if(state.view === 'groupFiles' || state.view === 'groupAlbum'){ state.view = 'group'; render(); }
  else if(isConvSubView(state.view)){ state.view = 'chat'; render(); }
  else { closeCtx(); closeEmojiPop(); }
});

/* Ctrl/Cmd + K 打开搜索（PRD SRCH 的键盘入口） */
document.addEventListener('keydown', e => {
  if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){
    e.preventDefault();
    state.search.open ? closeSearch() : openSearch();
  }
});

/* 右键菜单动作 */
function handleCtx(id){
  const ctx = state.ctx;
  if(!ctx) return;

  if(ctx.kind === 'conversation'){
    const c = ctx.payload.conv;
    if(id === 'top')  c.pinned = !c.pinned;
    if(id === 'mute') c.muted = !c.muted;
    if(id === 'read'){ c.unread = 0; c.mention = false; }
    if(id === 'hide'){ c.hidden = true; }
    closeCtx();
    render();
    const msg = {
      top:  c.pinned ? '已置顶「' + c.name + '」' : '已取消置顶',
      mute: c.muted ? '「' + c.name + '」已开启免打扰' : '已关闭免打扰',
      read: '「' + c.name + '」已标记为已读',
      hide: '已删除会话「' + c.name + '」'
    };
    if(msg[id]) showToast(msg[id]);
    return;
  }

  if(ctx.kind === 'member'){
    const m = ctx.payload.member;
    closeCtx();
    const msgs = {
      transfer:  '已向「' + m.n + '」发出群主转让请求，待对方确认',
      setAdmin:  '已将「' + m.n + '」设为群管理员',
      unsetAdmin:'已取消「' + m.n + '」的管理员身份',
      remove:    '已将「' + m.n + '」移出群聊，对方会收到系统提示'
    };
    if(msgs[id]) showToast(msgs[id]);
    if(id === 'setAdmin' || id === 'unsetAdmin'){ m.role = id === 'setAdmin' ? 2 : 1; render(); }
    if(id === 'remove'){
      groupSettings.members = groupSettings.members.filter(x => x.id !== m.id);
      render();
    }
    return;
  }

  const key = ctx.payload.key;
  closeCtx();

  switch(id){
    case 'reply': {
      const m = msgByKey(key);
      const input = document.getElementById('composerInput');
      if(input && m){
        input.value = '';
        input.placeholder = '回复 ' + (m.from || '对方') + '…';
        input.focus();
        showToast('正在回复 ' + (m.from || '对方'));
      }
      break;
    }
    case 'forward': state.picked = new Set([key]); openModal('forward'); break;
    case 'fav':     showToast('已收藏到「我的收藏」'); break;
    case 'react':   openEmojiPop(key, document.querySelector('[data-msgkey="' + key + '"] .msg-item__react') || document.body); break;
    case 'copy': {
      const t = msgText(key);
      if(navigator.clipboard) navigator.clipboard.writeText(t).then(
        () => showToast('已复制消息内容'),
        () => showToast('复制失败，请手动选择'));
      else showToast('已复制：' + t.slice(0, 20));
      break;
    }
    case 'recall': showToast('已撤回该消息（2 分钟内可撤回）'); break;
    case 'delete': showToast('已删除该消息（仅本机）'); break;
    case 'multi':  enterMulti(key); break;
  }
}

/* ==========================================================================
   初始化
   ========================================================================== */
(function init(){
  applyTheme();
  applyDensity();
  // wide 及以上详情面板作为常驻第 4 列默认展开，其余断点为抽屉默认收起
  state.showDetail = window.innerWidth >= 1440;
  app.dataset.mobile = window.innerWidth < 768 ? 'list' : 'main';
  render();
})();

