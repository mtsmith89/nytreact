import axios from "axios";

export default {
  getArticles: () => {
    return axios.get("/api/articles");
  },
  getArticle: id => {
    return axios.get("/api/articles/" + id);
  },
  deleteArticle: id => {
    return axios.get("/api/articles/" + id);
  },
  saveArticle: articleData => {
    return axios.post("/api/articles", articleData);
  },
  queryNYT: queryUrl => {
    return axios.get(queryUrl);
  }
};
