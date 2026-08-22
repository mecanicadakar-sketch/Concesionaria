export interface BrandModelDictionary {
  [brandName: string]: string[];
}

export const CAR_BRAND_MODELS: BrandModelDictionary = {
  Toyota: [
    'Hilux',
    'Corolla',
    'Corolla Cross',
    'Yaris',
    'RAV4',
    'SW4',
    'Etios',
    'Land Cruiser',
    'Prius',
    'Hiace',
    'Camry',
    'C-HR',
    'Vitz',
    'Ractis',
    'Celta',
    'Voxi',
    'Noah',
    'Raum',
    'Runx',
    'Platz',
    'Allion',
    'Premio',
    'Axio',
  ],
  Volkswagen: [
    'Gol',
    'Golf',
    'Golf GTI',
    'Amarok',
    'Vento',
    'Taos',
    'T-Cross',
    'Nivus',
    'Polo',
    'Virtus',
    'Tiguan',
    'Bora',
    'Suran',
    'Fox',
    'Saveiro',
    'Passat',
    'Scirocco',
    'Up!',
  ],
  Ford: [
    'Ranger',
    'Focus',
    'Fiesta',
    'EcoSport',
    'Ka',
    'Territory',
    'Maverick',
    'Mustang',
    'Bronco',
    'Bronco Sport',
    'Kuga',
    'Mondeo',
    'Transit',
    'F-150',
    'F-150 Raptor',
  ],
  Chevrolet: [
    'Tracker',
    'Onix',
    'Onix Plus',
    'Cruze',
    'S10',
    'Spin',
    'Prisma',
    'Celta',
    'Aveo',
    'Trailblazer',
    'Camaro',
    'Montana',
    'Sonic',
    'Agile',
    'Astra',
    'Captiva',
    'Equinox',
    'Corsa',
  ],
  Renault: [
    'Sandero',
    'Stepway',
    'Duster',
    'Kwid',
    'Logan',
    'Kangoo',
    'Oroch',
    'Captur',
    'Alaskan',
    'Fluence',
    'Clio',
    'Megane',
    'Master',
    'Kardian',
    'Symbol',
  ],
  Fiat: [
    'Cronos',
    'Pulse',
    'Toro',
    'Strada',
    'Mobi',
    'Argo',
    'Fastback',
    'Uno',
    'Palio',
    '500',
    'Fiorino',
    'Ducato',
    'Punto',
    'Siena',
    'Titano',
  ],
  Peugeot: [
    '208',
    '308',
    '2008',
    '3008',
    '207',
    '408',
    'Partner',
    '5008',
    '307',
    '206',
    '407',
    'Expert',
    'Boxer',
  ],
  Nissan: [
    'Frontier',
    'Kicks',
    'Versa',
    'Sentra',
    'March',
    'X-Trail',
    'Note',
    'Tiida',
    'Murano',
    'Pathfinder',
    'Leaf',
  ],
  Jeep: [
    'Compass',
    'Renegade',
    'Commander',
    'Grand Cherokee',
    'Wrangler',
    'Gladiator',
    'Cherokee',
  ],
  BMW: [
    'Serie 1',
    'Serie 2',
    'Serie 3',
    'Serie 4',
    'Serie 5',
    'Serie 7',
    'X1',
    'X2',
    'X3',
    'X4',
    'X5',
    'X6',
    'X7',
    'M2',
    'M3',
    'M4',
    'M5',
    'Z4',
    'iX',
  ],
  'Mercedes-Benz': [
    'Clase A',
    'Clase B',
    'Clase C',
    'Clase E',
    'Clase S',
    'GLA',
    'GLB',
    'GLC',
    'GLE',
    'GLS',
    'CLA',
    'Citan',
    'Vito',
    'Sprinter',
    'Clase G',
  ],
  Audi: [
    'A1',
    'A3',
    'A4',
    'A5',
    'A6',
    'A7',
    'A8',
    'Q2',
    'Q3',
    'Q5',
    'Q7',
    'Q8',
    'TT',
    'R8',
    'e-tron',
  ],
  Honda: [
    'Civic',
    'HR-V',
    'CR-V',
    'Fit',
    'City',
    'WR-V',
    'Accord',
    'ZR-V',
    'Pilot',
  ],
  Hyundai: [
    'Tucson',
    'Creta',
    'HB20',
    'Santa Fe',
    'Accent',
    'Elantra',
    'i10',
    'Grand i10',
    'Kona',
    'Palisade',
    'Veloster',
    'Staria',
  ],
  Kia: [
    'Sportage',
    'Seltos',
    'Rio',
    'Cerato',
    'Picanto',
    'Carnival',
    'Sorento',
    'Sonet',
    'Soul',
    'EV6',
    'K3',
  ],
  Citroën: [
    'C3',
    'C4 Cactus',
    'C4 Lounge',
    'Berlingo',
    'C3 Aircross',
    'Basalt',
    'C5 Aircross',
    'C4',
    'Jumpy',
  ],
  RAM: [
    '1500',
    'Rampage',
    '2500',
    '700',
  ],
  Mazda: [
    '2',
    '3',
    '6',
    'CX-3',
    'CX-30',
    'CX-5',
    'CX-50',
    'CX-90',
    'MX-5',
  ],
};

/**
 * Returns all distinct brands sorted alphabetically, combining master list with any from listings
 */
export function getAllBrands(additionalListings?: { make: string }[]): string[] {
  const brandSet = new Set<string>(Object.keys(CAR_BRAND_MODELS));
  if (additionalListings) {
    additionalListings.forEach((item) => {
      if (item.make && item.make.trim()) {
        // Find existing with case-insensitive match or add
        const existing = Array.from(brandSet).find(
          (b) => b.toLowerCase() === item.make.trim().toLowerCase()
        );
        if (!existing) {
          brandSet.add(item.make.trim());
        }
      }
    });
  }
  return Array.from(brandSet).sort((a, b) => a.localeCompare(b));
}

/**
 * Returns all models for a specific brand, merging canonical list and any custom from listings
 */
export function getModelsForBrand(
  brandName?: string,
  additionalListings?: { make: string; model: string }[]
): string[] {
  if (!brandName || !brandName.trim()) {
    // If no brand selected, return all models from all brands or from listings
    const allModelsSet = new Set<string>();
    Object.values(CAR_BRAND_MODELS).forEach((models) => {
      models.forEach((m) => allModelsSet.add(m));
    });
    if (additionalListings) {
      additionalListings.forEach((item) => {
        if (item.model && item.model.trim()) {
          allModelsSet.add(item.model.trim());
        }
      });
    }
    return Array.from(allModelsSet).sort((a, b) => a.localeCompare(b));
  }

  const cleanBrand = brandName.trim();
  const canonicalKey = Object.keys(CAR_BRAND_MODELS).find(
    (k) => k.toLowerCase() === cleanBrand.toLowerCase()
  );

  const modelSet = new Set<string>(canonicalKey ? CAR_BRAND_MODELS[canonicalKey] : []);

  if (additionalListings) {
    additionalListings.forEach((item) => {
      if (
        item.make &&
        item.make.trim().toLowerCase() === cleanBrand.toLowerCase() &&
        item.model &&
        item.model.trim()
      ) {
        modelSet.add(item.model.trim());
      }
    });
  }

  return Array.from(modelSet).sort((a, b) => a.localeCompare(b));
}
