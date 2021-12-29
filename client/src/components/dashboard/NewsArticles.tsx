import React from 'react';

import NewsArticle from './NewsArticle';

const NewsArticles = ({ articles }: any) => {
  return (
    <>
      {
        articles.length > 0 ? (
          <div className='wrapper-3'>
            {
              articles.map((article) => 
                <NewsArticle 
                  _id={article._id}
                  author={article.author} 
                  title={article.title} 
                  description={article.description} 
                  createdAt={article.createdAt} 
                />
              )
            }
          </div> 
        ) : (
          <p className='text-muted' style={{ textAlign: 'center', fontSize: '20px' }}>Could'nt retrieve any news articles</p>
        )
      }
    </>
  );
}

export default NewsArticles;