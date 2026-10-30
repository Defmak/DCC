# Script de jeu — ÉTAGE 2 « Le labyrinthe de parpaings »
(Durée fiction : 6 jours · Nouveauté : les spectateurs votent, misent, offrent des cadeaux… et des pénalités)

## 1. Mise en scène
- **Spawn** : `abri` anti-effondrement avec le groupe de Meadow Lark.
- **Annonce du Système** : minuteur raccourci à 6 jours, « sanctions en cas d'usage des toilettes du donjon », activation des *viewer follows* et enchères de patronage.
- Ambiance : labyrinthe de blocs de béton, régions toujours déconnectées, mobs : clurichauns non vaccinés (altération **Toxine** en mêlée), dingos de danger.

## 2. Intrigue secondaire — Rev-Up
- Le **Krakaren cloné** vend sa gnole « Rev-Up » dans un schéma pyramidal.
- Carl fabrique le **« Jug O' Boom »** : gnole + explosifs pour nettoyer les salles de zombies.
- *Leçon* : le donjon manipule aussi par l'économie, pas que par les monstres.

## 3. Quête des dingos (`antre_dingo`)
- Des dingos de danger en cage, contrôlés par des kobolds.
- Mécanique : donner un **biscuit pour animaux** → point mini-carte passe au blanc → dingo libéré, allié.

## 4. Boss de quartier — Le Krakaren (niveau 15)
- Salle `salle_krakaren` verrouillée, toile de fond logos Rev-Up.
- **Récompense de groupe** : Donut adopte un bébé velociraptor → **Mongo** (apparaît dans le panneau groupe du webgame).

## 5. Événement scripté — L'élémentaire de rage (`jardin_rage`)
- Un **Rage Elemental** poursuit les anciens de Meadow Lark.
- Le joueur doit gagner le combat pour les protéger → les PNJ atteignent l'étage 3 en sécurité (récompense narrative).

## 6. Célébrité
- Donut gagne ses premiers *followers* ; tension : la gloire attire les crawlers hostiles (Frank Q, Maggie My dans le livre).

## 7. Sortie
- `escalier_down2` : panneau « Choisis ta race. Choisis ta classe. Choisis mal et meurs. » → transition étage 3.

## Mécaniques web
| Élément | Implémentation |
|---|---|
| Toxine du clurichaun | combat : mêlée = risque de dégât/dot ; distance recommandée |
| Gnole Rev-Up | objet `moonshine` : 50/50 heal/dégâts (humour noir) |
| Dingos libérés | script `dingos`, récompense potion/biscuit |
| Mongo | ajouté au panneau « Cour Royale » après boss Krakaren |
| Minuteur 6 jours + spectateurs | HUD étage 2 : `⏳ 6j`, `📺 12 400 000` |
| Rage élémental | combat scripté `rage_elemental` avec enjeu PNJ |
