// ============================================================
// js/save.js — 存档系统
// ============================================================

function saveGame() {
  const data = {
    player: G.player,
    inventory: G.inventory,
    equipment: G.equipment,
    buffs: G.buffs,
    flags: G.flags,
    currentAct: G.currentAct,
    eventQueue: G.eventQueue,
    currentEventIndex: G.currentEventIndex,
    phase: G.phase,
    combatLog: G.combatLog,
    pendingResult: G.pendingResult,
    pendingResultContinue: null,
    uidCounter,
  };
  localStorage.setItem('game2_save', JSON.stringify(data));
}

function loadGame() {
  const raw = localStorage.getItem('game2_save');
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    G.player = data.player;
    G.inventory = data.inventory;
    G.equipment = data.equipment;
    G.buffs = data.buffs || [];
    G.flags = data.flags || [];
    G.currentAct = data.currentAct;
    G.eventQueue = data.eventQueue;
    G.currentEventIndex = data.currentEventIndex;
    G.combatLog = data.combatLog || [];
    G.pendingResult = data.pendingResult || null;
    G.pendingResultContinue = null;
    uidCounter = data.uidCounter || 1;
    G.phase = data.phase || 'event';
    G.shopMode = false;
    G.combatState = null;
    if (G.phase === 'combat') G.phase = 'event';
    return true;
  } catch (e) {
    return false;
  }
}

function newGame() {
  G = createInitialState();
  initAct1();
  G.phase = 'event';
  saveGame();
  render();
}

function continueGame() {
  if (loadGame()) {
    render();
  } else {
    newGame();
  }
}

function resetToTitle() {
  G = createInitialState();
  render();
}
