import { useAppStore } from "../../hooks/store";
import { useTrainingFormStore, useWranglingFormStore } from "./formStore";
import { Image, Typography, Badge, Button } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { trainModel } from "../../apis/trainingService";
import { saveModel } from "../../apis/saveModel";
import trainingGif from "../../assets/training.gif";
import donePng from "../../assets/done.png";
import errorPng from "../../assets/error.png";
import { Flex, Padding, Spacer } from "../../components/utils";
import { convertDecimalToPercentage } from "../../utils/utils";

function TrainingResult() {
  const navigate = useNavigate();
  const [isTraining, setIsTraining] = useState(true);
  const [isError, setIsError] = useState(false);
  const [trainingResult, setTrainingResult] = useState({});
  const curretnData = useAppStore((state) => state.currentData);
  const setStep = useAppStore((state) => state.setStep);
  const resetWorkingSpace = useAppStore((state) => state.resetWorkingSpace);
  const currentUserId = useAppStore((state) => state.currentUserId);
  const modelAlgorithm = useTrainingFormStore((state) => state.modelAlgorithm);
  const modelProvider = useTrainingFormStore((state) => state.modelProvider);
  const modelAlgorithmInputs = useTrainingFormStore(
    (state) => state.modelAlgorithmInputs
  );
  const modelAlgorithmOutputs = useTrainingFormStore(
    (state) => state.modelAlgorithmOutputs
  );
  const [onSaving, setOnSaving] = useState(false);

  function getKeys(targetKeys) {
    const keys = [];
    curretnData.keys.forEach((key) => {
      if (targetKeys.includes(key.key)) {
        keys.push(key);
      }
    });
    return keys;
  }

  function onRetrainPress() {
    setStep(1);
  }
  const fillingNANumeric = useWranglingFormStore(
    (state) => state.fillingNANumeric
  );
  const fillingNACategorical = useWranglingFormStore(
    (state) => state.fillingNACategorical
  );
  const normalizationNumeric = useWranglingFormStore(
    (state) => state.normalizationNumeric
  );
  const normalizationCategorical = useWranglingFormStore(
    (state) => state.normalizationCategorical
  );

  function onSaveModelPress() {
    setOnSaving(true);
    const data = {
      inputsKey: getKeys(modelAlgorithmInputs),
      outputsKey: getKeys(modelAlgorithmOutputs),
      trainedData: curretnData._id,
      wrangling: {
        fillingNANumeric,
        fillingNACategorical,
        normalizationNumeric,
        normalizationCategorical,
      },
    };
    saveModel(currentUserId, modelProvider, data).then((res) => {
      console.log(res);
      setOnSaving(false);
      setStep(0);
      resetWorkingSpace();
      navigate("/data");
    });
  }

  useEffect(() => {
    trainModel(
      curretnData._id,
      modelAlgorithm,
      modelProvider,
      modelAlgorithmInputs,
      modelAlgorithmOutputs,
      0.2
    )
      .then((res) => {
        console.log(res);
        setIsTraining(false);
        setTrainingResult(res);
      })
      .catch((err) => {
        setIsTraining(false);
        setIsError(true);
      });
  }, []);

  return (
    <div>
      <Padding size={2}>
        {isTraining ? (
          <Flex justify="center" direction="column">
            <Image src={trainingGif} width={500} preview={false} />
            <Flex align="center">
              <Badge
                status="processing"
                size="default"
                text="training is in progress"
              ></Badge>
            </Flex>
          </Flex>
        ) : isError ? (
          <Flex direction="column" justify="center">
            <Image src={errorPng} width={350} preview={false} />
            <Typography.Title level={5}>
              Something went wrong, please try again
            </Typography.Title>
            <Spacer size={1} />
            <Flex>
              <Button onClick={onRetrainPress}>Retrain</Button>
            </Flex>
          </Flex>
        ) : (
          <Flex direction="column" justify="center">
            <Image src={donePng} width={350} preview={false} />
            <Typography.Text>
              Preview Accuracy:{" "}
              {convertDecimalToPercentage(
                typeof trainingResult.metrics.accuracy === "object"
                  ? trainingResult.metrics.accuracy[0]
                  : trainingResult.metrics.accuracy
              )}
            </Typography.Text>
            <Spacer size={1} />
            <Flex>
              <Button onClick={onRetrainPress}>Retrain</Button>
              <Spacer size={1} />
              <Button
                type="primary"
                onClick={onSaveModelPress}
                loading={onSaving}
              >
                Save Model
              </Button>
            </Flex>
          </Flex>
        )}
      </Padding>
    </div>
  );
}

export default TrainingResult;
