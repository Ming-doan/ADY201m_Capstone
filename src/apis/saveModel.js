import { postMethod } from "./apiHelper";

export async function saveModel(userId, provider, data) {
  const _path = `/apis/savemodel/${userId}`;
  const _data = {
    provider: provider,
    data: data,
  };
  return await postMethod(_path, _data);
}
