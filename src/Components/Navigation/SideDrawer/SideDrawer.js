import React from 'react';

import NavigationsItems from '../NavigationItems/NavigationsItems';
import Logo from '../../Logo/Logo';
import classes from './SideDrawer.module.css';
import Aux from '../../../hoc/Auxilary/Auxilary';
import Backdrop from '../../UI/Backdrop/Backdrop';



const SideDrawer = (props) => {
    let attachClasses = [classes.SideDrawer, classes.Close];
    if (props.open) {
        attachClasses = [classes.SideDrawer, classes.Open];
    }
    return (
        <Aux>
            <Backdrop show={props.open} clicked={props.closed} />
            <div className={attachClasses.join(' ')} onClick={props.closed}>
                <div className={classes.Logo}>
                    <Logo />
                </div>
                <nav>
                    <NavigationsItems isAuthenticated={props.isAuth} />
                </nav>
            </div>
        </Aux>
    )
};

export default SideDrawer;
