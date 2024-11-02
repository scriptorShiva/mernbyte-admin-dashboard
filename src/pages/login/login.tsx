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
import {
  LockFilled,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Credentials, FieldType } from "../../types";
import { useMutation } from "react-query";
import { login } from "../../http/api";

const loginUser = async (credentials: Credentials) => {
  // server call

  const { data } = await login(credentials);
  return data;
};

function Login() {
  const { mutate, isError, error, isLoading } = useMutation({
    mutationKey: ["login"], // unique for each mutation
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  return (
    <>
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
              <ShoppingCartOutlined
                style={{ fontSize: 24, color: "#6A1B9A" }}
              />
              {/* <div style={{ margin: 0, fontSize: 16, fontWeight: "bold" }}>
                LoremIpsum
              </div> */}
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
                mutate({
                  email: values.username,
                  password: values.password,
                });
              }}
            >
              {isError && (
                <Alert
                  style={{ marginBottom: 10 }}
                  message={(error as Error)?.message}
                  type="error"
                />
              )}
              <Form.Item<FieldType>
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                  { type: "email", message: "Please enter your valid email!" },
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
                <Input.Password
                  prefix={<LockFilled />}
                  placeholder="Password"
                />
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
                  loading={isLoading}
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Space>
      </Layout>
    </>
  );
}

export default Login;
