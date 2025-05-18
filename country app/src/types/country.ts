export interface Country {
  cca3: string;
  name: {
    common: string;
    official: string;
  };
  capital?: string[];
  region: string;
  population: number;
  flags: {
    png: string;
    svg: string;
  };
  languages?: {
    [key: string]: string;
  };

  // ✅ Add these extra optional fields for CountryDetail page
  borders?: string[];
  currencies?: {
    [currencyCode: string]: {
      name: string;
      symbol: string;
    };
  };
  maps?: {
    googleMaps: string;
    openStreetMaps: string;
  };
}
