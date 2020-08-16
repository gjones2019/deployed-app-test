import React from 'react';
import ListEntry from './listEntry.js';

// Song search list
const SearchResults = ({ videos, listClickHandler }) => {
  return (
    <div>
      {videos.map((video) => (
        <ListEntry video={video} listClickHandler={listClickHandler} />
      ))}
    </div>
  );
};

export default SearchResults;
