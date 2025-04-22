import { Button } from "antd";

export default function TabsSection({ active, onChange }) {
  return (
    <section>
      <Button type={active === 'main' ? "primary" : "default"} onClick={() => onChange('main')} style={{ marginRight: 10 }}>
        Популярное
      </Button>
      <Button type={active === 'CoinChart' ? "primary" : "default"} onClick={() => onChange('CoinChart')}>
        Портфель
      </Button>
    </section>
  );
}
