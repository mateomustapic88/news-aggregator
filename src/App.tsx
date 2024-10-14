import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import FilterOptions from "./components/FilterOptions/FilterOptions";
import ArticleList from "./components/ArticleList/ArticleList";
import ReadLater from "./components/ReadLater/ReadLater";
import {
  fetchNewsFromNewsAPI,
  fetchNewsFromGuardian,
  fetchNewsFromNYT,
} from "./services/newsService";
import "./App.scss";
import { filterRemovedContent } from "./utils/filterRemovedContent";
import {
  getSavedArticles,
  saveArticle,
  removeArticle,
} from "./utils/localStorageUtil";

const App: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showReadLater, setShowReadLater] = useState(false);
  const [savedArticles, setSavedArticles] = useState<any[]>(getSavedArticles());

  const sources = [
    { name: "CNN", id: "cnn", api: "newsapi" },
    { name: "Reuters", id: "reuters", api: "newsapi" },
    { name: "The New York Times", id: "nyt", api: "nyt" },
  ];

  const handleSearch = async (query: string) => {
    setLoading(true);
    setShowReadLater(false);
    try {
      const searchQuery = query.trim() || "latest";
      const newsAPIArticles = await fetchNewsFromNewsAPI(searchQuery);
      const guardianArticles = await fetchNewsFromGuardian(searchQuery);
      const nytArticles = await fetchNewsFromNYT(searchQuery);

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

  const handleFilterChange = async (filter: {
    category?: string;
    source?: string;
    author?: string;
    date?: string;
    hasImage?: boolean;
  }) => {
    setLoading(true);
    setShowReadLater(false);
    try {
      const {
        category = "",
        source = "",
        author = "",
        date = "",
        hasImage = false,
      } = filter;
      const query = category ? category : "latest";

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

      let allArticles = [...newsAPIArticles, ...nytArticles];

      if (hasImage) {
        allArticles = allArticles.filter((article) => article.imageUrl);
      }

      const filteredArticles = filterRemovedContent(allArticles);
      setArticles(filteredArticles.slice(0, 50));
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialArticles = async () => {
      setLoading(true);
      try {
        const defaultCategory = "latest";
        const newsAPIArticles = await fetchNewsFromNewsAPI(defaultCategory);
        const guardianArticles = await fetchNewsFromGuardian(defaultCategory);
        const nytArticles = await fetchNewsFromNYT(defaultCategory);

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
  }, []);

  const toggleReadLaterView = () => {
    setShowReadLater((prevShowReadLater) => !prevShowReadLater);
  };

  const handleSaveForLater = (article: any) => {
    const saved = getSavedArticles();
    if (
      saved.find(
        (savedArticle: { title: any }) => savedArticle.title === article.title
      )
    ) {
      removeArticle(article.title);
      toast.info("Removed from Read Later");
    } else {
      saveArticle(article);
      toast.success("Saved for Read Later");
    }
    setSavedArticles(getSavedArticles());
  };

  const handleRemoveFromSaved = (article: any) => {
    removeArticle(article.title);
    setSavedArticles(getSavedArticles());
    toast.info("Removed from Read Later");
  };

  const isArticleSaved = (article: any) =>
    savedArticles.some((savedArticle) => savedArticle.title === article.title);

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
        <button
          onClick={toggleReadLaterView}
          className='read-later-toggle-button'
        >
          {showReadLater ? "View All Articles" : "View Read Later Articles"}
        </button>
        {showReadLater ? (
          <ReadLater
            savedArticles={savedArticles}
            onRemoveArticle={handleRemoveFromSaved}
          />
        ) : loading ? (
          <p className='loading'>Loading articles...</p>
        ) : (
          <ArticleList
            articles={articles.map((article) => ({
              ...article,
              actionButton: (
                <button
                  onClick={() => handleSaveForLater(article)}
                  className={`article-action-button ${
                    isArticleSaved(article) ? "remove" : "save"
                  }`}
                >
                  {isArticleSaved(article)
                    ? "Remove For Later"
                    : "Save For Later"}
                </button>
              ),
            }))}
          />
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer position='top-right' autoClose={2000} />
    </div>
  );
};

export default App;
