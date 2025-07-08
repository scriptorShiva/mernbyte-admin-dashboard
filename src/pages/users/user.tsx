import {
  Breadcrumb,
  Button,
  Drawer,
  Form,
  Modal,
  Space,
  //Spin,
  Table,
  Tag,
} from "antd";
import { Link, Navigate } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createUser, deleteUser, getUsers, updateUser } from "../../http/api";
import { CreateUserData, Tenant, User } from "../../types";
import ColumnGroup from "antd/es/table/ColumnGroup";
import Column from "antd/es/table/Column";
import { useAuthStore } from "../../store";
import UserFilter from "./UserFilter";
import { useEffect, useMemo, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  WarningFilled,
} from "@ant-design/icons";
import UserForm from "./forms/UserForm";
import { debounce } from "lodash";

const roleColors: Record<string, string> = {
  admin: "purple",
  manager: "orange",
  user: "green",
  customer: "blue",
};

function Users() {
  // state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // on click on edit
  const [editUser, setEditUser] = useState<User | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  // ant design form hook
  const [formData] = Form.useForm();

  // query params
  const [queryParams, setQueryParams] = useState({
    current: 1,
    pageSize: 5,
    role: "",
    q: "",
  });

  // its a react hook : give access to the query cache manager
  // triggers specific refetch of the data , update data in cache manually , reads data from cache
  const queryClient = useQueryClient();

  const onClose = () => {
    setDrawerOpen(false);
    formData.resetFields();
    setEditUser(null);
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
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: async () => {
      const rawParams = {
        role: queryParams.role,
        currentPage: String(queryParams.current),
        perPage: String(queryParams.pageSize),
        q: queryParams.q,
      };

      // Remove empty , null , undefined values
      const cleanedParams: Record<string, any> = {};
      Object.entries(rawParams).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
          cleanedParams[key] = String(value);
        }
      });

      const queryStringGenerate = new URLSearchParams(cleanedParams).toString();
      const res = await getUsers(queryStringGenerate);

      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  // for create we will use mutation
  const { mutate: createUserMutate } = useMutation({
    mutationKey: ["createUser"],
    mutationFn: async (data: CreateUserData) => {
      console.log(data, "ddd");
      const res = await createUser(data);
      return res.data;
    },
    onSuccess: () => {
      formData.resetFields();
      onClose();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // for update we will use this mutation
  const { mutate: updateUserMutate } = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: async (data: CreateUserData) => {
      const res = await updateUser(String(editUser!.id), data);
      return res.data;
    },
    onSuccess: () => {
      formData.resetFields();
      onClose();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // for delete we will use this mutation
  const { mutate: deleteUserMutate } = useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: async (id: string) => {
      const res = await deleteUser(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // Debouncing
  // useMemo for memoising/caching. Why we used it.
  /**
   * Creates the debouncedSearch only once, when the component mounts.
   * Reuses the same function on every render (as long as dependencies don’t change).
   * You’re computing something expensive, or You want to persist a function/object/array between renders without redefining it.
   */
  const debouncedSearch = useMemo(() => {
    return debounce((searchTerm: string) => {
      setQueryParams((prev) => ({
        ...prev,
        q: searchTerm,
        current: 1,
      }));
    }, 500); // 500ms delay
  }, []);

  // clean up debounce on unmounts :Enables debouncedSearch.cancel() to work correctly in cleanup.
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // on click on edit open drawer and populate data in it as state changes
  useEffect(() => {
    if (editUser) {
      formData.setFieldsValue({
        firstname: editUser.firstName,
        lastname: editUser.lastName,
        email: editUser.email,
        role: editUser.role,
        password: "",
        tenantId: editUser.tenant?.id,
      });
    }
  }, [editUser]);

  // on form submit
  const onSubmit = async () => {
    // check validations if validations success then next
    await formData.validateFields();

    const values = await formData.getFieldsValue();

    if (!!editUser) {
      updateUserMutate({
        firstName: values.firstname,
        lastName: values.lastname,
        email: values.email,
        password: values.password,
        role: values.role,
        tenantId: values.tenantId,
      });
    } else {
      createUserMutate({
        firstName: values.firstname,
        lastName: values.lastname,
        email: values.email,
        password: values.password,
        role: values.role,
        tenantId: values.tenantId,
      });
    }
  };

  // delete user
  const onDelete = (id: string) => {
    deleteUserMutate(id, {
      onSuccess: () => {
        setIsModalOpen(false); // close modal on success
        setDeleteUserId(null); // reset selected id
      },
      onError: (error) => {
        console.error("Failed to delete user", error);
      },
    });
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
            if (filterName === "q") {
              debouncedSearch(filterValue);
            } else {
              setQueryParams({
                ...queryParams,
                [filterName]: filterValue,
                current: 1,
              });
            }
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
        <div className="error-spin-message">
          {/* NO need ant design table component has loading state */}
          {/* <div className="spin">{isFetching && <Spin />}</div> */}
          <div className="error">{isError && <div>{error.message}</div>}</div>
        </div>

        {users && (
          <Table<User>
            dataSource={users?.data || []}
            loading={isFetching}
            pagination={{
              total: users?.total,
              pageSize: queryParams.pageSize,
              current: queryParams.current,
              onChange: (page, pageSize) => {
                setQueryParams({
                  ...queryParams,
                  current: page,
                  pageSize: pageSize,
                });
              },
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total}`,
            }}
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
            <Column
              title="Tenant"
              dataIndex="tenant"
              key="tenant"
              render={(tenant: Tenant) => tenant?.name}
            />

            <Column
              title="Action"
              key="action"
              render={(_, record: User) => {
                return (
                  <Space size="middle">
                    {/* Edit */}
                    <Button
                      type="link"
                      onClick={() => {
                        setDrawerOpen(true);
                        setEditUser(record);
                      }}
                    >
                      <EditOutlined />
                    </Button>
                    {/* Delete */}
                    <Button
                      type="link"
                      onClick={() => {
                        setDeleteUserId(String(record.id!));
                        setIsModalOpen(true);
                      }}
                    >
                      <DeleteOutlined />
                    </Button>
                  </Space>
                );
              }}
            />
          </Table>
        )}
      </Space>

      {/* Drawer component */}
      <Drawer
        className="custom-drawer"
        title={!!editUser ? "Edit User" : "Create a new account"}
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
          <UserForm editMode={!!editUser} />
        </Form>
      </Drawer>

      {/* Modal for delete User */}
      <Modal
        title={
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <WarningFilled style={{ color: "#D89614", fontSize: 25 }} />
            Confirm Deletion
          </span>
        }
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={() => {
          if (deleteUserId) {
            onDelete(deleteUserId);
          }
        }}
        onCancel={() => setIsModalOpen(false)}
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>
    </>
  );
}

export default Users;
