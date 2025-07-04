import Title from "antd/es/typography/Title";
import { useAuthStore } from "../store";
import { Card, Tag } from "antd";
import {
  BarChartOutlined,
  CreditCardFilled,
  ShoppingFilled,
} from "@ant-design/icons";
import "./home.css";
import { OrderStatus } from "../constants/order-status";

const orderData = [
  {
    name: "Rajesh Kumar ",
    order: "3",
    amount: "₹ 1000",
    status: "Preparing",
    address: "Delhi, India",
  },
  {
    name: "Rohan Kumar ",
    order: "3",
    amount: "₹ 1000",
    status: "On the way",
    address: "Delhi, India",
  },
  {
    name: " Mahendra ",
    order: "3",
    amount: "₹ 1000",
    status: "Delivered",
    address: "Delhi, India",
  },
  {
    name: "Tushar ",
    order: "3",
    amount: "₹ 1000",
    status: "Delivered",
    address: "Delhi, India",
  },
];

function Home() {
  const { user } = useAuthStore();

  return (
    <>
      <Title level={4}>
        Welcome! {user?.firstName} {user?.lastName} 😊
      </Title>

      <div className="cards-container">
        <div className="sales-cards">
          <div className="data">
            <Card className="card">
              <div className="card-header">
                <div className="icon-wrapper icon-green">
                  <ShoppingFilled style={{ color: "#13C925", fontSize: 25 }} />
                </div>
                <Title level={4}>Total Orders</Title>
              </div>
              <div className="card-value">28</div>
            </Card>

            <Card className="card">
              <div className="card-header">
                <div className="icon-wrapper icon-blue">
                  <BarChartOutlined
                    style={{ color: "#14AAFF", fontSize: 25 }}
                  />
                </div>
                <Title level={4}>Total Sale</Title>
              </div>
              <div className="card-value">₹ 1,000</div>
            </Card>
          </div>

          <Card className="card analytics-card">
            <div className="card-header">
              <div className="icon-wrapper icon-blue">
                <BarChartOutlined style={{ color: "#14AAFF", fontSize: 25 }} />
              </div>
              <Title level={4}>Sales</Title>
            </div>
            <div className="card-value">--</div>
          </Card>
        </div>

        <Card className="order-card">
          <div className="card-header">
            <div className="icon-wrapper icon-orange">
              <CreditCardFilled style={{ color: "#F65F42", fontSize: 25 }} />
            </div>
            <Title level={4}>Recent Orders</Title>
          </div>

          <div className="recent-orders-card-value">
            <ul>
              {orderData.map((order, index) => (
                <li key={index}>
                  <div className="customer-details">
                    <div className="customer-name">{order.name}</div>
                    <div className="customer-address">{order.address}</div>
                  </div>
                  <div className="order-details">
                    <div className="order-amount">{order.amount}</div>
                    <div className="order-status">
                      <Tag
                        color={
                          OrderStatus.find((s) => s.name === order.status)
                            ?.color
                        }
                      >
                        {order.status}
                      </Tag>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer">
            <div className="see-all-orders">See all orders...</div>
          </div>
        </Card>
      </div>
    </>
  );
}

export default Home;
