export type CategoryId =
  | "proteinas"
  | "mercearia"
  | "frutas"
  | "legumes"
  | "laticinios"
  | "bebidas"
  | "limpeza"
  | "higiene"
  | "congelados"
  | "biscoitos"
  | "gelados"
  | "outros";

export type Category = {
  id: CategoryId;
  label: string;
  emoji?: string;
};
