import React, { useState, useEffect, useRef } from 'react';

import useHttp from '../../hooks/useHttp';
import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import './Search.css';

const Search = React.memo(props => {

  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();
  const { loading, data, error, sendRequest, clearError} = useHttp();

  useEffect(() => {
    
    const timer = setTimeout(() => {
      if(enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 ? '' 
        : `?orderBy="title"&equalTo="${enteredFilter}"`;
        sendRequest(`${process.env.REACT_APP_INGREDIENT_API}/ingredients.json${query}`,
                    'GET');
      };
    }, 500);
    return () => {
      clearTimeout(timer);
    }
  },[enteredFilter, onLoadIngredients, inputRef, sendRequest]);

  useEffect(() => {
    if(!loading && !error && data){
            const loadedIngredients = [];
            for (let key in data){
               loadedIngredients.push({
                 id:key,
                 ...data[key]
               });
            }
            onLoadIngredients(loadedIngredients);
    };
  },[data, loading, error, onLoadIngredients]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {loading && <span>Loading...</span>}
          <input type="text" value={enteredFilter} onChange={event => 
          setEnteredFilter(event.target.value)} 
          ref={inputRef}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
