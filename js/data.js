// ============================================================
// DUNGEON CRAWLER CARL — mode découverte, étages 1 à 3
// Données de jeu : étages, salles, ennemis, objets, scripts
// ============================================================

const ITEMS = {
  petBiscuit:   { id: "petBiscuit",   name: "Biscuit pour animaux amélioré", ico: "🍪", type: "consommable", desc: "Transforme un animal en crawler parlant. Donut adore." },
  dynamite:     { id: "dynamite",     name: "Dynamite gobeline",               ico: "🧨", type: "arme",       desc: "+6 dégâts à distance. Idéal contre un chef de guerre." },
  chopper:      { id: "chopper",      name: "Goblin Copper Chopper",           ico: "🪓", type: "arme",       desc: "Hache de cuivre. +4 dégâts au corps à corps." },
  potion:       { id: "potion",       name: "Potion de soins",                 ico: "🧪", type: "consommable", desc: "Restaure 8 PV." },
  ironSkin:     { id: "ironSkin",     name: "Potion peau de fer",              ico: "🥉", type: "consommable", desc: "+2 DEF pendant 3 combats." },
  moonshine:    { id: "moonshine",    name: "Gnole Rev-Up",                    ico: "🍶", type: "consommable", desc: "+3 PV max temporairement… ou explosion. 50/50." },
  wispTome:     { id: "wispTome",     name: "Tome d'armure de feu follet",     ico: "📖", type: "équipement", desc: "Apprend « Lueur » : 2 PM, 4 dégâts magiques." },
  scrollFog:    { id: "scrollFog",    name: "Parchemin de brume",              ico: "📜", type: "consommable", desc: "Révèle toute la carte de l'étage." },
  ringCon:      { id: "ringCon",      name: "Anneau d'argent +2 CON",          ico: "💍", type: "équipement", desc: "+2 Constitution." },
  shuriken:     { id: "shuriken",     name: "Shuriken enchanté de carnage",    ico: "⭐", type: "arme",       desc: "+5 dégâts, attaque à distance." },
  crown:        { id: "crown",        name: "Couronne de Princesse Donut",     ico: "👑", type: "équipement", desc: "Donut est la cheffe. +1 CHA pour tout le groupe." },
  raceBook:     { id: "raceBook",     name: "Livre des races",                 ico: "📕", type: "objet",      desc: "Étage 3 : permet de choisir sa race." },
  classBook:    { id: "classBook",    name: "Livre des classes",               ico: "📗", type: "objet",      desc: "Étage 3 : permet de choisir sa classe." },
};

const ENEMIES = {
  rat:        { name: "Rat de donjon",        ico: "🐀", hp: 6,  atk: 2, xp: 3,  gold: 0 },
  goblin:     { name: "Gobelin",              ico: "👺", hp: 9,  atk: 3, xp: 5,  gold: 0 },
  slime:      { name: "Slime vert",           ico: "🟢", hp: 8,  atk: 2, xp: 4,  gold: 0, note: "Ne le frappe pas à mains nues : il dissout presque son bras !" },
  llama:      { name: "Lama maudit",          ico: "🦙", hp: 10, atk: 4, xp: 6,  gold: 0, note: "Crache un jet corrosif." },
  clurichaun: { name: "Clurichaun non vacciné", ico: "🧟", hp: 12, atk: 4, xp: 7, gold: 2, note: "Inflige l'altération « Toxine »." },
  krakaren:   { name: "Krakaren (clone)",     ico: "🐙", hp: 26, atk: 6, xp: 20, gold: 5, boss: true, note: "Schéma pyramidal de gnole en toile de fond." },
  hoarder:    { name: "L'Accapareur",         ico: "🕷️", hp: 22, atk: 5, xp: 18, gold: 4, boss: true, note: "Boss de quartier n°1, niveau 7." },
  goblinChief:{ name: "Chef de guerre gobelin", ico: "🤴", hp: 30, atk: 7, xp: 25, gold: 6, boss: true, note: "La salle se verrouille. Prépare le chariot d'explosifs…" },
  juicer:     { name: "Le Jus (The Juicer)", ico: "🥤", hp: 34, atk: 8, xp: 30, gold: 8, boss: true, note: "Boss de quartier n°3, niveau 9, salle de sport." },
  dingo:      { name: "Dingo de danger",      ico: "🐕", hp: 10, atk: 4, xp: 6,  gold: 2 },
  signet:     { name: "Tsarine Signet (élite)", ico: "🗡️", hp: 28, atk: 8, xp: 22, gold: 8, boss: true, note: "Attaque le chapiteau du cirque chaque nuit." },
  grimaldi:   { name: "Grimaldi le Pestiféré", ico: "🎪", hp: 40, atk: 9, xp: 40, gold: 12, boss: true, note: "Maître de piste, boss de ville niveau 85, protégé par une armure de feu follet." },
};

