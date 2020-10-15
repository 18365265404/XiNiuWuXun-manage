import sessionStorage from '../utils/sessionStorage'
export default {
  siderBarMsg:(state,payload)=>{
    state.siderState=payload
  },
  userData(state,payload){

    state.userData=payload
    console.log('state',state)
    sessionStorage.putSessionStorage('userData',state.userData)
  },
};
 