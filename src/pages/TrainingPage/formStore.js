import { create } from "zustand";
import {
  wranglingFillingNANumericOptions,
  wranglingFillingNACategoricalOptions,
  wranglingNormalizationNumericOptions,
  wranglingNormalizationCategoricalOptions,
} from "./constants";

export const useWranglingFormStore = create((set) => ({
  fillingNANumeric: wranglingFillingNANumericOptions[0].value,
  fillingNACategorical: wranglingFillingNACategoricalOptions[0].value,
  normalizationNumeric: wranglingNormalizationNumericOptions[0].value,
  normalizationCategorical: wranglingNormalizationCategoricalOptions[0].value,
  setFillingNANumeric: (data) => set({ fillingNANumeric: data }),
  setFillingNACategorical: (data) => set({ fillingNACategorical: data }),
  setNormalizationNumeric: (data) => set({ normalizationNumeric: data }),
  setNormalizationCategorical: (data) =>
    set({ normalizationCategorical: data }),
}));

export const useTrainingFormStore = create((set) => ({
  modelAlgorithm: null,
  modelProvider: null,
  modelAlgorithmInputs: [],
  modelAlgorithmOutputs: [],
  setModelAlgorithm: (data) => set({ modelAlgorithm: data }),
  setModelProvider: (data) => set({ modelProvider: data }),
  setModelAlgorithmInputs: (data) => set({ modelAlgorithmInputs: data }),
  setModelAlgorithmOutputs: (data) => set({ modelAlgorithmOutputs: data }),
}));
