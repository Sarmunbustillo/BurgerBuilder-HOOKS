import React, {Component} from 'react';

import Aux from '../Auxilary/Auxilary';
import Modal from '../../Components/UI/Modal/Modal';

const withErrorHandler = (WrappedComponent, axios) => {
    return  class extends Component { 
        state ={
            error: null
        };

        constructor() {
            super()            
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({error: null});
                return req;
            });
            this.resInterceptor = axios.interceptors.response.use(res => res, error => {
                this.setState({error: error});
            });
        };

        componentWillUnmount() {
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        };

        errorComfirmedHandler = () => {
            this.setState({error: null});
        };

        render() {
            return (
                <Aux>
                    <Modal show={this.state.error}
                    modalClosed={this.errorComfirmedHandler}>
                        {this.state.error ? this.state.error.message : null}
               </Modal>
                    <WrappedComponent {...this.props}></WrappedComponent>
                </Aux>
            );
        }        
    }       
}

export default withErrorHandler
