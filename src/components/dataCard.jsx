import { Col, Badge, Card } from "antd";

function DataCard({ data, onPress }) {
  return (
    <Col span={6}>
      <Badge.Ribbon text={data.fileType}>
        <Card
          hoverable
          title={data.dataName}
          size="small"
          onClick={onPress}
        ></Card>
      </Badge.Ribbon>
    </Col>
  );
}

export default DataCard;
