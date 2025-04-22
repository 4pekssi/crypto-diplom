import { Flex, Typography } from "antd";
import styled from "styled-components";

const { Title, Text } = Typography;

const StyledFlex = styled(Flex)`
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const CoinImage = styled.img`
  width: 40px;
  height: 40px;

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export default function CoinInfo({ coin }) {
  if (!coin) return null;

  return (
    <StyledFlex align="center">
      <CoinImage src={coin.image} alt={coin.name || "Cryptocurrency"} />
      <InfoContainer>
        <Title level={2} style={{ margin: 0 }}>
          {coin.name || "Unknown"}
        </Title>
        <Text type="secondary">
          {coin.symbol?.toUpperCase() || "???"} | Rank: #
          {coin.market_cap_rank || "N/A"}
        </Text>
        <Text>Current Price: ${coin.current_price?.toFixed(2) || "N/A"}</Text>
        <Text
          type={coin.price_change_percentage_24h >= 0 ? "success" : "danger"}
        >
          24h Change: {coin.price_change_percentage_24h?.toFixed(2) || 0}%
        </Text>
      </InfoContainer>
    </StyledFlex>
  );
}
