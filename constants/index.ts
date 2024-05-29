import {
  ArgumentTax,
  ArgumentType,
  Audio,
  Background,
  Command,
  CommandType,
  Speaker,
} from "@/types";

import ANJELO from "@/public/Characters/Anjelo.png";
import EJAY from "@/public/Characters/Ejay.png";
import HERSHEY from "@/public/Characters/Hershey.png";
import SAMMY from "@/public/Characters/Sammy.png";
import TRIS from "@/public/Characters/Tris.png";
import EZEKIEL from "@/public/Characters/Ezekiel.png";

import CAF_DAY from "@/public/Backgrounds/Cafeteria_Day.png";
import CAF_DAWN from "@/public/Backgrounds/Cafeteria_Dawn.png";
import CAF_NIGHT from "@/public/Backgrounds/Cafeteria_Night.png";
import CAF_MIDNIGHT from "@/public/Backgrounds/Cafeteria_MidNight.png";

import PAS_DAY from "@/public/Backgrounds/Pasillo_Day.png";
import PAS_DAWN from "@/public/Backgrounds/Pasillo_Dawn.png";
import PAS_NIGHT from "@/public/Backgrounds/Pasillo_Night.png";
import PAS_MIDNIGHT from "@/public/Backgrounds/Pasillo_MidNight.png";

import SAL_DAY from "@/public/Backgrounds/Salon_Day.png";
import SAL_DAWN from "@/public/Backgrounds/Salon_Dawn.png";
import SAL_NIGHT from "@/public/Backgrounds/Salon_Night.png";
import SAL_MIDNIGHT from "@/public/Backgrounds/Salon_MidNight.png";

export const CHARACTERS: Speaker[] = [
  { name: "Anjelo Bracamonte", image: ANJELO },
  { name: "Ejay Pagsisihan", image: EJAY },
  { name: "Hershey dela Fuerte", image: HERSHEY },
  { name: "Sammy Jacob", image: SAMMY },
  { name: "Tris Jones", image: TRIS },
  { name: "Ezekiel Mendoza", image: EZEKIEL },
];

export const ARG_TAX: ArgumentTax[] = ["Claim", "Ground", "Warrant"];
export const ARG_TYPE: ArgumentType[] = ["Against", "For", "Irrelevant"];

export const BACKGROUNDS: Background[] = [
  { name: "Cafeteria (Day)", image: CAF_DAY },
  { name: "Cafeteria (Dawn)", image: CAF_DAWN },
  { name: "Cafeteria (Night)", image: CAF_NIGHT },
  { name: "Cafeteria (MidNight)", image: CAF_MIDNIGHT },

  { name: "Pasillo (Day)", image: PAS_DAY },
  { name: "Pasillo (Dawn)", image: PAS_DAWN },
  { name: "Pasillo (Night)", image: PAS_NIGHT },
  { name: "Pasillo (MidNight)", image: PAS_MIDNIGHT },

  { name: "Salon (Day)", image: SAL_DAY },
  { name: "Salon (Dawn)", image: SAL_DAWN },
  { name: "Salon (Night)", image: SAL_NIGHT },
  { name: "Salon (MidNight)", image: SAL_MIDNIGHT },
];

export const AUDIOS: Audio[] = [
  { trackname: "Track #1" },
  { trackname: "Track #2" },
  { trackname: "Track #3" },
];
export const SFX: Audio[] = [
  { trackname: "sfx #1" },
  { trackname: "sfx #2" },
  { trackname: "sfx #3" },
];

export const COMMANDS: Command[] = [
  { name: "CharacterMoveLeft", type: CommandType.Action, parameters: [] },
  { name: "CharacterMoveRight", type: CommandType.Action, parameters: [] },
  { name: "CharacterMoveUp", type: CommandType.Action, parameters: [] },
  { name: "CharacterMoveLeft", type: CommandType.Action, parameters: [] },
  { name: "CharacterShrink", type: CommandType.Action, parameters: [] },
  { name: "playtrack", type: CommandType.Audio, parameters: [] },
  { name: "playsoundeffect", type: CommandType.Audio, parameters: [] },
];
