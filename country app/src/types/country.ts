export interface Country {
    name: {
      common: string;
      official: string;
    };
    cca3: string;
    flags: {
      png: string;
      svg: string;
    };
    region: string;
    capital: string[];
    population: number;
    languages: { [key: string]: string };
  }
  