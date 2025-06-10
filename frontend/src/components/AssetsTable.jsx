import {
  Table,
  Typography,
  Button,
  Space,
  Modal,
  InputNumber,
  message,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useCrypto } from "../context/crypto-context";
import { useState } from "react";

export default function AssetsTable() {
  const { assets, removeAsset, updateAsset } = useCrypto();
  const [editingAsset, setEditingAsset] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newAmount, setNewAmount] = useState(0);

  const columns = [
    {
      title: "",
      dataIndex: "image",
      key: "image",
      width: 50,
      render: (_, record) => {
        const iconUrl = record.icon || record.image;
        return iconUrl ? (
          <img
            src={iconUrl}
            alt={record.name}
            style={{ width: 24, height: 24, objectFit: "contain" }}
          />
        ) : null;
      },
    },
    {
      title: "Название",
      dataIndex: "name",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["descend", "ascend"],
      showSorterTooltip: {
        title: "Нажмите для отмены сортировки",
      },
    },
    {
      title: "Цена покупки, $",
      dataIndex: "price",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.price - b.price,
      render: (value) => value.toFixed(2),
      sortDirections: ["descend", "ascend"],
      showSorterTooltip: {
        title: "Нажмите для отмены сортировки",
      },
    },
    {
      title: "Текущая цена, $",
      dataIndex: "currentPrice",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.currentPrice - b.currentPrice,
      render: (value) => value.toFixed(2),
      sortDirections: ["descend", "ascend"],
      showSorterTooltip: {
        title: "Нажмите для отмены сортировки",
      },
    },
    {
      title: "Количество",
      dataIndex: "amount",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.amount - b.amount,
      render: (value) => value.toFixed(4),
      sortDirections: ["descend", "ascend"],
      showSorterTooltip: {
        title: "Нажмите для отмены сортировки",
      },
    },
    {
      title: "Общая сумма, $",
      dataIndex: "totalAmount",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (value) => value.toFixed(2),
      sortDirections: ["descend", "ascend"],
      showSorterTooltip: {
        title: "Нажмите для отмены сортировки",
      },
    },
    {
      title: "Прибыль/Убыток",
      dataIndex: "totalProfit",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.totalProfit - b.totalProfit,
      render: (value, record) => (
        <Typography.Text type={record.grow ? "success" : "danger"}>
          {value.toFixed(2)}$ ({record.growPercent}%)
        </Typography.Text>
      ),
      sortDirections: ["descend", "ascend"],
      showSorterTooltip: {
        title: "Нажмите для отмены сортировки",
      },
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setNewAmount(asset.amount);
    setEditModalVisible(true);
  };

  const handleDelete = (asset) => {
    Modal.confirm({
      title: "Подтверждение удаления",
      content: `Вы уверены, что хотите удалить ${asset.name} из портфеля?`,
      okText: "Да",
      cancelText: "Нет",
      onOk: () => {
        const success = removeAsset(asset.id);
        if (success) {
          message.success("Актив успешно удален");
        } else {
          message.error("Не удалось удалить актив");
        }
      },
    });
  };

  const handleEditSubmit = () => {
    if (newAmount <= 0) {
      message.error("Количество должно быть больше 0");
      return;
    }

    const success = updateAsset(editingAsset.id, newAmount);
    if (success) {
      message.success("Количество успешно обновлено");
      setEditModalVisible(false);
    } else {
      message.error("Не удалось обновить количество");
    }
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={assets}
        rowKey="id"
        pagination={false}
      />

      <Modal
        title="Изменить количество"
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setEditModalVisible(false)}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Typography.Text>
            Текущее количество: {editingAsset?.amount}
          </Typography.Text>
          <InputNumber
            style={{ width: "100%" }}
            value={newAmount}
            onChange={setNewAmount}
            min={0}
            step={0.00000001}
            precision={8}
            placeholder="Введите новое количество"
          />
        </Space>
      </Modal>
    </>
  );
}
