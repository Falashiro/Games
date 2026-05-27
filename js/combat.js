// ============================================================
// js/combat.js — 战斗引擎
// ============================================================

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function startCombat(enemyId, rewards) {
  const template = ENEMIES[enemyId];
  const enemy = {
    name: template.name,
    hp: template.hp,
    maxHp: template.hp,
    atk: template.atk,
    def: template.def,
    spd: template.spd,
    trait: template.trait,
  };
  G.combatState = { enemy, round: 1, playerStartHp: G.player.hp, rewards: rewards || [],
    baseAtk: G.player.atk, baseDef: G.player.def, baseSpd: G.player.spd, baseLuk: G.player.luk };
  G.phase = 'combat';
  G.combatLog = [];
  G.battling = false;
  G.preCombat = true;
  render();
}

async function simulateCombatRound() {
  if (!G.combatState || G.roundInProgress) return;
  G.roundInProgress = true;
  const cs = G.combatState;
  const enemy = cs.enemy;
  const stats = totalStats();
  let pAtk = stats.atk;
  let pDef = stats.def;
  const pSpd = stats.spd;

  const weaponUid = G.equipment.weapon;
  if (weaponUid) {
    const w = G.inventory.find(i => i.uid === weaponUid);
    if (w && w.id === 'dragonFang') pAtk += 5;
  }

  let playerImmune = false;
  const armorUid = G.equipment.armor;
  if (armorUid && cs.round === 1) {
    const a = G.inventory.find(i => i.uid === armorUid);
    if (a && a.id === 'holyShield') playerImmune = true;
  }

  if (weaponUid) {
    const w = G.inventory.find(i => i.uid === weaponUid);
    if (w && w.id === 'shadowBlade' && enemy.hp > enemy.maxHp / 2) {
      pAtk = Math.floor(pAtk * 1.3);
    }
  }

  const playerFirst = G._firstStrike || pSpd >= enemy.spd;
  const logLines = [];
  // Clear per-round flags
  G._autoLuk = false; G._firstStrike = false;
  logLines.push(`--- 第 ${cs.round} 回合 ---`);

  for (const b of G.buffs) {
    if (b.effects && b.effects.healPerRound) {
      const healAmt = b.effects.healPerRound;
      G.player.hp = Math.min(G.player.maxHp, G.player.hp + healAmt);
      logLines.push(`[${b.name}] 恢复 ${healAmt} HP`);
    }
    if (b.effects && b.effects.poisonDmg) {
      G.player.hp -= b.effects.poisonDmg;
      logLines.push(`[${b.name}] 中毒造成 ${b.effects.poisonDmg} 点伤害！`);
      if (G.player.hp <= 0) { endCombat(false, logLines); return; }
    }
  }
  // autoLuk buff: all LUK checks auto-succeed
  if (G.buffs.some(b => b.effects && b.effects.autoLuk)) {
    G._autoLuk = true;
  }
  // firstStrike buff
  if (G.buffs.some(b => b.effects && b.effects.firstStrike)) {
    G._firstStrike = true;
  }

  // --- 敌人特性：每回合 / 固定回合效果 ---
  // Act 4+
  // pierceDef: void swordsman ignores 5 player DEF
  if (enemy.trait === 'pierceDef') {
    pDef = Math.max(0, pDef - 5);
  }
  // crystalArmor: crystallize every 4 rounds, reflect damage
  if (enemy.trait === 'crystalArmor') {
    if (cs.round % 4 === 0 && cs.round > 0) {
      enemy.def += 10;
      logLines.push(`[晶化] 结晶巨蝎进入晶化状态！DEF +10（本回合无法行动）`);
      // Skip enemy attack this round
      enemy._frozen = true;
    }
  }
  if (enemy.trait === 'corrodeClaw') {
    if (!G.buffs.some(b => b.effects && b.effects.immuneDebuff)) {
      G.player.def = Math.max(G.player.def - 1, 0);
    }
    if (cs.round === 1) logLines.push(`[腐蚀之爪] 裂隙爬行者降低了你的防御！DEF −1`);
  }
  if (enemy.trait === 'corrodeAura') {
    G.player.hp -= 4;
    logLines.push(`[腐蚀光环] 裂隙之怒的腐蚀光环造成 4 点伤害！`);
    if (G.player.hp <= 0) { endCombat(false, logLines); return; }
  }
  if (enemy.trait === 'regen5') {
    enemy.hp = Math.min(enemy.maxHp, enemy.hp + 5);
    if (cs.round === 1) logLines.push(`[再生] 虚空守卫每回合恢复 5 HP`);
  }
  if (enemy.trait === 'mindBlast' && cs.round % 3 === 0) {
    G.player.hp -= 8;
    logLines.push(`[心灵震爆] 虚空先知造成 8 点伤害！（无视防御）`);
    if (G.player.hp <= 0) { endCombat(false, logLines); return; }
  }
  if (enemy.trait === 'abyssLord') {
    if (cs.round % 5 === 0) { G.player.hp -= 10; if (!G.buffs.some(b => b.effects && b.effects.immuneDebuff)) G.player.atk = Math.max(0, G.player.atk - 3); logLines.push(`[黑暗吞噬] 深渊之主造成 10 伤害并降低 ATK 3！`); }
    if (G.player.hp <= 0) { endCombat(false, logLines); return; }
  }
  // Act 5+
  if (enemy.trait === 'fireBreath2' && cs.round % 3 === 0) {
    G.player.hp -= 6;
    logLines.push(`[火焰吐息] 龙裔守卫的吐息造成 6 点伤害！（无视防御）`);
    if (G.player.hp <= 0) { endCombat(false, logLines); return; }
  }
  if (enemy.trait === 'fireBreath3' && cs.round % 3 === 0) {
    G.player.hp -= 8;
    logLines.push(`[火焰吐息] 幼年火龙的吐息造成 8 点伤害！（无视防御）`);
    if (G.player.hp <= 0) { endCombat(false, logLines); return; }
  }
  if (enemy.trait === 'lavaBurn') {
    G.player.hp -= 5;
    logLines.push(`[灼烧] 熔岩元素造成 5 点灼烧伤害！`);
    if (G.player.hp <= 0) { endCombat(false, logLines); return; }
  }
  if (enemy.trait === 'dragonLord') {
    if (cs.round <= 3) { if (cs.round === 1 && !G.buffs.some(b => b.effects && b.effects.immuneDebuff)) { enemy._dragonAtk = G.player.atk; G.player.atk = Math.max(0, G.player.atk - 3); logLines.push(`[龙威] 古龙之王的威压降低了你的 ATK！ATK −3`); } }
    if (cs.round % 4 === 0) { G.player.hp -= 15; logLines.push(`[龙息] 古龙之王喷出龙息！造成 15 点伤害！`); if (G.player.hp <= 0) { endCombat(false, logLines); return; } }
    if (enemy.hp < enemy.maxHp * 0.4 && !enemy._enraged) { enemy._enraged = true; enemy.atk += 8; enemy.spd += 4; logLines.push(`[激怒] 古龙之王陷入狂暴！ATK +8, SPD +4`); }
  }
  // Act 6+
  if (enemy.trait === 'starBurn') {
    G.player.hp -= 4;
    logLines.push(`[星光灼烧] 星尘化身造成 4 点伤害！（无视防御）`);
    if (G.player.hp <= 0) { endCombat(false, logLines); return; }
  }
  if (enemy.trait === 'voidBeast') {
    if (cs.round % 4 === 0) { G.player.hp -= 12; logLines.push(`[虚空吐息] 虚空巨兽造成 12 点伤害！`); if (G.player.hp <= 0) { endCombat(false, logLines); return; } }
    if (enemy.hp < enemy.maxHp * 0.3 && cs.round > 1) { enemy.hp = Math.min(enemy.maxHp, enemy.hp + 10); logLines.push(`[黑暗之心] 虚空巨兽恢复 10 HP`); }
    if (cs.round % 3 === 0 && !G.buffs.some(b => b.effects && b.effects.immuneDebuff)) { G.player.atk = Math.max(0, G.player.atk - 2); G.player.def = Math.max(0, G.player.def - 2); G.player.spd = Math.max(0, G.player.spd - 2); logLines.push(`[维度撕裂] 全属性 −2！`); }
  }
  if (enemy.trait === 'fateLord') {
    if (cs.round % 5 === 0) { if (Math.random() < 0.5) { enemy.atk += 5; logLines.push(`[命运轮转] 命运化身的 ATK +5`); } else { enemy.def += 5; logLines.push(`[命运轮转] 命运化身的 DEF +5`); } }
    // Track HP at start of round for 因果反噬
    if (!enemy._hpBeforeRound) enemy._hpBeforeRound = enemy.hp;
    if (cs.round % 3 === 0 && cs.round > 0) {
      const dmgThisRound = enemy._hpBeforeRound - enemy.hp;
      const reflect = Math.floor(Math.max(0, dmgThisRound) * 0.3);
      if (reflect > 0) { G.player.hp -= reflect; logLines.push(`[因果反噬] 反弹 ${reflect} 点伤害！`); if (G.player.hp <= 0) { endCombat(false, logLines); return; } }
    }
    enemy._hpBeforeRound = enemy.hp;
    if (enemy.hp < enemy.maxHp * 0.2 && !enemy._final) { enemy._final = true; for (let fi = 0; fi < 3; fi++) { const fdmg = Math.max(1, enemy.atk - pDef); G.player.hp -= fdmg; logLines.push(`[终末审判] 第 ${fi+1} 击造成 ${fdmg} 点伤害！`); if (G.player.hp <= 0) { endCombat(false, logLines); return; } } }
  }
  if (enemy.trait === 'poison' && cs.round % 3 === 0) {
    G.player.hp -= 3;
    logLines.push(`[毒液] ${enemy.name}的毒液造成 3 点伤害！（无视防御）`);
    if (G.player.hp <= 0) { endCombat(false, logLines); return; }
  }
  if (enemy.trait === 'poison2' && cs.round % 3 === 0) {
    G.player.hp -= 2;
    logLines.push(`[毒液] ${enemy.name}的毒液造成 2 点伤害！（无视防御）`);
    if (G.player.hp <= 0) { endCombat(false, logLines); return; }
  }
  if (enemy.trait === 'burning') {
    G.player.hp -= 2;
    logLines.push(`[燃烧] 烈焰守卫的火焰造成 2 点灼烧伤害！`);
    if (G.player.hp <= 0) { endCombat(false, logLines); return; }
  }
  if (enemy.trait === 'curseAura') {
    G.player.hp -= 3;
    logLines.push(`[诅咒光环] 诅咒守卫的诅咒吸取 3 点生命！`);
    if (G.player.hp <= 0) { endCombat(false, logLines); return; }
  }
  if (enemy.trait === 'acidArmor' && cs.round % 4 === 0) {
    G.player.hp -= 5;
    logLines.push(`[酸液喷吐] ${enemy.name}的酸液造成 5 点伤害！（无视防御）`);
    if (G.player.hp <= 0) { endCombat(false, logLines); return; }
  }
  // Hard shell / acid armor: temporary DEF bonus (apply once)
  if (enemy.trait === 'hardShell' && cs.round === 1) {
    enemy.def += 2;
    logLines.push(`[硬壳] ${enemy.name}的甲壳提升了防御！DEF +2`);
  }
  if (enemy.trait === 'eliteBeetle' && cs.round === 1) {
    enemy.def += 3;
    logLines.push(`[硬壳] 甲虫王的甲壳提升了防御！DEF +3`);
  }
  if (enemy.trait === 'acidArmor' && cs.round === 1) {
    enemy.def += 3;
    logLines.push(`[结晶甲壳] ${enemy.name}的结晶甲壳减免伤害！`);
  }
  // Energy shield: ancient construct (apply once)
  if (enemy.trait === 'multiAttack' && enemy.hp < enemy.maxHp * 0.3 && !enemy._shielded) {
    enemy._shielded = true;
    enemy.def += 4;
    logLines.push(`[能量护盾] 古代构装体激活护盾！DEF +4`);
  }
  // Elemental weakness: ice weapon vs burning
  if (enemy.trait === 'burning' && weaponUid) {
    const w = G.inventory.find(i => i.uid === weaponUid);
    if (w && w.id === 'iceSword') {
      pAtk = Math.floor(pAtk * 1.5);
      if (cs.round === 1) logLines.push(`[元素克制] 冰属性武器对烈焰守卫造成 150% 伤害！`);
    }
  }
  // Old pickaxe vs beetles
  if ((enemy.trait === 'hardShell' || enemy.trait === 'eliteBeetle') && weaponUid) {
    const w = G.inventory.find(i => i.uid === weaponUid);
    if (w && w.id === 'oldPickaxe') {
      pAtk = Math.floor(pAtk * 1.5);
      if (cs.round === 1) logLines.push(`[对甲虫专攻] 旧矿镐对甲虫造成 150% 伤害！`);
    }
  }

  // Elite beetle enrage
  if (enemy.trait === 'eliteBeetle' && enemy.hp < enemy.maxHp / 2) {
    enemy.atk = ENEMIES.beetleKing.atk + 4;
    if (cs.round > 1) {} // silently applied
    if (enemy.hp > 0 && enemy._enraged === undefined) {
      enemy._enraged = true;
      logLines.push(`[激怒] 甲虫王受伤后变得狂暴！ATK +4`);
    }
  }

  // Multi-attack: every 3 rounds, enemy attacks twice
  const enemyAttacks = (enemy.trait === 'multiAttack' && cs.round % 3 === 0) ? 2 : 1;

  const attackers = playerFirst
    ? [{name:'你', atk:pAtk, def:pDef, hp:()=>G.player.hp, isPlayer:true},
       ...Array(enemyAttacks).fill({name:enemy.name, atk:enemy.atk, def:enemy.def, hp:()=>enemy.hp, isPlayer:false})]
    : [...Array(enemyAttacks).fill({name:enemy.name, atk:enemy.atk, def:enemy.def, hp:()=>enemy.hp, isPlayer:false}),
       {name:'你', atk:pAtk, def:pDef, hp:()=>G.player.hp, isPlayer:true}];

  if (enemyAttacks > 1 && cs.round % 3 === 0) {
    logLines.push(`[多重攻击] 古代构装体使用六只手臂连续攻击！`);
  }

  for (let ai = 0; ai < attackers.length; ai++) {
    const a = attackers[ai];
    if (a.isPlayer && G.player.hp <= 0) continue;
    if (!a.isPlayer && enemy.hp <= 0) continue;
    // Crystal freeze: skip enemy attack
    if (!a.isPlayer && enemy._frozen) { enemy._frozen = false; continue; }

    // delay between attackers
    if (ai > 0 && G.combatState) {
      G.combatLog.push(...logLines);
      logLines.length = 0;
      render();
      await sleep(_combatDelay);
    }

    const dmg = Math.max(1, a.atk - (a.isPlayer ? enemy.def : pDef));
    if (a.isPlayer) {
      enemy.hp -= dmg;
      logLines.push(`你 对 ${enemy.name} 造成 ${dmg} 点伤害。（剩余 HP: ${Math.max(0,enemy.hp)}）`);
      // Crystal reflect
      if (enemy.trait === 'crystalArmor' && !enemy._frozen) {
        G.player.hp -= 3;
        logLines.push(`[晶刺] 结晶巨蝎反弹 3 点伤害！`);
      }

      if (enemy.hp <= 0 && weaponUid) {
        const w = G.inventory.find(i => i.uid === weaponUid);
        if (w && w.id === 'vampFang') {
          G.player.hp = Math.min(G.player.maxHp, G.player.hp + 10);
          logLines.push(`[吸血之牙] 击杀恢复 10 HP`);
        }
      }

      const accUids = [G.equipment.acc1, G.equipment.acc2].filter(Boolean);
      for (const auid of accUids) {
        const acc = G.inventory.find(i => i.uid === auid);
        if (acc && acc.id === 'vampRing') {
          const vampHeal = Math.floor(dmg * 0.1);
          if (vampHeal > 0) {
            G.player.hp = Math.min(G.player.maxHp, G.player.hp + vampHeal);
            logLines.push(`[吸血戒指] 吸收 ${vampHeal} HP`);
          }
        }
      }

      if (enemy.hp <= 0) {
        endCombat(true, logLines);
        return;
      }
    } else {
      if (playerImmune) {
        logLines.push(`${enemy.name} 的攻击被圣盾抵挡！（首回合免疫）`);
        playerImmune = false;
      } else {
        if (armorUid) {
          const a = G.inventory.find(i => i.uid === armorUid);
          if (a && a.id === 'thornArmor') {
            enemy.hp -= 2;
            logLines.push(`[荆棘铠甲] 反弹 2 点伤害！`);
          }
        }
        G.player.hp -= dmg;
        logLines.push(`${enemy.name} 对你造成 ${dmg} 点伤害。（剩余 HP: ${Math.max(0,G.player.hp)}）`);

        if (enemy.trait === 'vampire') {
          const leechHeal = Math.floor(dmg * 0.5);
          enemy.hp = Math.min(enemy.maxHp, enemy.hp + leechHeal);
          logLines.push(`[水蛭群·吸血] 恢复 ${leechHeal} HP`);
        }

        if (G.player.hp <= 0) {
          endCombat(false, logLines);
          return;
        }
      }
    }
  }

  if (armorUid) {
    const a = G.inventory.find(i => i.uid === armorUid);
    if (a && a.id === 'dragonGodArmor') {
      G.player.hp = Math.min(G.player.maxHp, G.player.hp + 3);
      logLines.push(`[龙神重甲] 恢复 3 HP`);
    }
  }

  if (weaponUid) {
    const w = G.inventory.find(i => i.uid === weaponUid);
    if (w && w.id === 'iceSword' && cs.round === 1) {
      enemy.spd = Math.max(0, enemy.spd - 2);
      logLines.push(`[寒冰长剑] 降低敌方 SPD 2 点`);
    }
  }

  cs.round++;
  G.combatLog.push(...logLines);
  render();
  if (G.combatState && _combatDelay > 0) {
    await sleep(_combatDelay);
  }
  G.roundInProgress = false;
}

