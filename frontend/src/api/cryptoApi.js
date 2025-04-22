const API_KEY = "CG-wZsiA35N8eBF3RBfFpdnrFwW";
const BASE_URL = "https://api.coingecko.com/api/v3";

export const fetchCryptoData = async (page = 1, perPage = 10) => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&x_cg_demo_api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Ошибка при получении данных");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    throw error;
  }
};

export const fetchCryptoDetails = async (id) => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false&x_cg_demo_api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Ошибка при получении деталей криптовалюты");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка при получении деталей:", error);
    throw error;
  }
};
