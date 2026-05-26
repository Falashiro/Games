// ============================================================
// js/events_act5.js — 第五幕：龙眠之地 事件池
// ============================================================

const EVENT_POOL_ACT5 = [
  // ---- 熔岩河畔 ----
  { id:'lavaRiver', title:'熔岩河畔',
    desc:'一条宽阔的熔岩河横在前方。河面上漂浮着半熔化的金块和宝石，在炽热的光芒下闪闪发光。河边有几块黑曜岩石可以垫脚。',
    options:[
      { text:'用矿石制作耐热容器捞金', conds:[{type:'hasItem',itemId:'goldOre',qty:2}], costs:[{type:'loseItem',itemId:'goldOre',qty:2}], results:[
        {type:'gold',val:120},
        {type:'addItem',itemId:'ancientCoin',qty:3},
        {type:'msg',text:'你用金矿石制成了耐热容器，捞起了熔岩中的财宝！获得 <hl>Gold +120</hl>、<hl>古代硬币 ×3</hl>。'}
      ]},
      { text:'踩着黑曜石渡河', conds:[{type:'spd',op:'>=',val:16}], costs:[{type:'hpCost',val:15}], results:[
        {type:'gold',val:60},
        {type:'msg',text:'你踏着滚烫的黑曜石跳过了熔岩河。获得 <hl>Gold +60</hl>。'}
      ]},
      { text:'用龙鳞隔热渡河', conds:[{type:'hasItem',itemId:'dragonScaleFrag'}], costs:[{type:'loseItem',itemId:'dragonScaleFrag',qty:1}], results:[
        {type:'gold',val:80},
        {type:'addItem',itemId:'goldOre',qty:3},
        {type:'msg',text:'龙鳞的隔热效果让你安全渡河。获得 <hl>Gold +80</hl>、<hl>金矿石 ×3</hl>。'}
      ]},
      { text:'沿河岸绕行', conds:[], costs:[{type:'hpCost',val:8}], results:[
        {type:'msg',text:'你沿着河岸绕了一大圈。'}
      ]},
    ],
  },
  // ---- 龙巢商人 ----
  { id:'dragonMerchant', title:'龙巢商人', shop:true,
    desc:'火山岩壁上凿出的洞穴中，一个穿着隔热石棉衣的矮人正在锻造台前忙碌。"来得好！我这可都是龙巢里的好东西！"',
    shopItems:[
      { itemId:'shadowBlade', price:220 }, { itemId:'holySword', price:250 },
      { itemId:'magicPlate', price:230 }, { itemId:'holyShield', price:250 },
      { itemId:'vampRing', price:240 }, { itemId:'blessedFeather', price:220 },
      { itemId:'awakenPotion', price:200 },
    ],
    options:[
      { text:'购买商品', conds:[], costs:[], results:[{type:'openShop'}] },
      { text:'出售物品', conds:[], costs:[], results:[{type:'openSell'}] },
      { text:'用龙鳞碎片交易', conds:[{type:'hasItem',itemId:'dragonScaleFrag',qty:3}], costs:[{type:'loseItem',itemId:'dragonScaleFrag',qty:3}], results:[
        {type:'addItem',itemId:'dragonFang',qty:1},
        {type:'msg',text:'矮人接过三片龙鳞，从锻造台下取出一把龙牙！获得 <hl>龙牙 (S)</hl>。'}
      ]},
      { text:'离开', conds:[], costs:[], results:[{type:'msg',text:'你对矮人点点头，继续深入火山。'}] },
    ],
  },
  // ---- 龙骨祭坛 ----
  { id:'dragonAltar', title:'龙骨祭坛',
    desc:'一副完整的巨龙骨架盘踞在火山口一侧，心脏位置悬浮着一颗跳动的暗红色光球。碑文写着："饮吾之血，承吾之力。"',
    options:[
      { text:'饮下龙血精华', conds:[{type:'hp',op:'>=',val:60}], costs:[{type:'hpCost',val:40}], results:[
        {type:'buff',name:'龙裔血脉',battles:99,effects:{atk:8,def:5}},
        {type:'msg',text:'龙血灼烧着你的血管，但你感到前所未有的力量！获得 <hl>龙裔血脉</hl>（本幕剩余战斗 ATK+8 DEF+5，每回合损失5HP）。'}
      ]},
      { text:'提取龙血保存', conds:[{type:'luk',op:'>=',val:16}], costs:[{type:'hpCost',val:15}], results:[
        {type:'addItem',itemId:'dragonBlood',qty:1},
        {type:'msg',text:'你小心提取了龙血精华。获得 <hl>龙血精华 (B)</hl>。'}
      ]},
      { text:'用龙鳞共鸣', conds:[{type:'hasItem',itemId:'dragonScaleFrag',qty:2}], costs:[{type:'loseItem',itemId:'dragonScaleFrag',qty:2}], results:[
        {type:'stat',key:'atk',val:3},{type:'stat',key:'def',val:2},
        {type:'msg',text:'龙鳞与龙骨产生共鸣！<hl>永久 ATK+3 DEF+2</hl>。'}
      ]},
      { text:'在龙骨前冥想', conds:[{type:'spd',op:'>=',val:18}], costs:[], results:[
        {type:'stat',key:'spd',val:3},
        {type:'buff',name:'龙骨加护',battles:5,effects:{def:4}},
        {type:'msg',text:'龙骨的精魂赋予你庇护。<hl>永久 SPD+3</hl> + 获得 <hl>龙骨加护</hl>（下5次战斗 DEF+4）。'}
      ]},
    ],
  },
  // ---- 幼龙巢穴 ----
  { id:'dragonNest', title:'幼龙巢穴',
    desc:'三只半人高的幼年火龙正趴在金币堆上打盹。金币堆的最上方，一把泛着金光的武器格外醒目。',
    options:[
      { text:'击败幼龙夺取武器', conds:[], costs:[], results:[
        {type:'combat',enemy:'youngDragon',rewards:[{type:'addItem',itemId:'dragonFang',qty:1},{type:'gold',val:120}]},
        {type:'msg',text:'幼龙们被惊醒，愤怒地朝你喷出火焰！'}
      ]},
      { text:'悄悄偷走武器', conds:[{type:'spd',op:'>=',val:20}], costs:[], results:[
        {type:'addItem',itemId:'dragonFang',qty:1},
        {type:'msg',text:'你蹑手蹑脚地绕过幼龙，取走了龙牙！'}
      ]},
      { text:'用食物引诱幼龙', conds:[{type:'hasItem',itemId:'glowMushroom',qty:3}], costs:[{type:'loseItem',itemId:'glowMushroom',qty:3}], results:[
        {type:'addItem',itemId:'dragonFang',qty:1},
        {type:'gold',val:80},
        {type:'msg',text:'幼龙们追着荧光蘑菇跑开了。获得 <hl>龙牙 (S)</hl>、<hl>Gold +80</hl>。'}
      ]},
      { text:'不惊动幼龙', conds:[], costs:[], results:[{type:'msg',text:'你悄悄退出了巢穴。'}] },
    ],
  },
  // ---- 熔岩锻造炉 ----
  { id:'lavaForge', title:'熔岩锻造炉',
    desc:'火山口旁的天然熔岩锻造炉——岩浆流入一个完美的凹坑，坑边的锻造工具已被高温烤得发红。',
    options:[
      { text:'锻造新装备', conds:[{type:'hasItem',itemId:'goldOre',qty:3},{type:'hasItem',itemId:'silverOre',qty:5}], costs:[{type:'loseItem',itemId:'goldOre',qty:3},{type:'loseItem',itemId:'silverOre',qty:5}], results:[
        {type:'addItem',itemId:'holySword',qty:1},
        {type:'addItem',itemId:'holyShield',qty:1},
        {type:'msg',text:'你用熔岩锻造了圣剑和圣盾！获得 <hl>圣剑 (A)</hl> + <hl>圣盾 (A)</hl>。'}
      ]},
      { text:'强化已有装备', conds:[{type:'hasItem',itemId:'dragonScaleFrag',qty:2}], costs:[{type:'loseItem',itemId:'dragonScaleFrag',qty:2}], results:[
        {type:'enhanceEquip'},
        {type:'msg',text:'龙鳞在熔岩中与你的装备融为一体！'}
      ]},
      { text:'淬炼饰品', conds:[{type:'hasItem',itemId:'purpleShard',qty:3}], costs:[{type:'loseItem',itemId:'purpleShard',qty:3}], results:[
        {type:'addItem',itemId:'phoenixFeather',qty:1},
        {type:'msg',text:'紫水晶在熔岩中淬炼成了凤凰羽毛。获得 <hl>凤凰羽毛 (A)</hl>。'}
      ]},
      { text:'小试牛刀', conds:[{type:'hasItem',itemId:'ironOre',qty:5}], costs:[{type:'loseItem',itemId:'ironOre',qty:5}], results:[
        {type:'randomEquip',rarity:'B'},
        {type:'msg',text:'你用铁矿石练了练手，打出了一件不错的装备。'}
      ]},
      { text:'没有材料，离开锻造炉', conds:[], costs:[], results:[
        {type:'msg',text:'你缺少锻造材料，只能遗憾离开。'}
      ]},
    ],
  },
  // ---- 龙语石碑 ----
  { id:'dragonRunes', title:'龙语石碑',
    desc:'火山口旁立着几块巨大的石碑，用龙语刻满了古老的文字。碑文在熔岩光芒下闪烁金光。中央有一个小型法阵。',
    options:[
      { text:'站在法阵中学习龙语', conds:[{type:'luk',op:'>=',val:18}], costs:[], results:[
        {type:'stat',key:'atk',val:3},{type:'stat',key:'luk',val:3},
        {type:'msg',text:'龙语的力量涌入你的脑海！<hl>永久 ATK+3 LUK+3</hl>。'}
      ]},
      { text:'拓印全部碑文', conds:[{type:'spd',op:'>=',val:18}], costs:[], results:[
        {type:'addItem',itemId:'dragonRune',qty:1},
        {type:'stat',key:'luk',val:2},
        {type:'msg',text:'你拓印了全部龙语碑文。<hl>永久 LUK+2</hl> + 获得 <hl>龙语拓片 (B)</hl>。'}
      ]},
      { text:'用龙鳞激活石碑', conds:[{type:'hasItem',itemId:'dragonScaleFrag',qty:3}], costs:[{type:'loseItem',itemId:'dragonScaleFrag',qty:3}], results:[
        {type:'stat',key:'atk',val:5},{type:'stat',key:'def',val:3},{type:'stat',key:'spd',val:3},
        {type:'msg',text:'三片龙鳞同时激活了所有石碑！<hl>永久 ATK+5 DEF+3 SPD+3</hl>！'}
      ]},
      { text:'砸碎石碑取走金粉', conds:[{type:'atk',op:'>=',val:35}], costs:[{type:'hpCost',val:25}], results:[
        {type:'gold',val:200},
        {type:'addItem',itemId:'dragonScaleFrag',qty:2},
        {type:'msg',text:'你砸碎石碑取走了上面的金粉。获得 <hl>Gold +200</hl>、<hl>龙鳞碎片 ×2</hl>。'}
      ]},
      { text:'看不懂龙语，离开石碑', conds:[], costs:[], results:[
        {type:'msg',text:'你端详了石碑半天，一个字也看不懂，只好离开。'}
      ]},
    ],
  },
  // ---- 炽热炼狱 ----
  { id:'lavaRealm', title:'炽热炼狱',
    desc:'前方的通道完全被岩浆覆盖，只有几根石柱可以落脚。通道尽头，一只巨大的熔岩元素正在岩浆中沐浴。',
    options:[
      { text:'挑战熔岩元素', conds:[], costs:[], results:[
        {type:'combat',enemy:'lavaElemental',rewards:[{type:'gold',val:130},{type:'randomEquip',rarity:'A'}]},
        {type:'msg',text:'熔岩元素凝聚成燃烧的拳头！'}
      ]},
      { text:'跳跃石柱通过', conds:[{type:'spd',op:'>=',val:22}], costs:[], results:[
        {type:'gold',val:50},
        {type:'msg',text:'你在石柱间轻盈跳跃，安全通过。获得 <hl>Gold +50</hl>。'}
      ]},
      { text:'用冰属性武器冻结岩浆', conds:[{type:'hasItem',itemId:'iceSword'}], costs:[], results:[
        {type:'gold',val:80},
        {type:'msg',text:'寒冰长剑冻结了岩浆，你从容走过。获得 <hl>Gold +80</hl>。'}
      ]},
      { text:'投石引开熔岩元素', conds:[{type:'atk',op:'>=',val:35}], costs:[{type:'hpCost',val:10}], results:[
        {type:'msg',text:'你投出巨石引开了熔岩元素的注意，快速通过。'}
      ]},
    ],
  },
  // ---- 龙王寝宫 ----
  { id:'dragonPalace', title:'龙王寝宫',
    desc:'一扇龙脊骨巨门半开着，门后走廊铺满黄金。走廊尽头是一张巨大的龙床——但上面并没有龙。宝箱中的宝物几乎溢出来。',
    options:[
      { text:'搜刮宝箱', conds:[], costs:[], results:[
        {type:'gold',val:200},
        {type:'randomEquip',rarity:'S'},
        {type:'buff',name:'龙之诅咒',battles:99,effects:{poisonDmg:8}},
        {type:'msg',text:'你大肆搜刮宝箱，但触发了龙之诅咒！<hl>Gold +200</hl> + S级装备，但本幕剩余战斗每回合损失8HP。'}
      ]},
      { text:'研究族谱', conds:[{type:'luk',op:'>=',val:20}], costs:[], results:[
        {type:'maxHp',val:30},
        {type:'heal',val:999},
        {type:'msg',text:'族谱揭示了龙血的秘密。<hl>永久 MaxHP +30</hl> + HP回满。'}
      ]},
      { text:'取少量贡品', conds:[], costs:[], results:[
        {type:'gold',val:100},
        {type:'randomEquip',rarity:'A'},
        {type:'msg',text:'你恭敬地取了一小份。<hl>Gold +100</hl> + A级装备，无副作用。'}
      ]},
      { text:'向龙床致敬后退出', conds:[], costs:[], results:[
        {type:'buff',name:'龙王默许',battles:99,effects:{atk:5,spd:3}},
        {type:'msg',text:'龙床微微发光——你获得了龙王的默许。获得 <hl>龙王默许</hl>（本幕剩余战斗 ATK+5 SPD+3）。'}
      ]},
    ],
  },
  // ---- 龙鳞矿脉 ----
  { id:'dragonVein', title:'龙鳞矿脉',
    desc:'一面岩壁上密密麻麻地嵌着数百年来巨龙蜕下的鳞片。鳞片已被火山热力自然淬炼，坚硬如钢却轻如羽毛。',
    options:[
      { text:'徒手采集', conds:[{type:'atk',op:'>=',val:30}], costs:[], results:[
        {type:'addItem',itemId:'dragonScaleFrag',qty:3},
        {type:'msg',text:'你用力从岩壁上撬下几片龙鳞。获得 <hl>龙鳞碎片 ×3</hl>。'}
      ]},
      { text:'用工具精细开采', conds:[{type:'spd',op:'>=',val:19}], costs:[], results:[
        {type:'addItem',itemId:'dragonScaleFrag',qty:5},
        {type:'msg',text:'你精细地开采了大量龙鳞。获得 <hl>龙鳞碎片 ×5</hl>。'}
      ]},
      { text:'爆破开采', conds:[{type:'hasItem',itemId:'purpleShard',qty:2}], costs:[{type:'loseItem',itemId:'purpleShard',qty:2}], results:[
        {type:'addItem',itemId:'dragonScaleFrag',qty:8},
        {type:'msg',text:'紫水晶引爆了矿脉！获得 <hl>龙鳞碎片 ×8</hl>。'}
      ]},
      { text:'只取表面几片', conds:[], costs:[], results:[
        {type:'addItem',itemId:'dragonScaleFrag',qty:1},
        {type:'msg',text:'你随手取了几片表面的龙鳞。获得 <hl>龙鳞碎片 ×1</hl>。'}
      ]},
    ],
  },
];

const BOSS_EVENT_ACT5 = {
  id:'boss', title:'古龙之王',
  desc:'火山口的最高处，一头体型超乎想象的远古巨龙从岩浆中升起。它的翼展遮蔽了火山口上方的天空，鳞片上流淌着熔岩般的光芒。它是这座龙巢的主人，已经在此沉睡了千年——而你的到来惊醒了它。',
};
