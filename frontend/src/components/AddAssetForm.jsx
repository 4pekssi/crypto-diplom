import {
  Select,
  Space,
  Divider,
  Form,
  InputNumber,
  Button,
  DatePicker,
  Result,
  Spin,
  message,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { fetchCryptoData } from "../api/cryptoApi";
import { useCrypto } from "../context/crypto-context";
import CoinInfo from "./CoinInfo";

const validateMessages = {
  required: "${label} is required!",
  types: {
    number: "${label} is not a valid number",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

export default function AddAssetForm({ onClose }) {
  const [cryptoList, setCryptoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coin, setCoin] = useState(null);
  const [form] = Form.useForm();
  const [submitted, setSubmitted] = useState(false);
  const { addAsset } = useCrypto();

  useEffect(() => {
    const loadCryptoData = async () => {
      try {
        const data = await fetchCryptoData(1, 100);
        setCryptoList(data);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        message.error("Не удалось загрузить список криптовалют");
      } finally {
        setLoading(false);
      }
    };

    loadCryptoData();
  }, []);

  async function onFinish(values) {
    const newAsset = {
      id: coin.id,
      amount: values.amount,
      price: values.price,
      date: values.date?.$d ?? new Date(),
    };

    const success = await addAsset(newAsset);

    if (success) {
      setSubmitted(true);
      message.success("Актив успешно добавлен");
    } else {
      message.error("Не удалось добавить актив");
    }
  }

  function handleAmountChange(value) {
    const price = form.getFieldValue("price");
    form.setFieldsValue({
      total: +(value * price).toFixed(2),
    });
  }

  function handlePriceChange(value) {
    const amount = form.getFieldValue("amount");
    form.setFieldsValue({
      total: +(amount * value).toFixed(2),
    });
  }

  if (submitted) {
    return (
      <Result
        status="success"
        title="Новый актив добавлен"
        subTitle={`Добавлено ${form.getFieldValue("amount")} ${
          coin.name
        } по цене $${form.getFieldValue("price")}`}
        extra={[
          <Button type="primary" key="console" onClick={onClose}>
            Закрыть
          </Button>,
        ]}
      />
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!coin) {
    return (
      <Select
        showSearch
        onSelect={(v) => setCoin(cryptoList.find((c) => c.id === v))}
        placeholder="Выберите монету"
        style={{ width: "100%" }}
        options={cryptoList.map((coin) => ({
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
    );
  }

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: "100%" }}
      initialValues={{
        price: coin.current_price ? +coin.current_price.toFixed(2) : 0,
      }}
      onFinish={onFinish}
      validateMessages={validateMessages}
      autoComplete="off"
    >
      <CoinInfo coin={coin} />
      <Divider />

      <Form.Item
        label="Количество"
        name="amount"
        rules={[
          {
            required: true,
            type: "number",
            min: 0,
          },
        ]}
      >
        <InputNumber
          placeholder="Введите количество монет"
          onChange={handleAmountChange}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item label="Цена" name="price">
        <InputNumber onChange={handlePriceChange} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Дата и время" name="date">
        <DatePicker showTime style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Итого" name="total">
        <InputNumber disabled style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Добавить актив
        </Button>
      </Form.Item>
    </Form>
  );
}
