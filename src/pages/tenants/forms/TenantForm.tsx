import { Card, Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import "./tenantform.css";

function TenantForm() {
  return (
    <>
      <div className="container">
        <div className="section-a">
          <Card>
            <div className="store-header">Store Details</div>
            <div className="store-name">
              <Form.Item
                label="Tenant / Store Name"
                name="name"
                rules={[
                  { required: true, message: "Please input your store name!" },
                ]}
              >
                <Input placeholder="store name" />
              </Form.Item>
            </div>
            <div className="store-address">
              <Form.Item
                label="Address"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input your store/tenant address!",
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Please input your tenant/store address"
                  maxLength={50}
                />
              </Form.Item>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export default TenantForm;
