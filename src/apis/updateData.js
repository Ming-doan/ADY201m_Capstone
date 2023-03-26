import { postMethod } from "./apiHelper";

export async function saveData(dataId, extension) {
  const _path = `/apis/savedata/${dataId}`;
  const _payload = {
    extension: extension,
  };
  return await postMethod(_path, _payload);
}
