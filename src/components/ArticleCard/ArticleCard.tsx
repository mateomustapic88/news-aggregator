import React from "react";
import "./ArticleCard.scss";

interface ArticleCardProps {
  title: string;
  description: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  description,
  imageUrl,
  source,
  publishedAt,
}) => {
  return (
    <div className='article-card'>
      {imageUrl && (
        <img src={imageUrl} alt={title} className='article-card__image' />
      )}
      <div className='article-card__content'>
        <h2 className='article-card__title'>{title}</h2>
        <p className='article-card__description'>{description}</p>
        <p className='article-card__meta'>
          <span className='article-card__source'>{source}</span> |{" "}
          <span className='article-card__date'>{publishedAt}</span>
        </p>
      </div>
    </div>
  );
};

export default ArticleCard;
