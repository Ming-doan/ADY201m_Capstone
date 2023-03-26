import { Col, Badge, Card } from "antd";

function ModelCard({ model, onPress }) {
  return (
    <Col span={6}>
      <Badge.Ribbon text={model.modelName.split("/")[0]}>
        <Card
          hoverable
          title={model.modelName.split("/")[1]}
          size="small"
          onClick={onPress}
        ></Card>
      </Badge.Ribbon>
    </Col>
  );
}

export default ModelCard;