var _combatDelay = 1000;

async function simulateAllCombat(fastForward) {
  if (G.battling || !G.combatState) return;
  G.battling = true;
  if (fastForward) _combatDelay = 0;
  let safety = 0;
  while (G.combatState && safety < 100) {
    await simulateCombatRound();
    safety++;
  }
  _combatDelay = 1000;
  G.battling = false;
}

function endCombat(victory, logLines) {
  G.roundInProgress = false;
  G.combatLog.push(...logLines);
  if (victory) {
    G.combatLog.push('═══════════════════');
    G.combatLog.push('战斗胜利！');

    // Save enemy info for combat-over display
    G.lastEnemy = { ...G.combatState.enemy };

    // Store rewards for later application (when user confirms)
    let goldMult = 1.0;
    const accUids = [G.equipment.acc1, G.equipment.acc2].filter(Boolean);
    for (const auid of accUids) {
      const acc = G.inventory.find(i => i.uid === auid);
      if (acc && acc.id === 'luckyCoin') goldMult += 0.2;
    }
    G.pendingCombatRewards = { rewards: G.combatState.rewards, goldMult };

    G.buffs = G.buffs.map(b => ({ ...b, battles: b.battles - 1 }))
      .filter(b => b.battles > 0);

    // Restore base stats (undo combat debuffs)
    if (G.combatState.baseAtk !== undefined) {
      G.player.atk = G.combatState.baseAtk;
      G.player.def = G.combatState.baseDef;
      G.player.spd = G.combatState.baseSpd;
      G.player.luk = G.combatState.baseLuk;
    }
    G.combatState = null;
    G.phase = 'combat';
    saveGame();
  } else {
    G.combatLog.push('═══════════════════');
    let revived = false;
    const accUids = [G.equipment.acc1, G.equipment.acc2].filter(Boolean);
    for (const auid of accUids) {
      const acc = G.inventory.find(i => i.uid === auid);
      if (acc && acc.id === 'phoenixFeather') {
        G.player.hp = Math.floor(G.player.maxHp * 0.5);
        G.combatLog.push('⚡ 凤凰羽毛发动！你复活了！（恢复 50% HP）');
        removeItem(auid, 1);
        revived = true;
        break;
      }
    }
    if (!revived) {
      const reviveIdx = G.inventory.findIndex(i => i.id === 'revivePotion');
      if (reviveIdx >= 0) {
        G.player.hp = Math.floor(G.player.maxHp * 0.5);
        G.combatLog.push('⚡ 重生药水发动！你复活了！（恢复 50% HP）');
        removeItem(G.inventory[reviveIdx].uid, 1);
        revived = true;
      }
    }

    if (revived) {
      // Continue fighting - don't end combat
      G.combatLog.push('═══════════════════');
      G.combatLog.push('继续战斗！');
    } else {
      G.combatLog.push('你倒下了……');
      G.combatState = null;
      G.phase = 'gameOver';
      localStorage.removeItem('game2_save');
    }
  }
  render();
}

