import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('bitcoin'); // Default search query
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=15f34dc0e8e543a29ec533a16fa10b1b`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        setNews(data.articles);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Failed to load news.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    const newQuery = e.target.searchInput.value.trim();
    if (newQuery) setSearchQuery(newQuery);
  };

  return (
    <>
    <div className="news-widget" style={{marginTop:"40px"}}>
      <h3 className="widget-title">Latest News</h3>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          name="searchInput"
          placeholder="Search for news"
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      <div className="news-container">
        {error && <div className="error">{error}</div>}
        {loading ? (
          <div className="loading">Loading news...</div>
        ) : news.length > 0 ? (
          news.map((article, index) => (
            <div key={index} className="news-item">
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="news-image"
                />
              )}
              <div className="news-details">
                <h4 className="news-title">{article.title}</h4>
                <p className="news-author">By: {article.author || 'Unknown'}</p>
                <p className="news-description">{article.description}</p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-link"
                >
                  Read full article
                </a>
                <p className="news-publishedAt">
                  Published at: {new Date(article.publishedAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div>No news found for "{searchQuery}".</div>
        )}
      </div>
    </div>
    </>
  );
};

export default Home;
