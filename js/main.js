// ============================================================
// UI + boucle d'entrée : rendu canvas, HUD, dialogues, carte
// ============================================================

const canvas = document.getElementById("viewport");
const ctx = canvas.getContext("2d");
const mapCanvas = document.getElementById("map-canvas");
const mctx = mapCanvas.getContext("2d");

function log(msg, cls) {
  const el = document.getElementById("log");
  const line = document.createElement("div");
  line.className = "log-line" + (cls ? " " + cls : "");
  line.textContent = msg;
  el.prepend(line);
  while (el.children.length > 60) el.removeChild(el.lastChild);
}

function banner(text) {
  const b = document.getElementById("banner");
  b.textContent = text;
  b.classList.remove("hidden");
  clearTimeout(banner._t);
  banner._t = setTimeout(() => b.classList.add("hidden"), 2200);
}

const UI = {
  setFloor(n, days, audience) {
    document.getElementById("hud-floor").textContent = "Étage " + n + " — " + FLOORS[n - 1].name.split("—")[1].trim();
    document.getElementById("hud-timer").textContent = "⏳ " + days + "j 00:00";
    document.getElementById("hud-audience").textContent = "📺 " + audience.toLocaleString("fr-FR") + " spectateurs";
  },

  draw() {
    const g = Game, f = g.floor, p = g.player, pal = f.palette;
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // sol
    for (let y = 0; y < VH; y++) for (let x = 0; x < VW; x++) {
      ctx.fillStyle = ((x + y) % 2 === 0) ? pal.floor : pal.bg;
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
    }
    // murs de bordure
    ctx.fillStyle = pal.wall;
    for (let x = 0; x < VW; x++) { ctx.fillRect(x * TILE, 0, TILE, TILE); ctx.fillRect(x * TILE, (VH - 1) * TILE, TILE, TILE); }
    for (let y = 0; y < VH; y++) { ctx.fillRect(0, y * TILE, TILE, TILE); ctx.fillRect((VW - 1) * TILE, y * TILE, TILE, TILE); }
    // portes
    ctx.fillStyle = "#c9a86a";
    const doors = { n: [8 * TILE, 0], s: [8 * TILE, (VH - 1) * TILE], w: [0, 6 * TILE], e: [(VW - 1) * TILE, 6 * TILE] };
    for (const d in g.room.exits) {
      const [dx, dy] = doors[d];
      ctx.fillRect(dx, dy, TILE, TILE);
      ctx.fillStyle = "#5a4632"; ctx.fillRect(dx + 6, dy + 6, TILE - 12, TILE - 12);
      ctx.fillStyle = "#c9a86a";
    }
    // PNJ
    if (g.room.npcs) for (const n of g.room.npcs) {
      const face = { mordecai: "🐀", meadowlark: "👴", shamankas: "🧝", agatha: "👵", mordecai3: "🐀", zev: "🧑" }[n] || "🧍";
      ctx.font = "26px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(face, 5 * TILE, 3 * TILE);
    }
    // loot au sol
    if (g.room.loot && g.room.loot.length && !Game.flags[Game.roomKey() + ":loot"]) {
      ctx.font = "22px serif";
      ctx.fillText("🎁", 12 * TILE, 8 * TILE);
    }
    // escalier
    if (g.room.stairs) { ctx.font = "30px serif"; ctx.fillText(g.room.victory ? "🏆" : "🕳️", 8 * TILE, 4 * TILE); }
    // boss marker
    if (g.room.boss && !Game.bossDead[Game.roomKey()]) { ctx.font = "28px serif"; ctx.fillText(ENEMIES[g.room.boss].ico, 8 * TILE, 5 * TILE); }
    // joueur + Donut
    ctx.font = "26px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("🧑‍🚀", p.x * TILE + TILE / 2, p.y * TILE + TILE / 2);
    ctx.font = "20px serif";
    ctx.fillText("🐱", p.x * TILE + TILE / 2 + 14, p.y * TILE + TILE / 2 - 12);
    // nom de salle
    ctx.fillStyle = "rgba(232,226,245,.85)";
    ctx.font = "bold 13px sans-serif"; ctx.textAlign = "left";
    ctx.fillText("📍 " + g.room.name, 12, canvas.height - 10);
  },

  drawMap() {
    const g = Game, f = g.floor;
    mctx.fillStyle = "#0a0714"; mctx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
    const ids = Object.keys(f.rooms);
    const pos = {};
    // placement naïf : BFS depuis startRoom
    const adj = {}; ids.forEach(id => adj[id] = []);
    ids.forEach(id => { for (const d in f.rooms[id].exits) adj[id].push(f.rooms[id].exits[d]); });
    const q = [[f.startRoom, 8, 6]]; pos[f.startRoom] = [8, 6];
    while (q.length) {
      const [id, x, y] = q.shift();
      for (const d in f.rooms[id].exits) {
        const nid = f.rooms[id].exits[d];
        if (pos[nid]) continue;
        const [nx, ny] = d === "n" ? [x, y - 2] : d === "s" ? [x, y + 2] : d === "w" ? [x - 3, y] : [x + 3, y];
        pos[nid] = [nx, ny]; q.push([nid, nx, ny]);
      }
    }
    const cw = 640 / 16, ch = 480 / 12;
    ids.forEach(id => {
      if (!g.explored[id]) return;
      const [x, y] = pos[id] || [8, 6];
      const px = x * cw, py = y * ch;
      mctx.fillStyle = id === g.roomId ? "#4a3570" : "#241a3d";
      mctx.strokeStyle = "#b388ff"; mctx.lineWidth = 2;
      mctx.fillRect(px, py, cw * 2.4, ch * 1.6); mctx.strokeRect(px, py, cw * 2.4, ch * 1.6);
      mctx.fillStyle = "#e8e2f5"; mctx.font = "10px sans-serif"; mctx.textAlign = "center";
      mctx.fillText(f.rooms[id].name, px + cw * 1.2, py + ch * 0.85);
    });
    if (pos[g.roomId]) {
      const [x, y] = pos[g.roomId];
      mctx.font = "16px serif";
      mctx.fillText("🧑‍🚀", x * cw + cw * 1.2, y * ch + ch * 0.5);
    }
  },

  updatePanel() {
    const p = Game.player;
    document.getElementById("crawler-level").textContent = "Niv. " + p.level;
    document.getElementById("hp-fill").style.width = (100 * p.hp / p.maxHp) + "%";
    document.getElementById("hp-text").textContent = p.hp + "/" + p.maxHp;
    document.getElementById("mp-fill").style.width = (100 * p.mp / p.maxMp) + "%";
    document.getElementById("mp-text").textContent = p.mp + "/" + p.maxMp;
    document.getElementById("xp-fill").style.width = (100 * p.xp / p.xpNext) + "%";
    document.getElementById("xp-text").textContent = p.xp + "/" + p.xpNext;
    document.getElementById("stats").innerHTML =
      "<span>FOR <b>" + p.str + "</b></span><span>DEX <b>" + p.dex + "</b></span>" +
      "<span>CON <b>" + p.con + "</b></span><span>INT <b>" + p.int + "</b></span>" +
      "<span>SAG <b>" + p.wis + "</b></span><span>CHA <b>" + p.cha + "</b></span>" +
      "<span>DÉF <b>" + p.def + "</b></span><span>🪙 <b>" + p.gold + "</b></span>";
    document.getElementById("party-list").innerHTML = Game.party.map(m =>
      `<div class="party-member"><span class="face">${m.face}</span><div><div class="pname">${m.name}</div><div class="prole">${m.role}</div></div></div>`
    ).join("") + (Game.flags["f0:guilde:script"] ? `<div class="party-member"><span class="face">🦖</span><div><div class="pname">Mongo</div><div class="prole">Familier de Donut (étage 2)</div></div></div>` : "");
    document.getElementById("inventory").innerHTML = Game.inventory.length ? Game.inventory.map((id, i) => {
      const it = ITEMS[id];
      return `<div class="inv-item" data-i="${i}"><span class="ico">${it.ico}</span><span class="iname">${it.name}</span><span class="itype">${it.type}</span></div>`;
    }).join("") : `<div style="color:var(--dim);font-size:12px">Vide. Loote des salles et des boss !</div>`;
    document.querySelectorAll(".inv-item").forEach(el =>
      el.addEventListener("click", () => Game.useItem(Game.inventory[+el.dataset.i])));
  },

  showDialog(line) {
    const d = document.getElementById("dialog");
    d.classList.remove("hidden");
    document.getElementById("dialog-speaker").textContent = line.who;
    document.getElementById("dialog-text").textContent = line.text;
    document.getElementById("dialog-choices").innerHTML = `<button id="dlg-next">▶ Continuer (Entrée)</button>`;
    document.getElementById("dlg-next").onclick = () => Game.advanceDialog();
  },

  hideDialog() { document.getElementById("dialog").classList.add("hidden"); },

  showCombat(c) {
    const d = document.getElementById("dialog");
    d.classList.remove("hidden");
    document.getElementById("dialog-speaker").textContent = c.ico + " " + c.name + (c.boss ? " — BOSS" : "") + "  (" + Math.max(0, c.hp) + "/" + c.maxHp + " PV)";
    document.getElementById("dialog-text").textContent = c.note || "Que fais-tu ?";
    document.getElementById("dialog-choices").innerHTML = `
      <button data-act="melee">👊 Coup de poing (corps à corps)</button>
      <button data-act="ranged">🎯 Attaque à distance</button>
      <button data-act="spell">🔥 Sort « Lueur » (2 PM)</button>
      <button data-act="dynamite">🧨 Dynamite (boss uniquement)</button>
      <button data-act="flee">💨 Fuir</button>`;
    document.querySelectorAll("#dialog-choices button").forEach(b =>
      b.onclick = () => {
        const a = b.dataset.act;
        if (a === "melee") Game.playerAttack(false);
        else if (a === "ranged") Game.playerAttack(true);
        else if (a === "spell") Game.castSpell();
        else if (a === "dynamite") Game.useDynamite();
        else if (a === "flee") Game.flee();
      });
  },

  hideCombat() { if (!Game.inDialog) this.hideDialog(); },

  showDeath() {
    document.getElementById("death-msg").textContent =
      "Carl, candidat n°4 122, a rejoint les 700 000 morts de l'étage " + (Game.floorIndex + 1) + ". La Borant Corporation remercie les spectateurs pour leur fidélité.";
    document.getElementById("screen-death").classList.remove("hidden");
  },

  showVictory(p) {
    document.getElementById("victory-msg").textContent =
      "Carl et la Cour Royale de Princesse Donut ont conquis les 3 premiers étages du donjon !";
    document.getElementById("victory-stats").innerHTML =
      "Niveau final : <b>" + p.level + "</b> · Or : <b>" + p.gold + "</b> 🪙 · Inventaire : " + Game.inventory.length + " objets · Mobs vaincus et boss terrassés : Hoarder, Chef gobelin, Juicer, Krakaren, Grimaldi…";
    document.getElementById("screen-victory").classList.remove("hidden");
  },
};

