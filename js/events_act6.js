// ============================================================
// js/events_act6.js — 第六幕：终末之境 事件池
// ============================================================

const EVENT_POOL_ACT6 = [
  // ---- 虚空商人 ----
  { id:'voidMerchant', title:'虚空商人', shop:true,
    desc:'虚空中悬浮着一个由星光编织成的摊位。一位半透明的老者正在用星尘修补一面破损的镜子。"终于有人来了。这些东西对我已经没用——但你或许需要它们。"',
    shopItems:[
      { itemId:'holySword', price:250 }, { itemId:'dragonFang', price:400 },
      { itemId:'holyShield', price:250 }, { itemId:'dragonGodArmor', price:400 },
      { itemId:'destinyStar', price:380 }, { itemId:'phoenixFeather', price:350 },
      { itemId:'revivePotion', price:500 }, { itemId:'awakenPotion', price:200 },
      { itemId:'blessedFeather', price:220 },
    ],
    options:[
      { text:'购买商品', conds:[], costs:[], results:[{type:'openShop'}] },
      { text:'出售物品', conds:[], costs:[], results:[{type:'openSell'}] },
      { text:'用星尘碎片交易', conds:[{type:'hasItem',itemId:'starDust',qty:3}], costs:[{type:'loseItem',itemId:'starDust',qty:3}], results:[
        {type:'addItem',itemId:'destinyStar',qty:1},
        {type:'gold',val:100},
        {type:'msg',text:'老者接过星尘碎片，递给你命运之星。获得 <hl>命运之星 (S)</hl>、<hl>Gold +100</hl>。'}
      ]},
      { text:'离开', conds:[], costs:[], results:[{type:'msg',text:'你向老者微微鞠躬，继续漂浮前行。'}] },
    ],
  },
  // ---- 回忆之镜 ----
  { id:'memoryMirror', title:'回忆之镜',
    desc:'一面巨大的银镜悬浮在虚空中。镜中映出的是刚踏入森林时的自己——浑身是伤却眼神坚定。镜中的影像向你伸出手。',
    options:[
      { text:'拥抱过去的自己', conds:[], costs:[], results:[
        {type:'stat',key:'atk',val:3},{type:'stat',key:'def',val:3},
        {type:'stat',key:'spd',val:3},{type:'stat',key:'luk',val:3},
        {type:'msg',text:'过去的经历化作力量回流体内。<hl>永久全属性 +3</hl>！'}
      ]},
      { text:'对镜中自己点头致意', conds:[{type:'luk',op:'>=',val:22}], costs:[], results:[
        {type:'maxHp',val:50},
        {type:'heal',val:999},
        {type:'msg',text:'镜中的自己微笑着点头。<hl>MaxHP +50</hl> + HP回满。'}
      ]},
      { text:'打碎镜子', conds:[{type:'atk',op:'>=',val:40}], costs:[{type:'hpCost',val:30}], results:[
        {type:'addItem',itemId:'dragonFang',qty:1},
        {type:'addItem',itemId:'dragonGodArmor',qty:1},
        {type:'msg',text:'镜片碎裂，其中封存的神器落入你手。获得 <hl>龙牙 (S)</hl> + <hl>龙神重甲 (S)</hl>。'}
      ]},
      { text:'在镜前静坐冥想', conds:[{type:'spd',op:'>=',val:22}], costs:[], results:[
        {type:'buff',name:'自我认同',battles:99,effects:{atk:5,def:5,spd:5,luk:5,healPerRound:5}},
        {type:'msg',text:'与镜中的自己达成和解。获得 <hl>自我认同</hl>（本幕剩余战斗全属性+5，每回合恢复5HP）。'}
      ]},
    ],
  },
  // ---- 重力反转之间 ----
  { id:'gravityRoom', title:'重力反转之间',
    desc:'踏入这间立方体空间的瞬间，上下颠倒。空间中央悬浮着几颗星尘凝成的宝珠，但重力场的扭曲让每一步都艰难无比。',
    options:[
      { text:'适应重力场行走', conds:[{type:'spd',op:'>=',val:25}], costs:[{type:'hpCost',val:15}], results:[
        {type:'addItem',itemId:'starDust',qty:3},
        {type:'gold',val:80},
        {type:'msg',text:'你艰难地适应了重力场，取到了宝珠。获得 <hl>星尘碎片 ×3</hl>、<hl>Gold +80</hl>。'}
      ]},
      { text:'用装备增加重量', conds:[{type:'atk',op:'>=',val:42}], costs:[], results:[
        {type:'addItem',itemId:'starDust',qty:5},
        {type:'msg',text:'你用重装备稳定身形，从容收集了宝珠。获得 <hl>星尘碎片 ×5</hl>。'}
      ]},
      { text:'用意念控制移动', conds:[{type:'luk',op:'>=',val:24}], costs:[], results:[
        {type:'addItem',itemId:'starDust',qty:3},
        {type:'stat',key:'spd',val:3},
        {type:'msg',text:'你用意念操控身体在无重力中移动。<hl>永久 SPD+3</hl> + <hl>星尘碎片 ×3</hl>。'}
      ]},
      { text:'退出空间绕行', conds:[], costs:[{type:'hpCost',val:8}], results:[
        {type:'msg',text:'你看了一眼倒转的天花板，选择了退出。'}
      ]},
    ],
  },
  // ---- 星辰锻造台 ----
  { id:'starForge', title:'星辰锻造台',
    desc:'七颗最明亮的星辰的光芒汇聚成一个炽热的锻造台。台面上放着一把尚未完成的神兵，只差最后一步淬火。',
    options:[
      { text:'完成神兵锻造', conds:[{type:'hasItem',itemId:'goldOre',qty:5},{type:'hasItem',itemId:'dragonScaleFrag',qty:3},{type:'hasItem',itemId:'purpleShard',qty:3}], costs:[{type:'loseItem',itemId:'goldOre',qty:5},{type:'loseItem',itemId:'dragonScaleFrag',qty:3},{type:'loseItem',itemId:'purpleShard',qty:3}], results:[
        {type:'addItem',itemId:'starSword',qty:1},
        {type:'msg',text:'世间最稀有之物铸成了星辰之剑！获得 <hl>星辰之剑 (S)</hl>——ATK+22 SPD+5 LUK+5！'}
      ]},
      { text:'淬炼已有装备', conds:[{type:'hasItem',itemId:'starDust',qty:5}], costs:[{type:'loseItem',itemId:'starDust',qty:5}], results:[
        {type:'enhanceEquip'},
        {type:'msg',text:'星尘淬入了你的装备，品质大幅跃升！'}
      ]},
      { text:'只做简单强化', conds:[{type:'hasItem',itemId:'goldOre',qty:3}], costs:[{type:'loseItem',itemId:'goldOre',qty:3}], results:[
        {type:'stat',key:'atk',val:5},
        {type:'msg',text:'你在星辰之火中淬炼了自己的力量。<hl>永久 ATK+5</hl>。'}
      ]},
      { text:'研究锻造工艺', conds:[{type:'luk',op:'>=',val:25}], costs:[], results:[
        {type:'stat',key:'atk',val:2},{type:'stat',key:'spd',val:2},
        {type:'buff',name:'锻造大师',battles:99,effects:{atk:999,def:999}},
        {type:'msg',text:'你领悟了星辰锻造的秘密。<hl>永久 ATK+2 SPD+2</hl> + 获得 <hl>锻造大师</hl>（装备属性翻倍）。'}
      ]},
      { text:'缺少材料，离开锻造台', conds:[], costs:[], results:[
        {type:'msg',text:'你缺少锻造所需的材料，只能离开。'}
      ]},
    ],
  },
  // ---- 时间之沙 ----
  { id:'timeSand', title:'时间之沙',
    desc:'一个悬浮的沙漏中，沙子并非向下流动——而是在上下两端之间循环往复。触碰沙漏可以看到无数个可能的未来。',
    options:[
      { text:'选择一个胜利的未来', conds:[{type:'luk',op:'>=',val:26}], costs:[], results:[
        {type:'buff',name:'命运的宠儿',battles:99,effects:{autoLuk:true}},
        {type:'msg',text:'你锚定了一个必胜的时间线。获得 <hl>命运的宠儿</hl>（本幕剩余战斗LUK判定自动成功）。'}
      ]},
      { text:'加速时间流动', conds:[{type:'spd',op:'>=',val:25}], costs:[{type:'hpCost',val:20}], results:[
        {type:'stat',key:'spd',val:5},
        {type:'buff',name:'时间加速',battles:99,effects:{firstStrike:true}},
        {type:'msg',text:'你获得了超越时间的速度。<hl>永久 SPD+5</hl> + 获得 <hl>时间加速</hl>（本幕剩余战斗必定先手）。'}
      ]},
      { text:'倒转沙漏', conds:[], costs:[{type:'hpCost',val:30}], results:[
        {type:'heal',val:999},
        {type:'maxHp',val:10},
        {type:'msg',text:'时间倒流，所有伤口消失。<hp>HP完全恢复</hp> + <hl>MaxHP +10</hl>。'}
      ]},
      { text:'研究沙漏原理', conds:[{type:'atk',op:'>=',val:45}], costs:[], results:[
        {type:'stat',key:'atk',val:3},{type:'stat',key:'spd',val:3},
        {type:'addItem',itemId:'starDust',qty:3},
        {type:'msg',text:'你理解了时间的秘密。<hl>永久 ATK+3 SPD+3</hl> + <hl>星尘碎片 ×3</hl>。'}
      ]},
    ],
  },
  // ---- 星界图书馆 ----
  { id:'starLibrary', title:'星界图书馆',
    desc:'无边无际的书架在虚空中排列成螺旋状。每一本书都是一段被遗忘的历史。中央阅读台上放着一本翻开的空白书。',
    options:[
      { text:'阅读他人的故事', conds:[{type:'luk',op:'>=',val:23}], costs:[], results:[
        {type:'stat',key:'atk',val:2},{type:'stat',key:'def',val:2},
        {type:'stat',key:'spd',val:2},{type:'stat',key:'luk',val:2},
        {type:'msg',text:'万千故事中的智慧融入心中。<hl>永久全属性 +2</hl>。'}
      ]},
      { text:'在空白书页写下自己的故事', conds:[], costs:[{type:'hpCost',val:25}], results:[
        {type:'maxHp',val:50},
        {type:'buff',name:'主角光环',battles:99,effects:{atk:5,def:5,spd:5,luk:5}},
        {type:'msg',text:'你是自己故事的主角。<hl>MaxHP +50</hl> + 获得 <hl>主角光环</hl>（本幕剩余战斗全属性+5）。'}
      ]},
      { text:'翻阅禁书区', conds:[{type:'atk',op:'>=',val:42}], costs:[{type:'hpCost',val:20}], results:[
        {type:'randomEquip',rarity:'S'},
        {type:'randomEquip',rarity:'S'},
        {type:'msg',text:'禁书中封存着两件神器！获得2件S级装备。'}
      ]},
      { text:'抄录有用的知识', conds:[{type:'spd',op:'>=',val:24}], costs:[], results:[
        {type:'addItem',itemId:'starDust',qty:5},
        {type:'stat',key:'luk',val:3},
        {type:'msg',text:'你摘抄了最有价值的知识。<hl>永久 LUK+3</hl> + <hl>星尘碎片 ×5</hl>。'}
      ]},
    ],
  },
  // ---- 虚空裂缝 ----
  { id:'voidRift', title:'虚空裂缝',
    desc:'一道撕裂空间的裂缝中涌出一头被放逐的虚空巨兽。它是无数世界毁灭的见证者，以吞噬希望为食。',
    options:[
      { text:'正面迎战', conds:[], costs:[], results:[
        {type:'combat',enemy:'voidBeast',rewards:[{type:'gold',val:200},{type:'randomEquip',rarity:'S'},{type:'randomEquip',rarity:'S'}]},
        {type:'msg',text:'虚空巨兽张开布满星辰的大口！'}
      ]},
      { text:'用星尘安抚巨兽', conds:[{type:'hasItem',itemId:'starDust',qty:5}], costs:[{type:'loseItem',itemId:'starDust',qty:5}], results:[
        {type:'addItem',itemId:'starDust',qty:8},
        {type:'randomEquip',rarity:'S'},
        {type:'msg',text:'巨兽吞下星尘后平静离去，留下了更多星尘。获得 <hl>星尘碎片 ×8</hl> + S级装备。'}
      ]},
      { text:'封印裂缝', conds:[{type:'atk',op:'>=',val:45}], costs:[{type:'hpCost',val:25}], results:[
        {type:'buff',name:'虚空行者',battles:99,effects:{atk:5,def:5,spd:5,luk:5}},
        {type:'msg',text:'你牺牲鲜血封住了裂缝。获得 <hl>虚空行者</hl>（本幕剩余战斗全属性+5）。'}
      ]},
      { text:'逃离战场', conds:[{type:'spd',op:'>=',val:26}], costs:[], results:[
        {type:'msg',text:'你在巨兽完全冲出裂缝前逃离了。'}
      ]},
    ],
  },
  // ---- 往昔之门 ----
  { id:'pastGates', title:'往昔之门',
    desc:'三扇门悬浮在虚空中。一扇映着你最初的模样，一扇映着最艰难的一战，一扇映着从未发生的未来。"选择吧。"',
    options:[
      { text:'进入过去之门', conds:[], costs:[], results:[
        {type:'clearInventory'},
        {type:'stat',key:'atk',val:10},
        {type:'stat',key:'def',val:10},
        {type:'stat',key:'spd',val:10},
        {type:'stat',key:'luk',val:10},
        {type:'maxHp',val:100},
        {type:'heal',val:999},
        {type:'msg',text:'你选择回到起点——所有装备和物品化为光点消散，但最纯粹的力量涌入体内！<hl>全属性 +10、MaxHP +100</hl>。'},
      ]},
      { text:'进入现在之门', conds:[], costs:[], results:[
        {type:'enhanceEquip'},
        {type:'enhanceEquip'},
        {type:'addItem',itemId:'starDust',qty:5},
        {type:'msg',text:'现在的一切都在光芒中升华。两件装备品质提升 + <hl>星尘碎片 ×5</hl>。'}
      ]},
      { text:'进入未来之门', conds:[{type:'luk',op:'>=',val:28}], costs:[], results:[
        {type:'addItem',itemId:'starSword',qty:1},
        {type:'addItem',itemId:'destinyStar',qty:1},
        {type:'addItem',itemId:'dragonGodArmor',qty:1},
        {type:'msg',text:'未来的你跨越时空送来了三件神器！获得 <hl>星辰之剑+命运之星+龙神重甲</hl>！'}
      ]},
      { text:'不进入任何门', conds:[], costs:[], results:[
        {type:'buff',name:'自由意志',battles:99,effects:{immuneDebuff:true}},
        {type:'msg',text:'你拒绝了所有既定的命运。获得 <hl>自由意志</hl>（本幕剩余战斗无法被降低属性）。'}
      ]},
    ],
  },
  // ---- 终末守望者 ----
  { id:'finalRest', title:'终末守望者',
    desc:'虚空中唯一的实体——一座由白色星尘构成的平台。一个简单的石床和一个冒着热气的泉水。平台边缘刻着："休息，然后战斗。"',
    options:[
      { text:'充分休息', conds:[], costs:[], results:[
        {type:'heal',val:999},
        {type:'clearDebuffs'},
        {type:'msg',text:'你在石床上沉沉睡去，醒来时身心焕然一新。<hp>HP完全恢复</hp>，负面Buff已清除。'}
      ]},
      { text:'在泉水中沐浴', conds:[], costs:[], results:[
        {type:'heal',val:999},
        {type:'maxHp',val:30},
        {type:'msg',text:'星尘泉水渗入你的皮肤。<hp>HP完全恢复</hp> + <hl>MaxHP +30</hl>。'}
      ]},
      { text:'整理装备和物资', conds:[], costs:[], results:[
        {type:'addItem',itemId:'bigHealPotion',qty:3},
        {type:'addItem',itemId:'awakenPotion',qty:2},
        {type:'msg',text:'你在平台角落发现了前人遗留的物资。获得 <hl>大治疗药水 ×3</hl>、<hl>觉醒药剂 ×2</hl>。'}
      ]},
      { text:'冥想备战', conds:[{type:'spd',op:'>=',val:25}], costs:[], results:[
        {type:'buff',name:'终末备战',battles:1,effects:{atk:8,def:8,spd:8,luk:8}},
        {type:'msg',text:'你与虚空共鸣，身心达到巅峰。获得 <hl>终末备战</hl>（与最终Boss战斗时全属性+8）。'}
      ]},
    ],
  },
];

const BOSS_EVENT_ACT6 = {
  id:'boss', title:'命运之座',
  desc:'虚空的最高处，一座由星尘和光芒构成的王座悬浮在万物之上。王座上坐着命运本身的化身——它的面容不断变换：时而是一位老人，时而是一个孩童，时而与你自己一模一样。"你已经看到了无数可能的命运。现在，选择你的结局。"',
};
