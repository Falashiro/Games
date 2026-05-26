// ============================================================
// js/events_act3.js — 第三幕：古代遗迹 事件池
// ============================================================

const EVENT_POOL_ACT3 = [
  // ---- 符文石碑 ----
  {
    id: 'runeStone',
    title: '符文石碑',
    desc: '一座两人高的石碑矗立在遗迹中央，碑面上刻满了闪烁着微光的古代符文。你能感受到符文中的魔力在流动。石碑前方有三个凹陷，似乎可以放入符文碎片来激活它。',
    options: [
      { text:'注入魔力激活', conds:[{type:'hp',op:'>=',val:30}], costs:[{type:'hpCost',val:20}], results:[
        {type:'stat',key:'spd',val:2},
        {type:'buff',name:'魔力共鸣',battles:2,effects:{atk:3}},
        {type:'msg',text:'你将手掌按在碑面上，魔力涌入体内！<hl>永久 SPD+2</hl> + 获得 <hl>魔力共鸣</hl>（下2次战斗 ATK+3）。'}
      ]},
      { text:'放入一枚符文碎片', conds:[{type:'hasItem',itemId:'runeShard'}], costs:[{type:'loseItem',itemId:'runeShard',qty:1}], results:[
        {type:'stat',key:'luk',val:2},
        {type:'addItem',itemId:'runeStoneAtk',qty:1},
        {type:'msg',text:'符文碎片嵌入凹槽，石碑发出耀眼光芒！<hl>永久 LUK+2</hl> + 获得 <hl>符文石·力 (B)</hl>。'}
      ]},
      { text:'放入两枚符文碎片', conds:[{type:'hasItem',itemId:'runeShard',qty:2}], costs:[{type:'loseItem',itemId:'runeShard',qty:2}], results:[
        {type:'stat',key:'atk',val:2},
        {type:'stat',key:'luk',val:2},
        {type:'addItem',itemId:'runeStoneDef',qty:1},
        {type:'msg',text:'两枚碎片同时嵌入，石碑震动起来！<hl>永久 ATK+2、LUK+2</hl> + 获得 <hl>符文石·盾 (B)</hl>。'}
      ]},
      { text:'拓印碑文后离开', conds:[], costs:[], results:[
        {type:'addItem',itemId:'runeRubbing',qty:1},
        {type:'msg',text:'你仔细地将碑文拓印下来。获得 <hl>符文拓片 (D)</hl>。'}
      ]},
    ],
  },
  // ---- 魔力喷泉 ----
  {
    id: 'magicFountain',
    title: '魔力喷泉',
    desc: '遗迹庭院中，一股清澈的泉水从石雕鱼口中流出。泉水中含有微弱的魔力，喝下后感到精力充沛。泉底沉着几枚古代硬币，在幽光中闪闪发光。',
    options: [
      { text:'饮用泉水', conds:[], costs:[], results:[
        {type:'heal',val:30},
        {type:'buff',name:'魔力泉涌',battles:2,effects:{healPerRound:3}},
        {type:'msg',text:'甘甜的泉水入喉，魔力在体内流淌。<hp>恢复 30 HP</hp> + 获得 <hl>魔力泉涌</hl>（下2次战斗每回合恢复3HP）。'}
      ]},
      { text:'在泉中沐浴', conds:[{type:'hp',op:'>=',val:50}], costs:[{type:'hpCost',val:10}], results:[
        {type:'heal',val:999},
        {type:'msg',text:'你浸入泉水中，所有伤口愈合，负面效果也随之消散。<hp>完全恢复 HP</hp>，负面Buff已清除。'}
      ]},
      { text:'捞取泉底硬币', conds:[{type:'spd',op:'>=',val:9}], costs:[], results:[
        {type:'gold',val:60},
        {type:'addItem',itemId:'ancientCoin',qty:1},
        {type:'msg',text:'你在不搅浑泉水的情况下捞起了硬币。获得 <hl>Gold +60</hl>、<hl>古代硬币 ×1</hl>。'}
      ]},
      { text:'装满水袋', conds:[], costs:[], results:[
        {type:'addItem',itemId:'magicSpring',qty:2},
        {type:'msg',text:'你用水袋装满了含有魔力的泉水。获得 <hl>魔力泉水 ×2</hl>。'}
      ]},
    ],
  },
  // ---- 古籍馆 ----
  {
    id: 'library',
    title: '古籍馆',
    desc: '一间保存相对完好的圆形大厅，墙壁上嵌满了石质书架。大多数古籍已经化为灰尘，但角落里一个石台上的金属盒仍然完好。金属盒上有复杂的锁扣，旁边散落着几张残页。',
    options: [
      { text:'阅读残页', conds:[{type:'luk',op:'>=',val:8}], costs:[], results:[
        {type:'stat',key:'luk',val:2},
        {type:'msg',text:'残页记载着古老的智慧，阅读后你感到灵光一现。<hl>永久 LUK+2</hl>。'}
      ]},
      { text:'尝试开锁', conds:[{type:'spd',op:'>=',val:10}], costs:[], results:[
        {type:'lukCheck',threshold:35,success:[
          {type:'addItem',itemId:'magicPlate',qty:1},
          {type:'msg',text:'锁扣应声而开，金属盒中是一件魔法板甲！获得 <hl>魔法板甲 (A)</hl>。'}
        ],fail:[
          {type:'hpCost',val:18},
          {type:'msg',text:'触发了魔法陷阱！一道电弧击中了你。HP −18。'}
        ]},
      ]},
      { text:'暴力砸开', conds:[{type:'atk',op:'>=',val:22}], costs:[], results:[
        {type:'addItem',itemId:'powerRing',qty:1},
        {type:'gold',val:40},
        {type:'msg',text:'你一拳砸碎了锁扣，但金属盒也受损了。获得 <hl>力量戒指 (D)</hl>、<hl>Gold +40</hl>。'}
      ]},
      { text:'用符文碎片解锁', conds:[{type:'hasItem',itemId:'runeShard'}], costs:[{type:'loseItem',itemId:'runeShard',qty:1}], results:[
        {type:'addItem',itemId:'magicPlate',qty:1},
        {type:'msg',text:'符文碎片消解了锁上的魔力禁制，盒子无声打开！获得 <hl>魔法板甲 (A)</hl>。'}
      ]},
    ],
  },
  // ---- 流浪法师 ----
  {
    id: 'wanderingMage',
    title: '流浪法师',
    desc: '一个披着深蓝长袍的老法师正坐在倒塌的石柱上读书。他抬起头，推了推半月形的眼镜："冒险者？来得正好。我在这里研究古代魔法，顺带做点小生意。以物易物也行，金币也行，随你方便。"',
    shop: true,
    shopItems: [
      { itemId:'vampFang', price:80 },
      { itemId:'iceSword', price:140 },
      { itemId:'lifeAmulet', price:80 },
      { itemId:'initBoots', price:85 },
      { itemId:'bigHealPotion', price:40 },
      { itemId:'atkPotion', price:35 },
    ],
    options: [
      { text:'购买商品', conds:[], costs:[], results:[{type:'openShop'}] },
      { text:'出售物品', conds:[], costs:[], results:[{type:'openSell'}] },
      { text:'用法师的魔法强化装备', conds:[{type:'gold',op:'>=',val:80}], costs:[{type:'gold',val:80}], results:[
        {type:'enhanceEquip'},
        {type:'msg',text:'法师挥动法杖，一道魔法光芒笼罩了你的装备。'}
      ]},
      { text:'离开', conds:[], costs:[], results:[{type:'msg',text:'你对法师点点头，继续探索遗迹。'}] },
    ],
  },
  // ---- 塌陷的回廊 ----
  {
    id: 'collapsedCorridor',
    title: '塌陷的回廊',
    desc: '连接两座建筑的石头回廊已经半塌，地面上裂开了数道深沟。沟底隐约可见散落的宝箱碎片和骸骨。对面墙上固定着几根垂下的铁链。',
    options: [
      { text:'跳跃通过裂缝', conds:[{type:'spd',op:'>=',val:12}], costs:[], results:[
        {type:'addItem',itemId:'ancientCoin',qty:2},
        {type:'msg',text:'你助跑后一个飞跃跨过了裂缝，在对面发现了古代硬币。获得 <hl>古代硬币 ×2</hl>。'}
      ]},
      { text:'攀爬铁链荡过去', conds:[{type:'atk',op:'>=',val:20}], costs:[], results:[
        {type:'addItem',itemId:'treasureAmulet',qty:1},
        {type:'gold',val:30},
        {type:'msg',text:'你抓住铁链荡到了对面，发现了一个被遗忘的小宝箱！获得 <hl>寻宝护符 (B)</hl>、<hl>Gold +30</hl>。'}
      ]},
      { text:'用符文碎片搭桥', conds:[{type:'hasItem',itemId:'runeShard'}], costs:[{type:'loseItem',itemId:'runeShard',qty:1}], results:[
        {type:'addItem',itemId:'runeStoneSpd',qty:1},
        {type:'msg',text:'你用符文碎片激活了残存的魔法桥梁，安全通过并找到了一枚符文石。获得 <hl>符文石·速 (B)</hl>。'}
      ]},
      { text:'爬下沟底绕行', conds:[], costs:[{type:'hpCost',val:15}], results:[
        {type:'gold',val:45},
        {type:'msg',text:'你小心翼翼地爬下沟底，捡到了几枚散落的金币。获得 <hl>Gold +45</hl>。'}
      ]},
    ],
  },
  // ---- 元素试炼之间 ----
  {
    id: 'elementTrial',
    title: '元素试炼之间',
    desc: '一间正方形的石室，四角各有一座元素祭坛——火、水、风、地。踏入石室的瞬间，火之祭坛猛烈燃烧起来，一个由烈焰构成的人形从中走出，整个房间的温度骤然升高。',
    options: [
      { text:'正面战斗', conds:[], costs:[], results:[
        {type:'combat',enemy:'fireGuard',rewards:[
          {type:'gold',val:50},
          {type:'addItem',itemId:'vampFang',qty:1,chance:40},
        ]},
        {type:'msg',text:'烈焰守卫挥动着熔岩之拳朝你冲来！'}
      ]},
      { text:'激活水之祭坛', conds:[{type:'hasItem',itemId:'iceSword'}], costs:[], results:[
        {type:'addItem',itemId:'iceShard',qty:2},
        {type:'msg',text:'你用寒冰长剑触碰水之祭坛，一股寒流瞬间压制了烈焰守卫！获得 <hl>冰晶碎片 ×2</hl>。'}
      ]},
      { text:'快速穿过石室', conds:[{type:'spd',op:'>=',val:11}], costs:[], results:[
        {type:'msg',text:'你在烈焰守卫完全成形之前冲过了石室。'}
      ]},
      { text:'关闭所有祭坛', conds:[{type:'luk',op:'>=',val:9}], costs:[], results:[
        {type:'buff',name:'元素平衡',battles:3,effects:{atk:3,def:2}},
        {type:'msg',text:'你按正确顺序关闭了四座祭坛，元素之力在你体内达成平衡。获得 <hl>元素平衡</hl>（下3次战斗 ATK+3、DEF+2）。'}
      ]},
    ],
  },
  // ---- 被诅咒的宝库 ----
  {
    id: 'cursedVault',
    title: '被诅咒的宝库',
    desc: '一扇镶嵌着宝石的厚重石门半开着。门内的宝库中，金币和珠宝堆积如山。但在宝库中央，一具戴着王冠的骷髅端坐在宝座上，骷髅眼窝中燃烧着幽绿的火焰。墙上的铭文警告道："贪者受诅，敬者得赐。"',
    options: [
      { text:'恭敬取走一份贡品', conds:[], costs:[], results:[
        {type:'gold',val:60},
        {type:'randomEquip',rarity:'C'},
        {type:'msg',text:'你向骷髅鞠躬后取走了一小份，骷髅的火焰似乎缓和了些。获得 <hl>Gold +60</hl>。'}
      ]},
      { text:'大量拿取财宝', conds:[], costs:[], results:[
        {type:'gold',val:150},
        {type:'actStat',key:'luk',val:-2},
        {type:'msg',text:'你贪婪地往背包里塞满金币。骷髅的火焰猛烈燃烧——你感到厄运降临！<hl>Gold +150</hl>，但 <hl>LUK −2</hl>（本幕内有效）。'}
      ]},
      { text:'向骷髅行礼后离开', conds:[{type:'luk',op:'>=',val:8}], costs:[], results:[
        {type:'buff',name:'王者祝福',battles:99,effects:{atk:3,def:3}},
        {type:'msg',text:'骷髅微微点头，幽绿火焰分出一缕飘向你——你获得了古代王的认可。获得 <hl>王者祝福</hl>（本幕剩余战斗 ATK+3、DEF+3）。'}
      ]},
      { text:'检查王冠', conds:[{type:'def',op:'>=',val:10}], costs:[{type:'hpCost',val:8}], results:[
        {type:'combat',enemy:'curseGuard',rewards:[
          {type:'addItem',itemId:'shadowBlade',qty:1},
          {type:'gold',val:30},
        ]},
        {type:'msg',text:'王冠下藏着一把暗影之刃！但触碰王冠惊醒了守卫。'}
      ]},
    ],
  },
  // ---- 观星台 ----
  {
    id: 'observatory',
    title: '观星台',
    desc: '遗迹最高处的露天平台上，一台巨大的古代星象仪仍在缓慢转动。天空中的星光通过镜片聚焦在中央的水晶球上。水晶球中映出了你的倒影——但倒影看起来更加强大。',
    options: [
      { text:'触摸水晶球', conds:[], costs:[{type:'hpCost',val:15}], results:[
        {type:'stat',key:'atk',val:3},
        {type:'msg',text:'水晶球中的倒影与你合为一体——你看到了未来的自己！<hl>永久 ATK+3</hl>。'}
      ]},
      { text:'调整星象仪', conds:[{type:'luk',op:'>=',val:10}], costs:[], results:[
        {type:'addItem',itemId:'goldOre',qty:5},
        {type:'msg',text:'星象仪转动后投影出一幅地图，标注了隐藏的金矿脉！获得 <hl>金矿石 ×5</hl>。'}
      ]},
      { text:'在观星台上冥想', conds:[{type:'spd',op:'>=',val:10}], costs:[], results:[
        {type:'buff',name:'星之加护',battles:3,effects:{spd:5}},
        {type:'msg',text:'星光洒落，你感到身体变得轻盈。获得 <hl>星之加护</hl>（下3次战斗 SPD+5）。'}
      ]},
      { text:'记录星图后离开', conds:[], costs:[], results:[
        {type:'addItem',itemId:'starChart',qty:1},
        {type:'msg',text:'你仔细地绘制了一份星图。获得 <hl>星图副本 (C)</hl>。'}
      ]},
    ],
  },
  // ---- 古代锻造炉 ----
  {
    id: 'ancientForge',
    title: '古代锻造炉',
    desc: '一间充满硫磺气味的石室中，一座古代锻造炉仍在熊熊燃烧。炉火呈奇异的蓝色，温度极高却不会烧伤靠近的人。炉旁的石台上放着一把尚未完工的剑胚。墙壁上刻着锻造的流程和配方。',
    options: [
      { text:'打造装备', conds:[{type:'hasItem',itemId:'ironOre',qty:3}], costs:[{type:'loseItem',itemId:'ironOre',qty:3}], results:[
        {type:'addItem',itemId:'longSword',qty:1},
        {type:'addItem',itemId:'chainmail',qty:1},
        {type:'msg',text:'你按照配方打造了装备！获得 <hl>长剑 (D)</hl> + <hl>锁子甲 (D)</hl>。'}
      ]},
      { text:'淬炼武器', conds:[{type:'hasItem',itemId:'silverOre',qty:2}], costs:[{type:'loseItem',itemId:'silverOre',qty:2}], results:[
        {type:'addItem',itemId:'vampFang',qty:1},
        {type:'msg',text:'你将银矿石投入熔炉淬炼剑胚！获得 <hl>火焰之刃 (C)</hl>。'}
      ]},
      { text:'重铸精炼', conds:[{type:'hasItem',itemId:'goldOre'}], costs:[{type:'loseItem',itemId:'goldOre',qty:1},{type:'chooseItem'}], results:[
        {type:'stat',key:'atk',val:2},
        {type:'msg',text:'你用金矿石重新淬炼了武器，武器变得更加锋利！<hl>永久 ATK+2</hl>。'}
      ]},
      { text:'用符文碎片强化', conds:[{type:'hasItem',itemId:'runeShard',qty:2}], costs:[{type:'loseItem',itemId:'runeShard',qty:2}], results:[
        {type:'addItem',itemId:'runeStoneLuk',qty:1},
        {type:'msg',text:'你将符文碎片投入炉火，锻造出一枚幸运符文石。获得 <hl>符文石·运 (B)</hl>。'}
      ]},
    ],
  },
  // ---- 宝石矿脉 ----
  {
    id: 'gemVein',
    title: '宝石矿脉',
    desc: '一面岩壁上嵌着数颗未经打磨的宝石，在微光下闪烁着诱人的光泽。但矿脉周围的地面上刻着警示性的符文——贸然开采可能会触发某种古老的防御机制。',
    options: [
      { text:'小心开采', conds:[{type:'luk',op:'>=',val:8}], costs:[], results:[
        {type:'addItem',itemId:'goldOre',qty:2},
        {type:'addItem',itemId:'ancientCoin',qty:1},
        {type:'msg',text:'你小心翼翼地凿下宝石，没有触发任何陷阱。获得 <hl>金矿石 ×2</hl>、<hl>古代硬币 ×1</hl>。'}
      ]},
      { text:'用矿石献祭符文', conds:[{type:'hasItem',itemId:'silverOre',qty:2}], costs:[{type:'loseItem',itemId:'silverOre',qty:2}], results:[
        {type:'addItem',itemId:'goldOre',qty:3},
        {type:'msg',text:'你将银矿石放在符文上，符文吸收了矿物精华后消散了！获得 <hl>金矿石 ×3</hl>。'}
      ]},
      { text:'强行开采', conds:[{type:'atk',op:'>=',val:20}], costs:[{type:'hpCost',val:10}], results:[
        {type:'addItem',itemId:'goldOre',qty:2},
        {type:'randomEquip',rarity:'C'},
        {type:'msg',text:'你敲碎符文防御，在矿脉深处发现了一件古人遗留的装备。获得 <hl>金矿石 ×2</hl>。'}
      ]},
      { text:'在符文前止步', conds:[], costs:[], results:[
        {type:'msg',text:'你决定不冒这个险。'}
      ]},
    ],
  },
  // ---- 回声长廊 ----
  {
    id: 'echoHall',
    title: '回声长廊',
    desc: '一条狭窄的长廊两旁矗立着石像，每座石像手中都捧着一面铜镜。你踏入长廊的瞬间，所有的铜镜同时转向你，镜中映出不同年龄、不同装束的自己——有的手持利剑，有的濒死倒地。',
    options: [
      { text:'打碎所有铜镜', conds:[{type:'atk',op:'>=',val:22}], costs:[{type:'hpCost',val:8}], results:[
        {type:'addItem',itemId:'runeShard',qty:3},
        {type:'msg',text:'镜片碎裂散落一地，其中混着几枚符文碎片。获得 <hl>符文碎片 ×3</hl>。'}
      ]},
      { text:'观察镜中的自己', conds:[{type:'luk',op:'>=',val:9}], costs:[], results:[
        {type:'stat',key:'luk',val:2},
        {type:'msg',text:'镜中的未来让你对命运有了更深的理解。<hl>永久 LUK+2</hl>。'}
      ]},
      { text:'快步穿过', conds:[{type:'spd',op:'>=',val:11}], costs:[], results:[
        {type:'msg',text:'你大步流星地穿过了长廊。'}
      ]},
      { text:'后退另寻他路', conds:[], costs:[{type:'hpCost',val:5}], results:[
        {type:'msg',text:'你退出了长廊，但那些镜中的影像仍在脑海中挥之不去。'}
      ]},
    ],
  },
  // ---- 生命之泉 ----
  {
    id: 'lifeSpring',
    title: '生命之泉',
    desc: '一座古老的喷泉仍在汩汩涌出翠绿色的液体。泉水表面浮着一层金色的光晕，散发着浓郁的生命气息。但喷泉的石座上刻着警告符文："凡人只可取一瓢——贪者血脉枯竭。"',
    options: [
      { text:'取一瓢饮用', conds:[], costs:[], results:[
        {type:'heal',val:50},
        {type:'maxHp',val:10},
        {type:'msg',text:'你遵照警告只取一瓢，翠绿的泉水甘甜无比。<hp>MaxHP +10</hp>，恢复 50 HP。'}
      ]},
      { text:'贪婪地大量饮用', conds:[], costs:[], results:[
        {type:'maxHp',val:-10},
        {type:'healPct',val:100},
        {type:'msg',text:'你贪婪地大口饮用，虽然全身伤口瞬间愈合，但符文诅咒发作——你的血脉开始枯竭。<loss>MaxHP −10</loss>，HP 回满。'}
      ]},
      { text:'用瓶子装走泉水', conds:[], costs:[], results:[
        {type:'addItem',itemId:'magicSpring',qty:3},
        {type:'msg',text:'你装了满满三瓶生命泉水。获得 <hl>魔力泉水 ×3</hl>。'}
      ]},
      { text:'研究符文后离开', conds:[{type:'luk',op:'>=',val:8}], costs:[], results:[
        {type:'addItem',itemId:'runeRubbing',qty:1},
        {type:'msg',text:'你拓下了喷泉上的符文作为研究素材。获得 <hl>符文拓片 ×1</hl>。'}
      ]},
    ],
  },
  // ---- 水晶花园 ----
  {
    id: 'crystalGarden',
    title: '水晶花园',
    desc: '一座地下的水晶花园——巨大的晶体从地面和天花板上生长出来，折射出七彩光芒。空气中弥漫着微甜的香气，让人昏昏欲睡。水晶丛中有一汪清澈的池水。',
    options: [
      { text:'采集水晶', conds:[], costs:[], results:[
        {type:'addItem',itemId:'iceShard',qty:2},
        {type:'msg',text:'你小心翼翼地敲下几块水晶碎片。获得 <hl>冰晶碎片 ×2</hl>。'}
      ]},
      { text:'饮用池水', conds:[], costs:[], results:[
        {type:'heal',val:40},
        {type:'buff',name:'水晶加护',battles:2,effects:{def:3}},
        {type:'msg',text:'池水甘甜清凉，一股保护性的魔力附着在你的皮肤上。<hp>恢复 40 HP</hp> + 获得 <hl>水晶加护</hl>（下2次战斗 DEF+3）。'}
      ]},
      { text:'在水晶丛中冥想', conds:[{type:'spd',op:'>=',val:10}], costs:[], results:[
        {type:'stat',key:'spd',val:2},
        {type:'msg',text:'你在水晶的能量场中冥想，身体变得更加轻盈。<hl>永久 SPD+2</hl>。'}
      ]},
      { text:'用矿石研磨晶粉', conds:[{type:'hasItem',itemId:'silverOre'}], costs:[{type:'loseItem',itemId:'silverOre',qty:1}], results:[
        {type:'addItem',itemId:'magicSpring',qty:3},
        {type:'msg',text:'你用银矿石研磨水晶成粉末，溶入水中制成了魔力泉水。获得 <hl>魔力泉水 ×3</hl>。'}
      ]},
    ],
  },
];

const BOSS_EVENT_ACT3 = {
  id: 'boss',
  title: '遗迹守护者',
  desc: '遗迹最深处的圣殿中，一座巨大的魔法阵覆盖了整个地面。魔法阵的中央，一台古老的构装体缓缓苏醒。它的身躯由黑曜石和黄金构成，六只手臂各持一件古代兵器。水晶核心中流淌着千年前的魔力——那是维持整个遗迹运转的能量源泉。',
};
