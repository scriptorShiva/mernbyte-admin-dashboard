import {
  Layout,
  Card,
  Space,
  Form,
  Input,
  Checkbox,
  Button,
  Alert,
} from "antd";
import { LockFilled, UserOutlined } from "@ant-design/icons";
import { Credentials, FieldType } from "../../types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { login, self, logout } from "../../http/api";
import { useAuthStore } from "../../store";
import { userPermission } from "../../hooks/usePermission";
import Logo from "../../components/logo/Logo";

const loginUser = async (credentials: Credentials) => {
  const { data } = await login(credentials);
  return data;
};

const getSelf = async () => {
  const { data } = await self();
  return data;
};

function Login() {
  const { setUser, logout: logoutFromStore } = useAuthStore();
  const { isAllowed } = userPermission();

  const { refetch } = useQuery({
    queryKey: ["self"],
    queryFn: getSelf,
    enabled: false,
  });

  const {
    mutate: logoutMutate,
    isError: isLogoutError,
    error: logoutError,
    isPending: isLogoutLoading,
  } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: () => {
      logoutFromStore();
      return;
    },
  });

  const {
    mutate: loginMutate,
    isError: isLoginError,
    error: loginError,
    isPending: isLoginLoading,
  } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    onSuccess: async () => {
      const selfDataPromise = await refetch();
      if (!isAllowed(selfDataPromise.data)) {
        logoutMutate();
        return;
      }
      setUser(selfDataPromise.data);
    },
  });

  return (
    <Layout
      style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}
    >
      <Space direction="vertical">
        <Layout.Content
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Space>
            <Logo />
          </Space>
        </Layout.Content>
        <Card
          bordered={false}
          style={{ width: 300 }}
          title={
            <Space
              style={{
                width: "100%",
                fontSize: 16,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <LockFilled /> Sign In
            </Space>
          }
        >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={(values) => {
              loginMutate({
                email: values.username,
                password: values.password,
              });
            }}
          >
            {isLoginError && (
              <Alert
                style={{ marginBottom: 10 }}
                message={(loginError as Error)?.message}
                type="error"
              />
            )}
            {isLogoutError && (
              <Alert
                style={{ marginBottom: 10 }}
                message={(logoutError as Error)?.message}
                type="error"
              />
            )}

            <Form.Item<FieldType>
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>

            <Form.Item<FieldType>
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password prefix={<LockFilled />} placeholder="Password" />
            </Form.Item>

            <Form.Item<FieldType>
              name="remember"
              valuePropName="checked"
              wrapperCol={{}}
            >
              <div>
                <Checkbox>Remember me</Checkbox>
                <a href="#">Forgot Password</a>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
                loading={isLoginLoading || isLogoutLoading}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </Layout>
  );
}

export default Login;
