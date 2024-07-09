import React, { useEffect, useState } from 'react';
import { Typography, Box, styled, Grid, IconButton, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, Link as RouterLink } from 'react-router-dom';
import { fetchUserProfile, fetchPublicBoards } from '../../redux/actions/userActions';
import { loadUserFromToken } from '../../redux/actions/authActions';
import { Edit2, Link as LinkIcon } from 'lucide-react';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import { ReactComponent as EmptyStateSVG } from '../../components/SocialLoginButtons/undraw_waiting__for_you_ldha.svg';

// Styled components
const ProfileContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#ffffff',
});

const WaveHeader = styled(Box)({
  position: 'relative',
  height: '200px',
  overflow: 'hidden',
  backgroundColor: '#f5f6f7',
  borderBottom: 'none',
});

const WaveShape = styled('div')({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  overflow: 'hidden',
  lineHeight: 0,
  '& svg': {
    position: 'relative',
    display: 'block',
    width: 'calc(100% + 1.3px)',
    height: '50px',
  },
  '& .shapeFill': {
    fill: '#FFFFFF',
  },
});

const Logo = styled(RouterLink)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  color: '#000000',
  fontWeight: 'bold',
  fontSize: '1.5rem',
  textDecoration: 'none',
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: -125,
  position: 'relative',
  zIndex: 1,
}));

const ProfileSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
}));

const AvatarWrapper = styled(Box)({
  marginBottom: '1rem',
  zIndex: 2,
});

const BoardCard = styled(Box)(({ background }) => ({
  position: 'relative',
  height: 150,
  borderRadius: '10px 10px 60px 10px',
  overflow: 'hidden',
  backgroundImage: `url(/board-backgrounds/${background})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  width: 300,
}));

const CardInfo = styled(Box)({
  padding: '8px',
  backgroundColor: 'white',
  borderRadius: '0 0 10px 10px',
});

const CardTitle = styled(Typography)({
  color: 'black',
  fontWeight: 'bold',
  fontSize: '1rem',
  marginBottom: '4px',
});

const CardSubtitle = styled(Typography)({
  color: 'rgba(0, 0, 0, 0.7)',
  fontSize: '0.875rem',
});

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: theme.spacing(4),
}));

const StyledSVG = styled(EmptyStateSVG)(({ theme }) => ({
  width: '300px',
  height: 'auto',
  marginBottom: theme.spacing(4),
}));

const AboutText = styled(Typography)(({ theme }) => ({
  color: 'black',
  fontWeight: 600,
  marginTop: theme.spacing(1),
}));

// Profile component
const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error, loading: authLoading } = useSelector((state) => state.auth);
  const [publicBoards, setPublicBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Function to calculate time ago
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "s";
  };

  // Effect to load user data and fetch public boards
  useEffect(() => {
    const fetchData = async () => {
      if (!user && !authLoading) {
        await dispatch(loadUserFromToken());
      }
      if (user) {
        try {
          const boards = await dispatch(fetchPublicBoards(user.username));
          setPublicBoards(boards);
        } catch (error) {
          setSnackbar({ open: true, message: 'Failed to fetch public boards', severity: 'error' });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [dispatch, user, authLoading]);

  // Function to close snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // Function to copy profile link
  const handleCopyLink = () => {
    const profileLink = `${window.location.origin}/user/${user.username}`;
    navigator.clipboard.writeText(profileLink).then(() => {
      setSnackbar({ open: true, message: 'Profile link copied to clipboard!', severity: 'success' });
    }, () => {
      setSnackbar({ open: true, message: 'Failed to copy link', severity: 'error' });
    });
  };

  if (loading || authLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography align="center">Please log in to view your profile</Typography>
      </Box>
    );
  }

  return (
    <ProfileContainer>
      <WaveHeader>
        <Logo to="/dashboard">BoardHub</Logo>
        <WaveShape>
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shapeFill"></path>
          </svg>
        </WaveShape>
      </WaveHeader>
      <MainContent>
        <ProfileSection>
          <AvatarWrapper>
            <UserAvatar 
              name={user.fullName} 
              width="128px" 
              height="128px" 
              fontSize="3rem"
              avatarUrl={user.avatarUrl}
            />
          </AvatarWrapper>
          <Typography variant="h4" fontWeight="bold" mt={2}>{user.fullName}</Typography>
          <Typography color="text.secondary">{user.username}</Typography>
          <AboutText>{user.about}</AboutText>
          <Box display="flex" alignItems="center" mt={2}>
            <Typography variant="body2" color="text.secondary" mr={2}>{user.followers?.length || 0} followers</Typography>
            <Typography variant="body2" color="text.secondary" mr={2}>{user.following?.length || 0} following</Typography>
            <IconButton component={Link} to="/settings" size="small">
              <Edit2 />
            </IconButton>
            <IconButton size="small" onClick={handleCopyLink}>
              <LinkIcon />
            </IconButton>
          </Box>
        </ProfileSection>

        <Typography variant="h6" gutterBottom>My Public Boards</Typography>
        {publicBoards.length > 0 ? (
          <Grid container spacing={2}>
            {publicBoards.map((board) => (
              <Grid item xs={12} sm={6} md={3} key={board.id || board.boardId}>
                <Box>
                  <Link to={`/${user.username}/board/${board.boardId}`} style={{ textDecoration: 'none' }}>
                    <BoardCard background={board.background || 'default.jpg'} />
                    <CardInfo>
                      <CardTitle>{board.title}</CardTitle>
                      <CardSubtitle>{user.fullName} • {getTimeAgo(board.updatedAt)}</CardSubtitle>
                    </CardInfo>
                  </Link>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <EmptyStateContainer>
            <StyledSVG />
            <Typography variant="h6" color="textSecondary">
              You have no public boards
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Create a new board and make it public to see it here!
            </Typography>
          </EmptyStateContainer>
        )}
      </MainContent>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ProfileContainer>
  );
};

export default Profile;