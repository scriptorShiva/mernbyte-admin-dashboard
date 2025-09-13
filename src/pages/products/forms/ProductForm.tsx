import {
  Card,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  Upload,
} from "antd";
import TextArea from "antd/es/input/TextArea";
const { Option } = Select;
import { PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getTenants } from "../../../http/api";
import { Category, Tenant } from "../../../types";
import { useState } from "react";
import "./productform.css";

type FieldType = {
  name: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e.slice(0, 1); // always keep only the first file
  }
  return e?.fileList?.slice(0, 1);
};

const ProductForm = () => {
  // states
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // use queries
  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return getCategories();
    },
  });
  const categories: Category[] = categoriesResponse?.data ?? [];

  const { data: tenantsResponse } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => {
      return getTenants(`currentPage=1&perPage=100`);
    },
  });
  const tenants: Tenant[] = tenantsResponse?.data.data ?? [];

  // methods
  const handleSelectedCategoryChange = (value: string) => {
    const findCategory = categories.find((category) => category._id === value);
    if (!findCategory) {
      setSelectedCategory(null);
      return;
    }
    // set selected category as the Category object
    setSelectedCategory(findCategory);
  };

  return (
    <div className="container">
      <Card title="Product Details">
        <div className="section-a">
          <Form.Item<FieldType>
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input your product name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select a category"
              //onChange={onGenderChange}
              allowClear
              onChange={handleSelectedCategoryChange}
            >
              {categories!.map((category: Category) => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please input your product description!",
              },
            ]}
          >
            <TextArea placeholder="description" allowClear rows={4} />
          </Form.Item>
        </div>
      </Card>

      <Card title="Product Image">
        <div className="section-b">
          <Form.Item
            label="Upload"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Please upload an image!" }]}
          >
            <Upload
              beforeUpload={() => false}
              listType="picture-card"
              maxCount={1}
              accept="image/*"
            >
              <button
                style={{
                  color: "inherit",
                  cursor: "inherit",
                  border: 0,
                  background: "none",
                }}
                type="button"
              >
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </button>
            </Upload>
          </Form.Item>
        </div>
      </Card>

      <Card title="Tenant Info">
        <div className="section-c">
          <Form.Item
            name="tenantId"
            label="Tenant"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select a tenant"
              //onChange={onGenderChange}
              allowClear
            >
              {tenants.map((tenant: Tenant) => (
                <Option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </Card>

      {selectedCategory?.priceConfiguration && (
        <Card title="Product Price">
          {Object.entries(selectedCategory?.priceConfiguration).length > 0
            ? Object.entries(selectedCategory?.priceConfiguration).map(
                ([key, value]) => (
                  <div className="section-d" key={key}>
                    <div className="title">{`${key} (${value.priceType})`}</div>
                    <div className="options">
                      {value.availableOptions.map((option) => (
                        <div key={option}>
                          <Form.Item
                            name={[
                              "priceConfiguration",
                              JSON.stringify({
                                key: key,
                                priceType: value.priceType,
                              }),
                              option,
                            ]}
                            label={option}
                            rules={[
                              {
                                required: true,
                                message: "Please input your product price!",
                              },
                            ]}
                          >
                            <InputNumber
                              width={"100px"}
                              //addonAfter={"INR"}
                              addonBefore={"₹"}
                            />
                          </Form.Item>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )
            : "No price configuration found for this category"}
        </Card>
      )}

      {selectedCategory?.attributes && (
        <Card title="Product Attributes">
          <div className="section-e">
            {selectedCategory.attributes.map((attribute) => (
              <div key={attribute._id}>
                <Form.Item
                  key={attribute._id}
                  name={["attributes", attribute.name]}
                  initialValue={attribute.defaultValue}
                  label={attribute.name}
                  rules={[
                    {
                      required: true,
                      message: "Please input your product attributes!",
                    },
                  ]}
                >
                  {attribute.widgetType === "switch" && (
                    <Switch
                      checkedChildren="On"
                      unCheckedChildren="Off"
                      defaultChecked={attribute.defaultValue === "true"}
                    />
                  )}
                  {attribute.widgetType === "radio" && (
                    <Radio.Group defaultValue={attribute.defaultValue}>
                      {attribute!.availableOptions.map((option) => (
                        <Radio.Button value={option}>{option}</Radio.Button>
                      ))}
                    </Radio.Group>
                  )}
                  {attribute.widgetType === "text" && <Input />}
                  {attribute.widgetType === "select" && (
                    <Select defaultValue={attribute.defaultValue}>
                      {attribute!.availableOptions.map((option) => (
                        <Option value={option}>{option}</Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card title="Other properties">
        <div className="section-f">
          <Form.Item name="isPublish" label="Published" valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>
      </Card>
    </div>
  );
};

export default ProductForm;
