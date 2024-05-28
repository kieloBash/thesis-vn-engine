export enum ArgumentTypeEnum {
  FOR = "for",
  AGAINST = "against",
  IRRELEVANT = "irrelevant",
}
export enum ArgumentTaxEnum {
  CLAIM = "claim",
  WARRANT = "warrant",
  GROUND = "ground",
}
// export interface SingleArgument {
//   claimKey: string;
//   text: string;
//   tax: SingleArgumentTax;
// }
// export interface ClaimArgument extends SingleArgument {
//   tax: SingleArgumentTax.CLAIM;
//   type: SingleArgumentType;
// }
// export interface WarrantArgument extends SingleArgument {
//   connectorKey: string;
//   tax: SingleArgumentTax.WARRANT;
// }
// export interface GroundArgument extends SingleArgument {
//   connectorKey: string;
//   tax: SingleArgumentTax.GROUND;
// }
// export interface ArgumentChain {
//   connector: string;
//   groundArg?: GroundArgument;
//   warantArg?: WarrantArgument;
// }

export interface FullArgument {
  lineRef: number;
  claimKey: string;
  claimText: string;
  type: ArgumentTypeEnum;
  tax: ArgumentTaxEnum;
  chain: ArgumentChain[];
}
export interface ArgumentChain {
  connectorKey: string;
  warrant?: SingleArgument;
  ground?: SingleArgument;
}
export interface SingleArgument {
  lineRef: number;
  connectorKey: string;

  text: string;
  tax: ArgumentTaxEnum;
}
export interface DisplayArg {
    tax: ArgumentTaxEnum;
    type?: ArgumentTypeEnum;
    connectorKey?: string;
    claimKey: string;
    text: string;
  }
  
