// ============================================================
// js/state.js — 游戏状态管理与物品栏操作
// ============================================================

function createInitialState() {
  return {
    player: { hp:100, maxHp:100, atk:10, def:2, spd:5, luk:3, gold:50 },
    inventory: [],
    equipment: { weapon:null, armor:null, acc1:null, acc2:null },
    buffs: [],
    flags: [],
    currentAct: 1,
    eventQueue: [],
    currentEventIndex: 0,
    phase: 'title',
    combatState: null,
    combatLog: [],
    actClearRewards: null,
    shopMode: false,
    pendingResult: null,
    pendingResultContinue: null,
  };
}

let G = createInitialState();
let uidCounter = 1;

function newUid() { return uidCounter++; }

// ---- 属性计算 ----

function getEquipStats(slot) {
  const uid = G.equipment[slot];
  if (!uid) return {};
  const inv = G.inventory.find(i => i.uid === uid);
  if (!inv) return {};
  const stats = {};
  if (inv.atk) stats.atk = inv.atk;
  if (inv.def) stats.def = inv.def;
  if (inv.spd) stats.spd = inv.spd;
  if (inv.luk) stats.luk = inv.luk;
  if (inv.maxHp) stats.maxHp = inv.maxHp;
  return stats;
}

function totalStats() {
  let s = { ...G.player };
  for (const slot of ['weapon','armor','acc1','acc2']) {
    const es = getEquipStats(slot);
    if (es.atk) s.atk += es.atk;
    if (es.def) s.def += es.def;
    if (es.spd) s.spd += es.spd;
    if (es.luk) s.luk += es.luk;
  }
  for (const b of G.buffs) {
    if (b.effects.atk) s.atk += b.effects.atk;
    if (b.effects.def) s.def += b.effects.def;
    if (b.effects.spd) s.spd += b.effects.spd;
    if (b.effects.luk) s.luk += b.effects.luk;
  }
  return s;
}

// ---- 物品栏操作 ----

function addItem(itemId, qty) {
  qty = qty || 1;
  const template = ITEMS[itemId];
  if (!template) return null;
  const stackable = ['consumable','material'].includes(template.type);
  if (stackable) {
    const existing = G.inventory.find(i => i.id === itemId);
    if (existing) { existing.qty += qty; return { item: existing }; }
  }
  const newItem = { ...template, qty, uid: newUid() };
  G.inventory.push(newItem);
  return { item: newItem };
}

function removeItem(uid, qty) {
  qty = qty || 1;
  const idx = G.inventory.findIndex(i => i.uid === uid);
  if (idx < 0) return false;
  const item = G.inventory[idx];
  for (const [slot, equid] of Object.entries(G.equipment)) {
    if (equid === uid) {
      G.equipment[slot] = null;
      if (item.maxHp) { G.player.maxHp -= item.maxHp; G.player.hp = Math.min(G.player.maxHp, G.player.hp); }
    }
  }
  if (item.qty > qty) {
    item.qty -= qty;
  } else {
    G.inventory.splice(idx, 1);
  }
  return true;
}

function hasItem(itemId) {
  return G.inventory.some(i => i.id === itemId && i.qty > 0);
}

function findItemUid(itemId) {
  const item = G.inventory.find(i => i.id === itemId && i.qty > 0);
  return item ? item.uid : null;
}

function countItem(itemId) {
  const item = G.inventory.find(i => i.id === itemId);
  return item ? item.qty : 0;
}
