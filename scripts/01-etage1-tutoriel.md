# Script de jeu — ÉTAGE 1 « Le Tutoriel »
(Durée fiction : 5 jours avant effondrement · Spectateurs : 0, étage fermé aux audiences)

## 1. Mise en scène d'ouverture
- **Ciné d'intro (texte animé)** : La Transformation. La Borant Corporation a recyclé la Terre en un donjon de 18 niveaux. Des escaliers de fer forgé apparaissent partout sur la surface gelée.
- **Spawn** : salle `escalier`. Carl (garde-côtes, veste en cuir, Crocs roses de son ex) + Donut (chatte persane écaille de tortue).
- **Premier événement** (salle `tunnel1`) : Carl perd ses Crocs → achievement **« Podophilie »** + running gag : le Système adore ses pieds nus.

## 2. Le tutoriel — Guilde et Mordecai
- Fuite devant un **Murder Dozer gobelin** → refuge dans la **Guilde du tutoriel** (`guilde`).
- **PNJ Mordecai** (rat hooligan, guide de jeu) : explique HUD, inventaire, stats, boss de quartier vs boss de ville, minuteur d'étage, mort permanente.
- **Objet clé** : *Biscuit pour animaux amélioré* → Donut le mange, se liquéfie, renaît **crawler parlante niveau 1**, fonde la **Cour Royale de Princesse Donut**, Carl = Garde du corps royal.

## 3. Boucle d'exploration (quartier gobelin)
- Mobs : rats (niveau 2, « concierge » de l'étage), gobelins, slime vert, lamas maudits.
- **Leçon de design** : le slime dissout le bras de Carl s'il frappe à mains nues → tutoriel implicite « attaque à distance » ; le lama crache un jet corrosif.
- PNJ shamankas **Rory & Lorelai** (`atelier`) : négocient la **Goblin Copper Chopper** + dynamite + poudre noire contre le **Tatouage Goblin Pass** (+20% dégâts vs gobelins).

## 4. Boss de quartier n°1 — L'Accapareur (niveau 7)
- Salle `caverne_hoarder`, la salle se **verrouille** au combat.
- Mécanique : combat classique mais le boss droppe un objet persistant copiable par tous les crawlers.
- Butin : tome d'armure de feu follet, potions.

## 5. Boss de quartier n°2 — Chef de guerre gobelin (niveau 8)
- **Moment signature du tome 1** : Carl pille l'atelier, construit un **chariot piégé** (poudre noire + ferraille + pus d'hobgobelin), le pousse dans la salle du boss et le fait exploser à distance.
- Le Système ment d'abord (« les gobelins tués ont été déplacés en sécurité ») puis avoue en riant. Tonalité humour noir.
- Butin : Anneau d'argent +2 CON, shuriken de carnage, achievement « Terroriste artisanal ».

## 6. Boss de quartier n°3 — Le Juicer (niveau 9)
- Salle de sport, heavy metal. Combat direct.
- Butin : shuriken enchanté de carnage, gantelet de guerre.

## 7. PNJ groupe — Meadow Lark
- Salle sûre `safe_room` : **Brandon, Chris, Agatha** et les anciens de la maison de retraite. Ils fabriquent des fortifications portables (tables, poids, outils).
- Enjeu émotionnel : les aider à descendre avant l'effondrement.

## 8. Sortie
- Salle `escalier_down` : escalier vers l'étage 2. Bilan : 1,3 million de survivants restants.
- Transition : l'étage 1 s'effondre derrière le joueur.

## Mécaniques implémentées dans le webgame
| Mécanique livre | Implémentation web |
|---|---|
| Minuteur 5 jours | HUD `⏳ 5j` (décoratif en démo) |
| Mort permanente | écran « Candidat éliminé » + respawn étage |
| Boss verrouillant la salle | bouton Fuir désactivé en boss room |
| Biscuit pour animaux | objet `petBiscuit`, déclenche le script Donut |
| Chariot d'explosifs | bouton 🧨 Dynamite réservé aux boss |
| Goblin Pass | bonus dégâts implémenté via hache/dynamite |
| Slime corrosif | pénalité si attaque mêlée sur slime |
| XP/niveaux | barre XP, +1 FOR/+1 CON par niveau, heal complet |
