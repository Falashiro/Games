// ============================================================
// js/engine.js — 游戏引擎：事件推进、选项结算、关底逻辑
// ============================================================

function initAct(actNum) {
  G.currentAct = actNum;
  G.currentEventIndex = 0;
  G.eventQueue = [];
  let pool, bossEvent, firstEvent, merchantId;
  const poolCount = 6; // 1 fixed + 6 pool + 1 boss = 8 total

  if (actNum === 1) {
    firstEvent = {
      id: 'wolf', title: '森林遇袭',
      desc: '你沿着小径踏入密林，空气中弥漫着潮湿的泥土气息。灌木丛中忽然传来低沉的呜咽——一只灰狼正死死盯着你，嘴角挂着涎水。它没有退让的意思。',
      options: [{ text:'拔剑迎战', conds:[], costs:[], results:[
        {type:'combat',enemy:'wolf',rewards:[{type:'gold',val:25},{type:'addItem',itemId:'wolfFang',qty:1,chance:46}]},
        {type:'msg', text:'灰狼哀嚎一声倒在地上。战斗胜利！<hl>Gold +25</hl>。狼牙掉落的概率判定中……'}
      ]}],
    };
    pool = EVENT_POOL;
    bossEvent = { id:'boss', ...BOSS_EVENT };
    merchantId = 'merchant';
  } else if (actNum === 2) {
    firstEvent = {
      id: 'caveLizard', title: '矿洞入口',
      desc: '你弯腰钻进矿洞入口，头顶的蝙蝠群被惊动，扑棱着翅膀掠过。黑暗中，一双发着荧光的眼睛正从岩壁裂缝中盯着你。',
      options: [{ text:'拔剑迎战', conds:[], costs:[], results:[
        {type:'combat',enemy:'caveLizard',rewards:[{type:'gold',val:35},{type:'addItem',itemId:'lizardScale',qty:1,chance:46}]},
        {type:'msg', text:'洞穴蜥蜴被斩杀。战斗胜利！<hl>Gold +35</hl>。蜥蜴鳞片的掉落概率判定中……'}
      ]}],
    };
    pool = EVENT_POOL_ACT2;
    bossEvent = { id:'boss', ...BOSS_EVENT_ACT2 };
    merchantId = 'mineMerchant';
  } else if (actNum === 3) {
    firstEvent = {
      id: 'stoneGolem', title: '遗迹守卫',
      desc: '你推开半掩的石门，踏入遗迹的前厅。地面上的魔法阵突然亮起刺眼的光芒，两座石像从基座上走了下来，手中的长戟对准了你。',
      options: [{ text:'迎战守卫', conds:[], costs:[], results:[
        {type:'combat',enemy:'stoneGolem',rewards:[{type:'gold',val:45},{type:'addItem',itemId:'runeShard',qty:1,chance:46}]},
        {type:'msg', text:'石像碎裂崩塌。战斗胜利！<hl>Gold +45</hl>。符文碎片的掉落概率判定中……'}
      ]}],
    };
    pool = EVENT_POOL_ACT3;
    bossEvent = { id:'boss', ...BOSS_EVENT_ACT3 };
    merchantId = 'wanderingMage';
  } else if (actNum === 4) {
    firstEvent = {
      id: 'riftFall', title: '裂隙坠落',
      desc: '脚下的地面突然崩裂，你坠入了一条闪烁着紫光的深渊裂隙。着地时扬起的尘土中，一对猩红的眼睛亮起——一头被惊扰的裂隙爬行者。',
      options: [{ text:'迎战', conds:[], costs:[], results:[
        {type:'combat',enemy:'riftCrawler',rewards:[{type:'gold',val:60},{type:'addItem',itemId:'purpleShard',qty:1,chance:46}]},
        {type:'msg', text:'裂隙爬行者被斩杀。战斗胜利！<hl>Gold +60</hl>。紫水晶碎片的掉落概率判定中……'}
      ]}],
    };
    pool = EVENT_POOL_ACT4;
    bossEvent = { id:'boss', ...BOSS_EVENT_ACT4 };
    merchantId = 'riftMerchant';
  } else if (actNum === 5) {
    firstEvent = {
      id: 'dragonEntrance', title: '龙巢入口',
      desc: '火山口的热浪扑面而来。两只浑身覆盖着暗红鳞片的龙裔战士正守在入口处，它们手持熔岩铸成的长矛，喉咙中发出低沉的龙吟。',
      options: [{ text:'迎战', conds:[], costs:[], results:[
        {type:'combat',enemy:'dragonGuard',rewards:[{type:'gold',val:80},{type:'addItem',itemId:'dragonScaleFrag',qty:1,chance:46}]},
        {type:'msg', text:'龙裔守卫倒下。战斗胜利！<hl>Gold +80</hl>。龙鳞碎片的掉落概率判定中……'}
      ]}],
    };
    pool = EVENT_POOL_ACT5;
    bossEvent = { id:'boss', ...BOSS_EVENT_ACT5 };
    merchantId = 'dragonMerchant';
  } else if (actNum === 6) {
    firstEvent = {
      id: 'starCorridor', title: '星光回廊',
      desc: '踏入虚空的瞬间，脚下的地面消失了。你在星辰之间漂浮，一道由星尘凝聚而成的人形从旋转的星云中走出。它没有面孔，但你能感到它在审视你的灵魂。',
      options: [{ text:'迎战', conds:[], costs:[], results:[
        {type:'combat',enemy:'starAvatar',rewards:[{type:'gold',val:100},{type:'addItem',itemId:'starDust',qty:1,chance:50}]},
        {type:'msg', text:'星尘化身消散。战斗胜利！<hl>Gold +100</hl>。星尘碎片的掉落概率判定中……'}
      ]}],
    };
    pool = EVENT_POOL_ACT6;
    bossEvent = { id:'boss', ...BOSS_EVENT_ACT6 };
    merchantId = 'voidMerchant';
  } else { return; }

  G.eventQueue.push(firstEvent);
  // Select pool events, ensure merchant is included
  const otherEvents = pool.filter(e => e.id !== merchantId);
  const shuffled = [...otherEvents].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, poolCount - 1);
  const merchant = pool.find(e => e.id === merchantId);
  if (merchant) selected.push(merchant);
  // Shuffle selected events (merchant still included)
  const finalSelected = selected.sort(() => Math.random() - 0.5);
  G.eventQueue.push(...finalSelected);
  G.eventQueue.push(bossEvent);
}

