import sessionStorage from '../utils/sessionStorage'
export default {
  siderState:sessionStorage.getSessionStorage('userData')||[],
  initFoot:false,
  count:0,
  bLoading:false,
  bFoot:true,
  userData:sessionStorage.getSessionStorage('userData')||'',
};
 