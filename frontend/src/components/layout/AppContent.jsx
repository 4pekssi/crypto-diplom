import { Layout, Typography, Space } from "antd";
import { useCrypto } from "../../context/crypto-context";
import PortfolioChart from "../PortfolioChart";
import AssetsTable from "../AssetsTable";
import styled from "styled-components";
import "../../index.css";

const PortfolioHeader = styled(Space)`
  margin-bottom: 20px;
`;

const CoinIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
  filter: brightness(0) invert(1);
`;

export default function AppContent() {
  const { assets, crypto } = useCrypto();

  const cryptoPriceMap = crypto.reduce((acc, c) => {
    acc[c.id] = c.current_price;
    return acc;
  }, {});

  const totalPortfolioValue = assets.reduce((total, asset) => {
    const price = cryptoPriceMap[asset.id] || 0;
    return total + asset.amount * price;
  }, 0);

  return (
    <Layout.Content className="contentStyle">
      <PortfolioHeader>
        <Typography.Title
          level={3}
          style={{ textAlign: "left", color: "#fff", margin: 0 }}
        >
          Портфель:{" "}
          {totalPortfolioValue.toLocaleString("ru-RU", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography.Title>
        <Space>
          {assets.map((asset) => {
            const coinData = crypto.find((c) => c.id === asset.id);
            return coinData ? (
              <CoinIcon
                key={asset.id}
                src={coinData.icon}
                alt={coinData.name}
                title={coinData.name}
              />
            ) : null;
          })}
        </Space>
      </PortfolioHeader>
      <PortfolioChart />
      <AssetsTable />
    </Layout.Content>
  );
}
