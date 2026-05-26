// ============================================================
// js/events_act2.js — 第二幕：幽暗矿洞 事件池
// ============================================================

const EVENT_POOL_ACT2 = [
  // ---- 废弃的轨道 ----
  {
    id: 'tracks',
    title: '废弃的轨道',
    desc: '一条生锈的矿车轨道向黑暗深处延伸。轨道旁散落着几块矿石，一辆半翻的矿车倒在岔路口。轨道分岔处的指示牌已经锈蚀得无法辨认。',
    options: [
      { text:'沿左侧轨道前进', conds:[], costs:[], results:[
        {type:'lukCheck',threshold:40,success:[
          {type:'addItem',itemId:'silverOre',qty:3},
          {type:'addItem',itemId:'goldOre',qty:1},
          {type:'msg',text:'左侧轨道通往一处富矿脉！获得 <hl>银矿石 ×3</hl>、<hl>金矿石 ×1</hl>。'}
        ],fail:[
          {type:'msg',text:'轨道塌方了！你被碎石砸中。'},
          {type:'hpCost',val:15}
        ]},
      ]},
      { text:'沿右侧轨道前进', conds:[], costs:[], results:[
        {type:'combat',enemy:'caveBeetle',rewards:[
          {type:'gold',val:20},
          {type:'addItem',itemId:'ironOre',qty:3},
        ]},
        {type:'msg',text:'一只矿洞甲虫挡在路中央！'}
      ]},
      { text:'修理矿车滑行', conds:[{type:'atk',op:'>=',val:18}], costs:[{type:'hpCost',val:8}], results:[
        {type:'addItem',itemId:'silverOre',qty:2},
        {type:'gold',val:18},
        {type:'msg',text:'你用力将矿车推上轨道，跳上去一路滑行！获得 <hl>银矿石 ×2</hl>、<hl>Gold +25</hl>。'}
      ]},
      { text:'原路绕行', conds:[], costs:[], results:[
        {type:'msg',text:'你决定不冒险，绕过了这段轨道。'}
      ]},
    ],
  },
  // ---- 矿工遗骸 ----
  {
    id: 'minerRemains',
    title: '矿工遗骸',
    desc: '一具穿着矿工服的骷髅靠在岩壁上，手中紧握着一把断柄矿镐。他身旁放着一个锈迹斑斑的铁盒，似乎装着什么遗物。',
    options: [
      { text:'打开铁盒', conds:[], costs:[], results:[
        {type:'addItem',itemId:'silverOre',qty:2},
        {type:'gold',val:14},
        {type:'msg',text:'铁盒中有几块银矿石和金币。获得 <hl>银矿石 ×2</hl>、<hl>Gold +20</hl>。'}
      ]},
      { text:'搜查遗骸全身', conds:[{type:'luk',op:'>=',val:6}], costs:[], results:[
        {type:'addItem',itemId:'goldOre',qty:2},
        {type:'addItem',itemId:'oldPickaxe',qty:1},
        {type:'msg',text:'你在矿工衣袋中找到了金矿石和一把保存完好的旧矿镐！获得 <hl>金矿石 ×2</hl>、<hl>旧矿镐 (C)</hl>。'}
      ]},
      { text:'为矿工安葬', conds:[{type:'def',op:'>=',val:6}], costs:[{type:'hpCost',val:5}], results:[
        {type:'buff',name:'矿工的祝福',battles:3,effects:{def:3}},
        {type:'msg',text:'你搬来石块为矿工垒了一座简易的坟。一股暖意涌上心头。获得 <hl>矿工的祝福</hl>（下3次战斗 DEF+3）。'}
      ]},
      { text:'不予理会', conds:[], costs:[], results:[
        {type:'msg',text:'你对这具遗骸敬而远之。'}
      ]},
    ],
  },
  // ---- 毒气裂隙 ----
  {
    id: 'gasFissure',
    title: '毒气裂隙',
    desc: '前方地面上裂开一道深不见底的缝隙，淡绿色的雾气从中缓缓溢出。吸入少许就让人头晕目眩。裂缝上方的岩壁上挂着一串亮闪闪的矿石。',
    options: [
      { text:'屏息快速采集', conds:[{type:'spd',op:'>=',val:10}], costs:[], results:[
        {type:'addItem',itemId:'silverOre',qty:2},
        {type:'msg',text:'你以极快的速度采集了矿石并退出毒气范围。获得 <hl>银矿石 ×2</hl>。'}
      ]},
      { text:'用布掩住口鼻', conds:[], costs:[{type:'hpCost',val:10}], results:[
        {type:'addItem',itemId:'goldOre',qty:1},
        {type:'addItem',itemId:'silverOre',qty:1},
        {type:'buff',name:'轻微中毒',battles:1,effects:{poisonDmg:3}},
        {type:'msg',text:'你尽可能屏住呼吸采集了矿石，但还是吸入了一些毒气。获得 <hl>金矿石 ×1</hl>、<hl>银矿石 ×1</hl>，但受到轻微中毒（下1次战斗每回合损失3HP）。'}
      ]},
      { text:'制作简易滤毒面罩', conds:[{type:'hasItem',itemId:'lizardScale'}], costs:[{type:'loseItem',itemId:'lizardScale',qty:1}], results:[
        {type:'addItem',itemId:'goldOre',qty:2},
        {type:'addItem',itemId:'silverOre',qty:3},
        {type:'msg',text:'你用蜥蜴鳞片制作了滤毒面罩，安全采集了全部矿石！获得 <hl>金矿石 ×2</hl>、<hl>银矿石 ×3</hl>。'}
      ]},
      { text:'绕道而行', conds:[], costs:[], results:[
        {type:'msg',text:'你捂着口鼻，从安全的上风口绕了过去。'}
      ]},
    ],
  },
  // ---- 矿洞商人 ----
  {
    id: 'mineMerchant',
    title: '矿洞商人',
    desc: '矿洞深处竟有一个小商铺——一个瘦小的老头在岩壁上凿出的壁龛里摆着几张破旧货架。他搓着手笑道："在这鬼地方见到活人不容易啊，给你个优惠价！"',
    shop: true,
    shopItems: [
      { itemId:'longSword', price:70 },
      { itemId:'chainmail', price:65 },
      { itemId:'bigHealPotion', price:40 },
      { itemId:'powerRing', price:55 },
      { itemId:'windBracelet', price:50 },
    ],
    options: [
      { text:'购买商品', conds:[], costs:[], results:[{type:'openShop'}] },
      { text:'出售物品', conds:[], costs:[], results:[{type:'openSell'}] },
      { text:'询问矿洞情报', conds:[{type:'gold',op:'>=',val:10}], costs:[{type:'gold',val:7}], results:[
        {type:'addItem',itemId:'goldOre',qty:1},
        {type:'msg',text:'老头接过金币，低声告诉你前方有一处隐藏的金矿脉。获得 <hl>金矿石 ×1</hl>。'}
      ]},
      { text:'离开', conds:[], costs:[], results:[{type:'msg',text:'你摆摆手，继续深入矿洞。'}] },
    ],
  },
  // ---- 发光蘑菇林 ----
  {
    id: 'mushroomGrove',
    title: '发光蘑菇林',
    desc: '洞壁上长满了发着幽蓝荧光的蘑菇，照亮了一小片地下空间。蘑菇丛中有一个天然形成的石台，似乎可以在这里稍作休整。有些蘑菇看上去可以食用，但颜色鲜艳得可疑。',
    options: [
      { text:'食用蓝色蘑菇', conds:[], costs:[], results:[
        {type:'heal',val:25},
        {type:'buff',name:'蘑菇活力',battles:1,effects:{spd:2}},
        {type:'msg',text:'蓝色蘑菇口感清甜，精力充沛起来。<hp>恢复 25 HP</hp> + 获得 <hl>蘑菇活力</hl>（下1次战斗 SPD+2）。'}
      ]},
      { text:'食用红色蘑菇', conds:[], costs:[], results:[
        {type:'lukCheck',threshold:50,success:[
          {type:'stat',key:'atk',val:2},
          {type:'msg',text:'红色蘑菇虽然辛辣，但一股力量涌入四肢！<hl>永久 ATK+2</hl>。'}
        ],fail:[
          {type:'hpCost',val:10},
          {type:'buff',name:'蘑菇中毒',battles:1,effects:{poisonDmg:3}},
          {type:'msg',text:'红色蘑菇有毒！你感到一阵剧烈的腹痛。HP −10 + <hl>中毒</hl>（下1次战斗每回合损失3HP）。'}
        ]},
      ]},
      { text:'采集蘑菇带走', conds:[{type:'luk',op:'>=',val:5}], costs:[], results:[
        {type:'addItem',itemId:'glowMushroom',qty:2},
        {type:'msg',text:'你小心翼翼地摘下了几朵最肥美的荧光蘑菇。获得 <hl>荧光蘑菇 ×2</hl>。'}
      ]},
      { text:'在石台上休息', conds:[], costs:[], results:[
        {type:'healPct',val:30},
        {type:'msg',text:'你躺在冰凉的石台上闭目养神。<hp>恢复 30% HP</hp>。'}
      ]},
    ],
  },
  // ---- 暗河渡口 ----
  {
    id: 'undergroundRiver',
    title: '暗河渡口',
    desc: '地下暗河挡住了去路。湍急的河水在黑暗中发出轰隆声响。河边系着一条破旧的木船，但船底有一道裂缝。不远处有一座摇摇欲坠的藤桥。',
    options: [
      { text:'修补木船渡河', conds:[{type:'atk',op:'>=',val:16}], costs:[], results:[
        {type:'addItem',itemId:'chainmail',qty:1},
        {type:'msg',text:'你用蛮力将木船裂缝合拢，划到了对岸。对岸的箱子里有一件锁子甲！获得 <hl>锁子甲 (D)</hl>。'}
      ]},
      { text:'走藤桥', conds:[{type:'spd',op:'>=',val:8}], costs:[], results:[
        {type:'msg',text:'你踏着藤桥轻巧地过了暗河。'}
      ]},
      { text:'游过去', conds:[], costs:[{type:'hpCost',val:20}], results:[
        {type:'msg',text:'你咬牙跳入冰凉的暗河，奋力游到了对岸。'}
      ]},
      { text:'沿河岸寻找浅滩', conds:[], costs:[{type:'hpCost',val:8}], results:[
        {type:'addItem',itemId:'ironOre',qty:3},
        {type:'msg',text:'你沿河岸走了一段，找到了一处浅滩。途中还捡到了一些铁矿石。获得 <hl>铁矿石 ×3</hl>。'}
      ]},
    ],
  },
  // ---- 蜘蛛巢室 ----
  {
    id: 'spiderNest',
    title: '蜘蛛巢室',
    desc: '岩壁上一片白色的蛛网密密麻麻地覆盖着整个洞室。几只拳头大的幼蛛在网间爬动。洞室中央，一只体型稍小的洞穴蜘蛛正守护着它的卵囊。卵囊在微光中闪烁着——里面似乎裹着什么发光的物体。',
    options: [
      { text:'正面击杀', conds:[], costs:[], results:[
        {type:'combat',enemy:'youngSpider',rewards:[
          {type:'gold',val:28},
          {type:'addItem',itemId:'swiftLeather',qty:1,chance:40},
        ]},
        {type:'msg',text:'你拔剑冲向幼年蛛后！'}
      ]},
      { text:'偷袭卵囊后逃跑', conds:[{type:'spd',op:'>=',val:9}], costs:[], results:[
        {type:'addItem',itemId:'spiderSilk',qty:2},
        {type:'msg',text:'你趁蛛后不备，迅速抓了几把蛛丝卵囊后全速撤离。获得 <hl>蜘蛛丝 ×2</hl>。'}
      ]},
      { text:'放火烧网', conds:[{type:'hasItem',itemId:'wolfFang'}], costs:[{type:'loseItem',itemId:'wolfFang',qty:1}], results:[
        {type:'addItem',itemId:'spiderSilk',qty:3},
        {type:'msg',text:'你用狼牙中的磷粉点燃蛛网，蛛后惊慌逃窜。获得 <hl>蜘蛛丝 ×3</hl>。'}
      ]},
      { text:'悄悄绕过', conds:[], costs:[], results:[
        {type:'msg',text:'你贴着洞壁，蹑手蹑脚地绕了过去。'}
      ]},
    ],
  },
  // ---- 绝望大厅 ----
  {
    id: 'despairHall',
    title: '绝望大厅',
    desc: '一个巨大的天然洞厅出现在眼前。洞厅中央，一只体型庞大的矿洞甲虫王正趴在一堆闪闪发光的矿石上打盹。它的甲壳如同黑铁般厚重，每一次呼吸都让地面微微震动。矿石堆中隐约可见一把品质不错的武器。',
    options: [
      { text:'正面挑战', conds:[], costs:[], results:[
        {type:'combat',enemy:'beetleKing',rewards:[
          {type:'gold',val:40},
          {type:'randomEquip',rarity:'C-B'},
        ]},
        {type:'msg',text:'你深吸一口气，走向矿石堆上的甲虫王！'}
      ]},
      { text:'潜行偷取矿石', conds:[{type:'spd',op:'>=',val:10}], costs:[], results:[
        {type:'addItem',itemId:'goldOre',qty:3},
        {type:'addItem',itemId:'silverOre',qty:5},
        {type:'msg',text:'你蹑手蹑脚地接近矿石堆，悄无声息地装满了背包。获得 <hl>金矿石 ×3</hl>、<hl>银矿石 ×5</hl>。'}
      ]},
      { text:'设置落石陷阱', conds:[{type:'atk',op:'>=',val:18}], costs:[{type:'hpCost',val:5}], results:[
        {type:'msg',text:'你推动洞顶巨石砸中甲虫王，它愤怒地朝你冲来！'},
        {type:'combat',enemy:'beetleKing',rewards:[
          {type:'gold',val:40},
          {type:'randomEquip',rarity:'C-B'},
        ]},
      ]},
      { text:'绕过大厅', conds:[], costs:[], results:[
        {type:'msg',text:'你屏住呼吸，从大厅边缘绕了过去。'}
      ]},
    ],
  },
  // ---- 坍塌的密道 ----
  {
    id: 'collapsedTunnel',
    title: '坍塌的密道',
    desc: '一堆塌方的碎石后面露出一扇锈蚀的铁门。门缝中透出的冷风带着古老的寒意，门后似乎藏着什么。',
    options: [
      { text:'撬开铁门', conds:[{type:'spd',op:'>=',val:10}], costs:[], results:[
        {type:'addItem',itemId:'iceSword',qty:1},
        {type:'gold',val:35},
        {type:'msg',text:'你灵巧地撬开了锈锁！门后是一间密室，存放着寒冰长剑和金币。获得 <hl>寒冰长剑 (B)</hl>、<hl>Gold +50</hl>。'}
      ]},
      { text:'暴力破门', conds:[{type:'atk',op:'>=',val:20}], costs:[{type:'hpCost',val:10}], results:[
        {type:'addItem',itemId:'chainmail',qty:1},
        {type:'gold',val:20},
        {type:'msg',text:'你用肩膀撞开了铁门！获得 <hl>锁子甲 (D)</hl>、<hl>Gold +30</hl>。'}
      ]},
      { text:'从门缝窥探', conds:[{type:'luk',op:'>=',val:7}], costs:[], results:[
        {type:'randomEquip',rarity:'C'},
        {type:'msg',text:'你透过门缝看到了一件闪闪发光的装备，用细枝勾了出来！'}
      ]},
      { text:'继续前进', conds:[], costs:[], results:[
        {type:'msg',text:'你决定不在此停留，继续探索矿洞。'}
      ]},
    ],
  },
  // ---- 矿石提炼炉 ----
  {
    id: 'oreRefinery',
    title: '矿石提炼炉',
    desc: '矿洞一角有一座古老的提炼炉，炉膛中尚有余温。旁边散落着矿渣和几块半成品锭。墙上贴着一张模糊的提炼配方：铁矿换银，银矿换金。',
    options: [
      { text:'提炼铁矿石', conds:[{type:'hasItem',itemId:'ironOre',qty:2}], costs:[{type:'loseItem',itemId:'ironOre',qty:2}], results:[
        {type:'addItem',itemId:'silverOre',qty:1},
        {type:'msg',text:'你将铁矿石投入炉中，提纯出一块银矿石。获得 <hl>银矿石 ×1</hl>。'}
      ]},
      { text:'提炼银矿石', conds:[{type:'hasItem',itemId:'silverOre',qty:2}], costs:[{type:'loseItem',itemId:'silverOre',qty:2}], results:[
        {type:'addItem',itemId:'goldOre',qty:1},
        {type:'msg',text:'你将银矿石投入炉中，提纯出一块金矿石。获得 <hl>金矿石 ×1</hl>。'}
      ]},
      { text:'大量提炼', conds:[{type:'hasItem',itemId:'ironOre',qty:5}], costs:[{type:'loseItem',itemId:'ironOre',qty:5}], results:[
        {type:'addItem',itemId:'goldOre',qty:2},
        {type:'msg',text:'你连续提炼了五块铁矿石，最终得到两块金矿石！获得 <hl>金矿石 ×2</hl>。'}
      ]},
      { text:'检查炉子', conds:[], costs:[], results:[
        {type:'addItem',itemId:'ironOre',qty:1},
        {type:'msg',text:'炉膛里还剩一块未取出的铁矿石。获得 <hl>铁矿石 ×1</hl>。'}
      ]},
    ],
  },
  // ---- 回声洞窟 ----
  {
    id: 'echoCave',
    title: '回声洞窟',
    desc: '洞壁上布满了细小的孔洞，你发出的任何声音都会被放大数倍后反射回来。这里安静得令人不安——直到你听到黑暗中有什么东西在回应你的呼吸声。',
    options: [
      { text:'大声喊叫', conds:[], costs:[], results:[
        {type:'lukCheck',threshold:40,success:[
          {type:'msg',text:'回声惊飞了暗处的蝙蝠群，它们留下的粪便中混着几块未消化的矿石。获得 <hl>银矿石 ×3</hl>。'},
          {type:'addItem',itemId:'silverOre',qty:3},
        ],fail:[
          {type:'combat',enemy:'caveBeetle',rewards:[{type:'gold',val:18}]},
          {type:'msg',text:'回声惊动了一只矿洞甲虫！'},
        ]},
      ]},
      { text:'静步穿过', conds:[{type:'spd',op:'>=',val:8}], costs:[], results:[
        {type:'msg',text:'你悄无声息地通过了回声洞窟。'}
      ]},
      { text:'用矿石堵住孔洞', conds:[{type:'hasItem',itemId:'ironOre'}], costs:[{type:'loseItem',itemId:'ironOre',qty:1}], results:[
        {type:'addItem',itemId:'spiderSilk',qty:2},
        {type:'msg',text:'你用铁矿石堵住了几个孔洞，改变了回声模式，意外发现了藏在孔洞中的蜘蛛丝。获得 <hl>蜘蛛丝 ×2</hl>。'}
      ]},
      { text:'快速冲过', conds:[], costs:[{type:'hpCost',val:8}], results:[
        {type:'msg',text:'你一口气冲了过去，但被凸起的岩壁擦伤了。'}
      ]},
    ],
  },
  // ---- 地脉温泉 ----
  {
    id: 'hotSpring',
    title: '地脉温泉',
    desc: '矿洞深处竟有一处天然温泉，水面冒着热气，空气中弥漫着硫磺的气味。温泉旁的岩石上长着几株只在温泉边生长的稀有草药。泉水呈现乳白色，似乎富含矿物质。',
    options: [
      { text:'浸泡温泉', conds:[], costs:[], results:[
        {type:'heal',val:35},
        {type:'maxHp',val:10},
        {type:'msg',text:'你泡在温泉中，矿物质渗入皮肤，体质得到了永久强化。<hp>MaxHP +10</hp>，恢复 35 HP。'}
      ]},
      { text:'采集温泉草药', conds:[], costs:[], results:[
        {type:'addItem',itemId:'glowMushroom',qty:3},
        {type:'msg',text:'你采集了温泉边生长的稀有草药。获得 <hl>荧光蘑菇 ×3</hl>。'}
      ]},
      { text:'喝下温泉水', conds:[], costs:[{type:'hpCost',val:10}], results:[
        {type:'maxHp',val:5},
        {type:'msg',text:'温泉水辛辣刺喉，但喝下后体内涌出一股力量。<hp>MaxHP +5</hp>，但喉咙灼痛让你损失了 10 HP。'}
      ]},
      { text:'洗把脸就走', conds:[], costs:[], results:[
        {type:'msg',text:'你用温泉洗了把脸，精神了许多。'}
      ]},
    ],
  },
  // ---- 矿车滑轨 ----
  {
    id: 'cartRide',
    title: '矿车滑轨',
    desc: '一条完好的矿车轨道沿着斜坡向下延伸。轨道尽头停着一辆可用的矿车，手刹看起来仍然可靠。沿着轨道滑下去可以快速穿越一大段矿道——但你不知道下面有什么。',
    options: [
      { text:'乘坐矿车滑下', conds:[], costs:[], results:[
        {type:'lukCheck',threshold:45,success:[
          {type:'gold',val:28},
          {type:'addItem',itemId:'silverOre',qty:2},
          {type:'msg',text:'矿车平稳地滑过矿道，直接冲到一处富矿脉附近！获得 <hl>Gold +40</hl>、<hl>银矿石 ×2</hl>。'}
        ],fail:[
          {type:'hpCost',val:12},
          {type:'msg',text:'矿车在一处急弯脱轨了！你被甩了出去。HP −12。'}
        ]},
      ]},
      { text:'检修刹车后乘坐', conds:[{type:'atk',op:'>=',val:15}], costs:[], results:[
        {type:'gold',val:20},
        {type:'msg',text:'你加固了刹车装置，矿车平稳地滑到了矿道深处。获得 <hl>Gold +30</hl>。'}
      ]},
      { text:'沿轨道步行', conds:[], costs:[], results:[
        {type:'addItem',itemId:'ironOre',qty:2},
        {type:'msg',text:'你沿着轨道慢慢走，在枕木旁捡到了几块散落的铁矿石。获得 <hl>铁矿石 ×2</hl>。'}
      ]},
      { text:'原路返回', conds:[], costs:[], results:[
        {type:'msg',text:'你看了一眼漆黑的矿道深处，决定不过去。'}
      ]},
    ],
  },
];

const BOSS_EVENT_ACT2 = {
  id: 'boss',
  title: '矿洞之主',
  desc: '矿洞的最深处，岩壁上嵌满了发光的矿石，将整个洞室映成幽绿色。地面上铺满了各种动物的骸骨。一头体型庞大的岩石巨虫从矿脉中钻出，浑身覆盖着坚硬的结晶甲壳，口中的酸液滴在岩石上，发出嗤嗤的腐蚀声。',
};
