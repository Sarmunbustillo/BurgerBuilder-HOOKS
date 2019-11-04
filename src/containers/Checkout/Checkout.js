import React, {  } from 'react';
import CheckoutSummary from '../../Components/Order/CheckoutSummary/CheckoutSummary';
import {Route, Redirect} from 'react-router-dom';
import ContactData from './ContactData/ContactData';
import {connect} from 'react-redux';


const Checkout = props => {    

    const onCheckoutCancelled = () => {
        props.history.goBack();
    };

    const onCheckoutContinued = () => {
        props.history.replace('./checkout/contact-data');
    };

    let summary = <Redirect to="/" />
    if(props.ings) {
        const purchasedRedirect = props.purchased ? <Redirect to="/" /> : null;
        summary =(
            <div>
                {purchasedRedirect}
                <CheckoutSummary 
                    ingredients={props.ings} 
                    onCheckoutCancelled={onCheckoutCancelled}
                    onCheckoutContinued={onCheckoutContinued}
                    /> 
                <Route
                    path={props.match.path + '/contact-data'}
                    component={ContactData}
                    />
            </div>
        )
    };

    return summary          
   
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
        
    }
};
 
export default connect(mapStateToProps)(Checkout);
