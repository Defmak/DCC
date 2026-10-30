# Liste des assets à construire — Dungeon Crawler Carl (webgame 3 étages)

Le prototype actuel tourne **sans asset externe** (sprites = émojis, rendu canvas procédural).
Cette liste décrit tout ce qu'il faut produire pour remplacer les émojis par de vrais assets.

## 1. Sprites personnages (16×16 ou 32×32, pixel art, PNG transparent)
| Fichier | Sujet | Utilisé par |
|---|---|---|
| `carl.png` | Carl, veste en cuir, pieds nus | joueur étage 1–2 |
| `carl_primal.png` | Carl race Primal (armure de peau) | joueur étage 3 |
| `donut.png` | Princesse Donut, persane écaille de tortue, couronne | compagnon (toujours à côté de Carl) |
| `mongo.png` | Bébé velociraptor (familier étage 2) | panneau groupe + salle |
| `mordecai.png` | Rat hooligan guide de jeu | PNJ étages 1 et 3 |
| `brandon.png`, `chris.png`, `agatha.png` | Groupe Meadow Lark | salles sûres |
| `rory.png`, `lorelai.png` | Shamankas gobelines | atelier étage 1 |
| `zev.png` | Crawler du village | étage 3 |

## 2. Sprites ennemis (32×32)
- `rat.png`, `goblin.png`, `slime.png`, `llama.png`, `clurichaun.png`, `dingo.png`
- Boss : `hoarder.png` (araignée niv.7), `goblin_chief.png` (niv.8), `juicer.png` (niv.9, salle de sport), `krakaren.png` (pieuvre clonée, logos Rev-Up), `signet.png` (élite armée), `grimaldi.png` (maître de piste niv.85, armure de feu follet)

## 3. Tilesets (tiles 40×40, Godot/Unity/Tiled-ready)
| Tileset | Étage | Contenu |
|---|---|---|
| `tileset_floor1.png` | 1 | terre battue, torches, lichens lumineux, murs rocheux, porte fer forgé |
| `tileset_floor2.png` | 2 | parpaings, moisissure, néons de l'annonce du Système |
| `tileset_floor3.png` | 3 | herbe, ruines médiévales, pavés de l'Over City, chapiteau du cirque |
- Éléments communs : `door.png`, `stairs_down.png`, `chest/loot.png`, `safe_room.png`

## 4. Objets (icônes 24×24)
`pet_biscuit.png`, `dynamite.png`, `copper_chopper.png`, `potion.png`, `iron_skin.png`, `moonshine.png`, `wisp_tome.png`, `fog_scroll.png`, `ring_con.png`, `shuriken.png`, `crown.png`, `race_book.png`, `class_book.png`

## 5. UI
- `logo_title.png` — écran titre (style néon LitRPG)
- `hud_frame.png` — bordure du panneau stats façon interface de jeu (HUD système)
- `banner_alert.png` — bandeau d'annonce du Système (minuteur, boss)
- `map_bg.png` — fond de la mini-carte (M)
- Polices : une police pixel/display pour les titres, une lisible pour les dialogues (ex. Press Start 2P + Inter)

## 6. Audio (libres de droits ou à composer)
- `bgm_floor1.ogg` (tunnels, angoisse légère), `bgm_floor2.ogg` (parpaings, percussions), `bgm_floor3.ogg` (Over City, cirque)
- SFX : `sfx_hit.ogg`, `sfx_spell.ogg`, `sfx_explosion.ogg` (chariot d'explosifs !), `sfx_levelup.ogg`, `sfx_boss.ogg`, `sfx_death.ogg`, `sfx_loot.ogg`, `sfx_dialog.ogg` (bip type jeu rétro)
- Voix du Système : synthèse text-to-speech avec effet robotique sarcastique

## 7. Illustrations d'ambiance (écrans)
- `art_transformation.png` — la Terre recyclée en donjon (écran titre)
- `art_floor_collapse.png` — effondrement d'étage (transition 1→2, 2→3)
- `art_victory.png` — Carl & Donut couronnés devant le chapiteau (écran victoire)

## 8. Outils recommandés
- Pixel art : **Aseprite** ou **Piskel** (gratuit)
- Tilesets : **Tiled** (gratuit) → exporter JSON consommable par le moteur
- Audio : **Bfxr** / **Chiptone** pour les SFX rétro, **Bosca Ceoil** pour les boucles
- Compression : pngquant, ogg via ffmpeg

## 9. Intégration moteur
Remplacer dans `js/main.js` : `ctx.fillText("🧑‍🚀", …)` par `ctx.drawImage(sprites.carl, …)`.
Précharger via un `assets/manifest.json` : `{ "carl": "assets/sprites/carl.png", … }`.
Garder les émojis en **fallback** si un PNG est absent (le jeu doit rester jouable).
