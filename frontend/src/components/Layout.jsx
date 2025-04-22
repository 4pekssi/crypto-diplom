import { Layout, Spin } from "antd";
import AppHeader from "./AppHeader";
import AppSider from "./AppSider";
import AppContent from "./AppContent";
import { useCrypto } from "../context/crypto-context";
import styled from "styled-components";

const { Header, Sider, Content } = Layout;

const StyledLayout = styled(Layout)`
  height: 100vh;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

const StyledHeader = styled(Header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;

  @media (max-width: 768px) {
    position: static;
    padding: 0 16px;
  }
`;

const StyledContentLayout = styled(Layout)`
  margin-top: 64px;

  @media (max-width: 768px) {
    margin-top: 0;
  }
`;

const StyledSider = styled(Sider)`
  overflow: auto;
  height: calc(100vh - 64px);
  position: fixed;
  left: 0;
  top: 64px;
  bottom: 0;

  @media (max-width: 768px) {
    position: static;
    height: auto;
    width: 100% !important;
    max-width: 100% !important;
  }
`;

const StyledContent = styled(Content)`
  margin: 24px 16px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
  overflow: initial;
  margin-left: ${(props) => props.$siderWidth}px;

  @media (max-width: 768px) {
    margin: 16px;
    padding: 16px;
    margin-left: 0;
  }
`;

export default function AppLayout() {
  const { loading } = useCrypto();
  const siderWidth = 200;

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <StyledLayout>
      <StyledHeader>
        <AppHeader />
      </StyledHeader>
      <StyledContentLayout>
        <StyledSider width={siderWidth} theme="light">
          <AppSider />
        </StyledSider>
        <StyledContent $siderWidth={siderWidth}>
          <AppContent />
        </StyledContent>
      </StyledContentLayout>
    </StyledLayout>
  );
}
