import {fillzero} from './fillzero';
export const date=time=>{
  var d=new Date();
  d.setTime(time*1000);
  return `${d.getFullYear()}-${fillzero(d.getMonth()+1)}-${fillzero(d.getDate())}`;
}
