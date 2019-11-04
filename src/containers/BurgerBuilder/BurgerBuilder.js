import React, {useState, useEffect, useCallback} from 'react';

import Aux from '../../hoc/Auxilary/Auxilary';
import Burger from '../../Components/Burger/Burger';
import BuildControls from '../../Components/Burger/BuildControls/BuildControls';
import Modal  from '../../Components/UI/Modal/Modal';
import axios from '../../axios-orders';
import OrderSummary from "../../Components/Burger/OrderSummary/OrderSumary";
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../Components/UI/Spinner/Spinner';
import * as actions from  '../../store/actions/index';
import {connect, useDispatch, useSelector} from 'react-redux';



const BurgerBuilder = props => {
    // constructor(props) {
    //     super(props);
    //     this.state ={...}
    // }
    const [purchasing, setPurchasing] = useState(false);

    const dispatch = useDispatch ();  
    
    const ings = useSelector(state  => {
        return state.burgerBuilder.ingredients 
    });
    const price = useSelector(state  => {
        return state.burgerBuilder.totalPrice 
    });
    const error = useSelector(state  => {
        return state.burgerBuilder.error 
    });
    const isAuthenticated = useSelector(state  => {
        return state.auth.token !== null 
    });

    const onIngredientAdded = (ingName) => dispatch(actions.addIngredient(ingName));
    const onIngredientRemoved = (ingName) => dispatch(actions.removeIngredient(ingName));
    const onInitIngredients = useCallback(()=> dispatch(actions.initIngredients()), [dispatch]);
    const onInitPurchased = () => dispatch(actions.purchasedInit());
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

    //fetch ingredients from database    
    useEffect(() => {
        onInitIngredients();       
    }, [onInitIngredients])
    
    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey];
        }).reduce((sum, el) => {
            return sum + el;
        }, 0);
        return sum > 0;
    };

    const purchaseHandler = () => {
        if (isAuthenticated) {
            setPurchasing(true);
        } else {
            onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }
    };

    const purchaseCancelHandler = ()=>  {
        setPurchasing(false);
    };

    const purchaseContinueHandler = () => {
        onInitPurchased();
        props.history.push('/checkout');
    };
    
    const  disableInfo ={
        ...ings
    };

    for (let key in disableInfo) {
        //returns true or false {salad: true, meat: false}
        disableInfo[key] = disableInfo[key] <= 0;
    };

    let orderSummary = null;

    let burger = error ? <p>Ingredients can't be loaded</p> : <Spinner /> ;
    if (ings) {
        burger = (
            <Aux>
                <Burger ingredients={ings} />
                <BuildControls
                    ingredientAdded={onIngredientAdded}
                    ingredientsRemoved={onIngredientRemoved}
                    disabled={disableInfo}
                    purchaseable={updatePurchaseState(ings)}
                    ordered={purchaseHandler}
                    isAuth={isAuthenticated}
                    price={price}
                />
            </Aux>
        );
        orderSummary = <OrderSummary
            ingredients={ings}
            price={price}
            purchaseCancelled={purchaseCancelHandler}
            purchaseContinued={purchaseContinueHandler}
        />
    };

    return (
        <Aux>
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    );
    
};



export default withErrorHandler(BurgerBuilder, axios);