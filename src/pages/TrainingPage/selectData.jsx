import style from "./style.module.scss";
import { useState } from "react";
import { uploadButtonStyle } from "./styles";
import { Button } from "antd";
import { Flex, Spacer } from "../../components/utils";
import { AiOutlineUpload, AiFillDatabase } from "react-icons/ai";
import UploadDataModal from "./uploadDataModal";
import SelectDataModal from "./selectDataModal";

function SelectData() {
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isSelectModalVisible, setIsSelectModalVisible] = useState(false);

  function onUploadDataPress() {
    setIsUploadModalVisible(!isUploadModalVisible);
  }

  function handleUploadOk() {
    setIsUploadModalVisible(false);
  }

  function handleUploadCancel() {
    setIsUploadModalVisible(false);
  }

  function onSelectDataPress() {
    setIsSelectModalVisible(!isSelectModalVisible);
  }

  function handleSelectOk() {
    setIsSelectModalVisible(false);
  }

  function handleSelectCancel() {
    setIsSelectModalVisible(false);
  }

  return (
    <div className={style.uploadButtonContainer}>
      <Flex>
        <Button
          style={uploadButtonStyle}
          type="dashed"
          size="large"
          block
          onClick={onUploadDataPress}
        >
          <Flex direction="column" justify="center">
            <AiOutlineUpload size={30} />
            <Spacer size={0.2} />
            Upload new Data
          </Flex>
        </Button>
        <Spacer size={1} />
        <Button
          style={uploadButtonStyle}
          type="dashed"
          size="large"
          block
          onClick={onSelectDataPress}
        >
          <Flex direction="column" justify="center">
            <AiFillDatabase size={30} />
            <Spacer size={0.2} />
            Select from existing Data
          </Flex>
        </Button>
      </Flex>
      <UploadDataModal
        isOpen={isUploadModalVisible}
        onOk={handleUploadOk}
        onCancel={handleUploadCancel}
      />
      <SelectDataModal
        isOpen={isSelectModalVisible}
        onOk={handleSelectOk}
        onCancel={handleSelectCancel}
      />
    </div>
  );
}

export default SelectData;
