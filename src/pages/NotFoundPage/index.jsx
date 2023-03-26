import { Result } from "antd";

function NotFoundPage() {
  return (
    <div>
      <Result
        status="404"
        title="Page Not Found"
        subTitle="Sorry, the page you visited does not exist."
      />
    </div>
  );
}

export default NotFoundPage;
