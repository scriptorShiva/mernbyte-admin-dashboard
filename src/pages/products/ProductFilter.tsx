import { SearchOutlined } from "@ant-design/icons";
import { Card, Input, Select, Switch } from "antd";
import "./product.css";

const ProductFilter = () => {
  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

  return (
    <Card>
      <div className="product-filter-card">
        <Input
          addonBefore={<SearchOutlined />}
          style={{ width: 300 }}
          placeholder="Search by products name..."
        />

        <Select
          // defaultValue="Category A"
          style={{ width: 160 }}
          //onChange={handleChange}
          options={[
            { value: "categoryA", label: "Category A" },
            { value: "categoryB", label: "Category B" },
            { value: "categoryC", label: "Category C" },
          ]}
          placeholder="Category"
        />

        <Select
          // defaultValue="Tenant A"
          style={{ width: 160 }}
          //onChange={handleChange}
          options={[
            { value: "tenantA", label: "Tenant A" },
            { value: "tenantB", label: "Tenant B" },
            { value: "tenantC", label: "Tenant C" },
          ]}
          placeholder="Store"
        />

        <div className="switch-container">
          <Switch defaultChecked onChange={onChange} />
          <span>Show only published</span>
        </div>
      </div>
    </Card>
  );
};

export default ProductFilter;
