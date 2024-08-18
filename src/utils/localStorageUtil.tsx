export const getSavedArticles = () => {
  const savedArticles = localStorage.getItem("savedArticles");
  return savedArticles ? JSON.parse(savedArticles) : [];
};

export const saveArticle = (article: any) => {
  const savedArticles = getSavedArticles();
  localStorage.setItem(
    "savedArticles",
    JSON.stringify([...savedArticles, article])
  );
};

export const removeArticle = (title: string) => {
  const savedArticles = getSavedArticles();
  const updatedArticles = savedArticles.filter(
    (article: any) => article.title !== title
  );
  localStorage.setItem("savedArticles", JSON.stringify(updatedArticles));
};