// ---------- Entrées clavier ----------
document.addEventListener("keydown", (e) => {
  if (Game.over) return;
  const k = e.key.toLowerCase();
  if (k === "m") {
    const mo = document.getElementById("map-overlay");
    if (mo.classList.contains("hidden")) { UI.drawMap(); mo.classList.remove("hidden"); }
    else mo.classList.add("hidden");
    e.preventDefault(); return;
  }
  if (!document.getElementById("map-overlay").classList.contains("hidden")) return;
  if (Game.inDialog || Game.combat) {
    if (k === "enter" || k === " ") { Game.inDialog ? Game.advanceDialog() : null; e.preventDefault(); }
    return;
  }
  if (k === "z" || k === "arrowup") Game.move(0, -1);
  else if (k === "s" || k === "arrowdown") Game.move(0, 1);
  else if (k === "q" || k === "arrowleft") Game.move(-1, 0);
  else if (k === "d" || k === "arrowright") Game.move(1, 0);
  else if (k === " ") { Game.checkTriggers(true); e.preventDefault(); }
});

// ---------- Boutons ----------
document.getElementById("btn-start").onclick = () => {
  document.getElementById("screen-title").classList.add("hidden");
  Game.init();
  UI.draw(); UI.updatePanel();
  Game.startScript("intro");
};
document.getElementById("btn-respawn").onclick = () => {
  document.getElementById("screen-death").classList.add("hidden");
  const fi = Game.floorIndex;
  Game.over = false;
  Game.player = { x: 8, y: 10, hp: 20, maxHp: 20, mp: 6, maxMp: 6, xp: 0, xpNext: 10, level: 1,
                  str: 5, dex: 4, con: 5, int: 4, wis: 3, cha: 3, def: 0, gold: Game.player.gold };
  Game.inventory = ["potion"]; Game.combat = null; Game.inDialog = false;
  Game.loadFloor(fi);
  UI.draw(); UI.updatePanel();
};
document.getElementById("btn-again").onclick = () => location.reload();

// boucle d'animation légère (clignotement torches)
setInterval(() => {
  const title = document.getElementById("screen-title");
  if (title.classList.contains("hidden") && !Game.over) UI.draw();
}, 900);
