import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom'

import Input from '../../Components/UI/Input/Input';
import Button from '../../Components/UI/Button/Button';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';
import Spinner from '../../Components/UI/Spinner/Spinner';
import { updateObject, checkValidity } from '../../shared/utility';



class Auth extends Component {
    state ={
        controls : {
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
        },
        
        isSignUp: true
    };

    componentDidMount () {
        if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath();
        }
    };
    

    inputChangedHandler = (event, controlName) => {
        const updatedControls = updateObject(this.state.controls, {
            [controlName]: updateObject(this.state.controls[controlName], {
                value: event.target.value,
                valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            })
        });       
        this.setState({controls: updatedControls})
    };
    // for reference in how to update an object withouth mutating it
    // inputChangedHandler = (event, controlName) => {
    //     const updatedControls = {
    //         ...this.state.controls,
    //         [controlName]: {
    //             ...this.state.controls[controlName],
    //             value: event.target.value,
    //             valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
    //             touched: true
    //         }
    //     };
    //     this.setState({controls: updatedControls})
    // };

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp);
    };

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isSignUp: !prevState.isSignUp}
        });
    }

    render() {
        //converts state object into an array that can bee looped thru
        const formElementsArray = [];
        //key = email, password
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                //this.state.controls[key] = elementType, elementConfig...
                config: this.state.controls[key]
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
                changed={(event) => this.inputChangedHandler(event, formElement.id)}
            />
            
        ));

        if(this.props.loading) {
            form = <Spinner />
        }

        let errorMesagge = null;
        if(this.props.error) {
            errorMesagge = (
                <p>{this.props.error.message}</p>
            );
        }

        let authRedirect = null;
        if(this.props.isAuthenticated) {
            authRedirect = <Redirect to={this.props.authRedirectPath} />
        }

        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errorMesagge}
                <form onSubmit={this.submitHandler}> 
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button 
                    btnType="Danger"
                    clicked={this.switchAuthModeHandler}
                    >SWITCH TO {this.state.isSignUp ? 'SIGNIN' : 'SINGUP'}</Button>
            </div>
        )
    }
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