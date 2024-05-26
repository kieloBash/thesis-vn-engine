import { ArgumentTax, ArgumentType, Speaker } from "@/types";

import ANJELO from "@/public/Characters/Anjelo.png";
import EJAY from "@/public/Characters/Ejay.png";
import HERSHEY from "@/public/Characters/Hershey.png";
import SAMMY from "@/public/Characters/Sammy.png";
import TRIS from "@/public/Characters/Tris.png";
import EZEKIEL from "@/public/Characters/Ezekiel.png";

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
