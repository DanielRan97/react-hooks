import React from 'react';
import './IngredientList.css';

const IngredientList = props => {

  let ingList =  (
    <div>
      {props.ingredients ? 
       <section className="ingredient-list">
       <h2>Loaded Ingredients</h2>
       <ul>
         {props.ingredients.map(ig => (
           <li key={ig.id ? ig.id : Math.random()} onClick={props.onRemoveItem.bind(this, ig.id)}>
             <span>{ig.title}</span>
             <span>{ig.amount}x</span>
           </li>
         ))}
       </ul>
     </section>:
     <p className={"noIngsAlert"}>No ingredients found</p>
      }
    </div>
  );

  return (
   <div>
      {ingList}
   </div>
  );
};

export default IngredientList;
