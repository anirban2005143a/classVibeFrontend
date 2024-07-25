import Cookie from 'js-cookie';

const addCookie = (name , value)=>{
    Cookie.set(name , value , {expires : 30})
}

export default addCookie