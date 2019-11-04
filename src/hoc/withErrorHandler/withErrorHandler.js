import React from 'react';

import Aux from '../Auxilary/Auxilary';
import Modal from '../../Components/UI/Modal/Modal';
import useHttpErrorHandler from '../../hooks/http-error-handler';
const withErrorHandler = (WrappedComponent, axios) => {
    return props => {
        const [error, clearError] = useHttpErrorHandler(axios);
                return (
            <Aux>
                <Modal show={error}
                    modalClosed={clearError}>
                    {error ? error.message : null}
            </Modal>
                <WrappedComponent {...props}></WrappedComponent>
            </Aux>
        );
           
    }     
}

export default withErrorHandler