// Les 3 étages. Chaque étage = grille de salles reliées (N/S/E/O).
const FLOORS = [
  {
    id: 1,
    name: "Étage 1 — Le Tutoriel",
    sub: "Tunnels torche-algues sous la surface gelée. 5 jours avant l'effondrement.",
    timerDays: 5,
    audience: 0,
    palette: { bg: "#1a1410", wall: "#3a2c1c", floor: "#241a12", fog: "#0a0705" },
    startRoom: "escalier",
    rooms: {
      escalier:   { name: "L'escalier de fer forgé", desc: "Un escalier orné descend dans les tunnels éclairés aux torches. En haut, la surface de la Terre est gelée.", exits: { s: "tunnel1" }, loot: [], npcs: [], mobs: [], script: "intro" },
      tunnel1:    { name: "Tunnel étroit", desc: "Des traces de pas. Quelque chose a traîné… une sandale rose abandonnée (les Crocs de Carl).", exits: { n: "escalier", s: "guilde" }, mobs: ["rat", "rat"], loot: ["potion"], script: "crocs" },
      guilde:     { name: "Guilde du tutoriel", desc: "Une salle sûre. Mordecai, un rat hooligan, y tient boutique de guide de jeu.", exits: { n: "tunnel1", e: "couloir_gobelins", s: "safe_room" }, npcs: ["mordecai"], loot: ["petBiscuit"], script: "mordecai", safe: true },
      safe_room:  { name: "Salle sûre de Meadow Lark", desc: "Des survivants d'une maison de retraite se cachent ici. Brandon et Chris bricolent des fortifications.", exits: { n: "guilde" }, npcs: ["meadowlark"], loot: ["ironSkin", "potion"], script: "meadowlark", safe: true },
      couloir_gobelins: { name: "Couloir gobelin", desc: "Des graffitis gobelins. Un Murder Dozer gobelin bloque le passage !", exits: { w: "guilde", e: "atelier", s: "caverne_hoarder" }, mobs: ["goblin", "goblin"], loot: ["dynamite"], script: "dozer" },
      atelier:    { name: "Atelier gobelin", desc: "Outils, poudre noire, liquides alchimiques. Les gobelins Rory et Lorelai négocient avec toi.", exits: { w: "couloir_gobelins", e: "chambre_chef" }, npcs: ["shamankas"], loot: ["chopper", "dynamite", "dynamite"], script: "atelier" },
      chambre_chef: { name: "Salle du chef de guerre", desc: "Une grande salle qui se VERROUILLERA au début du combat. Le chef gobelin rit derrière sa porte.", exits: { w: "atelier" }, boss: "goblinChief", loot: ["ringCon", "shuriken"], script: "boss_chief", bossRoom: true },
      caverne_hoarder: { name: "Antre de l'Accapareur", desc: "Une caverne remplie de détritus et de toiles d'araignée. Quelque chose bouge au fond.", exits: { n: "couloir_gobelins", e: "arene_juicer" }, boss: "hoarder", loot: ["wispTome", "potion"], script: "boss_hoarder", bossRoom: true },
      arene_juicer: { name: "La salle de sport abandonnée", desc: "Des haltères, des tapis. Le Jus, niveau 9, s'entraîne en écoutant du heavy metal.", exits: { w: "caverne_hoarder", s: "quartier_lamas", e: "escalier_down" }, boss: "juicer", loot: ["shuriken", "potion", "ironSkin"], script: "boss_juicer", bossRoom: true },
      quartier_lamas: { name: "Repaire des lamas", desc: "Des lamas aux yeux mauvais rôdent. Leur salive est corrosive.", exits: { n: "arene_juicer", w: "escalier_down" }, mobs: ["llama", "llama", "slime"], loot: ["moonshine"], script: "lamas" },
      escalier_down: { name: "Escalier vers l'étage 2", desc: "Un escalier étroit mène plus bas. Le brouillard du niveau suivant monte jusqu'à tes chevilles.", exits: { e: "arene_juicer", w: "quartier_lamas" }, stairs: true, script: "stairs1" },
    },
  },
  {
    id: 2,
    name: "Étage 2 — Le labyrinthe de parpaings",
    sub: "Un dédale de blocs de béton, toujours divisé en régions. Minuteur : 6 jours. Les spectateurs arrivent.",
    timerDays: 6,
    audience: 12_400_000,
    palette: { bg: "#12141a", wall: "#39404f", floor: "#1d2129", fog: "#07080b" },
    startRoom: "abri",
    rooms: {
      abri:       { name: "Abri anti-effondrement", desc: "Le groupe de Meadow Lark s'est réfugié ici. L'annonce du donjon grésille : minuteur raccourci à 6 jours, « sanctions en cas d'usage des toilettes ».", exits: { e: "couloir2", s: "refuge" }, npcs: ["meadowlark"], loot: ["potion", "potion"], script: "intro2", safe: true },
      refuge:     { name: "Refuge des anciens", desc: "Agatha et les autres papys discutent calmement, comme si mourir demain était un programme télé.", exits: { n: "abri" }, npcs: ["agatha"], loot: ["ironSkin"], script: "agatha", safe: true },
      couloir2:   { name: "Couloir de béton", desc: "Des parpaings, de la moisissure, des clurichauns toxiques qui traînent.", exits: { w: "abri", e: "salle_krakaren", s: "cave_moonshine" }, mobs: ["clurichaun", "rat", "clurichaun"], loot: ["moonshine"], script: "clurichauns" },
      cave_moonshine: { name: "Cave à gnole", desc: "Des tonneaux de Rev-Up, la gnole du schéma pyramidal. Carl fabrique son « Jug O' Boom ».", exits: { n: "couloir2", e: "antre_dingo" }, mobs: ["clurichaun"], loot: ["moonshine", "moonshine", "dynamite"], script: "moonshine" },
      antre_dingo: { name: "Chenil des Dingos de danger", desc: "Des dingos en cage, contrôlés par des kobolds, hurlent dans le noir. Nourris-les avec des biscuits pour les libérer.", exits: { w: "cave_moonshine", n: "salle_krakaren" }, mobs: ["dingo", "dingo", "goblin"], loot: ["petBiscuit", "potion"], script: "dingos" },
      salle_krakaren: { name: "Arène du Krakaren", desc: "Un chapiteau sombre. Une pieuvre clonée flotte au centre, entourée de logos Rev-Up. La salle se verrouille.", exits: { w: "couloir2", s: "antre_dingo", e: "jardin_rage", n: "escalier_down2" }, boss: "krakaren", loot: ["wispTome", "ringCon", "potion"], script: "boss_krakaren", bossRoom: true },
      jardin_rage: { name: "Jardin ravagé", desc: "Un élémentaire de rage poursuit les survivants de Meadow Lark ! Protège-les.", exits: { w: "salle_krakaren", e: "escalier_down2" }, mobs: ["llama", "slime", "goblin"], loot: ["potion", "ironSkin"], script: "rage_elemental" },
      escalier_down2: { name: "Escalier vers l'étage 3", desc: "Dernière marche avant l'Over City. Un panneau : « Choisis ta race. Choisis ta classe. Choisis mal et meurs. »", exits: { s: "salle_krakaren", w: "jardin_rage" }, stairs: true, script: "stairs2" },
    },
  },
  {
    id: 3,
    name: "Étage 3 — L'Over City",
    sub: "Vaste étendue de villages médiévaux dans des ruines, grande comme l'Arizona. C'est ici qu'on choisit race et classe.",
    timerDays: 7,
    audience: 900_000_000,
    palette: { bg: "#101a12", wall: "#2f4a2e", floor: "#1a2b1a", fog: "#060a06" },
    startRoom: "porte_overcity",
    rooms: {
      porte_overcity: { name: "Porte de l'Over City", desc: "Les régions du donjon se rejoignent enfin. Des villages en ruines s'étendent à perte de vue.", exits: { e: "village", s: "marche" }, loot: ["raceBook", "classBook"], script: "intro3" },
      village:    { name: "Village des survivants", desc: "Des crawlers ont bâti un camp. Zev raconte que la célébrité « Pork Boy » est fabriquée de toutes pièces.", exits: { w: "porte_overcity", e: "choix", n: "cirque" }, npcs: ["zev"], loot: ["potion"], script: "zev" },
      marche:     { name: "Le marché", desc: "Des échanges de butin, des rumeurs sur la couronne de Donut et le niveau 9.", exits: { n: "porte_overcity", e: "choix", s: "ruines" }, mobs: ["clurichaun", "goblin"], loot: ["scrollFog", "potion"], script: "marche" },
      choix:      { name: "Salle du choix", desc: "Deux autels : un livre rouge (race) et un livre vert (classe). Les points de stats accumulés attendent.", exits: { w: "village", n: "marche", e: "cirque" }, npcs: ["mordecai3"], loot: [], script: "choix_race_classe", key: true },
      ruines:     { name: "Ruines infestées", desc: "Des clurichauns et des gobelins se battent entre eux dans les décombres.", exits: { n: "marche", e: "cirque" }, mobs: ["clurichaun", "clurichaun", "goblin"], loot: ["moonshine", "dynamite"], script: "ruines" },
      cirque:     { name: "Le chapiteau de Grimaldi", desc: "Le chapiteau du Cirque itinérant de Grimaldi. Chaque nuit, Tsarine Signet l'attaque avec une armée invoquée. La salle se verrouille au combat final.", exits: { s: "village", w: "choix", n: "ruines", e: "sortie_victoire" }, boss: "grimaldi", secondaryBoss: "signet", loot: ["crown", "wispTome", "ringCon"], script: "boss_grimaldi", bossRoom: true },
      sortie_victoire: { name: "La sortie — fin de la démo", desc: "Au-delà du chapiteau, la démonstration des 3 premiers étages s'achève. L'aventure continue dans les 15 étages suivants…", exits: { w: "cirque" }, stairs: true, victory: true, script: "victoire" },
    },
  },
];