function enhanceEquipment() {
  // Upgrade rarity of one equipped weapon or armor
  const candidates = [];
  const wUid = G.equipment.weapon;
  const aUid = G.equipment.armor;
  if (wUid) candidates.push({uid:wUid, slot:'weapon'});
  if (aUid) candidates.push({uid:aUid, slot:'armor'});
  if (candidates.length === 0) return null;
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  const item = G.inventory.find(i => i.uid === pick.uid);
  if (!item) return null;
  const upgraded = upgradeRarity(item.id);
  if (upgraded === item.id) return null; // Already max rarity
  removeItem(pick.uid, 1);
  addItem(upgraded, 1);
  return { oldName: item.name, newName: ITEMS[upgraded].name };
}

function initAct1() { initAct(1); }
function initAct2() { initAct(2); }
function initAct3() { initAct(3); }

function currentEvent() {
  if (G.currentEventIndex >= G.eventQueue.length) return null;
  return G.eventQueue[G.currentEventIndex];
}

function nextEvent() {
  G.currentEventIndex++;
  G.pendingResult = null;
  G.pendingResultContinue = null;
  if (G.currentEventIndex >= G.eventQueue.length) {
    showActClear();
    return;
  }
  G.phase = 'event';
  saveGame();
  render();
}

// ---- 选项结算 ----

function checkConditions(conds) {
  const stats = totalStats();
  for (const c of conds) {
    switch (c.type) {
      case 'atk': if (!compareVal(stats.atk, c.op, c.val)) return false; break;
      case 'def': if (!compareVal(stats.def, c.op, c.val)) return false; break;
      case 'spd': if (!compareVal(stats.spd, c.op, c.val)) return false; break;
      case 'luk': if (!compareVal(stats.luk, c.op, c.val)) return false; break;
      case 'hp': if (!compareVal(G.player.hp, c.op, c.val)) return false; break;
      case 'gold': if (!compareVal(G.player.gold, c.op, c.val)) return false; break;
      case 'hasItem': if (c.qty ? countItem(c.itemId) < c.qty : !hasItem(c.itemId)) return false; break;
      case 'hasAnyItem': if (G.inventory.length === 0) return false; break;
    }
  }
  return true;
}

