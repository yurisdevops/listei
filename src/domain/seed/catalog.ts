import { CatalogItem } from "../models/catolog";

const now = () => Date.now();

export const CATALOG_SEED: CatalogItem[] = [
  // Proteínas
  {
    id: "frango",
    name: "Frango",
    categoryId: "proteinas",
    pricingType: "weight",
    defaultUnit: "kg",
    createdBy: "system",
    createdAt: now(),
  },
  {
    id: "carne_moida",
    name: "Carne moída",
    categoryId: "proteinas",
    pricingType: "weight",
    defaultUnit: "kg",
    createdBy: "system",
    createdAt: now(),
  },
  {
    id: "ovos",
    name: "Ovos",
    categoryId: "proteinas",
    pricingType: "unit",
    defaultUnit: "un",
    createdBy: "system",
    createdAt: now(),
  },

  // Mercearia
  {
    id: "arroz",
    name: "Arroz",
    categoryId: "mercearia",
    pricingType: "unit",
    defaultUnit: "un",
    createdBy: "system",
    createdAt: now(),
  },
  {
    id: "feijao",
    name: "Feijão",
    categoryId: "mercearia",
    pricingType: "unit",
    defaultUnit: "un",
    createdBy: "system",
    createdAt: now(),
  },
  {
    id: "macarrao",
    name: "Macarrão",
    categoryId: "mercearia",
    pricingType: "unit",
    defaultUnit: "un",
    createdBy: "system",
    createdAt: now(),
  },

  // Frutas
  {
    id: "banana",
    name: "Banana",
    categoryId: "frutas",
    pricingType: "weight",
    defaultUnit: "kg",
    createdBy: "system",
    createdAt: now(),
  },
  {
    id: "maca",
    name: "Maçã",
    categoryId: "frutas",
    pricingType: "weight",
    defaultUnit: "kg",
    createdBy: "system",
    createdAt: now(),
  },

  // Legumes
  {
    id: "tomate",
    name: "Tomate",
    categoryId: "legumes",
    pricingType: "weight",
    defaultUnit: "kg",
    createdBy: "system",
    createdAt: now(),
  },
  {
    id: "beterraba",
    name: "Beterrana",
    categoryId: "legumes",
    pricingType: "weight",
    defaultUnit: "kg",
    createdBy: "system",
    createdAt: now(),
  },

  {
    id: "batata",
    name: "Batata",
    categoryId: "legumes",
    pricingType: "weight",
    defaultUnit: "kg",
    createdBy: "system",
    createdAt: now(),
  },

  // Limpeza
  {
    id: "detergente",
    name: "Detergente",
    categoryId: "limpeza",
    pricingType: "unit",
    defaultUnit: "un",
    createdBy: "system",
    createdAt: now(),
  },
  {
    id: "sabaoempo",
    name: "Sabão em pó",
    categoryId: "limpeza",
    pricingType: "unit",
    defaultUnit: "un",
    createdBy: "system",
    createdAt: now(),
  },
];
