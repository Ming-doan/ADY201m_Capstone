import style from "./style.module.scss";
import { Modal, message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { Flex, Spacer } from "../../components/utils";

const { Dragger } = Upload;
const props = {
  name: "file",
  multiple: false,
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

function UploadDataModal({ isOpen, onOk, onCancel }) {
  return (
    <div>
      <Modal
        title="Upload your data"
        open={isOpen}
        onOk={onOk}
        onCancel={onCancel}
      >
        <Dragger {...props}>
          <Flex direction="column" justify="center" align="center">
            <div className={style.draggerUploadIcon}>
              <InboxOutlined />
            </div>
            Click or drag file to this area to upload
          </Flex>
        </Dragger>
      </Modal>
    </div>
  );
}

export default UploadDataModal;
