import style from "./style.module.scss";
import { Transfer, Select, Button } from "antd";
import { useState } from "react";
import { Flex } from "../../components/utils";
import { modelAlgorithmOptions } from "./constants";
import { useAppStore } from "../../hooks/store";
import { BsArrowRight } from "react-icons/bs";
import { useTrainingFormStore } from "./formStore";

function ModelConfig() {
  const currentData = useAppStore((state) => state.currentData);
  const dataTable = useAppStore((state) => state.dataTable);
  const [targetKeys, setTargetKeys] = useState([getDataColumns()[0].key]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [model, setModel] = useState(modelAlgorithmOptions[0]);
  const setStep = useAppStore((state) => state.setStep);
  const setModelAlgorithm = useTrainingFormStore(
    (state) => state.setModelAlgorithm
  );
  const setModelProvider = useTrainingFormStore(
    (state) => state.setModelProvider
  );
  const setModelAlgorithmInputs = useTrainingFormStore(
    (state) => state.setModelAlgorithmInputs
  );
  const setModelAlgorithmOutputs = useTrainingFormStore(
    (state) => state.setModelAlgorithmOutputs
  );

  function getDataColumns() {
    const _table_keys = Object.keys(dataTable.data[0]);
    const _data_keys = currentData.keys;
    let _data = [];
    for (let _key of _data_keys) {
      if (_table_keys.includes(_key.key)) {
        _data.push(_key);
      }
    }
    return _data;
  }

  function getModelRequiredInputs(model) {
    return (
      (model.ouputs === targetKeys.length || model.ouputs === -1) &&
      (model.inputs === getDataColumns().length - targetKeys.length ||
        model.inputs === -1)
    );
  }

  function getModelsOption() {
    return modelAlgorithmOptions.map((model) => {
      return {
        ...model,
        disabled: !getModelRequiredInputs(model),
      };
    });
  }

  function onTransferChange(nextTargetKeys, direction, moveKeys) {
    setTargetKeys(nextTargetKeys);
  }

  function onTransferSelectChange(sourceSelectedKeys, targetSelectedKeys) {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  }

  function onSelectModelChange(value) {
    setModel(modelAlgorithmOptions.find((model) => model.value === value));
  }

  function onPreviousStepPress() {
    setStep(0);
  }

  function onStartTrainingPress() {
    const modelName = model.value.split("/")[1];
    const provider = model.value.split("/")[0];
    const inputs = [];
    const outputs = [];
    for (let key of getDataColumns()) {
      if (targetKeys.includes(key.key)) {
        outputs.push(key.key);
      } else {
        inputs.push(key.key);
      }
    }
    setModelAlgorithm(modelName);
    setModelProvider(provider);
    setModelAlgorithmInputs(inputs);
    setModelAlgorithmOutputs(outputs);
    setStep(2);
  }

  return (
    <div className={style.modelConfigContainer}>
      <Flex justify="space-between">
        <Transfer
          dataSource={getDataColumns()}
          titles={["Inputs", "Outputs"]}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={onTransferChange}
          onSelectChange={onTransferSelectChange}
          render={(item) => item.key}
          status={
            targetKeys.length === 0 ||
            targetKeys.length === getDataColumns().length
              ? "error"
              : null
          }
        />
        <BsArrowRight size={20} />
        <Select
          style={{ width: 400 }}
          size="large"
          placeholder="Please select model"
          defaultValue={model.value}
          options={getModelsOption()}
          onChange={(value) => onSelectModelChange(value)}
        />
        <BsArrowRight size={20} />
        <Button
          type="primary"
          size="large"
          disabled={
            targetKeys.length === 0 ||
            targetKeys.length === getDataColumns().length ||
            !getModelRequiredInputs(model)
          }
          onClick={onStartTrainingPress}
        >
          Start Training Section
        </Button>
      </Flex>
      <Button onClick={onPreviousStepPress}>Previous Step</Button>
    </div>
  );
}

export default ModelConfig;
