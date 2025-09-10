import { SearchOutlined } from "@ant-design/icons";
import { Card, Input, Select, Switch } from "antd";
import "./product.css";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getTenants } from "../../http/api";
import { Category, Tenant } from "../../types";
import React from "react";

type Filters = {
  q: string;
  categoryId: string;
  tenantId: string;
  isPublish: string;
  page: number;
  limit: number;
};

interface ProductFilterProps {
  children: React.ReactNode;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const ProductFilter = ({
  children,
  filters,
  setFilters,
}: ProductFilterProps) => {
  //const queryClient = useQueryClient();

  // use queries
  const { data: stores } = useQuery({
    queryKey: ["stores"],
    queryFn: () => {
      return getTenants(`currentPage=1&perPage=100`);
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return getCategories();
    },
  });

  return (
    <Card>
      <div className="product-filter-card">
        <Input
          addonBefore={<SearchOutlined />}
          style={{ width: 300 }}
          placeholder="Search by products name..."
          value={filters.q}
          onChange={(e) => {
            setFilters((prev) => ({ ...prev, q: e.target.value }));
          }}
        />

        {/* categories */}
        <Select
          // defaultValue="Category A"
          style={{ width: 160 }}
          allowClear={true}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, categoryId: value }))
          }
          options={categories?.data.map((category: Category) => {
            return {
              value: category._id,
              label: category.name,
            };
          })}
          placeholder="Category"
        />

        <Select
          // defaultValue="Tenant A"
          style={{ width: 160 }}
          allowClear={true}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, tenantId: value }))
          }
          options={stores?.data.data.map((store: Tenant) => {
            return {
              value: store.id,
              label: store.name,
            };
          })}
          placeholder="Store"
        />

        <div className="switch-container">
          <Switch
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, isPublish: String(value) }))
            }
          />
          <span>Show only published</span>
        </div>

        <div className="right-section">{children}</div>
      </div>
    </Card>
  );
};

export default ProductFilter;
