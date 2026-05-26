// ============================================================
// js/events_act4.js — 第四幕：深渊裂隙 事件池
// ============================================================

const EVENT_POOL_ACT4 = [
  // ---- 水晶矿脉 ----
  { id:'crystalVein', title:'水晶矿脉',
    desc:'裂隙岩壁上嵌满了发光的紫色水晶簇。水晶内部流淌着液态的光芒，触碰时能感受到微弱的魔力震动。',
    options:[
      { text:'采集地面水晶', conds:[], costs:[], results:[
        {type:'addItem',itemId:'purpleShard',qty:2},
        {type:'msg',text:'你捡起了地面上自然脱落的水晶碎片。获得 <hl>紫水晶碎片 ×2</hl>。'}
      ]},
      { text:'开采岩壁水晶', conds:[{type:'atk',op:'>=',val:25}], costs:[], results:[
        {type:'addItem',itemId:'purpleShard',qty:3},
        {type:'randomEquip',rarity:'C-B'},
        {type:'msg',text:'你用力凿开了岩壁上的水晶簇！获得 <hl>紫水晶碎片 ×3</hl>。'}
      ]},
      { text:'用工具小心提取', conds:[{type:'spd',op:'>=',val:14}], costs:[], results:[
        {type:'addItem',itemId:'purpleShard',qty:4},
        {type:'msg',text:'你用精细的手法完整提取了水晶。获得 <hl>紫水晶碎片 ×4</hl>。'}
      ]},
      { text:'吸收水晶魔力', conds:[{type:'luk',op:'>=',val:12}], costs:[], results:[
        {type:'stat',key:'spd',val:2},
        {type:'buff',name:'水晶共鸣',battles:3,effects:{atk:5,def:3}},
        {type:'msg',text:'水晶魔力流入体内！<hl>永久 SPD+2</hl> + 获得 <hl>水晶共鸣</hl>（下3次战斗 ATK+5 DEF+3）。'}
      ]},
    ],
  },
  // ---- 裂隙商人 ----
  { id:'riftMerchant', title:'裂隙商人', shop:true,
    desc:'一个披着紫袍的蒙面商人坐在突出的岩石平台上。"深渊中的旅人——你需要的，我都有。"',
    shopItems:[
      { itemId:'iceSword', price:140 }, { itemId:'luckyRapier', price:130 },
      { itemId:'dragonScale', price:150 }, { itemId:'shadowCloak', price:140 },
      { itemId:'atkPotion', price:35 }, { itemId:'awakenPotion', price:200 },
    ],
    options:[
      { text:'购买商品', conds:[], costs:[], results:[{type:'openShop'}] },
      { text:'出售物品', conds:[], costs:[], results:[{type:'openSell'}] },
      { text:'用水晶碎片交换', conds:[{type:'hasItem',itemId:'purpleShard',qty:3}], costs:[{type:'loseItem',itemId:'purpleShard',qty:3}], results:[
        {type:'randomEquip',rarity:'B-A'},
        {type:'msg',text:'商人接过水晶碎片，从暗格中取出一件品质极高的装备。'}
      ]},
      { text:'离开', conds:[], costs:[], results:[{type:'msg',text:'你对商人点点头，继续前行。'}] },
    ],
  },
  // ---- 腐蚀之湖 ----
  { id:'corrodeLake', title:'腐蚀之湖',
    desc:'裂隙底部有一片紫色的地下湖。湖水浓稠如油，湖对岸可以看到一个石台上放着的宝箱，但湖水中似乎有东西在游动。',
    options:[
      { text:'游泳渡湖', conds:[], costs:[{type:'hpCost',val:25}], results:[
        {type:'randomEquip',rarity:'B'},
        {type:'actStat',key:'def',val:-1},
        {type:'msg',text:'你咬牙游到了对岸，但湖水腐蚀了你的护甲。<hl>DEF −1</hl>（本幕内有效）。'}
      ]},
      { text:'建造筏子渡湖', conds:[{type:'atk',op:'>=',val:28}], costs:[{type:'hpCost',val:10}], results:[
        {type:'randomEquip',rarity:'B'},
        {type:'msg',text:'你用碎石和木板做了个筏子安全渡湖。获得了一件B级装备。'}
      ]},
      { text:'采集湖水样本', conds:[{type:'spd',op:'>=',val:15}], costs:[], results:[
        {type:'addItem',itemId:'purpleShard',qty:3},
        {type:'msg',text:'你小心采集了湖水样本，发现其中凝聚着紫水晶微粒。获得 <hl>紫水晶碎片 ×3</hl>。'}
      ]},
      { text:'绕湖而行', conds:[], costs:[{type:'hpCost',val:8}], results:[
        {type:'msg',text:'你沿着湖岸绕了一大圈。'}
      ]},
    ],
  },
  // ---- 虚空回廊 ----
  { id:'voidCorridor', title:'虚空回廊',
    desc:'一排拱门悬浮在虚空中，每扇门上刻着不同符文：剑、盾、眼。门后的黑暗中传来不同的声音。',
    options:[
      { text:'进入剑之门', conds:[{type:'atk',op:'>=',val:30}], costs:[], results:[
        {type:'combat',enemy:'voidSwordsman',rewards:[{type:'addItem',itemId:'holySword',qty:1},{type:'gold',val:60}]},
        {type:'msg',text:'虚空剑士手持利刃向你走来！'}
      ]},
      { text:'进入盾之门', conds:[{type:'def',op:'>=',val:14}], costs:[], results:[
        {type:'combat',enemy:'voidGuard',rewards:[{type:'addItem',itemId:'holyShield',qty:1},{type:'gold',val:60}]},
        {type:'msg',text:'虚空守卫举起巨盾挡住去路！'}
      ]},
      { text:'进入眼之门', conds:[{type:'luk',op:'>=',val:14}], costs:[], results:[
        {type:'combat',enemy:'voidSeer',rewards:[{type:'addItem',itemId:'destinyStar',qty:1},{type:'gold',val:60}]},
        {type:'msg',text:'虚空先知睁开第三只眼凝视着你！'}
      ]},
      { text:'不进入任何门', conds:[], costs:[], results:[
        {type:'msg',text:'你绕过了这些虚空之门。'}
      ]},
    ],
  },
  // ---- 紫晶祭坛 ----
  { id:'purpleAltar', title:'紫晶祭坛',
    desc:'一座由整块紫水晶雕成的祭坛。碑文写着："以晶换力，以力破暗。"',
    options:[
      { text:'放入1枚水晶碎片', conds:[{type:'hasItem',itemId:'purpleShard'}], costs:[{type:'loseItem',itemId:'purpleShard',qty:1}], results:[
        {type:'heal',val:40},
        {type:'buff',name:'水晶护盾',battles:2,effects:{def:5}},
        {type:'msg',text:'祭坛发出柔和紫光。<hp>恢复 40 HP</hp> + 获得 <hl>水晶护盾</hl>（下2次战斗 DEF+5）。'}
      ]},
      { text:'放入3枚水晶碎片', conds:[{type:'hasItem',itemId:'purpleShard',qty:3}], costs:[{type:'loseItem',itemId:'purpleShard',qty:3}], results:[
        {type:'stat',key:'atk',val:2},{type:'stat',key:'def',val:2},
        {type:'buff',name:'水晶觉醒',battles:99,effects:{atk:4}},
        {type:'msg',text:'三枚水晶同时发光！<hl>永久 ATK+2 DEF+2</hl> + 获得 <hl>水晶觉醒</hl>（本幕剩余战斗 ATK+4）。'}
      ]},
      { text:'放入5枚水晶碎片', conds:[{type:'hasItem',itemId:'purpleShard',qty:5}], costs:[{type:'loseItem',itemId:'purpleShard',qty:5}], results:[
        {type:'stat',key:'atk',val:3},{type:'stat',key:'def',val:3},{type:'stat',key:'spd',val:2},
        {type:'randomEquip',rarity:'A-S'},
        {type:'msg',text:'五枚水晶引发共鸣！<hl>永久 ATK+3 DEF+3 SPD+2</hl>！'}
      ]},
      { text:'触摸祭坛冥想', conds:[{type:'spd',op:'>=',val:14}], costs:[], results:[
        {type:'heal',val:999},
        {type:'stat',key:'spd',val:3},
        {type:'msg',text:'你在祭坛前进入深度冥想。<hp>HP完全恢复</hp> + <hl>永久 SPD+3</hl>。'}
      ]},
      { text:'绕开祭坛', conds:[], costs:[], results:[
        {type:'msg',text:'你身上没有水晶碎片，暂时绕过了祭坛。'}
      ]},
    ],
  },
  // ---- 深渊钓客 ----
  { id:'abyssFisher', title:'深渊钓客',
    desc:'一个白发老者坐在裂隙边缘，手中握着一根发光的鱼竿。"年轻人，要不要试试手气？这深渊底下可不止有怪物——还有被遗忘的宝物。"',
    options:[
      { text:'试一次手气', conds:[{type:'gold',op:'>=',val:50}], costs:[{type:'gold',val:50}], results:[
        {type:'lukCheck',threshold:40,success:[
          {type:'randomEquip',rarity:'A-S'},
          {type:'msg',text:'钓竿猛地一沉！你拉上来一件闪闪发光的装备！'}
        ],fail:[
          {type:'combat',enemy:'riftWrath',rewards:[{type:'gold',val:40}]},
          {type:'msg',text:'钓竿剧烈弯曲——一只裂隙之怒被钓了上来！'}
        ]},
      ]},
      { text:'花大价钱钓三次', conds:[{type:'gold',op:'>=',val:150}], costs:[{type:'gold',val:150}], results:[
        {type:'lukCheck',threshold:40,success:[{type:'randomEquip',rarity:'A'},{type:'msg',text:'第一钓：一件A级装备！'}],fail:[{type:'addItem',itemId:'purpleShard',qty:1},{type:'msg',text:'第一钓：紫水晶碎片。'}]},
        {type:'lukCheck',threshold:40,success:[{type:'randomEquip',rarity:'A'},{type:'msg',text:'第二钓：又一件A级装备！'}],fail:[{type:'addItem',itemId:'purpleShard',qty:1},{type:'msg',text:'第二钓：紫水晶碎片。'}]},
        {type:'lukCheck',threshold:40,success:[{type:'randomEquip',rarity:'A'},{type:'msg',text:'第三钓：再来一件A级装备！'}],fail:[{type:'addItem',itemId:'purpleShard',qty:1},{type:'msg',text:'第三钓：紫水晶碎片。'}]},
      ]},
      { text:'向老者请教技巧', conds:[{type:'luk',op:'>=',val:15}], costs:[{type:'gold',val:30}], results:[
        {type:'stat',key:'luk',val:2},
        {type:'buff',name:'垂钓者的智慧',battles:5,effects:{lukBonus15:true}},
        {type:'msg',text:'老者教了你几手绝活。<hl>永久 LUK+2</hl> + 获得 <hl>垂钓者的智慧</hl>（下5次LUK判定+20%）。'}
      ]},
      { text:'不钓了', conds:[], costs:[], results:[{type:'msg',text:'你看了一眼无底的深渊，收回了手。'}] },
    ],
  },
  // ---- 影之长廊 ----
  { id:'shadowHall', title:'影之长廊',
    desc:'一条狭窄的通道，两侧紫水晶被黑暗力量污染。你的影子从地面上站立起来，变成了一个与你一模一样的暗影镜像。',
    options:[
      { text:'与镜像战斗', conds:[], costs:[], results:[
        {type:'combat',enemy:'voidSwordsman',rewards:[{type:'addItem',itemId:'shadowBlade',qty:1},{type:'gold',val:70}]},
        {type:'msg',text:'镜像拔剑——与你同样的招式！'}
      ]},
      { text:'打碎被污染的水晶', conds:[{type:'atk',op:'>=',val:32}], costs:[{type:'hpCost',val:15}], results:[
        {type:'addItem',itemId:'purpleShard',qty:5},
        {type:'msg',text:'你击碎了所有被污染的水晶，镜像消散。获得 <hl>紫水晶碎片 ×5</hl>。'}
      ]},
      { text:'跑过长廊', conds:[{type:'spd',op:'>=',val:16}], costs:[], results:[
        {type:'msg',text:'你在镜像完全成形之前冲过了长廊。'}
      ]},
      { text:'用紫水晶净化', conds:[{type:'hasItem',itemId:'purpleShard',qty:2}], costs:[{type:'loseItem',itemId:'purpleShard',qty:2}], results:[
        {type:'buff',name:'暗影抗性',battles:99,effects:{spd:3}},
        {type:'msg',text:'紫水晶的力量净化了长廊。获得 <hl>暗影抗性</hl>（本幕剩余战斗 SPD+3）。'}
      ]},
    ],
  },
  // ---- 失落者的营地 ----
  { id:'lostCamp', title:'失落者的营地',
    desc:'一处小小的营地——破损的帐篷围着一堆熄灭的篝火。营地中央有一本翻开的日记，最后一页的字迹潦草而绝望。',
    options:[
      { text:'阅读日记', conds:[], costs:[], results:[
        {type:'stat',key:'luk',val:1},
        {type:'msg',text:'日记记载了深渊中的秘密。<hl>永久 LUK+1</hl>。'}
      ]},
      { text:'搜寻物资', conds:[{type:'luk',op:'>=',val:13}], costs:[], results:[
        {type:'addItem',itemId:'bigHealPotion',qty:3},
        {type:'gold',val:80},
        {type:'addItem',itemId:'purpleShard',qty:2},
        {type:'msg',text:'你找到了前人的物资储备！获得 <hl>大治疗药水 ×3</hl>、<hl>Gold +80</hl>、<hl>紫水晶碎片 ×2</hl>。'}
      ]},
      { text:'在营地休息', conds:[], costs:[], results:[
        {type:'healPct',val:40},
        {type:'msg',text:'你在帐篷中安稳地睡了一觉。<hp>恢复 40% HP</hp>。'}
      ]},
      { text:'重建篝火', conds:[{type:'hasItem',itemId:'purpleShard'}], costs:[{type:'loseItem',itemId:'purpleShard',qty:1}], results:[
        {type:'buff',name:'篝火之暖',battles:99,effects:{healPerRound:3}},
        {type:'msg',text:'紫水晶点燃了魔法篝火。获得 <hl>篝火之暖</hl>（本幕剩余战斗每回合恢复3HP）。'}
      ]},
    ],
  },
  // ---- 结晶洞室 ----
  { id:'crystalChamber', title:'结晶洞室',
    desc:'无数紫水晶形成天然镜面矩阵，中央悬浮着一颗紫晶核心——那是一只结晶巨蝎的心脏。巨蝎感应到你的到来，六只水晶眼睛同时睁开。',
    options:[
      { text:'挑战巨蝎', conds:[], costs:[], results:[
        {type:'combat',enemy:'crystalScorpion',rewards:[{type:'gold',val:100},{type:'randomEquip',rarity:'A'}]},
        {type:'msg',text:'结晶巨蝎挥动着晶刺朝你冲来！'}
      ]},
      { text:'潜行偷取晶核', conds:[{type:'spd',op:'>=',val:18}], costs:[], results:[
        {type:'addItem',itemId:'purpleShard',qty:8},
        {type:'msg',text:'你趁巨蝎不备偷走了晶核碎片。获得 <hl>紫水晶碎片 ×8</hl>。'}
      ]},
      { text:'用共振粉碎水晶', conds:[{type:'hasItem',itemId:'purpleShard',qty:3}], costs:[{type:'loseItem',itemId:'purpleShard',qty:3}], results:[
        {type:'addItem',itemId:'purpleShard',qty:5},
        {type:'randomEquip',rarity:'A'},
        {type:'msg',text:'你用水晶共振直接粉碎了巨蝎！获得 <hl>紫水晶碎片 ×5</hl>。'}
      ]},
      { text:'绕过洞室', conds:[], costs:[], results:[{type:'msg',text:'你绕过了这个危险的洞室。'}] },
    ],
  },
];

const BOSS_EVENT_ACT4 = {
  id:'boss', title:'深渊之主',
  desc:'裂隙的最深处，紫光褪去，一片纯粹的黑暗笼罩着一切。黑暗中，无数只眼睛缓缓睁开——它们属于同一个庞大的躯体。深渊之主——一头与黑暗本身融为一体的古兽——从沉睡中苏醒。',
};
