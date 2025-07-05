import { Breadcrumb, Button, Drawer, Form, Space, Table, Tag } from "antd";
import { Link, Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getUsers } from "../../http/api";
import { CreateUserData, User } from "../../types";
import ColumnGroup from "antd/es/table/ColumnGroup";
import Column from "antd/es/table/Column";
import { useAuthStore } from "../../store";
import UserFilter from "./UserFilter";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import UserForm from "./forms/UserForm";

const roleColors: Record<string, string> = {
  admin: "purple",
  manager: "orange",
  user: "green",
  customer: "blue",
};

function Users() {
  // state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ant design form hook
  const [formData] = Form.useForm();

  // its a react hook : give access to the query cache manager
  // triggers specific refetch of the data , update data in cache manually , reads data from cache
  const queryClient = useQueryClient();

  const onClose = () => {
    setDrawerOpen(false);
    formData.resetFields();
  };

  // Accept admin no one will be able to access this users list.
  const { user } = useAuthStore();
  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

  // react query
  // for get we use useQuery
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

  // for create we will use mutation
  const { mutate: createUserMutate } = useMutation({
    mutationKey: ["createUser"],
    mutationFn: async (data: CreateUserData) => {
      console.log(data, "ddd");
      const res = await createUser(data);
      return res.data.data;
    },
    onSuccess: () => {
      formData.resetFields();
      onClose();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // on form submit
  const onSubmit = async () => {
    // check validations if validations success then next
    await formData.validateFields();
    const values = await formData.getFieldsValue();

    createUserMutate({
      firstName: values.firstname,
      lastName: values.lastname,
      email: values.email,
      password: values.password,
      role: values.role,
      tenantId: values.tenantId,
    });

    console.log(formData.getFieldsValue());
  };

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Breadcrumb
          items={[
            { title: <Link to={"/"}>Dashboard</Link> },
            { title: "Users" },
          ]}
        />

        {/* User filter */}
        <UserFilter
          onFilterChange={(filterName: string, filterValue: string) => {
            console.log(filterName, filterValue);
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size={"large"}
            onClick={() => setDrawerOpen(true)}
          >
            Create users
          </Button>
        </UserFilter>

        {/* User page design */}
        {isLoading && <div>Loading...</div>}
        {isError && <div>{error.message}</div>}

        {users && (
          <Table<User>
            dataSource={users}
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
            rowKey={(user) => user.id}
          >
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

      {/* Drawer component */}
      <Drawer
        className="custom-drawer"
        title="Create a new account"
        width={720}
        onClose={onClose}
        open={drawerOpen}
        destroyOnClose={true}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={onSubmit}>
              Submit
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={formData}>
          <UserForm />
        </Form>
      </Drawer>
    </>
  );
}

export default Users;
