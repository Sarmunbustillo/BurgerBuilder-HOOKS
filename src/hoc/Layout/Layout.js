import React, {useState} from 'react';

import {connect} from 'react-redux';

import Aux from '../Auxilary/Auxilary';
import classes from './Layout.module.css'
import Toolbar from '../../Components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../Components/Navigation/SideDrawer/SideDrawer';

const Layout = props => {
    const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false);
    

    const SideDrawerClosedHandler = () => {
        setSideDrawerIsVisible(false);
    }

    const toggleSideDrawerHandler = () => {        
        setSideDrawerIsVisible(!sideDrawerIsVisible);       
    }  

        return ( 
            <Aux>
                <Toolbar 
                    isAuth={props.isAuthenticated}
                    DrawerToggleClicked={toggleSideDrawerHandler} />
                <SideDrawer 
                    isAuth={props.isAuthenticated}
                    open={sideDrawerIsVisible} closed={SideDrawerClosedHandler}/>
                <main className={classes.Content}>
                    {props.children}
                </main>
             </Aux> 
        )
    
};

const mapStateToProps = state =>  {
    return {
        isAuthenticated: state.auth.token !== null
    };
};

export default connect(mapStateToProps)(Layout);