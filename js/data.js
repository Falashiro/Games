// ============================================================
// js/data.js — 物品、敌人、事件数据定义
// ============================================================

const ITEMS = {
  // 武器
  woodStick:  { id:'woodStick', name:'木棍',   type:'weapon', rarity:'F', atk:1, desc:'' },
  shortSword: { id:'shortSword',name:'短剑',   type:'weapon', rarity:'E', atk:3, desc:'' },
  longSword:  { id:'longSword', name:'长剑',   type:'weapon', rarity:'D', atk:6, desc:'' },
  swiftDagger:{ id:'swiftDagger',name:'迅捷匕首',type:'weapon', rarity:'D', atk:4, spd:3, desc:'' },
  vampFang:   { id:'vampFang',  name:'吸血之牙',type:'weapon', rarity:'C', atk:5, effect:'击杀恢复10HP', desc:'' },
  iceSword:   { id:'iceSword',  name:'寒冰长剑',type:'weapon', rarity:'B', atk:9, effect:'降低敌方SPD2点', desc:'' },
  luckyRapier:{ id:'luckyRapier',name:'幸运刺剑',type:'weapon', rarity:'B', atk:7, luk:4, desc:'' },
  stormBlade:{ id:'stormBlade',name:'风暴之刃',type:'weapon', rarity:'B', atk:8, spd:5, desc:'' },
  shadowBlade:{ id:'shadowBlade',name:'暗影之刃',type:'weapon', rarity:'A', atk:11, effect:'对HP>50%敌人伤害+30%', desc:'' },
  holySword:  { id:'holySword', name:'圣剑',   type:'weapon', rarity:'A', atk:14, effect:'对暗影敌人伤害+50%', desc:'' },
  dragonFang: { id:'dragonFang',name:'龙牙',   type:'weapon', rarity:'S', atk:16, effect:'无视敌方DEF5点', desc:'' },

  // 护甲
  cloth:      { id:'cloth',     name:'布衣',   type:'armor', rarity:'F', def:1, desc:'' },
  leather:    { id:'leather',   name:'皮甲',   type:'armor', rarity:'E', def:2, desc:'' },
  chainmail:  { id:'chainmail', name:'锁子甲',  type:'armor', rarity:'D', def:4, desc:'' },
  featherArmor:{id:'featherArmor',name:'轻羽甲',type:'armor', rarity:'D', def:2, spd:3, desc:'' },
  thornArmor: { id:'thornArmor',name:'荆棘铠甲',type:'armor', rarity:'C', def:3, effect:'反弹2点伤害', desc:'' },
  swiftLeather:{id:'swiftLeather',name:'灵巧皮衣',type:'armor', rarity:'C', def:3, spd:5, desc:'' },
  ironPlate:{ id:'ironPlate',name:'铁板甲',type:'armor', rarity:'C', def:5, desc:'' },
  dragonScale:{ id:'dragonScale',name:'龙鳞甲',  type:'armor', rarity:'B', def:6, effect:'免疫燃烧', desc:'' },
  shadowCloak:{ id:'shadowCloak',name:'暗影斗篷',type:'armor', rarity:'B', def:4, luk:5, desc:'' },
  magicPlate: { id:'magicPlate',name:'魔法板甲',type:'armor', rarity:'A', def:8, effect:'减免魔法伤害3点', desc:'' },
  holyShield: { id:'holyShield',name:'圣盾',   type:'armor', rarity:'A', def:8, effect:'首回合免疫伤害', desc:'' },
  dragonGodArmor:{id:'dragonGodArmor',name:'龙神重甲',type:'armor',rarity:'S',def:12,effect:'每回合恢复3HP',desc:''},

  // 饰品
  brokenRing: { id:'brokenRing',name:'破损戒指',type:'accessory',rarity:'F',atk:1,desc:'' },
  luckyCoin:  { id:'luckyCoin', name:'幸运硬币',type:'accessory',rarity:'E',effect:'金币获取+20%',desc:'' },
  powerRing:  { id:'powerRing', name:'力量戒指',type:'accessory',rarity:'D',atk:3,desc:'' },
  windBracelet:{id:'windBracelet',name:'疾风手环',type:'accessory',rarity:'D',spd:4,desc:'' },
  lifeAmulet: { id:'lifeAmulet',name:'生命护符',type:'accessory',rarity:'C',maxHp:30,desc:'' },
  initBoots:  { id:'initBoots', name:'先制之靴',type:'accessory',rarity:'C',spd:8,desc:'' },
  luckyFoot:  { id:'luckyFoot', name:'幸运兔脚',type:'accessory',rarity:'B',luk:6,desc:'' },
  guardRing:{ id:'guardRing', name:'守护戒指',type:'accessory',rarity:'B',def:4,atk:2,desc:''},
  vampRing:   { id:'vampRing',  name:'吸血戒指',type:'accessory',rarity:'A',effect:'造成伤害的10%恢复HP',desc:'' },
  phoenixFeather:{id:'phoenixFeather',name:'凤凰羽毛',type:'accessory',rarity:'A',effect:'死亡时复活一次(50%HP)',desc:''},
  destinyStar:{ id:'destinyStar',name:'命运之星',type:'accessory',rarity:'S',luk:10,effect:'掉落物品数量翻倍',desc:''},

  // 消耗品
  bandage:    { id:'bandage',   name:'绷带',    type:'consumable',rarity:'F',heal:10,desc:'' },
  healPotion: { id:'healPotion',name:'治疗药水', type:'consumable',rarity:'E',heal:30,desc:'' },
  bigHealPotion:{id:'bigHealPotion',name:'大治疗药水',type:'consumable',rarity:'D',heal:60,desc:''},
  spdScroll:  { id:'spdScroll', name:'速度卷轴', type:'consumable',rarity:'D',tempSpd:5,desc:'下次战斗SPD+5' },
  atkPotion:  { id:'atkPotion', name:'力量药水', type:'consumable',rarity:'C',tempAtk:5,desc:'下次战斗ATK+5' },
  lukPotion:  { id:'lukPotion', name:'幸运药水', type:'consumable',rarity:'C',tempLuk:8,desc:'下次战斗LUK+8' },
  escapeScroll:{id:'escapeScroll',name:'逃脱卷轴',type:'consumable',rarity:'B',desc:'跳过当前战斗事件'},
  fullHealPotion:{id:'fullHealPotion',name:'大回复药水',type:'consumable',rarity:'B',fullHeal:true,desc:'恢复全部HP'},
  awakenPotion:{id:'awakenPotion',name:'觉醒药剂',type:'consumable',rarity:'A',permAtk:2,desc:'永久ATK+2'},
  blessedFeather:{id:'blessedFeather',name:'祝福之羽',type:'consumable',rarity:'A',permLuk:3,desc:'永久LUK+3'},
  revivePotion:{id:'revivePotion',name:'重生药水',type:'consumable',rarity:'S',autoRevive:true,desc:'死亡时自动复活(恢复50%HP)'},

  // 材料
  wolfFang:   { id:'wolfFang',  name:'狼牙',   type:'material',rarity:'F',sellPrice:8,desc:'' },
  herb:       { id:'herb',       name:'草药',   type:'material',rarity:'E',sellPrice:5,desc:'' },
  spiritHerb: { id:'spiritHerb', name:'灵草',   type:'material',rarity:'D',sellPrice:12,desc:'' },
  ironOre:    { id:'ironOre',    name:'铁矿石',  type:'material',rarity:'E',sellPrice:8,desc:'' },
  silverOre:  { id:'silverOre',  name:'银矿石',  type:'material',rarity:'D',sellPrice:15,desc:'' },
  goldOre:    { id:'goldOre',    name:'金矿石',  type:'material',rarity:'C',sellPrice:30,desc:'' },
  springWater:{ id:'springWater',name:'泉水',   type:'consumable',rarity:'E',heal:20,sellPrice:5,desc:'恢复20HP'},

  // 第二幕新增
  lizardScale:{ id:'lizardScale',name:'蜥蜴鳞片',type:'material',rarity:'E',sellPrice:10,desc:''},
  spiderSilk: { id:'spiderSilk', name:'蜘蛛丝',  type:'material',rarity:'D',sellPrice:18,desc:''},
  oldPickaxe: { id:'oldPickaxe', name:'旧矿镐',  type:'weapon',rarity:'C',atk:8,effect:'对甲虫伤害+50%',desc:''},
  glowMushroom:{id:'glowMushroom',name:'荧光蘑菇',type:'consumable',rarity:'D',heal:40,sellPrice:15,desc:''},

  // 第三幕新增
  runeShard:  { id:'runeShard',  name:'符文碎片',type:'material',rarity:'D',sellPrice:20,desc:'古代符文的力量结晶'},
  runeRubbing:{ id:'runeRubbing',name:'符文拓片',type:'material',rarity:'D',sellPrice:25,desc:''},
  ancientCoin:{ id:'ancientCoin',name:'古代硬币',type:'material',rarity:'C',sellPrice:35,desc:''},
  starChart:  { id:'starChart',  name:'星图副本',type:'material',rarity:'C',sellPrice:40,desc:''},
  iceShard:   { id:'iceShard',   name:'冰晶碎片',type:'material',rarity:'C',sellPrice:30,desc:''},
  magicSpring:{ id:'magicSpring',name:'魔力泉水',type:'consumable',rarity:'D',heal:50,sellPrice:20,desc:''},
  runeStoneAtk:{id:'runeStoneAtk',name:'符文石·力',type:'accessory',rarity:'B',atk:4,desc:'当前幕内有效'},
  runeStoneDef:{id:'runeStoneDef',name:'符文石·盾',type:'accessory',rarity:'B',def:4,desc:'当前幕内有效'},
  runeStoneSpd:{id:'runeStoneSpd',name:'符文石·速',type:'accessory',rarity:'B',spd:4,desc:'当前幕内有效'},
  runeStoneLuk:{id:'runeStoneLuk',name:'符文石·运',type:'accessory',rarity:'B',luk:5,desc:'当前幕内有效'},

  // 第四幕新增
  purpleShard:{id:'purpleShard',name:'紫水晶碎片',type:'material',rarity:'D',sellPrice:30,desc:'发光的紫色水晶碎片'},
  // 第五幕新增
  dragonScaleFrag:{id:'dragonScaleFrag',name:'龙鳞碎片',type:'material',rarity:'C',sellPrice:50,desc:'远古巨龙的鳞片碎片'},
  dragonBlood:{id:'dragonBlood',name:'龙血精华',type:'consumable',rarity:'B',desc:'下次战斗 ATK+10 DEF+5 每回合损失3HP'},
  dragonRune:{id:'dragonRune',name:'龙语拓片',type:'material',rarity:'B',sellPrice:80,desc:'龙语碑文的拓印'},
  // 第六幕新增
  starDust:{id:'starDust',name:'星尘碎片',type:'material',rarity:'B',sellPrice:60,desc:'虚空中的星尘凝聚'},
  starSword:{id:'starSword',name:'星辰之剑',type:'weapon',rarity:'S',atk:22,spd:5,luk:5,effect:'对全属性敌人伤害+30%',desc:'第六幕独有神兵'},
};

