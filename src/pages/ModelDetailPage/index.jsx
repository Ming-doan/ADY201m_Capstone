import style from "./style.module.scss";
import { Radio, Button, InputNumber, Typography, Spin } from "antd";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import { Flex, Spacer, Divider } from "../../components/utils";
import { useState, useEffect } from "react";
import { getModelById } from "../../apis/getModelById";
import { predict } from "../../apis/predict";

function ModelDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [model, setModel] = useState({});
  const [isPredicting, setIsPredicting] = useState(false);
  const [data, setData] = useState([]);
  const [result, setResult] = useState([]);

  function onBackPress() {
    navigate("/model");
  }

  function getOptions(dtype) {
    return dtype.map((item) => ({
      label: item,
      value: item,
    }));
  }

  function onDataChange(value, index) {
    data[index] = value;
    console.log(data);
    setData(data);
  }

  function getInitState(model) {
    return model.inputsKey.map((inputKey) => {
      return inputKey.dtype.length === 0 ? 0 : inputKey.dtype[0];
    });
  }

  function FetchModelInput() {
    return model.inputsKey.map((inputKey, index) => {
      return (
        <div className={style.input}>
          <Typography.Text strong italic>
            {inputKey.key}
          </Typography.Text>
          <Spacer size={0.5} />
          {inputKey.dtype.length === 0 ? (
            <InputNumber
              placeholder={`Enter ${inputKey.key}`}
              style={{ width: "100%" }}
              onChange={(value) => onDataChange(value, index)}
            />
          ) : (
            <Radio.Group
              options={getOptions(inputKey.dtype)}
              optionType="button"
              buttonStyle="solid"
              onChange={(e) => onDataChange(e.target.value, index)}
            />
          )}
          <Spacer size={1} />
        </div>
      );
    });
  }

  function FetchModelOutput() {
    return model.outputsKey.map((outputKey, index) => (
      <div className={style.input}>
        <Typography.Text strong italic>
          {outputKey.key}
        </Typography.Text>
        <Spacer size={0.5} />
        <Typography.Text>
          {result.length != 0 ? result[index] : 0}
        </Typography.Text>
      </div>
    ));
  }

  function onPredictPress() {
    setIsPredicting(true);
    predict(model._id, data).then((res) => {
      console.log(res);
      setIsPredicting(false);
      setResult(res.result);
    });
  }

  useEffect(() => {
    const _modelId = location.pathname.split("/").pop();
    getModelById(_modelId).then((res) => {
      console.log(res);
      setModel(res);
      setData(getInitState(res));
      setIsLoading(false);
    });
  }, []);

  return !isLoading ? (
    <div className={style.container}>
      <div className={style.actions}>
        <Button type="ghost" onClick={onBackPress}>
          <BiArrowBack />
        </Button>
        <Spacer size={1} />
        <Typography.Title style={{ margin: 0 }} level={4}>
          Model {model.modelName}
        </Typography.Title>
      </div>
      <Flex align="strech">
        <div className={style.left}>
          <FetchModelInput />
        </div>
        <Spacer size={1} />
        <Divider />
        <Spacer size={1} />
        <div className={style.right}>
          <FetchModelOutput />
        </div>
      </Flex>
      <Spacer size={2} />
      <Button
        type="primary"
        block
        loading={isPredicting}
        size="large"
        onClick={onPredictPress}
      >
        Predict
      </Button>
    </div>
  ) : (
    <div className={style.loading}>
      <Flex justify="center" align="center">
        <Spin tip="Fetching model data" />
      </Flex>
    </div>
  );
}

export default ModelDetailPage;
