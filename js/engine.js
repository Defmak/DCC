// ============================================================
// Moteur de jeu : grille, déplacement, combats, HUD, carte
// ============================================================

const TILE = 40;
const VW = 16, VH = 12; // viewport en tuiles

const Game = {
  floorIndex: 0,
  floor: null,
  room: null,
  roomId: null,
  player: { x: 8, y: 10, hp: 20, maxHp: 20, mp: 6, maxMp: 6, xp: 0, xpNext: 10, level: 1,
            str: 5, dex: 4, con: 5, int: 4, wis: 3, cha: 3, def: 0, gold: 0 },
  party: [{ id: "carl", name: "Carl", role: "Garde du corps royal", face: "🧑‍🚀" }],
  inventory: [],
  visited: {},
  explored: {},
  flags: {},
  inDialog: false,
  dialogQueue: [],
  combat: null,
  bossDead: {},
  turn: 0,
  over: false,

  init() {
    this.loadFloor(0);
    this.inventory = ["petBiscuit", "potion"];
    this.visited[this.roomId] = true;
    this.explored[this.roomId] = true;
  },

  loadFloor(i) {
    this.floorIndex = i;
    this.floor = FLOORS[i];
    this.roomId = this.floor.startRoom;
    this.room = this.floor.rooms[this.roomId];
    this.player.x = 8; this.player.y = 10;
    this.visited = {}; this.explored = {};
    this.visited[this.roomId] = true; this.explored[this.roomId] = true;
    this.bossDead = {};
    UI.setFloor(i + 1, this.floor.timerDays, this.floor.audience);
  },

  roomKey() { return "f" + this.floorIndex + ":" + this.roomId; },

  move(dx, dy) {
    if (this.inDialog || this.combat || this.over) return;
    const dir = dy === -1 ? "n" : dy === 1 ? "s" : dx === -1 ? "w" : "e";
    const atEdge = (dy === -1 && this.player.y === 1) || (dy === 1 && this.player.y === VH - 2) ||
                   (dx === -1 && this.player.x === 1) || (dx === 1 && this.player.x === VW - 2);
    if (atEdge && this.room.exits[dir]) {
      this.changeRoom(this.room.exits[dir], dir);
      return;
    }
    const nx = this.player.x + dx, ny = this.player.y + dy;
    if (nx < 1 || ny < 1 || nx > VW - 2 || ny > VH - 2) return;
    this.player.x = nx; this.player.y = ny;
    this.checkTriggers();
    UI.draw();
  },

  changeRoom(id, fromDir) {
    this.roomId = id;
    this.room = this.floor.rooms[id];
    const opp = { n: "s", s: "n", e: "w", w: "e" }[fromDir];
    if (opp === "s") { this.player.x = 8; this.player.y = 1; }
    else if (opp === "n") { this.player.x = 8; this.player.y = VH - 2; }
    else if (opp === "w") { this.player.x = 1; this.player.y = 6; }
    else { this.player.x = VW - 2; this.player.y = 6; }
    this.visited[this.roomId] = true; this.explored[this.roomId] = true;
    log("🚪 " + this.room.name, "sys");
    log(this.room.desc, "");
    this.checkTriggers(true);
    UI.draw(); UI.updatePanel();
  },

  checkTriggers(first) {
    const r = this.room;
    const key = this.roomKey();
    if (r.script && !this.flags[key + ":script"] && SCRIPTS[r.script]) {
      this.startScript(r.script);
      return;
    }
    // mobs aléatoires résiduels
    if (r.mobs && r.mobs.length && !this.flags[key + ":cleared"] && Math.random() < (first ? 1 : 0.65)) {
      const mob = r.mobs[Math.floor(Math.random() * r.mobs.length)];
      this.startCombat(mob, r);
      return;
    }
  },

  startScript(name) {
    this.flags[this.roomKey() + ":script"] = true;
    const lines = SCRIPTS[name] || [];
    this.dialogQueue = lines.slice();
    this.inDialog = true;
    UI.showDialog(this.dialogQueue[0]);
  },

  advanceDialog(choiceIdx) {
    if (!this.inDialog) return;
    if (choiceIdx !== undefined) { /* branche future */ }
    this.dialogQueue.shift();
    if (this.dialogQueue.length === 0) {
      this.inDialog = false;
      UI.hideDialog();
      this.afterScript();
    } else {
      UI.showDialog(this.dialogQueue[0]);
    }
  },

  afterScript() {
    const r = this.room, key = this.roomKey();
    if (r.loot && r.loot.length && !this.flags[key + ":loot"]) {
      this.flags[key + ":loot"] = true;
      r.loot.forEach(id => this.addItem(id));
      log("🎁 Butin : " + r.loot.map(id => ITEMS[id].ico + " " + ITEMS[id].name).join(", "), "gold");
    }
    if (r.boss && !this.bossDead[key]) { this.startCombat(r.boss, r); return; }
    if (r.stairs && r.victory) { this.winGame(); return; }
    if (r.stairs && this.floorIndex < FLOORS.length - 1) {
      banner("⬇️ Passage à l'étage " + (this.floorIndex + 2) + "…");
      setTimeout(() => { this.loadFloor(this.floorIndex + 1); UI.draw(); UI.updatePanel(); this.checkTriggers(true); }, 1200);
    }
    if (r.key && !this.flags[key + ":done"]) { this.flags[key + ":done"] = true; this.gainXp(15); }
  },

  addItem(id) { this.inventory.push(id); UI.updatePanel(); },

  useItem(id) {
    const i = this.inventory.indexOf(id);
    if (i === -1 || this.inDialog || this.combat) return;
    const it = ITEMS[id];
    const p = this.player;
    if (id === "potion") { p.hp = Math.min(p.maxHp, p.hp + 8); log("🧪 +8 PV", "good"); this.inventory.splice(i, 1); }
    else if (id === "ironSkin") { p.def += 2; log("🥉 Peau de fer : +2 DEF (3 combats)", "good"); this.inventory.splice(i, 1); }
    else if (id === "moonshine") {
      if (Math.random() < 0.5) { p.maxHp += 3; p.hp = Math.min(p.maxHp, p.hp + 3); log("🍶 Gnole Rev-Up : +3 PV max !", "good"); }
      else { p.hp = Math.max(1, p.hp - 4); log("🍶 La gnole était frelatée… -4 PV", "bad"); }
      this.inventory.splice(i, 1);
    }
    else if (id === "dynamite") { log("🧨 Garde la dynamite pour un boss.", ""); return; }
    else if (id === "scrollFog") { Object.keys(this.floor.rooms).forEach(k => this.explored[k] = true); log("📜 Toute la carte de l'étage est révélée !", "gold"); this.inventory.splice(i, 1); UI.drawMap(); }
    else if (id === "petBiscuit") { log("🍪 « Donne ça à un animal de compagnie… »", ""); return; }
    else { log(it.ico + " " + it.name + " — " + it.desc, ""); return; }
    UI.updatePanel();
  },

  gainXp(n) {
    const p = this.player;
    p.xp += n;
    log("✨ +" + n + " XP", "good");
    while (p.xp >= p.xpNext) {
      p.xp -= p.xpNext; p.level++; p.xpNext = Math.round(p.xpNext * 1.5);
      p.maxHp += 4; p.hp = p.maxHp; p.maxMp += 2; p.mp = p.maxMp;
      p.str += 1; p.con += 1;
      banner("⬆️ NIVEAU " + p.level + " !");
      log("⬆️ Niveau " + p.level + " atteint ! PV/PM restaurés, +1 FOR +1 CON.", "gold");
    }
    UI.updatePanel();
  },

  startCombat(mobId, room) {
    const base = ENEMIES[mobId];
    const scale = 1 + this.floorIndex * 0.35;
    this.combat = {
      id: mobId, name: base.name, ico: base.ico,
      hp: Math.round(base.hp * scale), maxHp: Math.round(base.hp * scale),
      atk: Math.round(base.atk * scale), xp: base.xp, gold: base.gold,
      boss: !!base.boss, note: base.note, room,
    };
    log("⚔️ Combat : " + base.ico + " " + base.name + (base.boss ? " (BOSS)" : "") + (base.note ? " — " + base.note : ""), "bad");
    UI.showCombat(this.combat);
  },

  playerAttack(ranged) {
    if (!this.combat) return;
    const p = this.player, c = this.combat;
    let dmg = p.str + (ranged ? p.dex : 0);
    if (this.inventory.includes("chopper") && !ranged) dmg += 4;
    if (this.inventory.includes("shuriken") && ranged) dmg += 5;
    if (c.id === "slime" && !ranged) { p.hp = Math.max(1, p.hp - 3); log("🟢 Le slime dissout ton bras ! -3 PV (il fallait attaquer à distance)", "bad"); }
    if (c.id === "llama" && Math.random() < 0.4) { p.hp = Math.max(1, p.hp - 2); log("🦙 Crachat corrosif ! -2 PV", "bad"); }
    dmg = Math.max(1, dmg + Math.floor(Math.random() * 3) - 1);
    c.hp -= dmg;
    log("💥 Tu infliges " + dmg + " dégâts à " + c.name + " (" + Math.max(0, c.hp) + "/" + c.maxHp + " PV)", "");
    if (c.hp <= 0) { this.winCombat(); return; }
    this.enemyTurn();
  },

  castSpell() {
    if (!this.combat) return;
    const p = this.player, c = this.combat;
    if (p.mp < 2) { log("Pas assez de PM pour « Lueur ».", "bad"); return; }
    p.mp -= 2;
    const dmg = 4 + p.int;
    c.hp -= dmg;
    log("🔥 « Lueur » : " + dmg + " dégâts magiques à " + c.name, "good");
    if (c.hp <= 0) { this.winCombat(); return; }
    this.enemyTurn();
    UI.updatePanel();
  },

  useDynamite() {
    if (!this.combat || !this.combat.boss) { log("La dynamite ne sert que contre un boss…", ""); return; }
    const i = this.inventory.indexOf("dynamite");
    if (i === -1) { log("Plus de dynamite !", "bad"); return; }
    this.inventory.splice(i, 1);
    const c = this.combat;
    const dmg = 6 + this.player.str + Math.floor(Math.random() * 4);
    c.hp -= dmg;
    log("🧨 Détonation à distance ! " + dmg + " dégâts à " + c.name, "gold");
    if (c.hp <= 0) { this.winCombat(); return; }
    this.enemyTurn();
    UI.updatePanel();
  },

  flee() {
    if (!this.combat) return;
    if (this.combat.boss || this.room.bossRoom) { log("🚫 Impossible de fuir un combat de boss ! La salle est verrouillée.", "bad"); return; }
    if (Math.random() < 0.6) {
      log("💨 Tu fuis le combat !", "");
      this.combat = null; UI.hideCombat(); UI.draw();
    } else {
      log("❌ Fuite ratée !", "bad");
      this.enemyTurn();
    }
  },

  enemyTurn() {
    const p = this.player, c = this.combat;
    if (!c) return;
    const dmg = Math.max(1, c.atk + Math.floor(Math.random() * 3) - 1 - p.def);
    p.hp -= dmg;
    log("🩸 " + c.name + " te inflige " + dmg + " dégâts (" + Math.max(0, p.hp) + "/" + p.maxHp + " PV)", "bad");
    if (p.def > 0) p.def = Math.max(0, p.def - 1);
    UI.updatePanel();
    if (p.hp <= 0) { this.gameOver(); return; }
    UI.showCombat(c);
  },

  winCombat() {
    const c = this.combat;
    log("🏆 " + c.name + " vaincu !", "good");
    this.gainXp(c.xp);
    if (c.gold) { this.player.gold += c.gold; log("🪙 +" + c.gold + " or", "gold"); }
    if (c.boss) {
      this.bossDead[this.roomKey()] = true;
      const r = this.room;
      if (r.loot) r.loot.forEach(id => this.addItem(id));
      if (r.loot) log("🎁 Butin de boss : " + r.loot.map(id => ITEMS[id].ico + " " + ITEMS[id].name).join(", "), "gold");
      banner("👑 BOSS VAINCU !");
    } else {
      if (Math.random() < 0.4) { this.addItem("potion"); log("🧪 Butin : potion de soins", "good"); }
      if (this.room.mobs) this.room.mobs = this.room.mobs.filter(m => m !== c.id);
      if (this.room.mobs && this.room.mobs.length === 0) this.flags[this.roomKey() + ":cleared"] = true;
    }
    this.combat = null;
    UI.hideCombat(); UI.updatePanel(); UI.draw();
  },

  gameOver() {
    this.over = true;
    UI.showDeath();
  },

  winGame() {
    this.over = true;
    UI.showVictory(this.player);
  },
};
