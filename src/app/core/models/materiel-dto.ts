export interface MaterielDto {
  categorieId: number | null | 'new';
  modeleId: number;
  numSerie: string;
  statutId: number | null;
  salleId: number | null;
}
