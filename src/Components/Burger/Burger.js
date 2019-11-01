import React from 'react';

import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredients/BurgerIngredients';

const burger = (props) => {
    //convert the incoming object of key value pairs into an array taking into accaount the keys.
    //returns an array of arrays
    let transformedIngredients = Object.keys(props.ingredients)
        .map(igKey => {            
            return [...Array(props.ingredients[igKey])].map((_, i) => {                
            return <BurgerIngredient key={igKey + i} type={igKey} />;           
            });
        }) 
    //flatten the array to have only one array of objects. instead of an array of arrays that each one holds objeacts.. in order to later check if theres no ingredients selected
        .reduce((arr, el) => {                 
            return arr.concat(el);
        }, []);
        if(transformedIngredients.length === 0) {
            transformedIngredients = <p>Please add ingredients!</p>;
        }
    //console.log(transformedIngredients);

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {transformedIngredients}            
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
};

export default burger;