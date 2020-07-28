import Vue from 'vue'
import Router from 'vue-router'
import Login from "./components/Login";
import Home from "./components/Home";
import Welcome from "./components/Welcome";
import Users from "./components/Users";


Vue.use(Router)

const router = new Router({
    routes: [
        {path: '/', redirect: '/login'},
        {path: '/login', component: Login},
        {
            path: '/home',
            redirect: '/welcome',
            component: Home,
            children: [{path: '/welcome', component: Welcome}, {path: '/users', component: Users}]
        },
    ]
})
router.beforeEach(((to, from, next) => {
    if (to.path === '/login')
        return next();
    //获取token
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr)
        return next('/login');
    next();
}));

export default router