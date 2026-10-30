# Script de jeu — ÉTAGE 3 « L'Over City »
(Vaste étendue de villages médiévaux en ruines, taille de l'Arizona · 900 millions de spectateurs · C'est ici que l'on choisit race et classe)

## 1. Mise en scène
- **Spawn** : `porte_overcity`. Les régions du donjon se rejoignent enfin.
- Enjeu annoncé : la **couronne de Donut** aura des conséquences au niveau 9.
- Rumeur : la rivalité médiatique avec « Pork Boy » est fabriquée par les producteurs (PNJ Zev).

## 2. Le choix race / classe — moment clé (`choix`)
- Deux livres : **Livre des races** et **Livre des classes**. Les 3 points de stats par niveau (étages 1–2) sont enfin distribuables.
- Choix canonique de Carl : **race Primal** + **classe Anarchiste indemnisé** (+2 CON, compétence « Chaos contrôlé »).
- Dans le webgame : séquence de dialogue avec le Système, +15 XP, Donut réagit.

## 3. Exploration
- Mobs : clurichauns, gobelins, lamas dans les ruines (`ruines`, `marche`).
- Butin : parchemin de brume (révèle la carte — touche **M**), potions, gnole.

## 4. Boss de ville — Grimaldi le Pestiféré (niveau 85)
- Le **chapiteau du Cirque itinérant** (`cirque`) : chaque nuit, **Tsarine Signet** (élite) l'attaque avec une armée invoquée.
- Mécanique canonique : Carl, protégé par une armure de feu follet, **négocie** entre Grimaldi et Signet au lieu de se battre → quête **« The Show Must Go On »** accomplie.
- Dans le webgame : dialogue de résolution + combat de boss contre Grimaldi (simplifié), double boss Signet/Grimaldi.
- Récompense : **la Couronne de Princesse Donut** 👑 (équipement, +1 CHA groupe).

## 5. Victoire de la démo
- Salle `sortie_victoire` : écran de victoire avec stats (niveau, or, objets).
- Texte de fin : « Les 15 étages suivants t'attendent dans les romans de Matt Dinniman » — le webgame s'arrête là volontairement.

## Mécaniques web
| Élément | Implémentation |
|---|---|
| Choix race/classe | salle clé `choix` avec PNJ Mordecai, flags de progression |
| Carte révélable | objet `scrollFog` + overlay carte (M) avec salles explorées |
| Négociation boss | script `boss_grimaldi` en pré-combat, puis combat simplifié |
| Couronne | objet `crown`, débloque l'écran de victoire |
| Spectateurs | HUD `📺 900 000 000` |
| 18 étages | message de fin invitant à lire la suite |
