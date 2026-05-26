// ============================================================
// js/ui.js — UI 渲染
// ============================================================

function render() {
  const app = document.getElementById('app');
  switch (G.phase) {
    case 'title': renderTitle(app); break;
    case 'event': renderEvent(app); break;
    case 'combat': renderCombat(app); break;
    case 'actClear': renderActClear(app); break;
    case 'gameOver': renderGameOver(app); break;
  }
}

// ---- 公共组件 ----

function renderTopBar() {
  const event = currentEvent();
  return `
    <div id="topbar">
      <span class="act-info">第 ${G.currentAct} 幕</span>
      <span>事件 ${G.currentEventIndex + 1} / ${G.eventQueue.length}</span>
      <span style="font-size:12px;color:#667">${event ? event.title : ''}</span>
    </div>`;
}

function renderPlayerPanel() {
  const stats = totalStats();
  const hpPct = Math.max(0, Math.round(G.player.hp / G.player.maxHp * 100));
  let equipHtml = '';
  for (const [slot, label] of [['weapon','武器'],['armor','护甲'],['acc1','饰品1'],['acc2','饰品2']]) {
    const uid = G.equipment[slot];
    const item = uid ? G.inventory.find(i => i.uid === uid) : null;
    const tooltip = item ? makeItemTooltip(item) : '';
    const cls = item ? `equip-slot has-tooltip rarity-${item.rarity}` : 'equip-slot';
    equipHtml += `<div class="${cls}" onclick="${item ? `clickInventory(${item.uid})` : ''}" style="${item ? 'cursor:pointer' : ''}"><span class="label">${label}:</span><span class="item-name">${item ? item.name : '(空)'}</span>${tooltip}</div>`;
  }
  let invHtml = '';
  for (let i = 0; i < 12; i++) {
    const item = G.inventory[i];
    if (item) {
      let cls = `inv-slot rarity-${item.rarity}`;
      let eqTag = '';
      for (const uid of Object.values(G.equipment)) {
        if (uid === item.uid) { cls += ' equipped'; eqTag = '<span class="eq-tag">E</span>'; break; }
      }
      const tooltip = makeItemTooltip(item);
      invHtml += `<div class="${cls}" onclick="clickInventory(${item.uid})" oncontextmenu="rightClickInventory(${item.uid},event)">${eqTag}<span style="word-break:break-all;line-height:1.1">${item.name}</span>${item.qty>1?`<span class="qty">×${item.qty}</span>`:''}${tooltip}</div>`;
    } else {
      invHtml += `<div class="inv-slot" style="color:#bbb;background:#f9f9f9"></div>`;
    }
  }
  let buffHtml = '';
  for (const b of G.buffs) {
    const desc = buffEffectDesc(b.effects);
    const tooltip = desc ? `<span class="inv-tooltip">${desc}</span>` : '';
    buffHtml += `<span class="buff-tag has-tooltip">${b.name}(${b.battles}次)${tooltip}</span> `;
  }
  return `
    <div id="left-panel">
      <div style="font-weight:bold;color:#c0392b;font-size:16px;text-align:center">冒险者</div>
      <div>HP ${G.player.hp}/${G.player.maxHp}</div>
      <div class="hp-bar"><div class="fill" style="width:${hpPct}%"></div></div>
      <div class="stat-row"><span>ATK</span><span class="val">${stats.atk}</span></div>
      <div class="stat-row"><span>DEF</span><span class="val">${stats.def}</span></div>
      <div class="stat-row"><span>SPD</span><span class="val">${stats.spd}</span></div>
      <div class="stat-row"><span>LUK</span><span class="val">${stats.luk}</span></div>
      <div class="stat-row"><span>Gold</span><span class="val">${G.player.gold}</span></div>
      <div class="section-title">装备</div>
      ${equipHtml}
      ${buffHtml ? `<div class="section-title">Buff</div>${buffHtml}` : ''}
      <div class="section-title">物品栏 (${G.inventory.length}/12)</div>
      <div class="inv-grid">${invHtml}</div>
    </div>`;
}

function formatCostLabel(c) {
  switch (c.type) {
    case 'hpCost': return `<span style="color:#c0392b">HP −${c.val}</span>`;
    case 'gold': return `<span style="color:#b8860b">Gold −${c.val}</span>`;
    case 'loseItem': return `<span style="color:#ff9800">${ITEMS[c.itemId]?.name || c.itemId} ×${c.qty||1}</span>`;
    case 'chooseItem': return '<span style="color:#ff9800">自选1件物品</span>';
    default: return '';
  }
}

function formatResultText(text) {
  return text
    .replace(/<hl>/g, '<span class="highlight">')
    .replace(/<\/hl>/g, '</span>')
    .replace(/<hp>/g, '<span class="hp-change">')
    .replace(/<\/hp>/g, '</span>')
    .replace(/<loss>/g, '<span class="hp-loss">')
    .replace(/<\/loss>/g, '</span>');
}

// ---- 标题画面 ----

function renderTitle(app) {
  const hasSave = !!localStorage.getItem('game2_save');
  app.innerHTML = `
    <div class="screen-center">
      <div class="screen-title">无定之途</div>
      <div style="margin-top:20px">
        <button class="big-btn" onclick="newGame()">新游戏</button>
        ${hasSave ? '<button class="big-btn secondary" onclick="continueGame()">继续游戏</button>' : ''}
      </div>
      <div class="flavor-text">"歧路万千，行者为途。"</div>
    </div>`;
}

