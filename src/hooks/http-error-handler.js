import { useState, useEffect} from 'react';

//for axios
export default httpClient => {
    const [error, setError] = useState(null)

    //these lines of code will run before the component is mounted, hence we could not use useEffect
    const reqInterceptor = httpClient.interceptors.request.use(req => {
        setError(null);
        return req;
    });
    const resInterceptor = httpClient.interceptors.response.use(res => res, err => {
        setError(err)
    });


    useEffect(() => {
        return () => {
            httpClient.interceptors.request.eject(reqInterceptor);
            httpClient.interceptors.response.eject(resInterceptor);
        };
    }, [reqInterceptor, resInterceptor]);

    const errorComfirmedHandler = () => {
        setError(null);
    };

    return [error, errorComfirmedHandler]; 

}