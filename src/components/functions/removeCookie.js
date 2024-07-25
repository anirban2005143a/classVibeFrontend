import Cookie from 'js-cookie';

const removeCookie = (name)=>{
    Cookie.remove(name)
}

export default removeCookie