// ---- 事件画面 ----

function renderEvent(app) {
  if (G.shopMode) { renderShop(app); return; }

  // If there's a pending result, show result regardless of current event
  if (G.pendingResult) {
    renderEventResult(app, currentEvent());
    return;
  }

  const event = currentEvent();
  if (!event) { showActClear(); return; }

  // Boss event rendering
  if (event.id === 'boss') { renderBossGate(app); return; }

  // Show options (only those with met conditions)
  let optsHtml = '';
  for (let i = 0; i < event.options.length; i++) {
    const opt = event.options[i];
    if (!checkConditions(opt.conds)) continue; // Hide unmet options
    let costStr = '';
    for (const c of opt.costs) {
      costStr += ` <span class="cost">[${formatCostLabel(c)}]</span>`;
    }
    optsHtml += `<button class="opt-btn" onclick="selectOption(${i})">${opt.text}${costStr}</button>`;
  }

  app.innerHTML = `
    ${renderTopBar()}
    <div id="main">
      ${renderPlayerPanel()}
      <div id="right-panel">
        <div class="event-title">${event.title}</div>
        <div class="event-desc">${event.desc}</div>
        <div class="options-area">${optsHtml}</div>
      </div>
    </div>`;
}

function renderEventResult(app, event) {
  const resultHtml = formatResultText(G.pendingResult);
  let continueLabel = '继续';
  if (event && event.id === 'boss') continueLabel = '结算奖励';
  app.innerHTML = `
    ${renderTopBar()}
    <div id="main">
      ${renderPlayerPanel()}
      <div id="right-panel">
        <div class="event-title">${event ? event.title : ''}</div>
        <div class="result-box">${resultHtml}</div>
        <button class="big-btn" style="margin-top:16px;width:100%" onclick="continueAfterResult()">${continueLabel}</button>
      </div>
    </div>`;
}

function continueAfterResult() {
  if (G.pendingResultContinue) {
    G.pendingResultContinue();
  } else {
    const event = currentEvent();
    if (event && event.id === 'boss') {
      showActClear();
    } else {
      nextEvent();
    }
  }
}

// ---- 关底画面 ----

function renderBossGate(app) {
  const event = currentEvent();

  if (G.pendingResult) {
    renderEventResult(app, event);
    return;
  }

  const bossInfo = getBossInfo();

  app.innerHTML = `
    ${renderTopBar()}
    <div id="main">
      ${renderPlayerPanel()}
      <div id="right-panel">
        <div class="event-title">⚠ 关底：${event.title}</div>
        <div class="event-desc">${event.desc}</div>
        <div style="background:#fef0f0;border:1px solid #f5c6cb;padding:12px;border-radius:8px;margin-bottom:12px">
          <div style="color:#c0392b;font-size:14px;font-weight:bold">Boss：${bossInfo.name}</div>
          <div style="font-size:12px;color:#888">HP:${bossInfo.hp}  ATK:${bossInfo.atk}  DEF:${bossInfo.def}  SPD:${bossInfo.spd}</div>
          <div style="font-size:11px;color:#c0392b;margin-top:2px">${bossInfo.traitDesc}</div>
        </div>
        <div class="options-area">
          <button class="opt-btn" onclick="bossFight()">正面迎战</button>
        </div>
      </div>
    </div>`;
}

// ---- 战斗画面 ----

