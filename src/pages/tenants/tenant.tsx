import { Breadcrumb, Button, Drawer, Form, Modal, Space, Table } from "antd";
import { Link, Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTenant,
  deleteTenant,
  getTenants,
  updateTenant,
} from "../../http/api";
import { Tenant } from "../../types";
import Column from "antd/es/table/Column";
import { useAuthStore } from "../../store";
import { useEffect, useMemo, useState } from "react";
import TenantSearch from "./TenantSearch";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  WarningFilled,
} from "@ant-design/icons";
import TenantForm from "./forms/TenantForm";
import { debounce } from "lodash";

function Tenants() {
  const [form] = Form.useForm();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTenant, setEditTenant] = useState<Tenant | null>(null);
  const [deleteTenantId, setDeleteTenantId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [queryParams, setQueryParams] = useState({
    current: 1,
    pageSize: 5,
    q: "",
  });

  // its a react hook : give access to the react query cache manager
  // triggers specific refetch of the data , update data in cache manually , reads data from cache
  const queryClient = useQueryClient();

  // react queries
  const {
    data: tenants,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["tenants", queryParams],
    queryFn: async () => {
      const rawParams = {
        currentPage: String(queryParams.current),
        perPage: String(queryParams.pageSize),
        q: queryParams.q,
      };

      // Remove empty , null , undefined values
      const cleanedParams: Record<string, string> = {};
      Object.entries(rawParams).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
          cleanedParams[key] = String(value);
        }
      });

      const queryStringGenerate = new URLSearchParams(cleanedParams).toString();
      const res = await getTenants(queryStringGenerate);
      return res.data;
    },
  });

  const { mutate: createTenantMutate } = useMutation({
    mutationKey: ["createTenant"],
    mutationFn: async (tenant: Tenant) => {
      const res = await createTenant(tenant);
      return res.data.data;
    },
    // what will happen after success
    onSuccess: () => {
      // 1. reset form
      form.resetFields();
      // 2. close it
      onClose();
      // 3. invalidate cache of tenants list means call the tenants list api again
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });

  const { mutate: updateTenantMutate } = useMutation({
    mutationKey: ["updateTenant"],
    mutationFn: async (tenant: Tenant) => {
      const res = await updateTenant(String(tenant.id), tenant);
      return res.data.data;
    },
    onSuccess: () => {
      form.resetFields();
      onClose();
      // after update refetch
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: deleteTenantMutate } = useMutation({
    mutationKey: ["deleteTenant"],
    mutationFn: async (tenantId: string) => {
      const res = await deleteTenant(tenantId);
      return res.data.data;
    },
    onSuccess: () => {
      // after delete refetch
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });

  const onClose = () => {
    setDrawerOpen(false);
  };

  const onSubmitHandler = async () => {
    // check validations if validations success then next
    await form.validateFields();
    const values = await form.getFieldsValue();

    if (editTenant) {
      updateTenantMutate({
        id: editTenant.id,
        name: values.name,
        address: values.address,
      });
    } else {
      createTenantMutate({
        name: values.name,
        address: values.address,
      });
    }

    setDrawerOpen(false);
    form.resetFields();
    setEditTenant(null);
  };

  const onDelete = (id: string) => {
    deleteTenantMutate(id, {
      onSuccess: () => {
        setIsModalOpen(false); // close modal on success
        setDeleteTenantId(null); // reset selected id
      },
      onError: (error) => {
        console.error("Failed to delete tenant", error);
      },
    });
  };

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
    if (editTenant) {
      form.setFieldsValue({
        name: editTenant.name,
        address: editTenant.address,
      });
    }
  }, [editTenant, form]);

  //   General Rule of Thumb : Always declare hooks first (top of component body).Then perform conditional logic (return, conditional rendering, etc.).
  // protection
  const { user } = useAuthStore();
  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

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
        {isError && <div className="error-message">{error.message}</div>}

        {/* Tenant search component */}
        <TenantSearch
          onFilterChange={(filterName, filterValue) => {
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
            Add tenant
          </Button>
        </TenantSearch>

        {/* table rendering */}
        {tenants && (
          <Table<Tenant>
            dataSource={tenants?.data || []}
            pagination={{
              current: Number(queryParams.current),
              pageSize: Number(queryParams.pageSize),
              total: tenants.total,
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
            rowKey={(tenant) => tenant.id!}
            loading={isFetching}
          >
            <Column title="ID" dataIndex="id" key="id" />
            <Column title="Store Name" dataIndex="name" key="name" />
            <Column title="Address" dataIndex="address" key="address" />
            <Column
              title="Action"
              key="action"
              render={(_, record) => (
                <Space size="middle">
                  <Button
                    type="link"
                    onClick={() => {
                      setEditTenant(record as Tenant);
                      setDrawerOpen(true);
                    }}
                  >
                    <EditOutlined />
                  </Button>
                  <Button
                    type="link"
                    onClick={() => {
                      setDeleteTenantId(record.id);
                      setIsModalOpen(true);
                    }}
                  >
                    <DeleteOutlined />
                  </Button>
                </Space>
              )}
            />
          </Table>
        )}
      </Space>

      {/* Drawer component */}
      <Drawer
        title="Create a new tenant"
        width={720}
        onClose={onClose}
        open={drawerOpen}
        destroyOnClose={true}
        className="custom-drawer"
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={onSubmitHandler}>
              Submit
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <TenantForm />
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
          if (deleteTenantId) {
            onDelete(deleteTenantId);
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

export default Tenants;
