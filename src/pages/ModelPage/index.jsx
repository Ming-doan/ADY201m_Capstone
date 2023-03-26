import { Row, Col, Button, Empty, Spin } from "antd";
import { useState, useEffect } from "react";
import ModelCard from "../../components/modelCard";
import { Flex } from "../../components/utils";
import { getModelsList } from "../../apis/getModelsList";
import { useAppStore } from "../../hooks/store";
import { useNavigate } from "react-router-dom";

function ModelPage() {
  const navigate = useNavigate();
  const modelsList = useAppStore((state) => state.modelsList);
  const setModelsList = useAppStore((state) => state.setModelsList);
  const currentUserId = useAppStore((state) => state.currentUserId);
  const [loading, setLoading] = useState(true);

  function onModelPress(model) {
    navigate(`/model/${model._id}`);
  }

  useEffect(() => {
    if (modelsList.length !== 0) {
      setLoading(false);
    } else {
      getModelsList(currentUserId).then((res) => {
        setModelsList(res);
        setLoading(false);
      });
    }
  }, []);

  return (
    <div className="data-container">
      {!loading ? (
        modelsList.length !== 0 ? (
          <Row gutter={20}>
            {modelsList.map((model) => {
              return (
                <ModelCard model={model} onPress={() => onModelPress(model)} />
              );
            })}
          </Row>
        ) : (
          <Empty description="Press Create new section and Train to get model" />
        )
      ) : (
        <Flex justify="center" align="center">
          <Spin />
        </Flex>
      )}
    </div>
  );
}

export default ModelPage;