// Dialogues et scripts narratifs (références par clé `script` des salles)
const SCRIPTS = {
  intro: [
    { who: "SYSTÈME", text: "Bienvenue dans DUNGEON CRAWLER WORLD : Édition Terre. Candidats : 8 milliards. Survivants prévus : ~1,3 million. Trouvez une guilde du tutoriel immédiatement." },
    { who: "Carl", text: "Où est… Donut ?! Ne me dis pas que le chat est descendu aussi…" },
    { who: "Donut", text: "Miaou. (Traduction : elle exige des friandises.)" },
    { who: "SYSTÈME", text: "Niveau 1 chargé. Minuteur de l'étage : 5 jours. Bonne chance, candidat n°4 122." },
  ],
  crocs: [
    { who: "SYSTÈME", text: "Objet perdu : Crocs roses de marque. Achievement obtenu : « Podophilie » — le système adore tes pieds nus, Carl." },
    { who: "Carl", text: "Super. Le jeu me déshabille maintenant." },
  ],
  mordecai: [
    { who: "Mordecai", text: "Salut, nouveau ! Moi c'est Mordecai, rat hooligan et guide de jeu attitré. Bienvenue dans le tutoriel !" },
    { who: "Mordecai", text: "Règles de base : tue des mobs, monte de niveau, bats les boss de quartier, trouve l'escalier. Mourir = mort permanente. Sympa, hein ?" },
    { who: "Mordecai", text: "Tiens — premier cadeau de bienvenue : un Biscuit pour animaux amélioré. Si ton chat a une Intelligence < 2, ce truc le transforme en crawler à part entière." },
    { who: "Carl", text: "…Je vais le donner à Donut. Évidemment." },
    { who: "Donut", text: "MIAOU ! (Elle avale le biscuit et se met à fondre en une masse tremblotante.)" },
    { who: "Donut", text: "…BONJOUR JE M'APPELLE PRINCESSE DONUT ET JE PARLE. Donne-moi un titre. MAINTENANT." },
    { who: "Carl", text: "La Cour Royale de Princesse Donut. voilà." },
    { who: "SYSTÈME", text: "Nouveau membre de groupe : Princesse Donut, niveau 1. Chef de groupe : Princesse Donut. Carl désigné Garde du corps royal." },
    { who: "Donut", text: "Parfait. Carl, à mes pieds. On a un donjon à conquérir et une audience à charmer." },
  ],
  meadowlark: [
    { who: "Brandon", text: "Carl ! Donut ! Vous êtes vivants ! Nous, on est le groupe de Meadow Lark. On s'occupe des fortifications." },
    { who: "Chris", text: "Des tables, des poids, des outils de gobelins… on peut construire quelque chose de solide si un boss nous tombe dessus." },
    { who: "Carl", text: "Gardez ça pour plus tard. On doit trouver l'escalier avant l'effondrement de l'étage." },
  ],
  dozer: [
    { who: "SYSTÈME", text: "Rencontre : Murder Dozer gobelin (tank à vapeur). Niveau 4." },
    { who: "Carl", text: "OK, plan : je lui mets un coup de pied, Donut le distrait, on passe en courant." },
  ],
  atelier: [
    { who: "Rory", text: "Psst ! Crawler ! Tu veux passer ? Nos chefs ont un atelier plein d'explosifs…" },
    { who: "Lorelai", text: "On te file la Goblin Copper Chopper si tu nous laisses fouiller. Marché conclu ?" },
    { who: "Carl", text: "Marché conclu. (Récupéré : hache, dynamite, poudre noire en pagaille.)" },
    { who: "SYSTÈME", text: "Nouveau passif : Tatouage Goblin Pass. Les gobelins te craignent… ou te respectent. +20% de dégâts contre eux." },
  ],
  boss_chief: [
    { who: "Chef de guerre gobelin", text: "HA ! Encore des humains ! Cette salle se verrouille, petit ! Personne ne sort !" },
    { who: "Carl", text: "Donut… tu te souviens du chariot de poudre noire ?" },
    { who: "Donut", text: "J'ai tout préparé. On ouvre la porte, on pousse le chariot, on se planque, et BOUM." },
    { who: "SYSTÈME", text: "Détonation à distance… Victoire ! Boss de quartier vaincu : Chef de guerre gobelin, niveau 8." },
    { who: "SYSTÈME", text: "Butin : Anneau d'argent +2 CON, Shuriken enchanté de carnage. Achievement : « Terroriste artisanal »." },
  ],
  boss_hoarder: [
    { who: "SYSTÈME", text: "Boss de quartier détecté : L'Accapareur, niveau 7. La salle se verrouille." },
    { who: "L'Accapareur", text: "MINE ! Tout est à moi ! Même ta vie, si j'en ai envie !" },
    { who: "Donut", text: "Carl ! Frappe-le avec la hache !" },
    { who: "SYSTÈME", text: "Victoire ! L'Accapareur vaincu. Les mobs de ce quartier cessent de réapparaître." },
  ],
  boss_juicer: [
    { who: "Le Jus", text: "BRO, personne me bat dans cette salle. J'ai soulevé des tonnes… de protéines." },
    { who: "SYSTÈME", text: "Boss de quartier : Le Jus, niveau 9. Combat en cours… Victoire !" },
    { who: "Le Jus", text: "…OK. T'as gagné. Tiens, mon shuriken. Et arrête de me regarder comme ça." },
  ],
  lamas: [
    { who: "Donut", text: "Regarde, Carl : des lamas ! Si on leur donne des friandises, ils deviennent gentils ?" },
    { who: "Carl", text: "Ce sont des LAMAS MAUDITS, Donut. Leur salive est CORROSIVE." },
    { who: "SYSTÈME", text: "Leçon du tutoriel : le type d'attaque compte plus que le niveau. Ne combats pas un slime à mains nues." },
  ],
  stairs1: [
    { who: "SYSTÈME", text: "Escalier trouvé ! Candidats restants sur l'étage 1 : 1,3 million. Passage à l'étage 2 autorisé." },
    { who: "Donut", text: "L'étage 2… J'ai entendu dire qu'on pouvait y adopter un animal de compagnie !" },
    { who: "Carl", text: "On verra. Avançons." },
  ],
  intro2: [
    { who: "SYSTÈME", text: "Étage 2 chargé : labyrinthe de parpaings. Minuteur : 6 jours. Nouveauté : les spectateurs peuvent maintenant voter, miser et t'envoyer des cadeaux… ou des pénalités." },
    { who: "SYSTÈME", text: "Avertissement : usage des toilettes du donjon désormais sanctionné. Ne demandez pas pourquoi." },
    { who: "Carl", text: "Six jours. Et cette fois on est filmés par des milliards de spectateurs." },
  ],
  agatha: [
    { who: "Agatha", text: "Ah, Carl ! On pensait que notre extrait du combat de boss avait été censuré… On nous a dit qu'on était « déplacés d'zone de sécurité »." },
    { who: "Carl", text: "Agatha… le système a menti. Je suis désolé." },
  ],
  clurichauns: [
    { who: "SYSTÈME", text: "Mob détecté : Clurichaun non vacciné. Dangereux en corps à corps : altération « Toxine »." },
    { who: "Carl", text: "Combat à distance, Donut. Lance-lui quelque chose." },
  ],
  moonshine: [
    { who: "Carl", text: "Des tonneaux de gnole « Rev-Up »… C'est la base du schéma pyramidal du Krakaren." },
    { who: "Donut", text: "On peut s'en servir comme explosif ! Je te prépare un « Jug O' Boom » !" },
    { who: "SYSTÈME", text: "Objet fabriqué : Jug O' Boom (dynamite artisanale, +6 dégâts)." },
  ],
  dingos: [
    { who: "Kobold", text: "Hé ! Ces dingos sont à MOI ! Lâchez vos biscuits !" },
    { who: "Donut", text: "Donne-leur les biscuits, Carl : avec un peu de chance ils passent du côté des gentils !" },
    { who: "SYSTÈME", text: "Les dingos de danger reçoivent un biscuit… leurs points sur la mini-carte passent au blanc. Ils sont libres !" },
  ],
  boss_krakaren: [
    { who: "Krakaren", text: "REV-UP ! Investissez dans la gnole du siècle ! Vous allez devenir RICHES ! (…c'est un clone.)" },
    { who: "SYSTÈME", text: "Boss de quartier : Krakaren, niveau 15. La salle se verrouille. Victoire !" },
    { who: "SYSTÈME", text: "Récompense de boss : récompense de groupe + familier offert à Donut : un bébé velociraptor nommé… Mongo !" },
    { who: "Donut", text: "MONGO ! Viens là, mon petit dinosaure !" },
  ],
  rage_elemental: [
    { who: "Brandon", text: "Carl ! Un élémentaire de rage attaque les anciens de Meadow Lark !" },
    { who: "Carl", text: "Je m'en occupe ! Protégez-vous !" },
    { who: "SYSTÈME", text: "Combat gagné : les survivants de Meadow Lark sont sains et saufs. Ils descendront à l'étage 3 avant l'effondrement." },
  ],
  stairs2: [
    { who: "SYSTÈME", text: "Escalier trouvé. Bienvenue à l'étage 3, où les régions se rejoignent enfin." },
    { who: "Mordecai", text: "Dernier avertissement, Carl : à l'étage 3, tu choisis ta RACE et ta CLASSE. 3 points de stats par niveau t'attendent. Choisis bien… ou meurs." },
  ],
  intro3: [
    { who: "SYSTÈME", text: "Étage 3 chargé : l'Over City, une vaste étendue de villages médiévaux en ruine, grande comme l'Arizona. Spectateurs : 900 millions." },
    { who: "Donut", text: "La rumeur dit que la couronne que je porte aura des conséquences… au niveau 9." },
    { who: "Carl", text: "Chaque chose en son temps. Avançons." },
  ],
  zev: [
    { who: "Zev", text: "Carl ! Tu connais « Pork Boy », la célébrité rivale de Donut ? Toute cette rivalité est FABRIQUÉE par les producteurs. Les conflits publics se louent à l'antenne !" },
    { who: "Donut", text: "JE Savais QUE C'ÉTAIT UN PORC !" },
  ],
  marche: [
    { who: "Marchand", text: "Carl ! Prends ce parchemin de brume : il révèle toute la carte de l'étage. Et des potions, si t'as survécu jusque-là." },
  ],
  choix_race_classe: [
    { who: "Mordecai", text: "C'est ici, Carl. Tes 3 points de stats par niveau sont en attente. Choisis ta race…" },
    { who: "SYSTÈME", text: "CHOIX DE RACE — (démo) Carl choisit : Primal. Bonus : +2 CON, peau plus résistante." },
    { who: "SYSTÈME", text: "CHOIX DE CLASSE — (démo) Carl choisit : Anarchiste indemnisé. Compétence : « Chaos contrôlé », explosions bonus." },
    { who: "Donut", text: "Tu es officiellement Primal Anarchiste indemnisé, Carl. Ne fais pas sauter l'Over City, hein." },
    { who: "Carl", text: "Promis. Enfin… probablement." },
  ],
  ruines: [
    { who: "SYSTÈME", text: "Des clurichauns et des gobelins s'entretuent dans les ruines. Profite du chaos pour piller." },
  ],
  boss_grimaldi: [
    { who: "Tsarine Signet", text: "Encore toi, Carl ? Ce soir, mon armée invoquée anéantit le chapiteau de Grimaldi !" },
    { who: "Grimaldi", text: "Le spectacle doit CONTINUER, Signet. Parle-lui, crawler." },
    { who: "Carl", text: "Écoutez-vous ! Vous vous battez chaque nuit pour rien — le vrai ennemi, c'est le jeu, pas l'autre !" },
    { who: "SYSTÈME", text: "Quête « The Show Must Go On » accomplie ! Boss de ville : Grimaldi le Pestiféré, niveau 85, vaincu grâce à la négociation." },
    { who: "Grimaldi", text: "…Merci, crawler. Tiens : la Couronne de Princesse Donut. Elle brillera sur scène — et ailleurs." },
    { who: "Donut", text: "MA COURONNE ! Je suis officiellement Princesse ! 👑" },
  ],
  victoire: [
    { who: "SYSTÈME", text: "Étage 3 terminé. Tu as parcouru le tutoriel, le labyrinthe et l'Over City." },
    { who: "Donut", text: "Prochaine étape : l'étage 4 et son métro noué comme un bretzel. On y va, Carl ?" },
    { who: "Carl", text: "On y va. Mais d'abord… Donut, arrête de lécher Mongo." },
    { who: "SYSTÈME", text: "FIN DE LA DÉMO — Les 15 étages suivants t'attendent dans les romans de Matt Dinniman." },
  ],
};
