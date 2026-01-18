export interface CarbonData {
  bytes: number;
  green: boolean;
  gco2e: number;
  rating: string;
  statistics: {
    adjustedBytes: number;
    energy: number;
    co2: {
      grid: { grams: number; litres: number };
      renewable: { grams: number; litres: number };
    };
  };
  cleanerThan: number;
}

export interface Equivalents {
  trees: { value: string | number; label: string };
  carMiles: { value: string | number; label: string };
  phoneCharges: { value: string | number; label: string };
  teaCups: { value: string | number; label: string };
  dataSize: { value: string; label: string };
}