function renderCombat(app) {
  // If combatState is null, combat just ended — show enemy + combat log + confirm button
  if (!G.combatState) {
    const victory = G.player.hp > 0;
    const enemy = G.lastEnemy;
    const logHtml = G.combatLog.map(l => {
      if (l.startsWith('===')) return `<div class="result-${victory?'win':'lose'}">${l}</div>`;
      if (l.startsWith('---')) return `<div class="round-hdr">${l}</div>`;
      if (l.startsWith('你') || l.startsWith('[')) return `<div class="player-action">${l}</div>`;
      return `<div class="enemy-action">${l}</div>`;
    }).join('');

    const enemyHtml = enemy ? `
      <div style="background:#fef0f0;border:1px solid #f5c6cb;padding:12px;border-radius:8px;margin-bottom:12px">
        <div style="font-size:14px;color:#c0392b;font-weight:bold">${enemy.name}  HP: 0/${enemy.maxHp}</div>
        <div style="font-size:12px;color:#888">ATK:${enemy.atk}  DEF:${enemy.def}  SPD:${enemy.spd}</div>
        ${enemy.trait ? `<div style="font-size:11px;color:#c0392b;margin-top:2px">${traitDesc(enemy.trait)}</div>` : ''}
      </div>` : '';

    app.innerHTML = `
      ${renderTopBar()}
      <div id="main">
        ${renderPlayerPanel()}
        <div id="right-panel">
          <div class="event-title">⚔ 战斗结束</div>
          ${enemyHtml}
          <div class="combat-log" style="max-height:240px;overflow-y:auto">${logHtml}</div>
          <button class="big-btn" style="margin-top:16px;width:100%" onclick="confirmCombatEnd()">确认结果</button>
        </div>
      </div>`;
    return;
  }

  const cs = G.combatState;
  const enemy = cs.enemy;
  const stats = totalStats();

  const logHtml = G.combatLog.map(l => {
    if (l.startsWith('===')) return `<div class="result-win">${l}</div>`;
    if (l.startsWith('---')) return `<div class="round-hdr">${l}</div>`;
    if (l.startsWith('你') || l.startsWith('[')) return `<div class="player-action">${l}</div>`;
    return `<div class="enemy-action">${l}</div>`;
  }).join('');

  // Pre-combat: show enemy info + "开始战斗" button, allow prep
  if (G.preCombat) {
    app.innerHTML = `
      ${renderTopBar()}
      <div id="main">
        ${renderPlayerPanel()}
        <div id="right-panel">
          <div class="event-title">⚔ 遭遇敌人</div>
          <div style="background:#fef0f0;border:1px solid #f5c6cb;padding:16px;border-radius:8px;margin-bottom:12px">
            <div style="font-size:18px;color:#c0392b;font-weight:bold;margin-bottom:8px">${enemy.name}</div>
            <div style="font-size:13px;color:#555;line-height:1.8">
              HP: <b>${enemy.hp}</b> &nbsp; ATK: <b>${enemy.atk}</b> &nbsp; DEF: <b>${enemy.def}</b> &nbsp; SPD: <b>${enemy.spd}</b>
            </div>
            ${enemy.trait ? `<div style="font-size:12px;color:#c0392b;margin-top:6px">${traitDesc(enemy.trait)}</div>` : ''}
            <div style="font-size:13px;color:#666;margin-top:8px">你的 SPD: ${stats.spd} vs 敌方 SPD: ${enemy.spd} → <b>${stats.spd >= enemy.spd ? '你' : enemy.name}</b> 先手</div>
          </div>
          <div style="font-size:13px;color:#888;margin-bottom:16px">准备就绪后开始战斗（可趁现在使用药水或更换装备）</div>
          <button class="big-btn" style="width:100%" onclick="beginCombat()">开始战斗</button>
        </div>
      </div>`;
    return;
  }

  app.innerHTML = `
    ${renderTopBar()}
    <div id="main">
      ${renderPlayerPanel()}
      <div id="right-panel">
        <div class="event-title">⚔ 战斗中</div>
        <div style="background:#fef0f0;border:1px solid #f5c6cb;padding:12px;border-radius:8px;margin-bottom:12px">
          <div style="font-size:14px;color:#c0392b;font-weight:bold">${enemy.name}  HP: ${Math.max(0,enemy.hp)}/${enemy.maxHp}</div>
          <div style="font-size:12px;color:#888">ATK:${enemy.atk}  DEF:${enemy.def}  SPD:${enemy.spd}</div>
          ${enemy.trait ? `<div style="font-size:11px;color:#c0392b;margin-top:2px">${traitDesc(enemy.trait)}</div>` : ''}
        </div>
        <div style="font-size:13px;color:#666">你的 SPD: ${stats.spd} vs 敌方 SPD: ${enemy.spd} → ${stats.spd >= enemy.spd ? '你' : enemy.name}先手</div>
        <div class="combat-log" style="margin-top:12px;max-height:220px;overflow-y:auto">${logHtml}</div>
        ${G.battling ? `
          <div style="margin-top:16px;text-align:center;color:#888;font-size:13px">战斗中…</div>
        ` : `
          <button class="big-btn" style="margin-top:16px;width:100%" onclick="simulateAllCombat()">自动战斗到底</button>
          <div style="display:flex;gap:8px;margin-top:8px">
            <button class="big-btn secondary" style="flex:1;font-size:14px;padding:12px" onclick="simulateCombatRound()">下一回合</button>
            <button class="big-btn secondary" style="flex:1;font-size:14px;padding:12px" onclick="simulateAllCombat(true)">快进到战斗结束</button>
          </div>
        `}
      </div>
    </div>`;
}

function getBossInfo() {
  if (G.currentAct === 1) return { name:'洞穴巨蛛', hp:45, atk:7, def:2, spd:5, traitDesc:'毒液：每 3 回合造成 3 点额外伤害（无视防御）' };
  if (G.currentAct === 2) return { name:'岩石巨虫', hp:72, atk:11, def:4, spd:4, traitDesc:'酸液喷吐：每 4 回合造成 5 点伤害；结晶甲壳：前 2 回合减免 3 点伤害' };
  if (G.currentAct === 3) return { name:'古代构装体', hp:100, atk:15, def:6, spd:7, traitDesc:'多重攻击：每 3 回合连续攻击 2 次；能量护盾：HP<30% 时 DEF+4' };
  if (G.currentAct === 4) return { name:'深渊之主', hp:132, atk:24, def:9, spd:9, traitDesc:'黑暗吞噬：每5回合造成10伤害并降ATK3；多重眼瞳：每3回合额外攻击一次' };
  if (G.currentAct === 5) return { name:'古龙之王', hp:176, atk:30, def:12, spd:11, traitDesc:'龙息：每4回合造成15伤害；龙威：前3回合玩家ATK−3；激怒：HP<40%时ATK+8 SPD+4' };
  if (G.currentAct === 6) return { name:'命运化身', hp:240, atk:40, def:16, spd:16, traitDesc:'命运轮转：每5回合ATK或DEF+5；因果反噬：每3回合反弹30%伤害；终末审判：HP<20%时连续攻击3次' };
  return { name:'?', hp:0, atk:0, def:0, spd:0, traitDesc:'' };
}

