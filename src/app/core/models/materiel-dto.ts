export interface MaterielDto {
  categorieId: number | null | 'new';
  modeleId: number | 'new' | null;
  numSerie: string;
  statutMaterielId: number | null;
  salleId: number | null;
}
