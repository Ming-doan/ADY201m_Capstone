import { getMethod } from "./apiHelper";

export async function getModelById(modelId) {
  const _path = `/apis/getmodel/${modelId}`;
  return await getMethod(_path);
}
