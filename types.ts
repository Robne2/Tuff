
export interface Oil {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  benefits: string[];
  uses: string[];
  aromaticDescription: string;
  color: string; // The identifying color on the dōTERRA label
  secondaryColor?: string;
  image: string;
}

export enum ViewMode {
  GRID = 'GRID',
  DETAIL = 'DETAIL'
}
