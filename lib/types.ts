
export interface ExcelFormData {
  diameterInitial: number;
  diameterFinal: number;
  carbonPercentage: number;
  structure: 'P' | 'W' | 'R';
  treatment: 'descaled' | 'descaled+coating' | 'pickled';
  numberOfPasses: number;
  benchMarkSpeed: number;
}

export interface ExcelCellMapping {
  diameterInitial: 'B3';
  diameterFinal: 'B5';
  carbonPercentage: 'C3';
  structure: 'D5';
  treatment: 'E5';
  numberOfPasses: 'D8';
  benchMarkSpeed: 'D9';
}

export const EXCEL_CELLS: ExcelCellMapping = {
  diameterInitial: 'B3',
  diameterFinal: 'B5',
  carbonPercentage: 'C3',
  structure: 'D5',
  treatment: 'E5',
  numberOfPasses: 'D8',
  benchMarkSpeed: 'D9'
};

export const STRUCTURE_OPTIONS = [
  { value: 'P', label: 'Patented' },
  { value: 'W', label: 'Direct Drawn Wire' },
  { value: 'R', label: 'Stelmor' }
];

export const TREATMENT_OPTIONS = [
  { value: 'descaled', label: 'Descaled' },
  { value: 'descaled+coating', label: 'Descaled + Coating' },
  { value: 'pickled', label: 'Pickled' }
];
