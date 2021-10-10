import React, { useReducer, useCallback, useMemo } from 'react';
import { useEffect } from 'react/cjs/react.development';
import useHttp from '../../hooks/useHttp';
import ErrorModal from '../UI/ErrorModal';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const ingredientsReducer = (ingredientsState, action) => {
  switch (action.type){
    case 'SET_INGS' : return action.ingredients;
    case 'ADD_INGS' : return [...ingredientsState, action.ingredients];
    case 'DELETE_INGS' : return ingredientsState.filter(ing => ing.id !== action.id);

    default: throw new Error('Should not get there!')
  }
};

const Ingredients = () =>  {
 
  const [ingredientsState, dispatchIngredients] = useReducer(ingredientsReducer, []);
  const {loading, error, sendRequest, clearError, action, data, extra} = useHttp();

   let ings = ingredientsState;

   useEffect(() => {
     switch (action) {
       case 'null': return undefined;
       case 'POST': return dispatchIngredients({type: 'ADD_INGS', ingredients: {id: data.name ,...extra}})
       case 'DELETE': return dispatchIngredients({type: 'DELETE_INGS', id: extra });
       default:
         return undefined;
     }
   },[action, data, extra])

  const loadIngredients = useCallback( ingredients => {
    sendRequest(`
    ${process.env.REACT_APP_INGREDIENT_API}/ingredients.json`,
      'GET');
      dispatchIngredients({type: 'SET_INGS', ingredients: ingredients });
  }, [ sendRequest]);

  const addIngredientsHandler = useCallback( ingredient => {
    sendRequest(`
    ${process.env.REACT_APP_INGREDIENT_API}/ingredients.json`,
      'POST',
      JSON.stringify(ingredient),
      ingredient);
  
  }, [sendRequest]);

  const removeIngredientsHandler = useCallback( ingredientId =>{
    sendRequest(
      `${process.env.REACT_APP_INGREDIENT_API}/ingredients/${ingredientId}.json`, 
       'DELETE',
       null,
       ingredientId);

  }, [sendRequest]);

  const ingredientsList = useMemo(() => {
   
    return  <IngredientList 
            ingredients={ings} 
            onRemoveItem={(ingredientId) => {
            removeIngredientsHandler(ingredientId)
            }}/>

  }, [removeIngredientsHandler, ings])

  return (
    <div className="App">
      {error !== null && <ErrorModal onClose={clearError}>{error}</ErrorModal> }
      <IngredientForm  onAddIngredient={addIngredientsHandler} loading={loading}/>

      <section>
        <Search onLoadIngredients={loadIngredients} />
        {ingredientsList}
      </section>
    </div>
  );
}

export default Ingredients;
