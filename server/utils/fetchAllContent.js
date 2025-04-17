import dotenv from 'dotenv';
dotenv.config();
import Parser from 'rss-parser';
import axios from 'axios';

const parser = new Parser();

const keywords = [
  "social", "equality", "climate", "injustice", "activism", "community",
  "mental health", "empathy", "sustainability", "change", "justice",
  "volunteer", "education", "poverty", "rights", "clean energy", "humanity",
  "art", "expression", "freedom", "environment", "culture"
];

const maxResults = 5;

// 🔴 TED Talks
async function fetchTEDTalks() {
  try {
    const feed = await parser.parseURL('https://www.ted.com/talks/rss');

    const filtered = feed.items.filter(item =>
      keywords.some(kw =>
        item.title.toLowerCase().includes(kw) ||
        item.contentSnippet?.toLowerCase().includes(kw)
      )
    ).slice(0, maxResults);

    return filtered.map(talk => ({
      title: talk.title,
      description: talk.contentSnippet,
      image: talk.itunes.image,
      createdAt: talk.pubDate,
      link: talk.link,
      category: 'ted'
    }));
  } catch (err) {
    console.error('Error fetching TED talks:', err.message);
    return [];
  }
}

// 🔵 YouTube Videos
async function fetchYouTubeVideos() {
  try {
    const res = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: keywords.join('|'),
        type: 'video',
        maxResults,
        order: 'date',
        key: process.env.YOUTUBE_API_KEY
      }
    });

    return res.data.items.map(item => ({
      title: item.snippet.title,
      description: item.snippet.description,
      image: item.snippet.thumbnails.medium.url,
      createdAt: item.snippet.publishedAt,
      link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      category: 'video'
    }));
  } catch (err) {
    console.error('Error fetching YouTube videos:', err.message);
    return [];
  }
}

// 📚 Books
async function fetchBooks() {
  try {
    const res = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: keywords.join('|'),
        maxResults
      }
    });

    return res.data.items.map(item => ({
      title: item.volumeInfo.title,
      description: item.volumeInfo.description || 'No description available.',
      image: item.volumeInfo.imageLinks?.thumbnail || '',
      createdAt: item.volumeInfo.publishedDate,
      link: item.volumeInfo.previewLink,
      category: 'book'
    }));
  } catch (err) {
    console.error('Error fetching books:', err.message);
    return [];
  }
}

// 📰 Articles
async function fetchArticles() {
  try {
    const res = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: keywords.join(' OR '),
        sortBy: 'publishedAt',
        pageSize: maxResults,
        language: 'en',
        apiKey: process.env.NEWS_API_KEY
      }
    });

    return res.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      image: article.urlToImage,
      createdAt: article.publishedAt,
      link: article.url,
      category: 'article'
    }));
  } catch (err) {
    console.error('Error fetching articles:', err.message);
    return [];
  }
}

// 🔄 All-in-One Function
async function fetchAllContent(timestamps = {}) {
    const [ted, youtube, books, articles] = await Promise.all([
      fetchTEDTalks(timestamps.ted),
      fetchYouTubeVideos(timestamps.video),
      fetchBooks(timestamps.book),
      fetchArticles(timestamps.article)
    ]);
  
    return [...ted, ...youtube, ...books, ...articles];
  }
  

fetchAllContent();



export { fetchAllContent };