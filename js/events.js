// ============================================================
// js/events.js — 事件池数据定义
// ============================================================

const EVENT_POOL = [
  // ---- 草药丛 ----
  {
    id: 'herbs',
    title: '草药丛',
    desc: '林间空地中，一片翠绿的草药在阳光下闪着微光。你认出其中几种可以止血的植物。草丛深处似乎还有更稀有的品种，但那里传来细微的嘶嘶声。',
    options: [
      { text:'安全采集', conds:[], costs:[], results:[
        {type:'addItem', itemId:'healPotion', qty:1},
        {type:'msg', text:'你小心翼翼地摘取了几株草药。获得 <hl>治疗药水 ×1</hl>。'}
      ]},
      { text:'深入采集', conds:[], costs:[], results:[
        {type:'lukCheck', threshold:40, success:[
          {type:'addItem', itemId:'healPotion', qty:2},
          {type:'addItem', itemId:'spiritHerb', qty:1},
          {type:'msg', text:'你屏息深入草丛，不仅采到了更多草药，还发现了一株稀有的灵草！获得 <hl>治疗药水 ×2</hl>、<hl>灵草 ×1</hl>。'}
        ], fail:[
          {type:'addItem', itemId:'healPotion', qty:1},
          {type:'combat', enemy:'snake'},
          {type:'msg', text:'一条毒蛇从草丛中窜出咬了你一口！获得 <hl>治疗药水 ×1</hl>，但被迫进入战斗。'}
        ]},
      ]},
      { text:'转身离开', conds:[], costs:[], results:[
        {type:'msg', text:'你决定不冒险，绕过了这片草丛。'}
      ]},
    ],
  },
  // ---- 流浪商人 ----
  {
    id: 'merchant',
    title: '流浪商人',
    desc: '一棵倒下的大树旁，一个背着巨大行囊的老人正在摆摊。他抬头朝你咧嘴一笑，露出稀疏的牙齿："来得正好，我这可都是好货！"',
    shop: true,
    shopItems: [
      { itemId:'shortSword', price:45 },
      { itemId:'leather', price:40 },
      { itemId:'healPotion', price:25 },
      { itemId:'brokenRing', price:20 },
    ],
    options: [
      { text:'购买商品', conds:[], costs:[], results:[{type:'openShop'}] },
      { text:'出售物品', conds:[], costs:[], results:[{type:'openSell'}] },
      { text:'离开', conds:[], costs:[], results:[{type:'msg', text:'你摇摇头，继续赶路。'}] },
    ],
  },
  // ---- 古老神像 ----
  {
    id: 'shrine',
    title: '古老神像',
    desc: '密林深处，一座爬满青苔的石像半埋在落叶中。石像的双眼似乎随你的移动而转动。基座上刻着一行模糊的文字："献上你所珍视的，换你所渴望的。"',
    options: [
      { text:'鲜血献祭', conds:[{type:'hp',op:'>=',val:20}], costs:[{type:'hpCost',val:15}], results:[
        {type:'stat', key:'atk', val:3},
        {type:'msg', text:'你用匕首划过手掌，鲜血滴在石像上。一股热流涌入你的身体——你感到力量增强了！<hl>永久 ATK+3</hl>。'}
      ]},
      { text:'金币献祭', conds:[{type:'gold',op:'>=',val:25}], costs:[{type:'gold',val:25}], results:[
        {type:'stat', key:'luk', val:3},
        {type:'msg', text:'你将金币放入石像的掌心，金币瞬间化为光点融入石像。你感到冥冥中有一股力量在庇佑你。<hl>永久 LUK+3</hl>。'}
      ]},
      { text:'物品献祭', conds:[{type:'hasAnyItem'}], costs:[{type:'chooseItem'}], results:[
        {type:'heal', val:35},
        {type:'msg', text:'你献上物品，石像散发出柔和的光芒，你的伤口开始愈合。<hp>恢复 35 HP</hp>。'}
      ]},
      { text:'无视离开', conds:[], costs:[], results:[{type:'msg', text:'你对石像敬了个礼，绕道离开。'}] },
    ],
  },
  // ---- 山贼哨站 ----
  {
    id: 'bandit',
    title: '山贼哨站',
    desc: '前方的小路上横着一道路障，两个手持短刀的山贼正守着篝火。其中一人瞥见了你的身影，站起身来。山贼头目掂了掂手中的钱袋——里面装着你之前被劫走的金币。',
    options: [
      { text:'正面战斗', conds:[], costs:[], results:[
        {type:'combat', enemy:'bandit', rewards:[
          {type:'gold',val:35},
          {type:'addItem',itemId:'leather',qty:1,chance:46},
        ]},
        {type:'msg', text:'你拔剑冲向山贼！'}
      ]},
      { text:'潜行绕过', conds:[{type:'spd',op:'>=',val:7}], costs:[], results:[
        {type:'msg', text:'你身轻如燕，无声无息地从山贼的视野盲区溜了过去。'}
      ]},
      { text:'支付买路钱', conds:[{type:'gold',op:'>=',val:20}], costs:[{type:'gold',val:20}], results:[
        {type:'msg', text:'你扔出20枚金币，山贼们忙着捡钱，你快步通过。'}
      ]},
      { text:'绕远路', conds:[], costs:[{type:'hpCost',val:10}], results:[
        {type:'msg', text:'你攀爬陡峭的山壁绕路，消耗了不少体力。'}
      ]},
    ],
  },
  // ---- 落穴陷阱 ----
  {
    id: 'pitTrap',
    title: '落穴陷阱',
    desc: '脚下的落叶忽然塌陷——你一脚踩空，坠入了一个约两人深的猎坑。坑壁上长满滑腻的青苔，显然是猎人布下的陷阱。坑底散落着一些之前受害者的遗物。',
    options: [
      { text:'攀爬脱出', conds:[{type:'atk',op:'>=',val:12}], costs:[], results:[
        {type:'addItem',itemId:'brokenRing',qty:1},
        {type:'gold',val:15},
        {type:'msg',text:'你凭借力量攀住坑壁上的树根，三下两下便爬了出去，还在坑底发现了一些遗物。获得 <hl>破损戒指 ×1</hl>、<hl>Gold +15</hl>。'}
      ]},
      { text:'搭人梯爬出', conds:[], costs:[{type:'hpCost',val:12}], results:[
        {type:'gold',val:20},
        {type:'msg',text:'你费了九牛二虎之力爬了出来，从坑底捡到了一些散落的金币。<hl>Gold +20</hl>。'}
      ]},
      { text:'大声呼救', conds:[{type:'gold',op:'>=',val:10}], costs:[{type:'gold',val:10}], results:[
        {type:'msg',text:'一位路过的樵夫听到呼救，拉你上来。为了表示感谢，你给了他10枚金币。'}
      ]},
      { text:'在坑底搜寻再爬出', conds:[], costs:[{type:'hpCost',val:18}], results:[
        {type:'gold',val:30},
        {type:'randomEquip',rarity:'F-D'},
        {type:'msg',text:'你仔细搜寻了坑底的每个角落，带着满满的收获艰难爬出。<hl>Gold +30</hl>。'}
      ]},
    ],
  },
  // ---- 受伤的猎人 ----
  {
    id: 'hunter',
    title: '受伤的猎人',
    desc: '一个浑身是血的男人靠坐在橡树下，身旁丢着一把断弓。他捂着腹部的伤口，艰难地抬起眼皮看向你："帮帮我……我会报答你的……"',
    options: [
      { text:'给予治疗药水', conds:[{type:'hasItem',itemId:'healPotion'}], costs:[{type:'loseItem',itemId:'healPotion',qty:1}], results:[
        {type:'addItem',itemId:'luckyCoin',qty:1},
        {type:'gold',val:10},
        {type:'msg',text:'猎人喝下药水，脸色好了许多。他从口袋中掏出一枚幸运硬币和10枚金币递给你。获得 <hl>幸运硬币 ×1</hl>、<hl>Gold +10</hl>。'}
      ]},
      { text:'为他包扎', conds:[{type:'hp',op:'>=',val:10}], costs:[{type:'hpCost',val:5}], results:[
        {type:'gold',val:25},
        {type:'msg',text:'你撕下自己的衣襟为他包扎，虽耗了些体力，但猎人感激地塞给你25枚金币。<hl>Gold +25</hl>。'}
      ]},
      { text:'给他20金币', conds:[{type:'gold',op:'>=',val:20}], costs:[{type:'gold',val:20}], results:[
        {type:'addItem',itemId:'healPotion',qty:2},
        {type:'addItem',itemId:'spiritHerb',qty:2},
        {type:'gold',val:15},
        {type:'msg',text:'猎人用最后力气指给你一处密藏："山壁石缝里……我的存货……"。获得 <hl>治疗药水 ×2</hl>、<hl>灵草 ×2</hl>、<hl>Gold +15</hl>。'}
      ]},
      { text:'警惕离开', conds:[], costs:[], results:[
        {type:'msg',text:'你不敢轻信陌生人，警惕地绕开了。'}
      ]},
    ],
  },
  // ---- 林间清泉 ----
  {
    id: 'spring',
    title: '林间清泉',
    desc: '一泓清澈的泉水在林间低洼处汇聚成池，水面泛着粼粼波光。泉边的石头上刻着古老的符文，似乎被祝福过。连日奔波让你疲惫不堪，这或许是个休整的好地方。',
    options: [
      { text:'小憩片刻', conds:[], costs:[], results:[
        {type:'healPct',val:20},
        {type:'msg',text:'你在泉边闭目养神，疲惫消退了不少。<hp>恢复 20% HP</hp>。'}
      ]},
      { text:'畅饮泉水', conds:[], costs:[], results:[
        {type:'heal',val:15},
        {type:'buff',name:'泉水祝福',battles:2,effects:{healPerRound:2}},
        {type:'msg',text:'甘甜的泉水入喉，一股暖意流向四肢百骸。<hp>恢复 15 HP</hp> + 获得 <hl>泉水祝福</hl>。'}
      ]},
      { text:'潜入池底', conds:[], costs:[], results:[
        {type:'lukCheck',threshold:35,success:[
          {type:'randomEquip',rarity:'D'},
          {type:'msg',text:'你在池底发现了一个锈迹斑斑的铁箱！'}
        ],fail:[
          {type:'combat',enemy:'leeches'},
          {type:'msg',text:'池底的水蛭群被惊动，朝你涌来！'}
        ]},
      ]},
      { text:'装满水袋', conds:[], costs:[], results:[
        {type:'addItem',itemId:'springWater',qty:1},
        {type:'msg',text:'你用水袋装满了被祝福的泉水。获得 <hl>泉水 ×1</hl>。'}
      ]},
    ],
  },
  // ---- 赌徒的营地 ----
  {
    id: 'gambler',
    title: '赌徒的营地',
    desc: '篝火旁围着几个旅人，正热火朝天地掷着骰子。一个戴着眼罩的瘦高男人朝你招招手："新人！来两把？我看你手气不错！森林里的规矩——诚实赌博，输赢自负。"',
    options: [
      { text:'小赌一把', conds:[{type:'gold',op:'>=',val:15}], costs:[{type:'gold',val:15}], results:[
        {type:'lukCheck',threshold:45,success:[
          {type:'gold',val:45},
          {type:'msg',text:'你押中了！赢回45枚金币。<hl>净赚 +30 Gold</hl>。'}
        ],fail:[
          {type:'msg',text:'运气不佳，你输掉了15枚金币。<loss>净亏 -15 Gold</loss>。'}
        ]},
      ]},
      { text:'豪赌一场', conds:[{type:'gold',op:'>=',val:30}], costs:[{type:'gold',val:30}], results:[
        {type:'lukCheck',threshold:35,success:[
          {type:'gold',val:90},
          {type:'randomEquip',rarity:'D'},
          {type:'msg',text:'大获全胜！赢回90金币。<hl>净赚 +60 Gold</hl>。'}
        ],fail:[
          {type:'msg',text:'豪赌失利，你输掉了30枚金币。<loss>净亏 -30 Gold</loss>。'}
        ]},
      ]},
      { text:'观战不赌', conds:[], costs:[], results:[
        {type:'buff',name:'赌徒的直觉',battles:1,effects:{lukBonus15:true}},
        {type:'msg',text:'你站在一旁观察他们的技巧，获得了些许心得。获得 <hl>赌徒的直觉</hl>。'}
      ]},
      { text:'劝阻赌博', conds:[{type:'luk',op:'>=',val:5}], costs:[], results:[
        {type:'addItem',itemId:'powerRing',qty:1},
        {type:'msg',text:'你用真诚的话语劝散了赌局，众人扫兴离去，却遗落了一枚戒指。获得 <hl>力量戒指 ×1</hl>。'}
      ]},
    ],
  },
  // ---- 废弃的矿坑 ----
  {
    id: 'mine',
    title: '废弃的矿坑',
    desc: '山壁上凿着一个半塌的矿洞入口，洞口还散落着几块矿石碎片和生锈的矿镐。从洞内吹出的风中带着矿物特有的金属气息。墙上贴着一张褪色的矿脉地图。',
    options: [
      { text:'捡拾洞口矿石', conds:[], costs:[], results:[
        {type:'addItem',itemId:'ironOre',qty:2},
        {type:'msg',text:'你在洞口捡到了几块不错的矿石。获得 <hl>铁矿石 ×2</hl>。'}
      ]},
      { text:'深入矿道开采', conds:[{type:'atk',op:'>=',val:13}], costs:[], results:[
        {type:'addItem',itemId:'ironOre',qty:3},
        {type:'addItem',itemId:'silverOre',qty:1},
        {type:'msg',text:'你抡起矿镐奋力开采，挖出了不少好矿石。获得 <hl>铁矿石 ×3</hl>、<hl>银矿石 ×1</hl>。'}
      ]},
      { text:'爆破矿壁', conds:[{type:'hasItem',itemId:'wolfFang'}], costs:[{type:'loseItem',itemId:'wolfFang',qty:1}], results:[
        {type:'addItem',itemId:'silverOre',qty:3},
        {type:'randomEquip',rarity:'D'},
        {type:'msg',text:'你用狼牙中的磷粉引爆了矿壁，炸出一个暗格！获得 <hl>银矿石 ×3</hl>。'}
      ]},
      { text:'检查矿脉地图', conds:[{type:'luk',op:'>=',val:4}], costs:[], results:[
        {type:'addItem',itemId:'goldOre',qty:1},
        {type:'msg',text:'你仔细解读了褪色的矿脉地图，找到了一处隐藏的金矿脉。获得 <hl>金矿石 ×1</hl>。'}
      ]},
    ],
  },
  // ---- 树洞密窖 ----
  {
    id: 'treeCache',
    title: '树洞密窖',
    desc: '一棵巨大的古树树干上开着一个半人高的树洞。洞内干燥整洁，似乎有人曾在这里居住过。角落里堆着几个封口的陶罐，墙上挂着一把生锈的钥匙。',
    options: [
      { text:'打开陶罐', conds:[], costs:[], results:[
        {type:'lukCheck',threshold:40,success:[
          {type:'addItem',itemId:'healPotion',qty:2},
          {type:'addItem',itemId:'herb',qty:3},
          {type:'msg',text:'陶罐中封存着治疗药水和干燥的草药。获得 <hl>治疗药水 ×2</hl>、<hl>草药 ×3</hl>。'}
        ],fail:[
          {type:'msg',text:'陶罐已经空了，里面的东西早就被人取走了。'}
        ]},
      ]},
      { text:'检查墙上的钥匙', conds:[], costs:[], results:[
        {type:'addItem',itemId:'ironOre',qty:2},
        {type:'msg',text:'钥匙已经锈蚀得无法使用，但钥匙环是铁制的，可以熔炼。获得 <hl>铁矿石 ×2</hl>。'}
      ]},
      { text:'在此过夜休息', conds:[], costs:[], results:[
        {type:'healPct',val:25},
        {type:'msg',text:'你在干燥的树洞中安稳地睡了一觉。<hp>恢复 25% HP</hp>。'}
      ]},
      { text:'继续赶路', conds:[], costs:[], results:[
        {type:'msg',text:'你扫了一眼树洞，没有停留。'}
      ]},
    ],
  },
  // ---- 泥沼小径 ----
  {
    id: 'swampPath',
    title: '泥沼小径',
    desc: '前方的小路被一片泥沼截断。浑浊的泥水中冒着气泡，几根枯树枝半埋在泥里。泥沼对面可以隐约看到几株发光的草药。一只青蛙从泥中跳出，鼓着眼睛看着你。',
    options: [
      { text:'用树枝铺路', conds:[{type:'atk',op:'>=',val:12}], costs:[], results:[
        {type:'addItem',itemId:'spiritHerb',qty:2},
        {type:'msg',text:'你搬来粗壮的枯枝在泥沼上铺出一条路，安全抵达对面并采到了发光的灵草。获得 <hl>灵草 ×2</hl>。'}
      ]},
      { text:'踩石头跳过去', conds:[{type:'spd',op:'>=',val:7}], costs:[], results:[
        {type:'addItem',itemId:'spiritHerb',qty:1},
        {type:'msg',text:'你踏着露出泥面的石头，轻巧地跳过了泥沼。获得 <hl>灵草 ×1</hl>。'}
      ]},
      { text:'涉泥而过', conds:[], costs:[{type:'hpCost',val:6}], results:[
        {type:'addItem',itemId:'spiritHerb',qty:2},
        {type:'msg',text:'你咬着牙趟过了及腰的泥沼，浑身是泥但收获不错。获得 <hl>灵草 ×2</hl>。'}
      ]},
      { text:'绕道而行', conds:[], costs:[{type:'hpCost',val:3}], results:[
        {type:'msg',text:'你沿着泥沼边缘绕了一大圈才找到干燥的路面。'}
      ]},
    ],
  },
  // ---- 古树之心 ----
  {
    id: 'ancientTree',
    title: '古树之心',
    desc: '一棵参天古树的树干上裂开了一道缝隙，温暖的橙色光芒从中透出。树心处悬浮着一颗拳头大的琥珀色结晶，散发着生命的气息。周围的空气都变得清新起来。',
    options: [
      { text:'吸收树心精华', conds:[], costs:[{type:'hpCost',val:20}], results:[
        {type:'maxHp',val:15},
        {type:'msg',text:'你将手伸入树心，生命能量涌入体内！<hp>MaxHP +15</hp>，但你流失了一些血液作为代价。'}
      ]},
      { text:'取走树心结晶', conds:[{type:'luk',op:'>=',val:6}], costs:[], results:[
        {type:'addItem',itemId:'healPotion',qty:3},
        {type:'msg',text:'你小心地取下了树心结晶，它化作了几瓶高浓度的治疗药水。获得 <hl>治疗药水 ×3</hl>。'}
      ]},
      { text:'在树下休息', conds:[], costs:[], results:[
        {type:'heal',val:30},
        {type:'msg',text:'你在古树下小憩，树心散发的气息加速了伤口愈合。<hp>恢复 30 HP</hp>。'}
      ]},
      { text:'不打扰古树', conds:[], costs:[], results:[
        {type:'msg',text:'你向古树鞠了一躬，默默离开。'}
      ]},
    ],
  },
  // ---- 藤蔓中的宝箱 ----
  {
    id: 'vineChest',
    title: '藤蔓中的宝箱',
    desc: '一棵大树上缠满了粗壮的藤蔓，藤蔓中似乎裹着什么东西——隐约可以看见木箱的一角和金属的反光。藤蔓上长满了尖刺，还在微微颤动，似乎有生命。',
    options: [
      { text:'用剑砍断藤蔓', conds:[{type:'atk',op:'>=',val:13}], costs:[], results:[
        {type:'gold',val:30},
        {type:'randomEquip',rarity:'E-D'},
        {type:'msg',text:'你挥剑斩断了蠕动的藤蔓，木箱掉落下来。获得 <hl>Gold +30</hl>。'}
      ]},
      { text:'小心解开藤蔓', conds:[{type:'luk',op:'>=',val:5}], costs:[], results:[
        {type:'gold',val:45},
        {type:'msg',text:'你小心翼翼地顺着藤蔓生长的脉络解开了它们，木箱完好无损地落下。获得 <hl>Gold +45</hl>。'}
      ]},
      { text:'点火驱赶藤蔓', conds:[{type:'hasItem',itemId:'wolfFang'}], costs:[{type:'loseItem',itemId:'wolfFang',qty:1}], results:[
        {type:'gold',val:30},
        {type:'addItem',itemId:'spiritHerb',qty:2},
        {type:'msg',text:'你用狼牙中的磷粉点燃一根枯枝，藤蔓遇火退散。获得 <hl>Gold +30</hl>、<hl>灵草 ×2</hl>。'}
      ]},
      { text:'不要冒险', conds:[], costs:[], results:[
        {type:'msg',text:'你看了一眼那蠕动的藤蔓，决定不碰为妙。'}
      ]},
    ],
  },
];

const BOSS_EVENT = {
  id: 'boss',
  title: '洞穴巨蛛',
  desc: '森林的尽头，一座漆黑的山洞张着大口。洞壁上粘着粗壮的蛛丝，空气中弥漫着腐臭。黑暗中，八只红色的眼睛亮了起来——一只巨大的蜘蛛正从洞顶缓缓降下，毒牙上滴落的毒液在地面嗤嗤作响。',
};
