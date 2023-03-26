import { postMethod } from "./apiHelper";

export async function predict(modelId, data) {
  const _path = `/apis/prediction/${modelId}`;
  const _data = {
    data: data,
  };
  return await postMethod(_path, _data);
}
