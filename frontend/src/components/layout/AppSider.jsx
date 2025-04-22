import { Layout, Card, Statistic, List, Typography, Tag, Empty } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { capitalize } from "../../utils";
import { useCrypto } from "../../context/crypto-context";
import styled from "styled-components";

const StyledSider = styled(Layout.Sider)`
  padding: 1rem;

  @media (max-width: 768px) {
    width: 100% !important;
    max-width: 100% !important;
  }
`;

const StyledCard = styled(Card)`
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    margin-bottom: 0.5rem;
  }
`;

export default function AppSider() {
  const { assets, crypto } = useCrypto();

  const getAssetDetails = (asset) => {
    const coin = crypto.find((c) => c.id === asset.id);
    if (!coin) return null;

    const currentPrice = coin.current_price;
    const totalAmount = asset.amount * currentPrice;
    const totalProfit = totalAmount - asset.amount * asset.price;
    const grow = asset.price < currentPrice;
    const growPercent = (
      ((currentPrice - asset.price) / asset.price) *
      100
    ).toFixed(2);

    return {
      ...asset,
      grow,
      growPercent,
      totalAmount,
      totalProfit,
      name: coin.name,
    };
  };

  const portfolioAssets = assets.map(getAssetDetails).filter(Boolean);

  if (!portfolioAssets.length) {
    return (
      <StyledSider width="25%">
        <Typography.Title level={4} style={{ marginBottom: 20 }}>
          Your Portfolio
        </Typography.Title>
        <Empty description="No assets in portfolio" />
      </StyledSider>
    );
  }

  return (
    <StyledSider width="25%">
      <Typography.Title level={4} style={{ marginBottom: 20 }}>
        Your Portfolio
      </Typography.Title>
      {portfolioAssets.map((asset) => (
        <StyledCard key={asset.id}>
          <Statistic
            title={capitalize(asset.name)}
            value={asset.totalAmount}
            precision={2}
            valueStyle={{ color: asset.grow ? "#3f8600" : "#cf1322" }}
            prefix={asset.grow ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            suffix="$"
          />

          <List
            size="small"
            dataSource={[
              {
                title: "Total Profit",
                value: asset.totalProfit,
                withTag: true,
              },
              { title: "Asset Amount", value: asset.amount, isPlain: true },
              { title: "Purchase Price", value: asset.price, isPrice: true },
            ]}
            renderItem={(item) => (
              <List.Item>
                <span>{item.title}</span>
                <span>
                  {item.withTag && (
                    <Tag color={asset.grow ? "green" : "red"}>
                      {asset.growPercent}%
                    </Tag>
                  )}
                  {item.isPlain && item.value}
                  {item.isPrice && `$${item.value.toFixed(2)}`}
                  {!item.isPlain && !item.isPrice && (
                    <Typography.Text type={asset.grow ? "success" : "danger"}>
                      ${item.value.toFixed(2)}
                    </Typography.Text>
                  )}
                </span>
              </List.Item>
            )}
          />
        </StyledCard>
      ))}
    </StyledSider>
  );
}
