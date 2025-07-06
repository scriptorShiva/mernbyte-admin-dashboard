import { Card, Form, Input, Select } from "antd";
import "./userform.css";
import { getTenants } from "../../../http/api";
import { useQuery } from "@tanstack/react-query";
import { Tenant } from "../../../types";

const UserForm = () => {
  // use query
  const { data: tenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const res = await getTenants();
      console.log(res);
      return res.data.data;
    },
  });

  return (
    <>
      <div className="container">
        <Card>
          <div className="section-a">
            <div className="basic-info-header">Basic Info</div>
            <div className="first-last-name">
              <Form.Item
                label="First Name"
                name="firstname"
                rules={[
                  { required: true, message: "Please input your first name!" },
                ]}
              >
                <Input placeholder="first name" />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name="lastname"
                rules={[
                  { required: true, message: "Please input your last name!" },
                ]}
              >
                <Input placeholder="last name" />
              </Form.Item>
            </div>
            <div className="email-phone">
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input type="email" placeholder="input xyz@gmail.com" />
              </Form.Item>
              <Form.Item label="Phone number" name="number">
                <Input type="number" placeholder="99XXXXXXXX" />
              </Form.Item>
            </div>
          </div>
        </Card>

        <Card>
          <div className="section-b">
            <div className="security-info-header">Security Info</div>
            <div className="password">
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  {
                    min: 8,
                    message: "Password must be at least 8 characters",
                  },
                  {
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                  },
                ]}
              >
                <Input type="password" placeholder="********" />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="confirm-password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (value && value !== getFieldValue("password")) {
                        return Promise.reject(
                          "The two passwords that you entered do not match!"
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input type="password" placeholder="********" />
              </Form.Item>
            </div>
          </div>
        </Card>

        <Card>
          <div className="section-c">
            <div className="role-header">Roles</div>
            <div className="role">
              <Form.Item
                label="Select Role"
                name="role"
                rules={[{ required: true, message: "Role required!" }]}
              >
                <Select
                  //   defaultValue="demo"
                  allowClear={true}
                  onChange={() => {}}
                  placeholder="Select Role"
                >
                  <Select.Option value="admin">Admin</Select.Option>
                  <Select.Option value="manager">Manager</Select.Option>
                  <Select.Option value="customer">Customer</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Select Tenant"
                name="tenantId"
                rules={[{ required: true, message: "Please select a tenant!" }]}
              >
                <Select
                  //   defaultValue="demo"
                  allowClear={true}
                  onChange={() => {}}
                  placeholder="Select Role"
                >
                  {tenants?.map((tenant: Tenant) => {
                    return (
                      <Select.Option key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default UserForm;
