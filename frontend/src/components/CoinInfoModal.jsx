import { Typography, Flex } from "antd";
import styled from "styled-components";

const { Title, Text } = Typography;

const CoinImage = styled.img`
  width: 60px;
  height: 60px;
  margin-right: 20px;
`;

const DetailRow = styled(Flex)`
  margin: 10px 0;
  justify-content: space-between;
`;

const formatNumber = (num) => {
  if (num === null || num === undefined) return "N/A";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
};

const formatPercent = (num) => {
  if (num === null || num === undefined) return "N/A";
  return `${num.toFixed(2)}%`;
};

export default function CoinInfoModal({ coin }) {
  if (!coin) return null;

  return (
    <>
      <Flex align="center" style={{ marginBottom: 20 }}>
        <CoinImage
          src={coin.icon || coin.image}
          alt={coin.name || "Криптовалюта"}
        />
        <div>
          <Title level={2} style={{ margin: 0 }}>
            {coin.name || "Неизвестно"}
          </Title>
          <Text type="secondary">
            {coin.symbol?.toUpperCase() || "???"} | Ранг #
            {coin.market_cap_rank || "N/A"}
          </Text>
        </div>
      </Flex>

      <DetailRow>
        <Text>Текущая цена:</Text>
        <Text strong>{formatNumber(coin.current_price)}</Text>
      </DetailRow>

      <DetailRow>
        <Text>Рыночная капитализация:</Text>
        <Text strong>{formatNumber(coin.market_cap)}</Text>
      </DetailRow>

      <DetailRow>
        <Text>Объем торгов за 24ч:</Text>
        <Text strong>{formatNumber(coin.total_volume)}</Text>
      </DetailRow>

      <DetailRow>
        <Text>Максимум за 24ч:</Text>
        <Text strong>{formatNumber(coin.high_24h)}</Text>
      </DetailRow>

      <DetailRow>
        <Text>Минимум за 24ч:</Text>
        <Text strong>{formatNumber(coin.low_24h)}</Text>
      </DetailRow>

      <DetailRow>
        <Text>Изменение цены за 24ч:</Text>
        <Text
          strong
          type={coin.price_change_percentage_24h >= 0 ? "success" : "danger"}
        >
          {formatPercent(coin.price_change_percentage_24h)}
        </Text>
      </DetailRow>

      <DetailRow>
        <Text>В обращении:</Text>
        <Text strong>
          {coin.circulating_supply?.toLocaleString("ru-RU") || "N/A"}{" "}
          {coin.symbol?.toUpperCase()}
        </Text>
      </DetailRow>
    </>
  );
}

{
}
