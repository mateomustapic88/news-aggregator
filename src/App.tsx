import React, { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import FilterOptions from "./components/FilterOptions/FilterOptions";
import ArticleList from "./components/ArticleList/ArticleList";
import {
  fetchNewsFromNewsAPI,
  fetchNewsFromGuardian,
  fetchNewsFromNYT,
} from "./services/newsService";
import "./App.scss";
import { filterRemovedContent } from "./utils/filterRemovedContent";

const App: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const sources = [
    { name: "CNN", id: "cnn", api: "newsapi" },
    { name: "Reuters", id: "reuters", api: "newsapi" },
    { name: "The New York Times", id: "nyt", api: "nyt" },
  ];

  // Function to handle search and update articles
  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      // Use a default query if the query is empty
      const searchQuery = query.trim() || "latest";

      const newsAPIArticles = await fetchNewsFromNewsAPI(searchQuery);
      const guardianArticles = await fetchNewsFromGuardian(searchQuery);
      const nytArticles = await fetchNewsFromNYT(searchQuery);

      // Combine and filter articles
      const allArticles = [
        ...newsAPIArticles,
        ...guardianArticles,
        ...nytArticles,
      ];
      const filteredArticles = filterRemovedContent(allArticles);

      setArticles(filteredArticles.slice(0, 50));
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle filter changes
  const handleFilterChange = async (filter: {
    category?: string;
    source?: string;
    author?: string;
    date?: string;
  }) => {
    setLoading(true);
    try {
      const { category = "", source = "", author = "", date = "" } = filter;
      const query = category ? category : "latest"; // Default query term

      // Fetch from NewsAPI with source if applicable
      const newsAPIArticles = source
        ? await fetchNewsFromNewsAPI(query, date, "popularity", source, author)
        : await fetchNewsFromNewsAPI(
            query,
            date,
            "popularity",
            undefined,
            author
          );

      const nytArticles = await fetchNewsFromNYT(query, date, author);

      // Combine and filter articles
      const allArticles = [...newsAPIArticles, ...nytArticles];
      const filteredArticles = filterRemovedContent(allArticles);

      // Limit results to 50
      setArticles(filteredArticles.slice(0, 50));
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch articles for all categories on initial load
  useEffect(() => {
    const fetchInitialArticles = async () => {
      setLoading(true);
      try {
        const defaultCategory = "latest";
        const newsAPIArticles = await fetchNewsFromNewsAPI(defaultCategory);
        const guardianArticles = await fetchNewsFromGuardian(defaultCategory);
        const nytArticles = await fetchNewsFromNYT(defaultCategory);

        // Combine and filter articles
        const allArticles = [
          ...newsAPIArticles,
          ...guardianArticles,
          ...nytArticles,
        ];
        const filteredArticles = filterRemovedContent(allArticles);

        setArticles(filteredArticles.slice(0, 50));
      } catch (error) {
        console.error("Error fetching initial articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialArticles();
  }, []); // Empty dependency array ensures this runs only on initial load

  return (
    <div className='app'>
      <Header />
      <div className='app__content'>
        <SearchBar onSearch={handleSearch} />
        <FilterOptions
          categories={["Technology", "Business", "Health"]}
          sources={sources}
          onFilterChange={handleFilterChange}
        />
        {loading ? (
          <p>Loading articles...</p>
        ) : (
          <ArticleList articles={articles} />
        )}
      </div>
    </div>
  );
};

export default App;
