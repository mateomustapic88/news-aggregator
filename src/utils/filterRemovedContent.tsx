// Utility function to filter out articles with '[Removed]' content
export const filterRemovedContent = (articles: any[]) => {
  return articles.filter((article) => {
    const fieldsToCheck = [
      article.title,
      article.description,
      article.content,
      article.source?.name,
    ];

    // Check if any field contains '[Removed]'
    return !fieldsToCheck.some(
      (field) => typeof field === "string" && field.includes("[Removed]")
    );
  });
};
