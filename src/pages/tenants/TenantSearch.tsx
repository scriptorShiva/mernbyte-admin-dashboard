import { Card } from "antd";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./tenant.css";

interface UserFilterProps {
  children?: React.ReactNode;
  onFilterChange: (filterName: string, filterValue: string) => void;
}

const TenantSearch = ({ onFilterChange, children }: UserFilterProps) => {
  return (
    <>
      <Card>
        <div className="tenant-filter-card-container">
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
          </div>
          <div className="right-section">
            <div className="create-tenant">{children}</div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default TenantSearch;
