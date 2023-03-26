import { uploadButtonStyle } from "./styles";
import { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Row, Col, Button, Empty, Spin } from "antd";
import DataCard from "../../components/dataCard";
import { Flex } from "../../components/utils";
import { getDataList } from "../../apis/getDataList";
import { useAppStore } from "../../hooks/store";

function DataPage() {
  const dataList = useAppStore((state) => state.dataList);
  const setDataList = useAppStore((state) => state.setDataList);
  const currentUserId = useAppStore((state) => state.currentUserId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dataList.length !== 0) {
      setLoading(false);
    } else {
      getDataList(currentUserId).then((res) => {
        setDataList(res);
        setLoading(false);
      });
    }
  }, []);
  return (
    <div className="data-container">
      {!loading ? (
        dataList.length !== 0 ? (
          <Row gutter={20}>
            {dataList.map((data) => {
              return <DataCard data={data} />;
            })}
            <Col span={6}>
              <Button
                style={uploadButtonStyle}
                type="dashed"
                size="large"
                block
              >
                <UploadOutlined />
              </Button>
            </Col>
          </Row>
        ) : (
          <Empty description="Press Upload new data or Create new section">
            <Button type="dashed">Upload new data</Button>
          </Empty>
        )
      ) : (
        <Flex justify="center" align="center">
          <Spin />
        </Flex>
      )}
    </div>
  );
}

export default DataPage;
