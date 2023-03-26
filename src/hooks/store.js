import { create } from "zustand";

export const useAppStore = create((set) => ({
  currentUserId: "vAZvGQpGm1IdlGiTrgCd",
  currentStep: 0,
  setStep: (step) => set({ currentStep: step }),
  currentData: null,
  setCurrentData: (data) => set({ currentData: data }),
  dataTable: null,
  setDataTable: (data) => set({ dataTable: data }),
  dataList: [],
  setDataList: (data) => set({ dataList: data }),
  modelsList: [],
  setModelsList: (data) => set({ modelsList: data }),
  resetWorkingSpace: () =>
    set({ currentData: null, dataTable: null, dataList: [], modelsList: [] }),
}));
