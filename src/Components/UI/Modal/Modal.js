import React, {} from 'react';

import classes from './Modal.module.css';
import Aux from '../../../hoc/Auxilary/Auxilary';
import Backdrop from '../Backdrop/Backdrop';

const Modal = props => {

        //used React.memo instead, but leaving it for reference
    //in order to optimize the page. by not rendering the modal in the background.
    //only  when is displayed or rendered
    //even tho this is fro the ordersummary component the should update is manage in the wrapper component
    // shouldComponentUpdate(nextProps, nextState) {
    //     //returns true if the condition is met
    //     return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
    // }

    return(
        <Aux>
            <Backdrop show={props.show} clicked={props.modalClosed}/>
            <div
                className={classes.Modal}
                style={{
                    transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: props.show ? '1' : '0'
                }}
                >{props.children}
            </div>
        </Aux>
    )

};

export default React.memo(Modal, (prevProps, nextProps) =>
     nextProps.show === prevProps.show &&
     nextProps.children === prevProps.children
);
