import { brandStyle, brandLogoStyle, siderStyle, headerStyle } from "./styles";
import brand from "../../assets/brand.png";
import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Button, Avatar } from "antd";
import { Spacer, Padding, Flex, Expanded } from "../../components/utils";
import { PlusOutlined } from "@ant-design/icons";
import { BsClipboardData } from "react-icons/bs";
import { HiCube } from "react-icons/hi";

const { Header, Content, Sider } = Layout;

function HomePage() {
  // Initiate navigation
  const navigator = useNavigate();
  const location = useLocation();

  // Get menu items function
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const menuItems = [
    {
      type: "divider",
    },
    getItem("Data", "data", <BsClipboardData />),
    getItem("Model", "model", <HiCube />),
  ];

  // Handling actions
  function onMenuPress(e) {
    navigator(`/${e.key}`);
  }

  function onNewPress() {
    navigator("/training");
  }

  // Use effect
  useEffect(() => {
    if (location.pathname === "/") {
      console.log(location.pathname);
      navigator("/data");
    }
  }, []);

  return (
    <div>
      <Layout>
        <Sider style={siderStyle}>
          <div style={brandStyle}>
            <img style={brandLogoStyle} src={brand} alt="brand" />
          </div>
          <Spacer size={1} />
          <Padding size={0.5}>
            <Button
              type="primary"
              block
              size="large"
              onClick={onNewPress}
              icon={<PlusOutlined />}
            >
              New Section
            </Button>
          </Padding>
          <Spacer size={0.5} />
          <Menu
            mode="inline"
            defaultSelectedKeys={["data"]}
            items={menuItems}
            onClick={onMenuPress}
          />
        </Sider>
        <Layout>
          <Header style={headerStyle}>
            <Flex>
              Welcome, Tintt19
              <Expanded />
              <Avatar size={"large"}>T</Avatar>
            </Flex>
          </Header>
          <Content>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default HomePage;
