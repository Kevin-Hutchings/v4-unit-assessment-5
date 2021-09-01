import axios from 'axios';

const initialState = {
   username: '',
   password: ''
}

const UPDATE_USER = 'UPDATE_USER';
const LOGOUT = 'LOGOUT';

export const updateUser = () => {
   let data = axios.get('/api/auth/me')
   .then(res => res.data)
   .catch(err => console.log(err))
   return {
      type: UPDATE_USER,
      payload: data
   }
}

export const logout = () => {
   return {
      type: LOGOUT,
   }
}

export default function reducer(state = initialState, action) {
   switch(action.type) {
      case UPDATE_USER: 
      return {
         ...state,
         ...action.payload,
      }
      case LOGOUT:
         return {
            ...state,
         }
      default: return state;
   }
}