import axios from 'axios';

// CoinGecko API has rate limits, so we need to handle them
const BASE_URL = 'https://api.coingecko.com/api/v3';

// Alternative proxy URLs in case the main API has CORS issues
const PROXY_URLS = [
  'https://api.coingecko.com/api/v3',
  'https://coingecko.p.rapidapi.com/api/v3'
];

const coinGeckoApi = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Add retry logic for API rate limiting and CORS issues
const fetchWithRetry = async (apiCall: () => Promise<any>, maxRetries = 3, delay = 1000) => {
  let retries = 0;
  let lastError: any = null;
  
  // Try with the main API first
  while (retries < maxRetries) {
    try {
      return await apiCall();
    } catch (error: any) {
      lastError = error;
      
      if (error.response && error.response.status === 429) {
        // Rate limited - wait and retry
        retries++;
        console.log(`Rate limited, retrying (${retries}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay * retries));
      } else if (error.message && (error.message.includes('CORS') || error.message.includes('Network Error'))) {
        // CORS issue - try a different base URL
        retries++;
        console.log(`CORS or network error, trying alternative endpoint (${retries}/${maxRetries})...`);
        
        // Switch to an alternative API endpoint
        if (retries < PROXY_URLS.length) {
          coinGeckoApi.defaults.baseURL = PROXY_URLS[retries];
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  
  throw lastError || new Error(`Failed after ${maxRetries} retries`);
};

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
}

export interface CoinMarketChart {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export const coinGeckoService = {
  // Get top coins by market cap
  getTopCoins: async (count: number = 20, currency: string = 'usd'): Promise<Coin[]> => {
    try {
      const response = await fetchWithRetry(() => 
        coinGeckoApi.get('/coins/markets', {
          params: {
            vs_currency: currency,
            order: 'market_cap_desc',
            per_page: count,
            page: 1,
            sparkline: false,
            price_change_percentage: '1h,24h,7d',
          },
        })
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching top coins:', error);
      return [];
    }
  },

  // Get historical market data for a specific coin
  getCoinMarketChart: async (
    coinId: string,
    days: number | 'max' = 7,
    currency: string = 'usd'
  ): Promise<CoinMarketChart | null> => {
    try {
      // Ensure days parameter is correctly formatted
      const daysParam = days === 'max' ? 'max' : days.toString();
      
      // Determine appropriate interval based on time range
      let interval = 'daily';
      if (days === 1) {
        interval = 'hourly';
      } else if (days === 7) {
        interval = 'hourly';
      } else if (days === 30 || days === 90) {
        interval = 'daily';
      } else if (days === 365 || days === 'max') {
        interval = 'weekly';
      }
      
      // Add cache busting parameter to avoid stale data
      const cacheBuster = new Date().getTime();
      
      // Try with direct API first
      try {
        const response = await fetchWithRetry(() => 
          coinGeckoApi.get(`/coins/${coinId}/market_chart`, {
            params: {
              vs_currency: currency,
              days: daysParam,
              interval: interval,
              _: cacheBuster, // Cache busting parameter
            },
          })
        );
        
        // Validate the response data
        if (response.data && Array.isArray(response.data.prices) && response.data.prices.length > 0) {
          return response.data;
        }
      } catch (directApiError) {
        console.error("Direct API call failed:", directApiError);
        // Continue to fallback methods
      }
      
      // Fallback: Try with a public CORS proxy
      try {
        const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(`${BASE_URL}/coins/${coinId}/market_chart?vs_currency=${currency}&days=${daysParam}&interval=${interval}`)}`;
        
        const proxyResponse = await axios.get(corsProxyUrl);
        
        if (proxyResponse.data && Array.isArray(proxyResponse.data.prices) && proxyResponse.data.prices.length > 0) {
          return proxyResponse.data;
        }
      } catch (proxyError) {
        console.error("CORS proxy fallback failed:", proxyError);
      }
      
      console.error('Invalid chart data format received or all methods failed');
      return null;
    } catch (error) {
      console.error(`Error fetching market chart for ${coinId}:`, error);
      return null;
    }
  },

  // Get detailed info for a specific coin
  getCoinDetails: async (coinId: string): Promise<any> => {
    try {
      const response = await fetchWithRetry(() => 
        coinGeckoApi.get(`/coins/${coinId}`, {
          params: {
            localization: false,
            tickers: false,
            market_data: true,
            community_data: false,
            developer_data: false,
          },
        })
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for ${coinId}:`, error);
      return null;
    }
  },

  // Search for coins by query
  searchCoins: async (query: string): Promise<any[]> => {
    try {
      const response = await fetchWithRetry(() => 
        coinGeckoApi.get('/search', {
          params: {
            query: query,
          },
        })
      );
      return response.data.coins || [];
    } catch (error) {
      console.error('Error searching coins:', error);
      return [];
    }
  },

  // Get global crypto market data
  getGlobalData: async (): Promise<any> => {
    try {
      const response = await fetchWithRetry(() => 
        coinGeckoApi.get('/global')
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching global data:', error);
      return null;
    }
  }
};
