import { postMethod } from "./apiHelper";

export async function dropColumn(dataId, columnName) {
  const _path = `/apis/dropcolumn/${dataId}`;
  const _data = {
    columnName: columnName,
  };
  return await postMethod(_path, _data);
}

export async function wrangling(dataId, fnaNum, fnaCate, norNum, norCate) {
  const _path = `/apis/wrangling/${dataId}`;
  const _data = {
    fillingNaNumeric: fnaNum,
    fillingNaCategorical: fnaCate,
    normalizationNumeric: norNum,
    normalizationCategorical: norCate,
  };
  return await postMethod(_path, _data);
}

export async function summary(dataId, columnName) {
  const _path = `/apis/tablesummary/${dataId}`;
  const _data = {
    columnName: columnName,
  };
  return await postMethod(_path, _data);
}