function applyReward(reward, goldMult) {
  switch (reward.type) {
    case 'gold':
      const amt = Math.floor(reward.val * (goldMult || 1));
      G.player.gold += amt;
      G.combatLog.push(`获得 Gold +${amt}`);
      break;
    case 'addItem':
      if (reward.chance !== undefined) {
        const stats = totalStats();
        const lukBonus = G.buffs.some(b => b.effects && b.effects.lukBonus15) ? 15 : 0;
        const roll = Math.random() * 100;
        if (roll < (reward.chance + stats.luk * 2 + lukBonus)) {
          addItem(reward.itemId, reward.qty || 1);
          G.combatLog.push(`掉落：${ITEMS[reward.itemId].name} ×${reward.qty||1}`);
          const accUids = [G.equipment.acc1, G.equipment.acc2].filter(Boolean);
          for (const auid of accUids) {
            const acc = G.inventory.find(i => i.uid === auid);
            if (acc && acc.id === 'destinyStar') {
              addItem(reward.itemId, reward.qty || 1);
              G.combatLog.push(`[命运之星] 额外掉落：${ITEMS[reward.itemId].name} ×${reward.qty||1}`);
              break;
            }
          }
        }
      } else {
        addItem(reward.itemId, reward.qty || 1);
        G.combatLog.push(`获得 ${ITEMS[reward.itemId].name} ×${reward.qty||1}`);
      }
      break;
    case 'randomEquip':
      const equip = rollRandomEquip(reward.rarity);
      if (equip) {
        addItem(equip, 1);
        G.combatLog.push(`获得 ${ITEMS[equip].name}`);
      }
      break;
  }
}

function upgradeRarity(itemId) {
  const order = ['F','E','D','C','B','A','S'];
  const item = ITEMS[itemId];
  if (!item || !item.rarity) return itemId;
  const idx = order.indexOf(item.rarity);
  if (idx < 0 || idx >= order.length - 1) return itemId;
  const targetRarity = order[idx + 1];
  const candidates = Object.entries(ITEMS)
    .filter(([id, it]) => it.type === item.type && it.rarity === targetRarity);
  if (candidates.length > 0) {
    return candidates[Math.floor(Math.random() * candidates.length)][0];
  }
  return itemId;
}

function rollRandomEquip(rarityRange) {
  const order = ['F','E','D','C','B','A','S'];
  const parts = rarityRange.split('-');
  const low = parts[0] || 'F';
  const high = parts[1] || low;
  const lowIdx = order.indexOf(low);
  const highIdx = order.indexOf(high);
  if (lowIdx < 0 || highIdx < 0) return null;
  const validRarities = order.slice(Math.min(lowIdx, highIdx), Math.max(lowIdx, highIdx) + 1);
  const candidates = Object.values(ITEMS).filter(i =>
    ['weapon','armor','accessory'].includes(i.type) &&
    validRarities.includes(i.rarity)
  );
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)].id;
}
