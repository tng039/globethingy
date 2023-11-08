// fetchArticles.ts

// Function to fetch the number of articles
const fetchArticleCount = async (): Promise<number> => {
    const response = await fetch('/news_request', {mode: 'cors'});
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const count = await response.json();
    return count;
  };
  
  // Function to fetch an article by number
  const fetchArticleByNumber = async (num: number): Promise<any> => {

    const response = await fetch(`/fetch_news?article_num=${num}`, {mode: 'cors'});
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const article = await response.json();
    
    const coordinates = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(article.location)}.json?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`);
    const coordinatesJSON = await coordinates.json();
    article.lat = coordinatesJSON.features[0].center[1];
    article.lng = coordinatesJSON.features[0].center[0];
  
  
    return article;
  };
  
  // Function to fetch all articles
  const fetchAllArticles = async () => {
    const count = await fetchArticleCount();
    const articles = [];
    for (let i = 0; i < count; i++) {
      const article = await fetchArticleByNumber(i);
      articles.push(article);
    }
    return articles;
  };

  export default fetchAllArticles;
  