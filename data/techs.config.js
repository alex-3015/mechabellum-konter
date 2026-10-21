// Techs mit grundsätzlicher Wirkung. Name und Spieltext kommen aus den Spieldateien (table + num, alle Sprachen),
// "set" ändert Zieltyp/Luft-Status (Grundlage für belegte Änderungen), "add"/"weaken" sind Tendenzen.
// Texte (Wirkung, Begründungen) stehen in i18n/<sprache>.json unter tech.<key>.*
module.exports = [
  {
    "key": "arclight_aa",
    "unit": "arclight",
    "table": "AirAttackTechnologyData",
    "num": "3115",
    "level": "belegt",
    "set": {
      "hitsAir": true
    },
    "add": [
      {
        "a": "arclight",
        "b": "wasp"
      }
    ]
  },
  {
    "key": "tarantula_aa",
    "unit": "tarantula",
    "table": "AirAttackTechnologyData",
    "num": "3124",
    "level": "belegt",
    "set": {
      "hitsAir": true
    },
    "add": [
      {
        "a": "tarantula",
        "b": "wasp"
      }
    ]
  },
  {
    "key": "mountain_aa",
    "unit": "mountain",
    "table": "AirAttackTechnologyData",
    "num": "312002",
    "level": "belegt",
    "set": {
      "hitsAir": true
    }
  },
  {
    "key": "sandworm_aa",
    "unit": "sandworm",
    "table": "AirAttackTechnologyData",
    "num": "3123",
    "level": "belegt",
    "set": {
      "hitsAir": true
    }
  },
  {
    "key": "voideye_air",
    "unit": "void_eye",
    "table": "FlyTechData",
    "num": "4430",
    "level": "belegt",
    "set": {
      "hitsAir": true,
      "flies": true
    }
  },
  {
    "key": "fang_grenade",
    "unit": "fang",
    "table": "AirAttackTechnologyData",
    "num": "3109",
    "level": "belegt",
    "set": {
      "hitsAir": false
    },
    "add": [
      {
        "a": "fang",
        "b": "crawler"
      }
    ]
  },
  {
    "key": "wraith_ground",
    "unit": "wraith",
    "table": "FlyTechData",
    "num": "4418",
    "level": "belegt",
    "set": {
      "hitsAir": false,
      "flies": false
    }
  },
  {
    "key": "fortress_aa",
    "unit": "fortress",
    "table": "ExtraWeaponTechnologyData",
    "num": "1105",
    "level": "tendenz",
    "set": {
      "hitsAir": true
    }
  },
  {
    "key": "sabertooth_aa",
    "unit": "sabertooth",
    "table": "ExtraWeaponTechnologyData",
    "num": "11015021",
    "level": "tendenz",
    "set": {
      "hitsAir": true
    }
  },
  {
    "key": "raiden_chain",
    "unit": "raiden",
    "table": "IterationHitDamageTechData",
    "num": "4027",
    "level": "tendenz",
    "weaken": [
      {
        "a": "fang",
        "b": "raiden"
      },
      {
        "a": "wasp",
        "b": "raiden"
      }
    ]
  },
  {
    "key": "centurion_melee",
    "unit": "centurion",
    "table": "MeleeModeTechData",
    "num": "5532",
    "level": "tendenz",
    "weaken": [
      {
        "a": "crawler",
        "b": "centurion"
      },
      {
        "a": "fang",
        "b": "centurion"
      }
    ]
  }
];
