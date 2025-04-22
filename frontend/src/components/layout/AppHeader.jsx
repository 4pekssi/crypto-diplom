import React, { useEffect, useState } from "react";
import { Button, Layout, Select, Space, Modal, Drawer } from "antd";
import { useCrypto } from "../../context/crypto-context";
import CoinInfoModal from "../CoinInfoModal";
import AddAssetForm from "../AddAssetForm";
import TabsSection from "../TabsSection";
import styled from "styled-components";

const headerStyle = {
  width: "100%",
  textAlign: "center",
  height: "60px",
  padding: "1rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const StyledSelect = styled(Select)`
  .ant-select-selection-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export default function AppHeader({ activeTab, onTabChange }) {
  const [select, setSelect] = useState(false);
  const [coin, setCoin] = useState(null);
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const { crypto } = useCrypto();

  useEffect(() => {
    const keypress = (event) => {
      if (event.key === "/") {
        setSelect((prev) => !prev);
      }
    };
    document.addEventListener("keypress", keypress);
    return () => document.removeEventListener("keypress", keypress);
  }, []);

  function handleSelect(value) {
    setCoin(crypto.find((c) => c.id === value));
    setModal(true);
  }

  return (
    <Layout.Header style={headerStyle}>
      <StyledSelect
        open={select}
        onSelect={handleSelect}
        onClick={() => setSelect((prev) => !prev)}
        placeholder="Нажмите / для поиска"
        style={{ width: "250px" }}
        options={crypto.map((coin) => ({
          label: coin.name,
          value: coin.id,
          icon: coin.icon || coin.image,
        }))}
        optionRender={(option) => (
          <Space>
            <img
              style={{ width: 20 }}
              src={option.data.icon}
              alt={option.data.label}
            />
            {option.data.label}
          </Space>
        )}
        filterOption={(input, option) =>
          option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      />

      <TabsSection active={activeTab} onChange={onTabChange} />

      <Button type="primary" onClick={() => setDrawer(true)}>
        Добавить актив
      </Button>

      <Modal
        open={modal}
        onCancel={() => {
          setModal(false);
          setCoin(null);
        }}
        destroyOnClose
        maskClosable={true}
        footer={null}
      >
        <CoinInfoModal
          coin={coin}
          isOpen={modal}
          onClose={() => {
            setModal(false);
            setCoin(null);
          }}
        />
      </Modal>

      <Drawer
        width={600}
        title="Добавить актив"
        onClose={() => setDrawer(false)}
        open={drawer}
        destroyOnClose
      >
        <AddAssetForm onClose={() => setDrawer(false)} />
      </Drawer>
    </Layout.Header>
  );
}
