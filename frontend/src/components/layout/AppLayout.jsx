import { Layout, Spin } from "antd";
import AppHeader from "./AppHeader";
import AppSider from "./AppSider";
import AppContent from "./AppContent";
import CoinChart from "../CoinChart";
import { useContext, useState } from "react";
import CryptoContext from "../../context/crypto-context";


export default function AppLayout() {
  const [tab, setTab] = useState("CoinChart");
  const { loading } = useContext(CryptoContext);

  if (loading) {
    return (
      <div className="fullscreen-spinner">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout>
      <AppHeader activeTab={tab} onTabChange={setTab} />
      <Layout>
        <AppSider />
        {tab === "CoinChart" && <AppContent />}
        {tab === "main" && <CoinChart />}
      </Layout>
    </Layout>
  );
}
