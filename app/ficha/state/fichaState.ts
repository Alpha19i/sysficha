export type FichaValues = Record<string, string>;

export const fichaState: {
  indice: number;
  values: FichaValues;
} = {
  indice: 0,
  values: {}
};