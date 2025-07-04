import { Button, Card, Select } from "antd";
import { Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import "./user.css";

interface UserFilterProps {
  onFilterChange: (filterName: string, filterValue: string) => void;
}

const UserFilter = ({ onFilterChange }: UserFilterProps) => {
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
                onChange={(e) => onFilterChange("search", e.target.value)}
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
                options={[{ value: "lucy", label: "Lucy" }]}
                placeholder="Select"
                size="large"
                onChange={(e) => onFilterChange("role", e)}
              />
            </div>
          </div>
          <div className="right-section">
            <div className="create-user">
              <Button type="primary" icon={<PlusOutlined />} size={"large"}>
                Create users
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default UserFilter;
