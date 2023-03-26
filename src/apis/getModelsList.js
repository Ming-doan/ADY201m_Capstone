import { getMethod } from "./apiHelper";

export async function getModelsList(userId) {
  const _path = `/apis/getmodelslist/${userId}`;
  return await getMethod(_path);
}