function compareVal(a, op, b) {
  switch (op) {
    case '>=': return a >= b;
    case '>': return a > b;
    case '<=': return a <= b;
    case '<': return a < b;
    case '==': return a == b;
    default: return true;
  }
}

function applyCosts(costs) {
  for (const c of costs) {
    switch (c.type) {
      case 'hpCost':
        G.player.hp -= c.val;
        break;
      case 'gold':
        G.player.gold -= c.val;
        break;
      case 'loseItem': {
        const uid = findItemUid(c.itemId);
        if (uid) removeItem(uid, c.qty || 1);
        break;
      }
      case 'chooseItem':
        break;
    }
  }
}

async function applyResults(results) {
  const messages = [];
  for (const r of results) {
    switch (r.type) {
      case 'msg':
        messages.push(r.text);
        break;
      case 'gold':
        G.player.gold += r.val;
        break;
      case 'addItem': {
        const result = addItem(r.itemId, r.qty || 1);
        if (result.full) {
          if (!G.pendingFullItems) G.pendingFullItems = [];
          G.pendingFullItems.push({ itemId: r.itemId, qty: r.qty || 1 });
          messages.push(`⚠ 物品栏已满！`);
        } else if (result.item && r.showName) {
          messages.push(`获得 <hl>${ITEMS[r.itemId].name} ×${r.qty||1}</hl>`);
        }
        break;
      }
      case 'heal':
        G.player.hp = Math.min(G.player.maxHp, G.player.hp + r.val);
        break;
      case 'healPct':
        const healAmt = Math.floor(G.player.maxHp * r.val / 100);
        G.player.hp = Math.min(G.player.maxHp, G.player.hp + healAmt);
        break;
      case 'maxHp':
        G.player.maxHp += r.val;
        G.player.hp = Math.min(G.player.maxHp, G.player.hp + Math.max(0, r.val));
        break;
      case 'stat':
        if (r.key === 'atk') G.player.atk += r.val;
        if (r.key === 'def') G.player.def += r.val;
        if (r.key === 'spd') G.player.spd += r.val;
        if (r.key === 'luk') G.player.luk += r.val;
        break;
      case 'actStat':
        if (!G.actMods) G.actMods = { atk:0, def:0, spd:0, luk:0, maxHp:0 };
        if (r.key === 'atk') { G.player.atk += r.val; G.actMods.atk += r.val; }
        if (r.key === 'def') { G.player.def += r.val; G.actMods.def += r.val; }
        if (r.key === 'spd') { G.player.spd += r.val; G.actMods.spd += r.val; }
        if (r.key === 'luk') { G.player.luk += r.val; G.actMods.luk += r.val; }
        if (r.key === 'maxHp') { G.player.maxHp += r.val; G.actMods.maxHp += r.val; G.player.hp = Math.min(G.player.maxHp, G.player.hp); }
        break;
      case 'combat':
        startCombat(r.enemy, r.rewards || []);
        return messages;
      case 'buff':
        G.buffs.push({ name:r.name, battles:r.battles, effects:r.effects });
        break;
      case 'lukCheck': {
        const stats = totalStats();
        const lukBonus = G.buffs.some(b => b.effects && b.effects.lukBonus15) ? 15 : 0;
        const autoSuccess = G.buffs.some(b => b.effects && b.effects.autoLuk);
        const successRate = r.threshold + stats.luk * 2 + lukBonus;
        const roll = Math.random() * 100;
        if (autoSuccess || roll < successRate) {
          const subMsgs = await applyResults(r.success);
          messages.push(...subMsgs);
        } else {
          const subMsgs = await applyResults(r.fail);
          messages.push(...subMsgs);
        }
        break;
      }
      case 'randomEquip': {
        const equipId = rollRandomEquip(r.rarity);
        if (equipId) {
          const result = addItem(equipId, 1);
          if (result.full) {
            if (!G.pendingFullItems) G.pendingFullItems = [];
            G.pendingFullItems.push({ itemId: equipId, qty: 1 });
            messages.push(`⚠ 物品栏已满！`);
          } else {
            messages.push(`获得 <hl>${ITEMS[equipId].name} (${ITEMS[equipId].rarity})</hl>`);
          }
        }
        break;
      }
      case 'enhanceEquip': {
        const result = enhanceEquipment();
        if (result) {
          messages.push(`<hl>${result.oldName}</hl> 被强化为 <hl>${result.newName}</hl>！`);
        } else {
          messages.push('没有可强化的装备，或装备已达最高品质。');
          G.player.gold += 80; // Refund
        }
        break;
      }
      case 'clearDebuffs':
        G.buffs = G.buffs.filter(b => !b.effects.poisonDmg);
        break;
      case 'clearInventory':
        G.inventory = [];
        G.equipment = { weapon:null, armor:null, acc1:null, acc2:null };
        break;
      case 'openShop':
        G.shopMode = 'buy';
        break;
      case 'openSell':
        G.shopMode = 'sell';
        break;
    }
  }
  return messages;
}

