import React, { useState, useEffect } from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom'

import Input from '../../Components/UI/Input/Input';
import Button from '../../Components/UI/Button/Button';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';
import Spinner from '../../Components/UI/Spinner/Spinner';
import { updateObject, checkValidity } from '../../shared/utility';



const Auth = props => {
    const [authForm, setAuthForm] = useState({
        email: {
            elementType: 'input',
            elementCofig: {
                type: 'email',
                placeholder: 'Email Address'
            },
            value: '',
            validation: {
                required: true,
                isEmail: true
            },
            valid: false,
            touched: false
        },
        password: {
            elementType: 'input',
            elementCofig: {
                type: 'password',
                placeholder: 'password'
            },
            value: '',
            validation: {
                required: true,
                minLength: 6
            },
            valid: false,
            touched: false
        }
    });

    const [isSignUp, setIsSignUp] = useState(true);  

    const {buildingBurger, authRedirectPath, onSetAuthRedirectPath} = props;
    useEffect(() => {
        if (!buildingBurger && authRedirectPath !== '/') {
            onSetAuthRedirectPath();
        }
    }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath])
    
    

    const inputChangedHandler = (event, controlName) => {
        const updatedauthForm = updateObject(authForm, {
            [controlName]: updateObject(authForm[controlName], {
                value: event.target.value,
                valid: checkValidity(event.target.value, authForm[controlName].validation),
                touched: true
            })
        });       
        setAuthForm(updatedauthForm);
    };    

    const submitHandler = (event) => {
        event.preventDefault();
        props.onAuth(authForm.email.value, authForm.password.value, isSignUp);
    };

    const switchAuthModeHandler = () => {
        setIsSignUp(!isSignUp)
    }

    
    //converts state object into an array that can bee looped thru
    const formElementsArray = [];
    //key = email, password
    for (let key in authForm) {
        formElementsArray.push({
            id: key,
            //authForm[key] = elementType, elementConfig...
            config: authForm[key]
        });
    }

    let form = formElementsArray.map(formElement => (
        <Input 
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementCofig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event) => inputChangedHandler(event, formElement.id)}
        />
        
    ));

    if(props.loading) {
        form = <Spinner />
    }

    let errorMesagge = null;
    if(props.error) {
        errorMesagge = (
            <p>{props.error.message}</p>
        );
    }

    let authRedirect = null;
    if(props.isAuthenticated) {
        authRedirect = <Redirect to={props.authRedirectPath} />
    }

    return (
        <div className={classes.Auth}>
            {authRedirect}
            {errorMesagge}
            <form onSubmit={submitHandler}> 
                {form}
                <Button btnType="Success">SUBMIT</Button>
            </form>
            <Button 
                btnType="Danger"
                clicked={switchAuthModeHandler}
                >SWITCH TO {isSignUp ? 'SIGNIN' : 'SINGUP'}</Button>
        </div>
    )    
};

const mapStateToProps = state => {    
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated : state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
};


export default connect(mapStateToProps, mapDispatchToProps)( Auth);