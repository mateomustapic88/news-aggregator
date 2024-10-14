import React from "react";
import ArticleCard from "../ArticleCard/ArticleCard";
import "./ReadLater.scss";

interface ReadLaterProps {
  savedArticles: {
    title: string;
    description: string;
    imageUrl: string;
    source: string;
    publishedAt: string;
  }[];
  onRemoveArticle: (article: any) => void;
}

const ReadLater: React.FC<ReadLaterProps> = ({
  savedArticles,
  onRemoveArticle,
}) => {
  return (
    <div className='read-later'>
      <h1>Saved Articles</h1>
      {savedArticles.length > 0 ? (
        <div className='read-later__list'>
          {savedArticles.map((article, index) => (
            <div key={index} className='read-later__item'>
              <ArticleCard
                title={article.title}
                description={article.description}
                imageUrl={article.imageUrl}
                source={article.source}
                publishedAt={article.publishedAt}
              />
              <button
                onClick={() => onRemoveArticle(article)}
                className='remove-from-saved-button'
              >
                Remove from Saved
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className='no-articles'>No articles saved for later.</p>
      )}
    </div>
  );
};

export default ReadLater;
