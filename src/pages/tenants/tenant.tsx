import { Breadcrumb, Button, Drawer, Space, Table } from "antd";
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTenants } from "../../http/api";
import { Tenant } from "../../types";
import Column from "antd/es/table/Column";
import { useAuthStore } from "../../store";
import { useState } from "react";
import TenantSearch from "./TenantSearch";
import { PlusOutlined } from "@ant-design/icons";

function Tenants() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const onClose = () => {
    setDrawerOpen(false);
  };

  const { user } = useAuthStore();
  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

  const {
    data: tenants,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const res = await getTenants();
      console.log(res);
      return res.data.data;
    },
  });
  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Breadcrumb
          items={[
            { title: <Link to={"/"}>Dashboard</Link> },
            { title: "Tenants" },
          ]}
        />

        {/* User page design */}
        {isLoading && <div>Loading...</div>}
        {isError && <div>{error.message}</div>}

        {/* Tenant search component */}

        <TenantSearch onFilterChange={(key, value) => console.log(key, value)}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size={"large"}
            onClick={() => setDrawerOpen(true)}
          >
            Add tenant
          </Button>
        </TenantSearch>

        {tenants && (
          <Table<Tenant>
            dataSource={tenants}
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
            rowKey={(tenant) => tenant.id}
          >
            <Column title="ID" dataIndex="id" key="id" />
            <Column title="Name" dataIndex="name" key="name" />
            <Column title="Address" dataIndex="address" key="address" />
          </Table>
        )}
      </Space>

      {/* Drawer component */}
      <Drawer
        title="Create a new account"
        width={720}
        onClose={onClose}
        open={drawerOpen}
        destroyOnClose={true}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={onClose}>
              Submit
            </Button>
          </Space>
        }
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </>
  );
}

export default Tenants;