function showResultMessages(messages, costHpLoss) {
  if (costHpLoss > 0) {
    messages.unshift(`<loss>HP −${costHpLoss}</loss>`);
  }
  G.pendingResult = messages.join('<br>');
  G.pendingResultContinue = function() { nextEvent(); };
  G.phase = 'event';
  render();
}

function showFullInventoryPopup(messages, hpDiff) {
  const items = G.pendingFullItems;
  G.pendingFullItems = null;

  function processNext() {
    if (items.length === 0) {
      showResultMessages(messages, hpDiff);
      return;
    }
    const next = items.shift();
    const item = ITEMS[next.itemId];
    // Build list of inventory items to discard
    let invHtml = '';
    for (const inv of G.inventory) {
      invHtml += `
        <div class="shop-item">
          <span style="flex:1">${inv.name} ${inv.qty>1?`×${inv.qty}`:''} <span style="color:#888;font-size:11px">(${inv.rarity}级)</span></span>
          <button class="buy-btn" onclick="discardForItem(${inv.uid},'${next.itemId}',${next.qty})">丢弃此物</button>
        </div>`;
    }

    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.id = 'fullInvPopup';
    popup.innerHTML = `
      <div class="popup-box" style="max-width:480px">
        <div class="popup-title">物品栏已满</div>
        <div style="color:#b8860b;font-weight:bold;margin-bottom:12px">获得物品：${item.name} ${next.qty>1?`×${next.qty}`:''} <span style="color:#888;font-size:11px">(${item.rarity}级)</span></div>
        <div style="color:#888;font-size:12px;margin-bottom:8px">选择一件物品丢弃以腾出空间：</div>
        <div style="max-height:250px;overflow-y:auto">${invHtml}</div>
        <div style="display:flex;gap:8px;margin-top:12px">
          <button class="big-btn secondary" style="flex:1;font-size:14px;padding:10px" onclick="document.getElementById('fullInvPopup').remove();skipFullItem('${next.itemId}',${next.qty});processFullNext()">不获取此物</button>
          <button class="big-btn secondary" style="flex:1;font-size:14px;padding:10px" onclick="document.getElementById('fullInvPopup').remove();skipFullItem('${next.itemId}',${next.qty});processFullNext();processRemainingFull()">不获取全部</button>
        </div>
      </div>`;
    document.body.appendChild(popup);
  }

  window.processFullNext = processNext;
  window.processRemainingFull = function() { items.length = 0; };
  window.skipFullItem = function() {}; // Just skips, no action needed

  window.discardForItem = function(uid, itemId, qty) {
    removeItem(uid, 1);
    addItem(itemId, qty);
    document.getElementById('fullInvPopup')?.remove();
    messages.push(`获得 <hl>${ITEMS[itemId].name}</hl>`);
    processNext();
  };

  processNext();
}

function beginCombat() {
  G.preCombat = false;
  render();
}

function confirmCombatEnd() {
  if (G.player.hp <= 0) {
    G.phase = 'gameOver';
    localStorage.removeItem('game2_save');
    render();
    return;
  }
  // Apply pending rewards, recording what was gained
  const rewardLines = [];
  if (G.pendingCombatRewards) {
    const pr = G.pendingCombatRewards;
    const origGold = G.player.gold;
    const origInv = G.inventory.map(i => ({ id: i.id, name: i.name, qty: i.qty, uid: i.uid }));
    for (const r of pr.rewards) {
      applyReward(r, pr.goldMult);
    }
    const goldGain = G.player.gold - origGold;
    if (goldGain > 0) rewardLines.push(`Gold +${goldGain}`);
    for (const item of G.inventory) {
      const old = origInv.find(o => o.uid === item.uid);
      if (!old) {
        rewardLines.push(`获得 <hl>${item.name}</hl>`);
      } else if (item.qty > old.qty) {
        rewardLines.push(`获得 <hl>${item.name} ×${item.qty - old.qty}</hl>`);
      }
    }
    G.pendingCombatRewards = null;
  }
  // Handle full inventory items from combat
  if (G.pendingFullItems && G.pendingFullItems.length > 0) {
    const items = [...G.pendingFullItems];
    G.pendingFullItems = null;
    let resultText = rewardLines.length > 0 ? rewardLines.join('<br>') : '战斗胜利！';
    showFullInventoryPopup([resultText], 0);
    return;
  }
  // Show rewards in event-result style
  let resultText = rewardLines.length > 0 ? rewardLines.join('<br>') : '战斗胜利！';
  G.pendingResult = resultText;
  G.pendingResultContinue = function() { afterCombatResult(); };
  G.phase = 'event';
  render();
}

// ---- 通关结算 ----

