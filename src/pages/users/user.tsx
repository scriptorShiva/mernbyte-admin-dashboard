import { Breadcrumb, Space, Table, Tag } from "antd";
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../http/api";
import { User } from "../../types";
import ColumnGroup from "antd/es/table/ColumnGroup";
import Column from "antd/es/table/Column";
import { useAuthStore } from "../../store";

const roleColors: Record<string, string> = {
  admin: "purple",
  manager: "orange",
  user: "green",
  customer: "blue",
};

function Users() {
  // Accept admin no one will be able to access this users list.
  const { user } = useAuthStore();
  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }
  // react query
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await getUsers();
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
            { title: "Users" },
          ]}
        />

        {/* User page design */}
        {isLoading && <div>Loading...</div>}
        {isError && <div>{error.message}</div>}

        {users && (
          <Table<User> dataSource={users} pagination={{ pageSize: 5 }}>
            <Column title="ID" dataIndex="id" key="id" />
            <ColumnGroup title="Name">
              <Column
                title="First Name"
                dataIndex="firstName"
                key="firstName"
              />
              <Column title="Last Name" dataIndex="lastName" key="lastName" />
            </ColumnGroup>
            {/* <Column title="Age" dataIndex="age" key="age" /> */}
            <Column title="Email" dataIndex="email" key="email" />

            <Column
              title="Role"
              dataIndex="role"
              key="role"
              render={(role: string) => (
                <Tag color={roleColors[role] || "default"}>
                  {role.toUpperCase()}
                </Tag>
              )}
            />
          </Table>
        )}
      </Space>
    </>
  );
}

export default Users;
