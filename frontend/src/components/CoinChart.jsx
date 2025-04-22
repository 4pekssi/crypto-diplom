import React, { useState, useEffect, useCallback } from "react";
import { Table, Input, Card, Spin, Alert } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { fetchCryptoData } from "../api/cryptoApi";
import styled from "styled-components";

// Стилизованные компоненты для адаптивности
const StyledContainer = styled.div`
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 8px;
  }
`;

const StyledSearch = styled(Input)`
  margin-bottom: 16px;
  width: 200px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledCard = styled(Card)`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    margin: 0 -8px;
  }
`;

// Конфигурация колонок таблицы
const getColumns = (sortedInfo) => [
  {
    title: "",
    dataIndex: "image",
    key: "image",
    width: 50,
    render: (image) => (
      <img src={image} alt="Icon" style={{ width: "24px", height: "24px" }} />
    ),
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
    ellipsis: true,
    responsive: ["md"],
  },
  {
    title: "Symbol",
    dataIndex: "symbol",
    key: "symbol",
    render: (symbol) => symbol.toUpperCase(),
    responsive: ["xs"],
  },
  {
    title: "Price",
    dataIndex: "current_price",
    key: "current_price",
    sorter: (a, b) => a.current_price - b.current_price,
    sortOrder:
      sortedInfo.columnKey === "current_price" ? sortedInfo.order : null,
    render: (price) => `$${price.toFixed(2)}`,
  },
  {
    title: "24h Change",
    dataIndex: "price_change_percentage_24h",
    key: "price_change_percentage_24h",
    sorter: (a, b) =>
      (a.price_change_percentage_24h ?? 0) -
      (b.price_change_percentage_24h ?? 0),
    sortOrder:
      sortedInfo.columnKey === "price_change_percentage_24h"
        ? sortedInfo.order
        : null,
    render: (priceChange) => (
      <span style={{ color: priceChange >= 0 ? "green" : "red" }}>
        {priceChange != null ? `${priceChange.toFixed(2)}%` : "-"}
      </span>
    ),
    responsive: ["md"],
  },
  {
    title: "Market Cap",
    dataIndex: "market_cap",
    key: "market_cap",
    sorter: (a, b) => a.market_cap - b.market_cap,
    sortOrder: sortedInfo.columnKey === "market_cap" ? sortedInfo.order : null,
    render: (value) => `$${(value / 1000000000).toFixed(2)}B`,
    responsive: ["lg"],
  },
];

// Компонент поиска
const SearchBar = ({ searchText, onSearchChange }) => (
  <StyledSearch
    placeholder="Search by name"
    value={searchText}
    onChange={onSearchChange}
    prefix={<SearchOutlined />}
  />
);

// Основной компонент таблицы
const CryptoTable = ({ data, loading, pagination, onTableChange }) => {
  const [sortedInfo, setSortedInfo] = useState({});

  const handleTableChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
    onTableChange(pagination);
  };

  return (
    <StyledCard>
      <Table
        columns={getColumns(sortedInfo)}
        dataSource={data}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          responsive: true,
        }}
        loading={loading}
        rowKey="id"
        onChange={handleTableChange}
        scroll={{ x: true }}
      />
    </StyledCard>
  );
};

// Основной компонент приложения
const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchData = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchCryptoData(page, pageSize);
      setData(result);
      setFilteredData(result);
      setPagination((prev) => ({
        ...prev,
        total: 200,
      }));
    } catch (error) {
      setError("Ошибка при загрузке данных. Пожалуйста, попробуйте позже.");
      console.error("Ошибка при получении данных:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [fetchData, pagination.current, pagination.pageSize]);

  useEffect(() => {
    const filtered = data.filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchText.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, data]);

  const handleSearchChange = (e) => setSearchText(e.target.value);
  const handleTableChange = (newPagination) => setPagination(newPagination);

  return (
    <StyledContainer>
      <SearchBar searchText={searchText} onSearchChange={handleSearchChange} />
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <CryptoTable
        data={filteredData}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
      />
    </StyledContainer>
  );
};

export default function CoinChart() {
  return <App />;
}