function renderActClear(app) {
  if (G.currentAct === 6) {
    app.innerHTML = `
      <div class="screen-center">
        <div class="screen-title">游戏通关</div>
        <div class="screen-subtitle">你超越了命运本身</div>
        <div style="max-width:500px;text-align:center;color:#ccc;line-height:2;margin:20px 0">
          你走过了迷失森林，穿越了幽暗矿洞，揭开了古代遗迹的秘密，<br>
          深入了深渊裂隙，征服了龙眠之地，最终在终末之境超越了命运本身。<br><br>
          歧路万千，行者为途。<br>
          你的旅途，已载入星界图书馆。
        </div>
        <button class="big-btn" style="margin-top:8px" onclick="pickActClearReward(0)">继续</button>
      </div>`;
    return;
  }
  const rewards = G.actClearRewards;
  let optsHtml = rewards.choices.map((c,i) => `
    <button class="opt-btn" style="font-size:14px;padding:14px" onclick="pickActClearReward(${i})">
      <b>${c.text}</b><br><span style="font-size:12px;color:#888">${c.desc}</span>
    </button>
  `).join('');

  app.innerHTML = `
    ${renderTopBar()}
    <div id="main">
      ${renderPlayerPanel()}
      <div id="right-panel">
        <div class="event-title">第${G.currentAct}幕 通关！</div>
        <div class="event-desc">${{1:'你成功穿越了迷失森林',2:'你征服了幽暗矿洞',3:'你揭开了古代遗迹的秘密',4:'你击败了深渊之主',5:'你战胜了古龙之王'}[G.currentAct]||''}</div>
        <div class="result-box">
          <div class="highlight">通关奖励：Gold +${rewards.gold}</div>
          <div style="margin-top:8px;color:#555;font-size:13px">选择一项额外奖励：</div>
        </div>
        <div class="options-area">${optsHtml}</div>
        <div class="flavor-text">${G.currentAct < 6 ? '选择奖励后将进入下一幕' : ''}</div>
      </div>
    </div>`;
}

function renderGameOver(app) {
  const victory = G.player.hp > 0;
  const deathMessages = {
    1: ['森林吞噬了又一个冒险者。','密林的阴影中，又多了一具无名骸骨。','灰狼的嚎叫回荡在森林上空——又一位旅人倒下了。','小径的尽头不是出口，而是你的终点。'],
    2: ['矿洞的黑暗中，再也听不到你的脚步声。','幽暗的矿道深处，又添了一缕亡魂。','岩石巨虫的领地，不会留下任何活口。','矿灯熄灭了——连同你的生命一起。'],
    3: ['古代遗迹的石板上，染上了新的血迹。','符文的光芒渐渐暗淡，如同你的生命。','千年的遗迹又多了一个沉默的守护者。','构装体的核心仍在运转，而你的心脏已经停止。'],
    4: ['深渊的紫光中，你的身影被黑暗吞噬。','裂隙深处多了一具漂浮的遗骸。','深渊之主不会容忍任何闯入者——你的尸体就是证明。','紫色的水晶染上了血色，那是最后的留念。'],
    5: ['龙巢的熔岩中，又多了一把灰烬。','古龙之王的咆哮震彻火山——又一个挑战者失败了。','你的遗骨将与巨龙为伴，直到永远。','火山口冒出一阵黑烟——那是你最后的痕迹。'],
    6: ['虚空的星辰中，你的灵魂化为星尘。','命运化身面无表情地抹去了又一个失败的命运。','星界图书馆的书架上多了一本未完成的故事。','在无尽虚空中，你的旅途画上了句号。'],
  };
  const msgs = deathMessages[G.currentAct] || deathMessages[1];
  const msg = msgs[Math.floor(Math.random() * msgs.length)];

  app.innerHTML = `
    <div class="screen-center">
      <div class="screen-title">${victory ? '冒险继续……' : '你倒下了'}</div>
      <div class="screen-subtitle">${victory ? '你通过了考验，但旅途尚未结束。' : msg}</div>
      <div style="margin-top:8px;color:#888;font-size:12px">第 ${G.currentAct} 幕</div>
      <div style="margin-top:20px">
        <button class="big-btn" onclick="resetToTitle()">返回标题</button>
      </div>
    </div>`;
}

// ---- 商店画面 ----

