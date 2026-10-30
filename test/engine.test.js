// Test d'intégration headless du moteur (UI stubé, pas de DOM).
const fs = require("fs");
const path = require("path");

const dataSrc = fs.readFileSync(path.join(__dirname, "..", "js", "data.js"), "utf8");
const engineSrc = fs.readFileSync(path.join(__dirname, "..", "js", "engine.js"), "utf8");

const mod = { exports: {} };
new Function("module", dataSrc + "; module.exports = { ITEMS, ENEMIES, FLOORS, SCRIPTS };")(mod);
const { ITEMS, ENEMIES, FLOORS, SCRIPTS } = mod.exports;

// stubs globaux attendus par engine.js
const calls = { banners: [], logs: 0 };
global.UI = new Proxy({}, { get: (t, k) => (...a) => {
  if (k === "setFloor") calls.floor = a;
  if (k === "showDeath") calls.death = true;
  if (k === "showVictory") calls.victory = a[0];
}});
global.log = () => calls.logs++;
global.banner = (t) => calls.banners.push(t);
global.setTimeout = (fn) => fn(); // exécution immédiate

const Game = new Function(
  "ITEMS", "ENEMIES", "FLOORS", "SCRIPTS", "UI", "log", "banner", "setTimeout",
  engineSrc + "; return Game;"
)(ITEMS, ENEMIES, FLOORS, SCRIPTS, global.UI, global.log, global.banner, global.setTimeout);

let errors = 0;
const fail = m => { console.error("❌ " + m); errors++; };
const ok = m => console.log("✅ " + m);
const assert = (c, m) => c ? ok(m) : fail(m);

// --- init étage 1 ---
Game.init();
assert(Game.floorIndex === 0 && Game.roomId === "escalier", "init étage 1, salle escalier");
assert(Game.inventory.includes("petBiscuit"), "inventaire de départ avec biscuit");

// --- script d'intro : avancer tous les dialogues ---
Game.startScript("intro");
let guard = 0;
while (Game.inDialog && guard++ < 50) Game.advanceDialog();
assert(!Game.inDialog, "script intro terminé après " + guard + " dialogues");

// --- navigation vers la guilde (escalier -> tunnel1 -> guilde) ---
Game.player.x = 8; Game.player.y = 10; // bord sud de la salle
Game.move(0, 1);
assert(Game.roomId === "tunnel1", "porte sud -> tunnel1 (salle: " + Game.roomId + ")");
guard = 0;
while (Game.inDialog && guard++ < 50) Game.advanceDialog(); // script "crocs"
Game.move(0, 1); // depuis tunnel1 (y replacé au nord), bord sud -> guilde
assert(Game.roomId === "guilde", "porte sud -> guilde (salle: " + Game.roomId + ")");
// avancer le script mordecai
Game.checkTriggers(true);
guard = 0;
while (Game.inDialog && guard++ < 80) Game.advanceDialog();
assert(Game.flags[Game.roomKey() + ":script"], "script guilde marqué joué");
assert(Game.inventory.filter(i => i === "petBiscuit").length >= 1, "biscuit looté à la guilde");

// --- combat : tuer un boss à la dynamite ---
Game.roomId = "chambre_chef"; Game.room = FLOORS[0].rooms.chambre_chef;
Game.inventory.push("dynamite");
Game.startCombat("goblinChief", Game.room);
assert(Game.combat && Game.combat.boss, "combat de boss lancé");
Game.useDynamite();
guard = 0;
while (Game.combat && guard++ < 30) Game.playerAttack(true);
assert(!Game.combat, "boss chef vaincu");
assert(Game.bossDead[Game.roomKey()], "boss marqué mort");
assert(Game.player.level > 1, "XP gagnée, niveau " + Game.player.level);

// --- victoire étage 3 ---
Game.loadFloor(2);
Game.roomId = "sortie_victoire"; Game.room = FLOORS[2].rooms.sortie_victoire;
Game.startScript("victoire");
guard = 0;
while (Game.inDialog && guard++ < 50) Game.advanceDialog();
assert(calls.victory, "écran de victoire déclenché");
assert(Game.over, "partie terminée");

// --- mort permanente ---
Game.over = false; Game.loadFloor(0);
Game.player.hp = 1;
Game.startCombat("juicer", FLOORS[0].rooms.arene_juicer);
Game.combat.hp = 1;
Game.player.hp = 1;
// forcer la mort : attaque ennemie
Game.combat.atk = 999;
Game.enemyTurn();
assert(calls.death === true, "mort permanente -> écran décès");

console.log(errors === 0 ? "\n🎉 MOTEUR OK" : `\n💥 ${errors} erreur(s)`);
process.exit(errors === 0 ? 0 : 1);