async function selectOption(idx) {
  const event = currentEvent();
  if (!event) return;
  const opt = event.options[idx];
  if (!checkConditions(opt.conds)) return;

  const hasChooseItem = opt.costs.some(c => c.type === 'chooseItem');
  if (hasChooseItem) {
    showItemSelectPopup(idx);
    return;
  }

  const hpBefore = G.player.hp;
  applyCosts(opt.costs);
  const hpAfterCosts = G.player.hp;
  const messages = await applyResults(opt.results);

  if (G.shopMode) { render(); return; }
  if (G.phase === 'combat') {
    return;
  }
  // Handle full inventory items
  if (G.pendingFullItems && G.pendingFullItems.length > 0) {
    showFullInventoryPopup(messages, hpBefore - hpAfterCosts);
    return;
  }
  showResultMessages(messages, hpBefore - hpAfterCosts);
}

// ---- 关底事件 ----

function bossFight() {
  let enemyId, goldReward, equipRarity;
  if (G.currentAct === 1) { enemyId = 'spiderBoss'; goldReward = 50; equipRarity = 'C-B'; }
  else if (G.currentAct === 2) { enemyId = 'rockWorm'; goldReward = 55; equipRarity = 'B-C'; }
  else if (G.currentAct === 3) { enemyId = 'ancientConstruct'; goldReward = 70; equipRarity = 'B-A'; }
  else if (G.currentAct === 4) { enemyId = 'abyssLord'; goldReward = 100; equipRarity = 'A-S'; }
  else if (G.currentAct === 5) { enemyId = 'ancientDragon'; goldReward = 140; equipRarity = 'S'; }
  else { enemyId = 'fateAvatar'; goldReward = 0; equipRarity = 'S'; }
  const bossRewards = [
    {type:'gold',val:goldReward},
    {type:'randomEquip',rarity:equipRarity},
  ];
  startCombat(enemyId, bossRewards);
}

function afterCombatResult() {
  const event = currentEvent();
  if (event && event.id === 'boss' && G.player.hp > 0) {
    showActClear();
    return;
  }
  nextEvent();
}

// ---- 通关结算 ----

