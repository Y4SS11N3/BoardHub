import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ConditionalHeader from './components/Header/ConditionalHeader';
import ConditionalFooter from './components/Footer/ConditionalFooter';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import BoardCreate from './pages/BoardCreate/BoardCreate';
import BoardView from './components/BoardView/BoardView';
import Settings from './pages/Settings/Settings';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import ConditionalBackground from './components/ConditionalBackground/ConditionalBackground';
import { loadUserFromToken } from './redux/actions/authActions';
import { UserAvatarProvider } from './components/UserAvatar/UserAvatarContext';
import BoardList from './components/BoardList/BoardList';
import SharedBoard from './pages/SharedBoard/SharedBoard';
import Contact from './pages/contact/contact';
import About from './pages/About/About';
import Profile from './pages/Profile/Profile';
import UserProfile from './pages/UserProfile/UserProfile';
import NotFound from './pages/NotFound/NotFound';
import SlideShowPage from './pages/SlideShowPage/SlideShowPage';
import './App.css';

// Create a theme instance
const theme = createTheme();

// Conditional route for the home page
const ConditionalHomeRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />;
};

// Main App component
const App = () => {
  const appTheme = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  // Load user from token on component mount
  useEffect(() => {
    dispatch(loadUserFromToken());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ConditionalBackground>
          <div className={`page-container theme-${appTheme}`}>
            <ConditionalHeader />
            <main className="main-content w-full">
              <ErrorBoundary>
                <UserAvatarProvider>
                  <Routes>
                    <Route path="/" element={<ConditionalHomeRoute />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
                    <Route path="/:username/board/:boardId" element={<PrivateRoute element={BoardCreate} />} />
                    <Route path="/:username/:boardSlug-:id" element={<PrivateRoute element={BoardView} />} />
                    <Route path="/settings" element={<PrivateRoute element={Settings} />}>
                      <Route path="basic-info" element={<Settings />} />
                      <Route path="change-password" element={<Settings />} />
                      <Route path="delete-account" element={<Settings />} />
                    </Route>
                    <Route path="/boards" element={<PrivateRoute element={BoardList} />} />
                    <Route path="/shared-with-me" element={<PrivateRoute element={Dashboard} />} />
                    <Route path="/trash" element={<PrivateRoute element={Dashboard} />} />
                    <Route path="/favorites" element={<PrivateRoute element={Dashboard} />} />
                    <Route path="/folder/:folderId" element={<PrivateRoute element={Dashboard} />} />
                    <Route path="/shared/:shareToken" element={<SharedBoard />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/profile" element={<PrivateRoute element={Profile} />} />
                    <Route path="/:username/board/:boardId/slideshow" element={<SlideShowPage />} />
                    <Route path="/:username/board/:boardId/slideshow/:type/:id" element={<SlideShowPage />} />
                    <Route path="/shared-slideshow/:shareToken" element={<SlideShowPage />} />
                    <Route path="/user/:username" element={<UserProfile />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </UserAvatarProvider>
              </ErrorBoundary>
            </main>
            <ConditionalFooter />
          </div>
        </ConditionalBackground>
      </Router>
    </ThemeProvider>
  );
};

export default App;