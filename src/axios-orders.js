import axios from 'axios';


const instace = axios.create({
    baseURL: 'https://react-dylans-burger.firebaseio.com/'
});

export default instace;