function getItem(id) {
  const item = ITEMS[id];
  if (!item) return null;
  return { ...item };
}

// 敌人数据
const ENEMIES = {
  // 第一幕
  wolf:     { name:'灰狼',   hp:22, atk:5, def:1, spd:3, trait:null },
  snake:    { name:'毒蛇',   hp:16, atk:6, def:0, spd:6, trait:null },
  bandit:   { name:'山贼',   hp:26, atk:6, def:2, spd:4, trait:null },
  leeches:  { name:'水蛭群', hp:18, atk:5, def:0, spd:4, trait:'vampire' },
  spiderBoss:{ name:'洞穴巨蛛',hp:45, atk:7, def:2, spd:5, trait:'poison' },
  // 第二幕
  caveLizard:{ name:'洞穴蜥蜴',hp:34, atk:8, def:2, spd:4, trait:null },
  caveBeetle:{ name:'矿洞甲虫',hp:32, atk:9, def:3, spd:3, trait:'hardShell' },
  youngSpider:{name:'幼年蛛后',hp:36, atk:10,def:3, spd:5, trait:'poison2' },
  beetleKing:{name:'甲虫王',  hp:56, atk:11,def:5, spd:3, trait:'eliteBeetle' },
  rockWorm:  { name:'岩石巨虫',hp:72, atk:11,def:4, spd:4, trait:'acidArmor' },
  // 第三幕
  stoneGolem:{ name:'活化石像',hp:45, atk:12,def:5, spd:5, trait:'immune' },
  fireGuard: { name:'烈焰守卫',hp:42, atk:13,def:4, spd:6, trait:'burning' },
  curseGuard:{ name:'诅咒守卫',hp:48, atk:14,def:5, spd:5, trait:'curseAura' },
  ancientConstruct:{name:'古代构装体',hp:100,atk:15,def:6,spd:7,trait:'multiAttack'},
  // 第四幕
  riftCrawler:{name:'裂隙爬行者',hp:60,atk:18,def:7,spd:8,trait:'corrodeClaw'},
  voidSwordsman:{name:'虚空剑士',hp:66,atk:22,def:7,spd:9,trait:'pierceDef'},
  voidGuard:{name:'虚空守卫',hp:78,atk:18,def:10,spd:7,trait:'regen5'},
  voidSeer:{name:'虚空先知',hp:60,atk:20,def:6,spd:10,trait:'mindBlast'},
  riftWrath:{name:'裂隙之怒',hp:66,atk:22,def:8,spd:9,trait:'corrodeAura'},
  crystalScorpion:{name:'结晶巨蝎',hp:95,atk:24,def:9,spd:8,trait:'crystalArmor'},
  abyssLord:{name:'深渊之主',hp:132,atk:24,def:9,spd:9,trait:'abyssLord'},
  // 第五幕
  dragonGuard:{name:'龙裔守卫',hp:78,atk:25,def:10,spd:10,trait:'fireBreath2'},
  youngDragon:{name:'幼年火龙',hp:72,atk:26,def:9,spd:11,trait:'fireBreath3'},
  lavaElemental:{name:'熔岩元素',hp:88,atk:30,def:10,spd:9,trait:'lavaBurn'},
  ancientDragon:{name:'古龙之王',hp:176,atk:30,def:12,spd:11,trait:'dragonLord'},
  // 第六幕
  starAvatar:{name:'星尘化身',hp:100,atk:32,def:13,spd:14,trait:'starBurn'},
  voidBeast:{name:'虚空巨兽',hp:132,atk:38,def:14,spd:15,trait:'voidBeast'},
  fateAvatar:{name:'命运化身',hp:240,atk:40,def:16,spd:16,trait:'fateLord'},
};