function renderShop(app) {
  const event = currentEvent();
  if (G.shopMode === 'buy' && event.shopItems) {
    if (!G.shopPurchased) G.shopPurchased = [];
    // Pick 4 random items from pool
    if (!G._shopSelection) {
      const shuffled = [...event.shopItems].sort(() => Math.random() - 0.5);
      G._shopSelection = shuffled.slice(0, Math.min(4, shuffled.length));
    }
    let itemsHtml = '';
    for (const si of G._shopSelection) {
      const item = ITEMS[si.itemId];
      const purchased = G.shopPurchased.includes(si.itemId);
      const canBuy = G.player.gold >= si.price && !purchased;
      let statDesc = [];
      if (item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory') {
        if (item.atk) statDesc.push(`ATK+${item.atk}`);
        if (item.def) statDesc.push(`DEF+${item.def}`);
        if (item.spd) statDesc.push(`SPD+${item.spd}`);
        if (item.luk) statDesc.push(`LUK+${item.luk}`);
        if (item.maxHp) statDesc.push(`MaxHP+${item.maxHp}`);
        if (item.effect) statDesc.push(item.effect);
      } else {
        statDesc.push(item.desc || '');
      }
      statDesc = statDesc.join(' | ');
      itemsHtml += `
        <div class="shop-item">
          <div>
            <span style="color:${rarityColor(item.rarity)}">${item.name}</span>
            <span style="font-size:11px;color:#888;margin-left:8px">${statDesc}</span>
            <span style="font-size:10px;color:#555;margin-left:4px">${item.rarity}级</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="color:#b8860b;font-weight:bold;font-size:13px">${si.price} G</span>
            <button class="buy-btn" ${canBuy?'':'disabled'} onclick="buyShopItem('${si.itemId}',${si.price})">${purchased ? '已售罄' : '购买'}</button>
          </div>
        </div>`;
    }
    app.innerHTML = `
      ${renderTopBar()}
      <div id="main">
        ${renderPlayerPanel()}
        <div id="right-panel">
          <div class="event-title">${event.title}</div>
          <div class="event-desc">${event.desc}</div>
          <div class="section-title" style="font-size:14px">商品</div>
          ${itemsHtml}
          <button class="big-btn secondary" style="margin-top:16px;width:100%" onclick="closeShop()">离开商店</button>
        </div>
      </div>`;
  } else if (G.shopMode === 'sell') {
    let sellItemsHtml = '';
    for (const item of G.inventory) {
      const price = Math.floor((item.sellPrice || 5) / 2);
      sellItemsHtml += `
        <div class="shop-item">
          <span>${item.name} ${item.qty>1?`×${item.qty}`:''}</span>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="color:#b8860b;font-weight:bold;font-size:13px">${price} G/个</span>
            <button class="buy-btn" onclick="sellItem(${item.uid},1)">出售1个</button>
            ${item.qty>1?`<button class="buy-btn" style="margin-left:4px" onclick="sellItem(${item.uid},${item.qty})">全部</button>`:''}
          </div>
        </div>`;
    }
    if (sellItemsHtml === '') sellItemsHtml = '<div style="color:#555;padding:20px;text-align:center">物品栏为空</div>';
    app.innerHTML = `
      ${renderTopBar()}
      <div id="main">
        ${renderPlayerPanel()}
        <div id="right-panel">
          <div class="event-title">出售物品</div>
          <div style="font-size:12px;color:#888;margin-bottom:12px">出售价格为物品价值的50%</div>
          ${sellItemsHtml}
          <button class="big-btn secondary" style="margin-top:16px;width:100%" onclick="closeShop()">完成出售</button>
        </div>
      </div>`;
  }
}

function buyShopItem(itemId, price) {
  if (G.player.gold < price) return;
  if (G.shopPurchased && G.shopPurchased.includes(itemId)) return;
  const item = ITEMS[itemId];
  if (!item) return;
  const stackable = ['consumable','material'].includes(item.type);
  const hasStack = stackable && G.inventory.some(i => i.id === itemId);
  if (G.inventory.length >= 12 && !hasStack) {
    alert('物品栏已满！请先丢弃一些物品再购买。');
    return;
  }
  G.player.gold -= price;
  addItem(itemId, 1);
  if (!G.shopPurchased) G.shopPurchased = [];
  G.shopPurchased.push(itemId);
  render();
}

function sellItem(uid, qty) {
  const item = G.inventory.find(i => i.uid === uid);
  if (!item) return;
  const price = Math.floor((item.sellPrice || 5) / 2) * qty;
  G.player.gold += price;
  removeItem(uid, qty);
  render();
}

function closeShop() {
  G.shopMode = false;
  G.shopPurchased = [];
  G._shopSelection = null;
  nextEvent();
}

function traitDesc(trait) {
  const map = {
    poison: '毒液：每 3 回合造成 3 点额外伤害（无视防御）',
    vampire: '吸血：每回合恢复造成伤害 50% 的 HP',
    hardShell: '硬壳：前 2 回合 DEF +2',
    poison2: '毒液：每 3 回合造成 2 点额外伤害（无视防御）',
    eliteBeetle: '硬壳：前 3 回合 DEF +3 | 激怒：HP<50% 时 ATK +4',
    acidArmor: '酸液喷吐：每 4 回合造成 5 点伤害 | 结晶甲壳：前 2 回合减免 3 点伤害',
    immune: '魔像：免疫中毒、眩晕',
    burning: '燃烧：每回合造成 2 点灼烧伤害 | 弱水：对冰属性武器伤害 +50%',
    curseAura: '诅咒光环：每回合吸取玩家 3 点生命',
    multiAttack: '多重攻击：每 3 回合连续攻击 2 次（第2次减半）| 能量护盾：HP<30% 时 DEF +4',
    // 第四幕
    corrodeClaw: '腐蚀之爪：每回合降低玩家 DEF 1',
    pierceDef: '破甲：无视玩家 DEF 5 点',
    regen5: '再生：每回合恢复 5 HP',
    mindBlast: '心灵震爆：每 3 回合造成 8 点伤害（无视防御）',
    corrodeAura: '腐蚀光环：每回合玩家损失 4 HP',
    crystalArmor: '晶化：每 4 回合冻结自身（无法行动但 DEF+10）| 晶刺：被攻击时反弹 3 点伤害',
    abyssLord: '黑暗吞噬：每 5 回合造成 10 伤害并降 ATK 3 | 多重眼瞳：每 3 回合额外攻击一次',
    // 第五幕
    fireBreath2: '火焰吐息：每 3 回合造成 6 点伤害（无视防御）',
    fireBreath3: '火焰吐息：每 3 回合造成 8 点伤害（无视防御）',
    lavaBurn: '灼烧：每回合造成 5 点灼烧伤害',
    dragonLord: '龙息：每 4 回合造成 15 伤害 | 龙威：前 3 回合玩家 ATK−3 | 激怒：HP<40% 时 ATK+8 SPD+4',
    // 第六幕
    starBurn: '星光灼烧：每回合造成 4 点伤害（无视防御）| 虚空闪避：每 3 回合闪避一次攻击',
    voidBeast: '虚空吐息：每 4 回合造成 12 伤害 | 黑暗之心：HP<30% 时每回合恢复 10 HP | 维度撕裂：每 3 回合降全属性 2',
    fateLord: '命运轮转：每 5 回合 ATK 或 DEF +5 | 因果反噬：每 3 回合反弹 30% 伤害 | 终末审判：HP<20% 时连续攻击 3 次',
  };
  return map[trait] || trait || '';
}

