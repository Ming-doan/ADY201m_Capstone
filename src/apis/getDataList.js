import { getMethod } from "./apiHelper";

export async function getDataList(userId) {
  const _path = `/apis/getdatalist/${userId}`;
  return await getMethod(_path);
}
