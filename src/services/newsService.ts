const NEWS_API_KEY = "45430950b5564891a1b89c862e51b6df";
const GUARDIAN_API_KEY = "f18a8961-8c9f-4cd3-96e9-6d78cfbfb799";
const NYT_API_KEY = "DYBHtwpWTKAwVSR0bxiNRVBqWqwip5Aw";

const BASE_NEWS_API_URL = "https://newsapi.org/v2";
const BASE_GUARDIAN_API_URL = "https://content.guardianapis.com";
const BASE_NYT_API_URL = "https://api.nytimes.com/svc/search/v2";

export const fetchNewsFromNewsAPI = async (
  query: string = "latest",
  date?: string,
  sortBy: string = "popularity",
  source?: string,
  author?: string
) => {
  const url = `${BASE_NEWS_API_URL}/everything?q=${encodeURIComponent(
    query
  )}&from=${date || ""}&sortBy=${sortBy}&apiKey=${NEWS_API_KEY}${
    source ? `&sources=${source}` : ""
  }${author ? `&author=${encodeURIComponent(author)}` : ""}&pageSize=50`;

  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`NewsAPI Error: ${errorData.message}`);
  }

  const data = await response.json();
  return data.articles.map((article: any) => ({
    title: article.title,
    description: article.description,
    imageUrl: article.urlToImage || "",
    source: article.source.name || "Unknown Source",
    publishedAt: article.publishedAt,
  }));
};

export const fetchNewsFromGuardian = async (
  query: string,
  date?: string,
  author?: string
) => {
  let url = `${BASE_GUARDIAN_API_URL}/search?q=${encodeURIComponent(
    query
  )}&api-key=${GUARDIAN_API_KEY}`;
  if (date) {
    url += `&from-date=${date}`;
  }
  if (author) {
    url += `&author=${encodeURIComponent(author)}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Guardian API Error: ${errorData.message}`);
  }
  const data = await response.json();
  return data.response.results.map((article: any) => ({
    title: article.webTitle,
    description: article.fields?.trailText || "",
    imageUrl: article.fields?.thumbnail || "",
    source: "The Guardian",
    publishedAt: article.webPublicationDate,
  }));
};

export const fetchNewsFromNYT = async (
  query: string,
  date?: string,
  author?: string
) => {
  let url = `${BASE_NYT_API_URL}/articlesearch.json?q=${encodeURIComponent(
    query
  )}&api-key=${NYT_API_KEY}`;
  if (date) {
    url += `&begin_date=${date.replace(/-/g, "")}`;
  }
  if (author) {
    url += `&fq=byline:${encodeURIComponent(author)}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`NYT API Error: ${errorData.message}`);
  }
  const data = await response.json();
  return data.response.docs.map((article: any) => ({
    title: article.headline.main,
    description: article.abstract,
    imageUrl:
      article.multimedia?.length > 0
        ? `https://www.nytimes.com/${article.multimedia[0].url}`
        : "",
    source: "The New York Times",
    publishedAt: article.pub_date,
  }));
};
