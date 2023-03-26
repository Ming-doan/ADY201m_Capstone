import { getMethod } from "./apiHelper";

export async function getDataById(dataId) {
  const _path = `/apis/getdatafile/${dataId}`;
  return await getMethod(_path);
}
