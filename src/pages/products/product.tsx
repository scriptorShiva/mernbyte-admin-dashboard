import { Breadcrumb, Button, Space, Table, TableProps, Tag } from "antd";
import { Link } from "react-router-dom";
import ProductFilter from "./ProductFilter";
import { PlusOutlined } from "@ant-design/icons";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProducts } from "../../http/api";
import { Image } from "antd";
import { Products } from "../../types";
import { useState } from "react";

interface DataType {
  id: string;
  name: string;
  description: string;
  category: { _id: string; name: string };
  isPublished: boolean;
  imageUrl: string;
  createdAt?: string;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Image",
    dataIndex: "imageUrl",
    key: "imageUrl",
    render: (url) => <Image src={url} width={50} height={50} alt="product" />,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    ellipsis: true,
  },
  {
    title: "Category",
    dataIndex: ["category", "name"],
    key: "category",
  },
  {
    title: "Status",
    key: "isPublished", // unique key name
    dataIndex: "isPublished", // inside db key name
    render: (isPublished: boolean) => {
      return (
        <Tag color={isPublished ? "green" : "red"}>
          {isPublished ? "Published" : "Unpublished"}
        </Tag>
      );
    },
  },
  {
    title: "Added On",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "Action",
    key: "action",
    render: () => (
      <Space size="middle">
        <a>Edit</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const Product = () => {
  // states
  const [filters, setFilters] = useState({
    q: "",
    categoryId: "",
    tenantId: "",
    isPublish: "",
    page: 1,
    limit: 1,
  });
  // use query
  // get products
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const params: Record<string, string> = {};

      if (filters.q) params.q = filters.q;
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.tenantId) params.tenantId = filters.tenantId;
      if (filters.isPublish) params.isPublish = filters.isPublish;

      params.page = String(filters.page);
      params.limit = String(filters.limit);

      const queryString = new URLSearchParams(params).toString();
      const res = await getProducts(queryString);
      return res.data;
    },
    placeholderData: keepPreviousData, //keeps old page while loading new one
  });

  const tableData =
    products?.data.map((product: Products) => ({
      id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      isPublished: product.isPublished,
      imageUrl: product.imageUrl,
      createdAt: product.createdAt
        ? new Date(product.createdAt).toLocaleDateString()
        : "",
    })) ?? [];

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
          <ProductFilter filters={filters} setFilters={setFilters}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size={"large"}
              //onClick={() => setDrawerOpen(true)}
            >
              Create Products
            </Button>
          </ProductFilter>
        </div>

        <div className="error-spin-message">
          {/* NO need ant design table component has loading state */}
          {/* <div className="spin">{isFetching && <Spin />}</div> */}
          <div className="error">{isError && <div>{error.message}</div>}</div>
        </div>

        <Table<DataType>
          columns={columns}
          dataSource={tableData}
          loading={isLoading}
          pagination={{
            current: filters.page,
            pageSize: filters.limit,
            total: products?.total,
            defaultPageSize: 10,
            showSizeChanger: false,
            onChange: (page, pageSize) => {
              setFilters({
                ...filters,
                page: page,
                limit: pageSize,
              });
            },
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
          }}
        />
      </Space>
    </>
  );
};

export default Product;
