const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.convertTopicsData = (topicData) => {
  return topicData.map(topic => [topic.slug, topic.description, topic.img_url]);
};

exports.convertUsersData = (userData) => {
  return userData.map(user => [user.username, user.name, user.avatar_url]);
};

exports.convertArticlesData = (articleData, convertTimeFunc) => {
  return articleData.map(article => {
    const formattedArticle = convertTimeFunc(article);
    return [
      formattedArticle.title,
      formattedArticle.topic,
      formattedArticle.author,
      formattedArticle.body,
      formattedArticle.created_at,
      formattedArticle.votes,
      formattedArticle.article_img_url
    ];
  });
};

exports.convertCommentsData = (commentData, insertedArticles, convertTimeFunc) => {
  const articlesRef = {};
  insertedArticles.forEach(article => {
    articlesRef[article.title] = article.article_id;
  });

  return commentData.map(({ article_title, ...comment }) => ({
    article_id: articlesRef[article_title], ...comment
  }))
  .map(comment => {
    const formattedComment = convertTimeFunc(comment);
    return [
      formattedComment.article_id,
      formattedComment.body,
      formattedComment.votes,
      formattedComment.author,
      formattedComment.created_at
    ];
  });
}