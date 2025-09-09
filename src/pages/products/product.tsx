import { Breadcrumb, Space } from "antd";
import { Link } from "react-router-dom";
import ProductFilter from "./ProductFilter";

const product = () => {
  return (
    <>
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <Breadcrumb
          items={[
            {
              title: <Link to={"/"}>Dashboard</Link>,
            },
            {
              title: "Products",
            },
          ]}
        />

        <div className="search-filter-container">
          <ProductFilter />
        </div>
      </Space>
    </>
  );
};

export default product;
