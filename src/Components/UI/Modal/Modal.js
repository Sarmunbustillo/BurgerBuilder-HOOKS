import React, {Component} from 'react';

import classes from './Modal.module.css';
import Aux from '../../../hoc/Auxilary/Auxilary';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component {

    //in order to optimize the page. by not rendering the modal in the background.
    //only  when is displayed or rendered
    //even tho this is fro the ordersummary component the should update is manage in the wrapper component
    shouldComponentUpdate(nextProps, nextState) {
        //returns true if the condition is met
        return nextProps.show !== this.props.show || nextProps.children !== this.props.children;      
    }   

    render() {
        return(
            <Aux>
                <Backdrop show={this.props.show} clicked={this.props.modalClosed}/>
                <div 
                    className={classes.Modal}
                    style={{
                        transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
                        opacity: this.props.show ? '1' : '0'
                    }}
                    >{this.props.children}  
                </div>
            </Aux>
        )
    }
};

export default Modal
