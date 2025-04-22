import React from "react";
import { Card } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import styled from "styled-components";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StyledCard = styled(Card)`
  margin-bottom: 16px;

  @media (max-width: 768px) {
    margin: 0 -8px 16px;
  }
`;

const PortfolioChart = ({ data }) => {
  if (!data || !data.length) {
    return null;
  }

  const chartData = {
    labels: data.map((item) => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: "Стоимость портфеля",
        data: data.map((item) => item.price * item.amount),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "История стоимости портфеля",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "$" + value.toLocaleString();
          },
        },
      },
    },
  };

  return (
    <StyledCard>
      <Line options={options} data={chartData} />
    </StyledCard>
  );
};

export default PortfolioChart;
