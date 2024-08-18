import React from "react";
import ArticleCard from "../ArticleCard/ArticleCard";
import "./ArticleList.scss";

interface ArticleListProps {
  articles: {
    title: string;
    description: string;
    imageUrl: string;
    source: string;
    publishedAt: string;
  }[];
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
  return (
    <div className='article-list'>
      {articles.map((article, index) => (
        <ArticleCard
          key={index}
          title={article.title}
          description={article.description}
          imageUrl={article.imageUrl}
          source={article.source}
          publishedAt={article.publishedAt}
        />
      ))}
    </div>
  );
};

export default ArticleList;