function rarityColor(r) {
  const map = {F:'#aaa',E:'#666',D:'#2e7d32',C:'#1565c0',B:'#7b1fa2',A:'#e65100',S:'#b8860b'};
  return map[r] || '#ccc';
}

function makeItemTooltip(item) {
  const rlabel = {F:'破损',E:'普通',D:'优质',C:'精良',B:'稀有',A:'史诗',S:'传说'};
  let lines = [`<b>${item.name}</b> <span style="color:#aaa">${rlabel[item.rarity]||item.rarity}级</span>`];
  if (item.type === 'weapon') {
    if (item.atk) lines.push(`ATK +${item.atk}`);
    if (item.def) lines.push(`DEF +${item.def}`);
    if (item.spd) lines.push(`SPD +${item.spd}`);
    if (item.luk) lines.push(`LUK +${item.luk}`);
  } else if (item.type === 'armor') {
    if (item.atk) lines.push(`ATK +${item.atk}`);
    if (item.def) lines.push(`DEF +${item.def}`);
    if (item.spd) lines.push(`SPD +${item.spd}`);
    if (item.luk) lines.push(`LUK +${item.luk}`);
  } else if (item.type === 'accessory') {
    if (item.atk) lines.push(`ATK +${item.atk}`);
    if (item.def) lines.push(`DEF +${item.def}`);
    if (item.spd) lines.push(`SPD +${item.spd}`);
    if (item.luk) lines.push(`LUK +${item.luk}`);
    if (item.maxHp) lines.push(`MaxHP +${item.maxHp}`);
  } else if (item.type === 'consumable') {
    let hasStat = false;
    if (item.heal) { lines.push(`恢复 ${item.heal} HP`); hasStat = true; }
    if (item.fullHeal) { lines.push(`恢复全部 HP`); hasStat = true; }
    if (item.permAtk) { lines.push(`永久 ATK +${item.permAtk}`); hasStat = true; }
    if (item.permLuk) { lines.push(`永久 LUK +${item.permLuk}`); hasStat = true; }
    if (item.tempAtk) { lines.push(`下次战斗 ATK +${item.tempAtk}`); hasStat = true; }
    if (item.tempSpd) { lines.push(`下次战斗 SPD +${item.tempSpd}`); hasStat = true; }
    if (item.tempLuk) { lines.push(`下次战斗 LUK +${item.tempLuk}`); hasStat = true; }
    if (item.autoRevive) { lines.push(`死亡时自动复活（恢复 50% HP）`); hasStat = true; }
    if (!hasStat && item.desc) lines.push(item.desc);
  } else if (item.type === 'material') {
    lines.push(`出售价: ${item.sellPrice||0} G`);
  }
  if (item.effect) lines.push(`<span style="color:#d4a017">${item.effect}</span>`);
  return `<span class="inv-tooltip">${lines.join('<br>')}</span>`;
}

function buffEffectDesc(effects) {
  if (!effects) return '';
  const lines = [];
  if (effects.healPerRound) lines.push(`每回合恢复 ${effects.healPerRound} HP`);
  if (effects.atk) lines.push(`ATK +${effects.atk}`);
  if (effects.def) lines.push(`DEF +${effects.def}`);
  if (effects.spd) lines.push(`SPD +${effects.spd}`);
  if (effects.luk) lines.push(`LUK +${effects.luk}`);
  if (effects.lukBonus15) lines.push('LUK 判定有利概率 +15%');
  return lines.join('<br>');
}

// ---- 物品栏交互 ----

function clickInventory(uid) {
  const item = G.inventory.find(i => i.uid === uid);
  if (!item) return;

  // Consumables work anywhere (including shop)
  if (item.type === 'consumable' && (item.heal || item.fullHeal || item.permAtk || item.permLuk || item.tempAtk || item.tempSpd || item.tempLuk)) {
    showUseItemPopup(item);
    return;
  }

  if (['weapon','armor','accessory'].includes(item.type)) {
    equipItem(uid);
    return;
  }
}

function rightClickInventory(uid, event) {
  event.preventDefault();
  const item = G.inventory.find(i => i.uid === uid);
  if (!item) return;
  showDiscardPopup(item);
}

function showDiscardPopup(item) {
  const popup = document.createElement('div');
  popup.className = 'popup-overlay';
  popup.id = 'discardPopup';
  popup.innerHTML = `
    <div class="popup-box">
      <div class="popup-title">丢弃 ${item.name}</div>
      <div style="color:#555;margin-bottom:12px">${item.qty > 1 ? `持有 ${item.qty} 个，选择丢弃数量：` : '确定要丢弃该物品吗？此操作不可撤销。'}</div>
      <div style="display:flex;gap:8px;margin-bottom:12px">
        ${item.qty > 1 ? `
          <input type="number" id="discardQty" value="1" min="1" max="${item.qty}" style="flex:1;padding:8px;border:1px solid #ddd;border-radius:4px;font-size:14px">
          <button class="big-btn secondary" style="padding:8px 16px;font-size:14px" onclick="document.getElementById('discardQty').value=${item.qty}">全部</button>
        ` : ''}
      </div>
      <button class="big-btn" style="background:#c0392b;width:100%" onclick="confirmDiscard(${item.uid});document.getElementById('discardPopup').remove()">确认丢弃</button>
      <button class="big-btn secondary" style="margin-top:8px;width:100%" onclick="document.getElementById('discardPopup').remove()">取消</button>
    </div>`;
  document.body.appendChild(popup);
}

