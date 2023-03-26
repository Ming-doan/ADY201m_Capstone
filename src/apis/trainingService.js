import { postMethod } from "./apiHelper";

export async function trainModel(
  dataId,
  model,
  provider,
  inputs,
  outputs,
  trainTestSplit,
  model_config
) {
  const _path = `/apis/trainingmodel/${dataId}`;
  const _data = {
    modelName: model,
    libName: provider,
    inputs: inputs,
    outputs: outputs,
    trainTestSplit: trainTestSplit,
  };
  return await postMethod(_path, _data);
}
