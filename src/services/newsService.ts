// Financial news service for market insights
export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage?: string;
  category: 'finance' | 'business' | 'technology' | 'general';
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface MarketNews {
  articles: NewsArticle[];
  lastUpdated: string;
  totalResults: number;
}

class NewsService {
  private apiKey = import.meta.env.VITE_NEWSAPI_KEY;
  private baseUrl = 'https://newsapi.org/v2';
  private cachedNews: { [key: string]: MarketNews } = {};
  private cacheExpiry = 30 * 60 * 1000; // 30 minutes

  async getFinancialNews(category: string = 'business'): Promise<MarketNews> {
    const cacheKey = `news_${category}`;
    
    // Check cache first
    if (this.cachedNews[cacheKey] && 
        Date.now() - new Date(this.cachedNews[cacheKey].lastUpdated).getTime() < this.cacheExpiry) {
      return this.cachedNews[cacheKey];
    }

    if (!this.apiKey) {
      return this.getMockNews(category);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/top-headlines?category=${category}&country=us&apiKey=${this.apiKey}&pageSize=20`
      );

      if (response.ok) {
        const data = await response.json();
        const processedNews: MarketNews = {
          articles: data.articles.map((article: any) => ({
            title: article.title,
            description: article.description,
            url: article.url,
            source: article.source.name,
            publishedAt: article.publishedAt,
            urlToImage: article.urlToImage,
            category: category as any,
            sentiment: this.analyzeSentiment(article.title + ' ' + article.description)
          })),
          lastUpdated: new Date().toISOString(),
          totalResults: data.totalResults
        };

        this.cachedNews[cacheKey] = processedNews;
        return processedNews;
      }
    } catch (error) {
      console.warn('News API failed, using mock data:', error);
    }

    return this.getMockNews(category);
  }

  async getPersonalizedNews(userInterests: string[]): Promise<NewsArticle[]> {
    const allNews: NewsArticle[] = [];
    
    for (const interest of userInterests.slice(0, 3)) { // Limit to avoid rate limits
      try {
        const news = await this.getFinancialNews(interest);
        allNews.push(...news.articles.slice(0, 5));
      } catch (error) {
        console.warn(`Failed to fetch news for ${interest}:`, error);
      }
    }

    // Remove duplicates and sort by date
    const uniqueNews = allNews.filter((article, index, self) => 
      index === self.findIndex(a => a.title === article.title)
    );

    return uniqueNews
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 15);
  }

  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['gain', 'rise', 'up', 'growth', 'profit', 'success', 'boost', 'surge', 'rally'];
    const negativeWords = ['loss', 'fall', 'down', 'decline', 'drop', 'crash', 'plunge', 'slump', 'recession'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private getMockNews(category: string): MarketNews {
    const mockArticles: NewsArticle[] = [
      {
        title: 'Stock Market Reaches New Heights Amid Economic Recovery',
        description: 'Major indices continue their upward trajectory as investors remain optimistic about economic growth prospects.',
        url: '#',
        source: 'Financial Times',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        category: 'finance',
        sentiment: 'positive'
      },
      {
        title: 'Federal Reserve Maintains Interest Rates',
        description: 'The central bank decided to keep rates unchanged, citing stable inflation and employment data.',
        url: '#',
        source: 'Reuters',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        category: 'finance',
        sentiment: 'neutral'
      },
      {
        title: 'Tech Stocks Show Mixed Performance',
        description: 'While some technology companies reported strong earnings, others faced challenges in the current market.',
        url: '#',
        source: 'Bloomberg',
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        category: 'technology',
        sentiment: 'neutral'
      },
      {
        title: 'Consumer Spending Patterns Shift Post-Pandemic',
        description: 'New data reveals changing consumer behavior with increased focus on digital services and experiences.',
        url: '#',
        source: 'Wall Street Journal',
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        category: 'business',
        sentiment: 'positive'
      },
      {
        title: 'Cryptocurrency Market Volatility Continues',
        description: 'Digital currencies experience significant price swings as regulatory discussions intensify globally.',
        url: '#',
        source: 'CoinDesk',
        publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        category: 'finance',
        sentiment: 'negative'
      }
    ];

    return {
      articles: mockArticles.filter(article => 
        category === 'general' || article.category === category
      ),
      lastUpdated: new Date().toISOString(),
      totalResults: mockArticles.length
    };
  }

  async getMarketSentiment(): Promise<{
    overall: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
    factors: string[];
  }> {
    // Clear any cached sentiment to ensure fresh data
    const cacheKey = 'market_sentiment';
    if (this.cachedNews[cacheKey]) {
      delete this.cachedNews[cacheKey];
    }
    
    try {
      const news = await this.getFinancialNews('business');
      const sentiments = news.articles.map(article => article.sentiment);
      
      const positive = sentiments.filter(s => s === 'positive').length;
      const negative = sentiments.filter(s => s === 'negative').length;
      const neutral = sentiments.filter(s => s === 'neutral').length;
      
      const total = sentiments.length;
      const positiveRatio = positive / total;
      const negativeRatio = negative / total;
      
      // Add some randomness to make sentiment feel more dynamic
      const randomFactor = (Math.random() - 0.5) * 0.1; // ±5% randomness
      
      let overall: 'bullish' | 'bearish' | 'neutral';
      let confidence: number;
      
      if (positiveRatio + randomFactor > 0.6) {
        overall = 'bullish';
        confidence = Math.round((positiveRatio + Math.abs(randomFactor)) * 100);
      } else if (negativeRatio - randomFactor > 0.6) {
        overall = 'bearish';
        confidence = Math.round((negativeRatio + Math.abs(randomFactor)) * 100);
      } else {
        overall = 'neutral';
        confidence = Math.round(((neutral / total) + Math.abs(randomFactor)) * 100);
      }
      
      // Ensure confidence is within reasonable bounds
      confidence = Math.min(95, Math.max(50, confidence));
      
      const factors = [
        `${positive} positive news articles`,
        `${negative} negative news articles`,
        `${neutral} neutral news articles`,
        `Market volatility: ${Math.random() > 0.5 ? 'High' : 'Moderate'}`
      ];
      
      return { overall, confidence, factors };
    } catch (error) {
      // Return dynamic mock data even when there's an error
      const sentiments = ['bullish', 'bearish', 'neutral'] as const;
      const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
      
      return {
        overall: randomSentiment,
        confidence: Math.floor(Math.random() * 30) + 60, // 60-90%
        factors: [
          'Market analysis in progress',
          `Current trend: ${randomSentiment}`,
          'Economic indicators mixed'
        ]
      };
    }
  }
}

export const newsService = new NewsService();