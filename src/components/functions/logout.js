import removeCookie from "./removeCookie"

const logout = ()=>{
    localStorage.removeItem('owners')
    localStorage.removeItem('allChats')
    removeCookie('authtoken')
    removeCookie('userId')
}

export default logout

