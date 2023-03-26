import style from "./style.module.scss";
import { selectDataCard } from "./styles";
import { useState, useEffect } from "react";
import { Modal, Card, Tag, Spin } from "antd";
import { Flex, Expanded } from "../../components/utils";
import { useAppStore } from "../../hooks/store";
import { getDataList } from "../../apis/getDataList";
import { getDataById } from "../../apis/getDataById";

function SelectDataModal({ isOpen, onOk, onCancel }) {
  const [isLoading, setIsLoading] = useState(true);
  const dataListStore = useAppStore((state) => state.dataList);
  const setDataTable = useAppStore((state) => state.setDataTable);
  const setCurrentData = useAppStore((state) => state.setCurrentData);
  const currentUserId = useAppStore((state) => state.currentUserId);
  const [dataList, setDataList] = useState([]);

  function onCardPress(index) {
    setIsLoading(true);
    getDataById(dataList[index]._id).then((res) => {
      setCurrentData(dataList[index]);
      setDataTable(res);
      setIsLoading(false);
      onCancel();
    });
  }

  useEffect(() => {
    if (dataListStore.length !== 0) {
      setDataList(dataListStore);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      getDataList(currentUserId).then((res) => {
        setDataList(res);
        setIsLoading(false);
      });
    }
  }, []);

  return (
    <div>
      <Modal
        title="Select your data"
        open={isOpen}
        onOk={onOk}
        onCancel={onCancel}
      >
        <Spin spinning={isLoading} tip="Fetching...">
          <Card size="small">
            {dataList.map((data, index) => {
              return (
                <Card.Grid
                  key={data._id}
                  style={selectDataCard}
                  onClick={() => onCardPress(index)}
                >
                  <Flex>
                    {data.dataName}
                    <Expanded />
                    <Tag color="#108ee9">{data.fileType}</Tag>
                  </Flex>
                </Card.Grid>
              );
            })}
          </Card>
        </Spin>
      </Modal>
    </div>
  );
}

export default SelectDataModal;