function confirmDiscard(uid) {
  const qtyEl = document.getElementById('discardQty');
  const qty = qtyEl ? parseInt(qtyEl.value) || 1 : 1;
  const item = G.inventory.find(i => i.uid === uid);
  if (!item) return;
  const name = item.name;
  removeItem(uid, qty);
  saveGame();
  render();
}

function showUseItemPopup(item) {
  const desc = item.desc || (item.heal ? `恢复 ${item.heal} HP` : '');
  const popup = document.createElement('div');
  popup.className = 'popup-overlay';
  popup.id = 'useItemPopup';
  popup.innerHTML = `
    <div class="popup-box">
      <div class="popup-title">使用 ${item.name}</div>
      <div style="color:#555;margin-bottom:12px">${desc}</div>
      <button class="big-btn" onclick="useItemConfirm(${item.uid});document.getElementById('useItemPopup').remove()">使用</button>
      <button class="big-btn secondary" style="margin-top:8px;width:100%" onclick="document.getElementById('useItemPopup').remove()">取消</button>
    </div>`;
  document.body.appendChild(popup);
}

function useItemConfirm(uid) {
  const item = G.inventory.find(i => i.uid === uid);
  if (!item) return;
  if (item.heal) G.player.hp = Math.min(G.player.maxHp, G.player.hp + item.heal);
  if (item.fullHeal) G.player.hp = G.player.maxHp;
  if (item.permAtk) G.player.atk += item.permAtk;
  if (item.permLuk) G.player.luk += item.permLuk;
  if (item.tempAtk || item.tempSpd || item.tempLuk) {
    const effects = {};
    if (item.tempAtk) effects.atk = item.tempAtk;
    if (item.tempSpd) effects.spd = item.tempSpd;
    if (item.tempLuk) effects.luk = item.tempLuk;
    G.buffs.push({ name:item.name, battles:1, effects });
  }
  removeItem(uid, 1);
  saveGame();
  render();
}

function equipItem(uid) {
  const item = G.inventory.find(i => i.uid === uid);
  if (!item) return;

  // Check if already equipped — unequip from its current slot
  for (const [slot, euid] of Object.entries(G.equipment)) {
    if (euid === uid) {
      G.equipment[slot] = null;
      if (item.maxHp) G.player.maxHp -= item.maxHp;
      G.player.hp = Math.min(G.player.maxHp, G.player.hp);
      saveGame();
      render();
      return;
    }
  }

  // Not equipped — find a slot to equip it
  if (item.type === 'weapon') {
    G.equipment.weapon = uid;
  } else if (item.type === 'armor') {
    G.equipment.armor = uid;
  } else if (item.type === 'accessory') {
    if (!G.equipment.acc1) G.equipment.acc1 = uid;
    else if (!G.equipment.acc2) G.equipment.acc2 = uid;
    else G.equipment.acc1 = uid;
  }
  if (item.maxHp) G.player.maxHp += item.maxHp;
  saveGame();
  render();
}

// ---- 物品献祭弹窗 ----

function showItemSelectPopup(optIndex) {
  const items = G.inventory.filter(i => i.qty > 0);
  let itemsHtml = items.map(i => `
    <div class="shop-item">
      <span>${i.name} ${i.qty>1?`×${i.qty}`:''} <span style="color:#888;font-size:11px">(${i.rarity}级)</span></span>
      <button class="buy-btn" onclick="confirmItemSacrifice(${optIndex},${i.uid})">献祭</button>
    </div>
  `).join('');

  const popup = document.createElement('div');
  popup.className = 'popup-overlay';
  popup.id = 'itemSelectPopup';
  popup.innerHTML = `
    <div class="popup-box">
      <div class="popup-title">选择一件物品献祭</div>
      <div style="max-height:300px;overflow-y:auto">${itemsHtml}</div>
      <button class="big-btn secondary" style="margin-top:12px;width:100%" onclick="document.getElementById('itemSelectPopup').remove()">取消</button>
    </div>`;
  document.body.appendChild(popup);
}

async function confirmItemSacrifice(optIndex, itemUid) {
  removeItem(itemUid, 1);
  document.getElementById('itemSelectPopup')?.remove();
  const event = currentEvent();
  const opt = event.options[optIndex];
  const remainingCosts = opt.costs.filter(c => c.type !== 'chooseItem');
  const hpBefore = G.player.hp;
  applyCosts(remainingCosts);
  const hpAfterCosts = G.player.hp;
  const messages = await applyResults(opt.results);
  if (G.shopMode) { render(); return; }
  if (G.phase === 'combat' || G.phase === 'combatEnd') return;
  if (G.pendingFullItems && G.pendingFullItems.length > 0) {
    showFullInventoryPopup(messages, hpBefore - hpAfterCosts);
    return;
  }
  showResultMessages(messages, hpBefore - hpAfterCosts);
}
