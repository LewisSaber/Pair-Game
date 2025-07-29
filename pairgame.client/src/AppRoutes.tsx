import EditIconSet from './pages/EditIconSet';
import Game from './pages/Game';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Registration from './pages/Registration'


const AppRoutes = [
    {
        path: '/register',
        element: <Registration />
    },
    {
        index: true,
        element: <Home />
    },
    {
        path: '/login',
        element: < Login />
    },
    {
        path: '/game',
        element: < Game/>
    },
    {
        path: '/profile',
        element: <Profile/>
    },
    {
        path: '/editIconSet',
        element: <EditIconSet />
    }
    
];

export default AppRoutes;