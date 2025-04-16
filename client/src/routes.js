import Home from './pages/Home';
import PropertyListPage from './pages/PropertyListPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import UserDashboard from './pages/UserDashboard';
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile';
import SavedProperties from './components/user/SavedProperties';

const routes = [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/properties',
    component: PropertyListPage,
    exact: true,
  },
  {
    path: '/properties/:id',
    component: PropertyDetailPage,
  },
  {
    path: '/search',
    component: SearchResultsPage,
  },
  {
    path: '/login',
    component: Login,
    protected: false,
  },
  {
    path: '/register',
    component: Register,
    protected: false,
  },
  {
    path: '/dashboard',
    component: UserDashboard,
    protected: true,
    children: [
      {
        path: 'profile',
        component: Profile,
      },
      {
        path: 'saved',
        component: SavedProperties,
      },
    ],
  },
];

export default routes;