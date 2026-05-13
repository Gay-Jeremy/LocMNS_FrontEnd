export interface MaterielDto {
  categorieId: number | null | 'new';
  modeleId: number | 'new';
  numSerie: string;
  statutId: number | null;
  salleId: number | null;
}
