import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";
import {
  Avatar,
  Badge,
  Breadcrumb,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Space,
  theme,
} from "antd";
import { useState } from "react";
const { Header, Content, Footer, Sider } = Layout;
import type { MenuProps } from "antd";
import {
  BarChartOutlined,
  BarcodeOutlined,
  BellFilled,
  HomeOutlined,
  ProductOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons/lib/icons";
import Logo from "../components/logo/Logo";
import { useMutation } from "react-query";
import { logout } from "../http/api";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "/",
    icon: <HomeOutlined />,
    label: <NavLink to="/">Home</NavLink>,
  },
  {
    key: "/users",
    icon: <UserOutlined />,
    label: <NavLink to="/users">Users</NavLink>,
  },
  {
    key: "/tenants",
    icon: <ShopOutlined />,
    label: <NavLink to="/users">Tenants</NavLink>,
  },
  {
    key: "/products",
    icon: <ProductOutlined />,
    label: <NavLink to="/users">Products</NavLink>,
  },
  {
    key: "/sales",
    icon: <BarChartOutlined />,
    label: <NavLink to="/users">Sales</NavLink>,
  },
  {
    key: "/promos",
    icon: <BarcodeOutlined />,
    label: <NavLink to="/users">Promos</NavLink>,
  },
];

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  //logout
  const { logout: logoutFromStore } = useAuthStore();
  const { mutate: logoutMutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: () => {
      logoutFromStore();
      return;
    },
  });

  // protection
  const { user } = useAuthStore();
  if (user === null) {
    return <Navigate to="/auth/login" replace={true} />;
  }

  return (
    <div>
      <div>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            collapsible
            collapsed={collapsed}
            theme="light"
            onCollapse={(value) => setCollapsed(value)}
          >
            <div className="demo-logo-vertical">
              <Logo />
            </div>

            <Menu
              theme="light"
              defaultSelectedKeys={["/"]}
              mode="inline"
              items={items}
            />
          </Sider>
          <Layout>
            <Header
              style={{
                paddingLeft: 25,
                paddingRight: 25,
                background: colorBgContainer,
              }}
            >
              <Flex gap="middle" align="start" justify="space-between">
                <Badge text="Hello" status="success" />
                <Space size={16}>
                  <Badge dot={true}>
                    <BellFilled />
                  </Badge>
                  <Dropdown
                    menu={{
                      items: [
                        {
                          label: "Logout",
                          key: "1",
                          onClick: () => logoutMutate(),
                        },
                      ],
                    }}
                    placement="bottomRight"
                    arrow
                  >
                    <Avatar
                      style={{
                        backgroundColor: "#fde3cf",
                        color: "#f56a00",
                      }}
                    >
                      U
                    </Avatar>
                  </Dropdown>
                </Space>
              </Flex>
            </Header>
            <Content style={{ margin: "0 16px" }}>
              <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>User</Breadcrumb.Item>
                <Breadcrumb.Item>Bill</Breadcrumb.Item>
              </Breadcrumb>
              <div
                style={{
                  padding: 24,
                  minHeight: 360,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
              >
                Bill is a cat.
              </div>
              <Outlet />
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Developed by ©{new Date().getFullYear()} mernByte
            </Footer>
          </Layout>
        </Layout>
      </div>
    </div>
  );
};

export default Dashboard;
