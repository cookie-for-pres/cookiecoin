import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

const NewsArticle = ({ _id, author, title, description, createdAt }) => {
  return (
    <>
      <div className='card'>
        <div className='card-header'>
          <a href={`/news-article/${_id}`}>
            { title } <span style={{ float: 'right' }}>{ moment(createdAt).format('ddd, MMM Do YYYY, h:mm A') }</span>
          </a>
        </div>
        <div className='card-body'>
          { description }
          <br />
          <p className='fst-italic'>-- { author }</p>
        </div>
        <div className='card-footer'>
          <Link className='btn btn-purple' style={{ width: '100%' }} to={`/news-article/${_id}`}>
            View Article <i className='fa-solid fa-newspaper' />
          </Link>
        </div>
      </div>
    </>
  );
}

export default NewsArticle;