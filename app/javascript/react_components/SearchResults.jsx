import React from "react";
import PropTypes from "prop-types";

const SearchResults = (props) => {
  return (
    <div style={{maxHeight:300, overflowY: props.searchResults.length === 0 ? 'hidden' : 'scroll', overflowX: 'hidden'}}>
      <ul className='list-group'>
        {props.searchResults.map((user) => (
          <li
            className='list-group-item'
            key={user.id}
            onClick={() => {props.onClickSearchResult(user)}}
          >
            {`${user.name}#${user.id}`}
          </li>
        ))}
      </ul>
    </div>
  )
}

SearchResults.propTypes = {
  searchResults: PropTypes.array,
  onClickSearchResult: PropTypes.func,
}

export default SearchResults