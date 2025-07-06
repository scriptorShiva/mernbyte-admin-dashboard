import { Card, Select } from "antd";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./user.css";

interface UserFilterProps {
  children?: React.ReactNode;
  onFilterChange: (filterName: string, filterValue: string) => void;
}

const UserFilter = ({ onFilterChange, children }: UserFilterProps) => {
  return (
    <>
      <Card>
        <div className="user-filter-card-container">
          <div className="left-section">
            <div className="search">
              <Input
                addonBefore={<SearchOutlined />}
                placeholder="Search..."
                size="large"
                onChange={(e) => onFilterChange("q", e.target.value)}
                allowClear
              />
            </div>
            <div className="status-filter">
              <Select
                // defaultValue="lucy"
                style={{ width: 120 }}
                allowClear
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                  { value: "banned", label: "Banned" },
                ]}
                placeholder="Select "
                size="large"
                onChange={(e) => onFilterChange("status", e)}
              />
            </div>
            <div className="role-filter">
              <Select
                //defaultValue="lucy"
                style={{ width: 120 }}
                allowClear
                options={[
                  { value: "manager", label: "Manager" },
                  { value: "admin", label: "Admin" },
                  { value: "customer", label: "Customer" },
                ]}
                placeholder="Select"
                size="large"
                onChange={(value) => onFilterChange("role", value || "")}
              />
            </div>
          </div>
          <div className="right-section">
            <div className="create-user">{children}</div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default UserFilter;