function showActClear() {
  G.phase = 'actClear';
  if (G.currentAct === 1) {
    G.actClearRewards = {
      gold: 30,
      choices: [
        { text:'稀有装备宝箱', desc:'随机 D~B 级装备', result:{type:'randomEquip',rarity:'D-B'} },
        { text:'大治疗药水 ×2 + 60 Gold', desc:'补给与财富', result:{type:'mixed',items:[{type:'addItem',itemId:'bigHealPotion',qty:2},{type:'gold',val:60}]} },
        { text:'永久 ATK+1、DEF+1', desc:'永久属性提升', result:{type:'stats', atk:1, def:1} },
      ],
    };
  } else if (G.currentAct === 2) {
    G.actClearRewards = {
      gold: 40,
      choices: [
        { text:'装备宝箱', desc:'随机 C~B 级装备', result:{type:'randomEquip',rarity:'C-B'} },
        { text:'大治疗药水 ×2 + 80 Gold', desc:'补给与财富', result:{type:'mixed',items:[{type:'addItem',itemId:'bigHealPotion',qty:2},{type:'gold',val:80}]} },
        { text:'永久 ATK+2、SPD+1', desc:'永久属性提升', result:{type:'stats', atk:2, spd:1} },
      ],
    };
  } else if (G.currentAct === 3) {
    G.actClearRewards = {
      gold: 55,
      choices: [
        { text:'装备宝箱', desc:'随机 B~A 级装备', result:{type:'randomEquip',rarity:'B-A'} },
        { text:'大治疗药水 ×2 + 100 Gold', desc:'补给与财富', result:{type:'mixed',items:[{type:'addItem',itemId:'bigHealPotion',qty:2},{type:'gold',val:100}]} },
        { text:'永久 ATK+2、DEF+1、SPD+1', desc:'永久属性提升', result:{type:'stats', atk:2, def:1, spd:1} },
      ],
    };
  } else if (G.currentAct === 4) {
    G.actClearRewards = {
      gold: 80,
      choices: [
        { text:'装备宝箱', desc:'随机 A~S 级装备', result:{type:'randomEquip',rarity:'A-S'} },
        { text:'大治疗药水 ×3 + 130 Gold', desc:'补给与财富', result:{type:'mixed',items:[{type:'addItem',itemId:'bigHealPotion',qty:3},{type:'gold',val:130}]} },
        { text:'永久 ATK+3、DEF+2、SPD+1', desc:'永久属性提升', result:{type:'stats', atk:3, def:2, spd:1} },
      ],
    };
  } else if (G.currentAct === 5) {
    G.actClearRewards = {
      gold: 120,
      choices: [
        { text:'装备宝箱', desc:'随机 S~A 级装备', result:{type:'randomEquip',rarity:'A-S'} },
        { text:'大治疗药水 ×3 + 180 Gold', desc:'补给与财富', result:{type:'mixed',items:[{type:'addItem',itemId:'bigHealPotion',qty:3},{type:'gold',val:180}]} },
        { text:'永久 ATK+3、DEF+3、SPD+2、MaxHP+20', desc:'永久属性提升', result:{type:'stats', atk:3, def:3, spd:2, maxHp:20} },
      ],
    };
  } else if (G.currentAct === 6) {
    G.actClearRewards = {
      gold: 200,
      choices: [
        { text:'通关', desc:'查看结局', result:{type:'ending'} },
      ],
    };
  }
  render();
}

function pickActClearReward(idx) {
  const resultLines = [`Gold +${G.actClearRewards.gold}`];
  G.player.gold += G.actClearRewards.gold;
  const choice = G.actClearRewards.choices[idx];
  const r = choice.result;
  if (r.type === 'ending') {
    G.phase = 'gameOver';
    localStorage.removeItem('game2_save');
    render();
    return;
  }
  if (r.type === 'randomEquip') {
    const equipId = rollRandomEquip(r.rarity);
    if (equipId) { addItem(equipId, 1); resultLines.push(`获得 <hl>${ITEMS[equipId].name}</hl>`); }
  } else if (r.type === 'mixed') {
    for (const sub of r.items) {
      if (sub.type === 'addItem') { addItem(sub.itemId, sub.qty); resultLines.push(`获得 <hl>${ITEMS[sub.itemId].name} ×${sub.qty}</hl>`); }
      if (sub.type === 'gold') { G.player.gold += sub.val; resultLines.push(`Gold +${sub.val}`); }
    }
  } else if (r.type === 'stats') {
    if (r.atk) { G.player.atk += r.atk; resultLines.push(`永久 ATK +${r.atk}`); }
    if (r.def) { G.player.def += r.def; resultLines.push(`永久 DEF +${r.def}`); }
    if (r.spd) { G.player.spd += r.spd; resultLines.push(`永久 SPD +${r.spd}`); }
    if (r.maxHp) { G.player.maxHp += r.maxHp; G.player.hp += r.maxHp; resultLines.push(`MaxHP +${r.maxHp}`); }
  }
  // Show result in event style, then transition
  G.pendingResult = resultLines.join('<br>');
  G.pendingResultContinue = function() {
    G.pendingResult = null; G.pendingResultContinue = null;
    // Clear all buffs and act-scoped stat mods
    G.buffs = [];
    if (G.actMods) {
      G.player.atk -= G.actMods.atk;
      G.player.def -= G.actMods.def;
      G.player.spd -= G.actMods.spd;
      G.player.luk -= G.actMods.luk;
      G.player.maxHp -= G.actMods.maxHp;
      G.player.hp = Math.min(G.player.maxHp, G.player.hp);
      G.actMods = null;
    }
    if (G.currentAct < 6) {
      initAct(G.currentAct + 1);
      G.phase = 'event';
      saveGame();
    } else {
      G.phase = 'gameOver';
      localStorage.removeItem('game2_save');
    }
    render();
  };
  G.phase = 'event';
  render();
}
