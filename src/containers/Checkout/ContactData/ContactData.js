import React, { useState } from 'react'
import Button from '../../../Components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../Components/UI/Spinner/Spinner';
import Input from '../../../Components/UI/Input/Input';
import {connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import { updateObject, checkValidity } from '../../../shared/utility';


const ContactData = props => {
    const [orderForm, setOrderForm] = useState({
        name: {
            elementType: 'input',
            elementCofig: {
                type: 'text',
                placeholder: 'Your Name'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        street: {
            elementType: 'input',
            elementCofig: {
                type: 'text',
                placeholder: 'Street'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        zipCode: {
            elementType: 'input',
            elementCofig: {
                type: 'number',
                placeholder: 'ZIP Code'
            },
            value: '',
            validation: {
                required: true,
                minLength: 5,
                maxLength: 5
            },
            valid: false,
            touched: false
        },
        country: {
            elementType: 'input',
            elementCofig: {
                type: 'text',
                placeholder: 'Country'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        email: {
            elementType: 'input',
            elementCofig: {
                type: 'email',
                placeholder: 'Your E-Mail'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        deliveryMethod: {
            elementType: 'select',
            elementCofig: {
                options:
                    [
                        { value: 'fastest', displayValue: 'Fastest' },
                        { value: 'cheapest', displayValue: 'Cheapest' }
                    ],

            },
            value: 'fastest',
            validation: {},
            valid: true
        },
    })
    const [formIsValid, setFormIsValid] = useState(false)   
    


    const orderHandler = (event) => {
        // console.log(props.ingredients);
        //alert('You Continued!');
        event.preventDefault();       
        const formData = {};
        for (let formElementIdentifier in orderForm) {
            formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
        }
        //normally you calculate the price on the server side.. here is just for the example
        const order = {
            ingredients: props.ings,
            price: props.price,
            orderData: formData,
            userId: props.userId
        }
       props.onOrderBurger(order, props.token);
    };
    

    
    const inputChangedHandler = (event, inputIdentifier) => {
        //console.log(event.target.value);
        // orderForm[inputIdentifier] = name, street, email
        const updatedFormElement = updateObject(orderForm[inputIdentifier], {
           value: event.target.value,
           valid: checkValidity(event.target.value, orderForm[inputIdentifier].validation),
           touched: true
        }); 
        
        const updatedOrderForm = updateObject(orderForm, {
            //name, street, ...
            [inputIdentifier]: updatedFormElement
        });        
        //console.log(updatedFormElement);
        //check if all the elements are valid
        let formIsValid = true;
        for (let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }
        setOrderForm(updatedOrderForm);
        setFormIsValid(formIsValid)        
    };

    
    //converts state object into an array that can bee looped thru
    const formElementsArray = [];
    //key = name, street....
    for (let key in orderForm) {
        formElementsArray.push({
            id: key,
            //orderForm[key] = elementType, elementConfig...
            config: orderForm[key]
        });
    };

    let form = (
        <form onSubmit={orderHandler}>               
            {formElementsArray.map(fromElement => (
                <Input 
                key={fromElement.id}
                elementType={fromElement.config.elementType}
                elementConfig={fromElement.config.elementCofig}
                value={fromElement.config.value}
                invalid={!fromElement.config.valid}
                shouldValidate={fromElement.config.validation}
                touched={fromElement.config.touched}
                changed={(event) => inputChangedHandler(event, fromElement.id)}
            />
            ))}
            <Button btnType="Success" disabled={!formIsValid} clicked={orderHandler}>Order</Button>
        </form> 
    );
    
    if(props.loading) {
        form = <Spinner />;
    }

    return (
        <div className={classes.ContactData}>
            <h4>Enter Your Contact Data</h4> 
            {form}     
        </div>
    )
    
};

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token : state.auth.token,
        userId: state.auth.userId
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));
