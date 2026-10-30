// Test fumée Node : vérifie la cohérence des données du jeu (sans DOM).
const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(path.join(__dirname, "..", "js", "data.js"), "utf8");
const mod = { exports: {} };
new Function("module", src + "; module.exports = { ITEMS, ENEMIES, FLOORS, SCRIPTS };")(mod);
const { ITEMS, ENEMIES, FLOORS, SCRIPTS } = mod.exports;

let errors = 0;
const fail = (m) => { console.error("❌ " + m); errors++; };
const ok = (m) => console.log("✅ " + m);

// 1. 3 étages
if (FLOORS.length === 3) ok("3 étages présents"); else fail("FLOORS.length = " + FLOORS.length);

// 2. graphe des salles connexe + références valides
FLOORS.forEach((f, fi) => {
  const ids = Object.keys(f.rooms);
  const seen = new Set([f.startRoom]);
  const q = [f.startRoom];
  while (q.length) {
    const id = q.shift();
    for (const d in f.rooms[id].exits) {
      const nid = f.rooms[id].exits[d];
      if (!f.rooms[nid]) fail(`Étage ${fi + 1} salle ${id}: sortie ${d} vers salle inconnue "${nid}"`);
      else if (!seen.has(nid)) { seen.add(nid); q.push(nid); }
    }
  }
  ids.forEach(id => { if (!seen.has(id)) fail(`Étage ${fi + 1}: salle "${id}" non atteignable`); });
  if (seen.size === ids.length) ok(`Étage ${fi + 1}: ${ids.length} salles toutes atteignables`);
});

// 3. scripts référencés existent ; loot/mobs/boss valides
FLOORS.forEach((f, fi) => {
  for (const id in f.rooms) {
    const r = f.rooms[id];
    if (r.script && !SCRIPTS[r.script]) fail(`Étage ${fi + 1} ${id}: script "${r.script}" manquant`);
    (r.loot || []).forEach(l => { if (!ITEMS[l]) fail(`Étage ${fi + 1} ${id}: item loot "${l}" inconnu`); });
    (r.mobs || []).forEach(m => { if (!ENEMIES[m]) fail(`Étage ${fi + 1} ${id}: mob "${m}" inconnu`); });
    if (r.boss && !ENEMIES[r.boss]) fail(`Étage ${fi + 1} ${id}: boss "${r.boss}" inconnu`);
  }
});
ok("Vérification scripts/loot/mobs/boss terminée");

// 4. chaque étage a un escalier et au moins un boss ; étage 3 a une victoire
FLOORS.forEach((f, fi) => {
  const hasStairs = Object.values(f.rooms).some(r => r.stairs);
  const bosses = Object.values(f.rooms).filter(r => r.boss).length;
  if (!hasStairs) fail(`Étage ${fi + 1}: pas d'escalier`);
  if (bosses === 0) fail(`Étage ${fi + 1}: pas de boss`);
  if (hasStairs && bosses > 0) ok(`Étage ${fi + 1}: escalier OK, ${bosses} boss`);
});
const last = FLOORS[2];
if (!Object.values(last.rooms).some(r => r.victory)) fail("Étage 3: pas de salle victoire"); else ok("Étage 3: salle victoire OK");

// 5. tous les dialogues ont who + text
for (const k in SCRIPTS) SCRIPTS[k].forEach((l, i) => {
  if (!l.who || !l.text) fail(`Script "${k}" ligne ${i}: who/text manquant`);
});
ok("Tous les dialogues ont un locuteur et un texte");

// 6. moteur : syntaxe valide
["engine.js", "main.js"].forEach(f => {
  const code = fs.readFileSync(path.join(__dirname, "..", "js", f), "utf8");
  try { new Function(code); ok(f + " : syntaxe OK"); } catch (e) { fail(f + " : " + e.message); }
});

console.log(errors === 0 ? "\n🎉 TOUS LES TESTS PASSENT" : `\n💥 ${errors} erreur(s)`);
process.exit(errors === 0 ? 0 : 1);
