import { createContext, useContext, useEffect, useState } from "react";
import { fetchCryptoData } from "../api/cryptoApi";

import { percentDifference } from "../utils";

const CryptoContext = createContext({
  assets: [],
  crypto: [],
  loading: false,
  error: null,
});

export function CryptoContextProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [crypto, setCrypto] = useState([]);
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState(null);

  function mapAssets(assets, result) {
    return assets
      .map((asset) => {
        const coin = result.find((c) => c.id === asset.id);
        if (!coin) return null;
        return {
          grow: asset.price < coin.current_price,
          growPercent: percentDifference(asset.price, coin.current_price),
          totalAmount: asset.amount * coin.current_price,
          totalProfit:
            asset.amount * coin.current_price - asset.amount * asset.price,
          ...asset,
          name: coin.name,
          currentPrice: coin.current_price,
        };
      })
      .filter(Boolean);
  }

  useEffect(() => {
    async function preload() {
      try {
        setLoading(true);
        const cryptoData = await fetchCryptoData(1, 100);
        setCrypto(cryptoData);

        const savedAssets = localStorage.getItem("assets");
        if (savedAssets) {
          const parsedAssets = JSON.parse(savedAssets);
          setAssets(parsedAssets);
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        setError("Не удалось загрузить данные. Пожалуйста, попробуйте позже.");
      } finally {
        setLoading(false);
      }
    }
    preload();
  }, []);

  // Периодическое обновление данных
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const cryptoData = await fetchCryptoData(1, 100);
        setCrypto(cryptoData);
      } catch (error) {
        console.error("Ошибка при обновлении данных:", error);
        setError("Ошибка при обновлении данных");
      }
    }, 30000); // Обновление каждые 30 секунд

    return () => clearInterval(interval);
  }, []);

  function addAsset(newAsset) {
    try {
      const coin = crypto.find((c) => c.id === newAsset.id);
      if (!coin) {
        throw new Error("Монета не найдена");
      }

      const assetData = {
        id: newAsset.id,
        amount: newAsset.amount,
        price: newAsset.price || coin.current_price,
        date: new Date().toISOString(),
      };

      setAssets((prev) => {
        const updatedAssets = [...prev, assetData];
        localStorage.setItem("assets", JSON.stringify(updatedAssets));
        return updatedAssets;
      });

      return true;
    } catch (error) {
      console.error("Ошибка при добавлении актива:", error);
      setError("Не удалось добавить актив");
      return false;
    }
  }

  function updateAsset(id, newAmount) {
    try {
      setAssets((prev) => {
        const updatedAssets = prev.map((asset) => {
          if (asset.id === id) {
            return { ...asset, amount: newAmount };
          }
          return asset;
        });
        localStorage.setItem("assets", JSON.stringify(updatedAssets));
        return updatedAssets;
      });
      return true;
    } catch (error) {
      console.error("Ошибка при обновлении актива:", error);
      setError("Не удалось обновить актив");
      return false;
    }
  }

  function removeAsset(id) {
    try {
      setAssets((prev) => {
        const updatedAssets = prev.filter((asset) => asset.id !== id);
        localStorage.setItem("assets", JSON.stringify(updatedAssets));
        return updatedAssets;
      });
      return true;
    } catch (error) {
      console.error("Ошибка при удалении актива:", error);
      setError("Не удалось удалить актив");
      return false;
    }
  }

  const value = {
    loading,
    crypto,
    assets: mapAssets(assets, crypto),
    error,
    addAsset,
    updateAsset,
    removeAsset,
  };

  return (
    <CryptoContext.Provider value={value}>{children}</CryptoContext.Provider>
  );
}

export default CryptoContext;

export function useCrypto() {
  return useContext(CryptoContext);
}
