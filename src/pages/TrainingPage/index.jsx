import style from "./style.module.scss";
import { Steps } from "antd";
import { stepItems } from "./constants";
import SelectData from "./selectData";
import DataTable from "./dataTable";
import ModelConfig from "./modelConfig";
import TrainingResult from "./trainingResult";
import { useAppStore } from "../../hooks/store";

function TrainingPage() {
  const dataTable = useAppStore((state) => state.dataTable);
  const step = useAppStore((state) => state.currentStep);

  function getContentByStep(step) {
    switch (step) {
      case 0:
        return !dataTable ? <SelectData /> : <DataTable />;
      case 1:
        return <ModelConfig />;
      default:
        return <TrainingResult />;
    }
  }

  return (
    <div className={style.container}>
      <Steps current={step} items={stepItems} />
      {getContentByStep(step)}
    </div>
  );
}

export default TrainingPage;
