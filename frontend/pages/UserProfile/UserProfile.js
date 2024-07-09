import React, { useEffect, useState } from 'react';
import { Typography, Box, styled, Grid, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { fetchUserProfile, fetchPublicBoards, followUser, unfollowUser } from '../../redux/actions/userActions';
import { Link as LinkIcon } from 'lucide-react';
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

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username } = useParams();
  const { user: profileUser, loading, error } = useSelector((state) => state.user);
  const currentUser = useSelector((state) => state.auth.user);
  const [isFollowing, setIsFollowing] = useState(false);
  const [publicBoards, setPublicBoards] = useState([]);
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

  // Fetch user profile and public boards
  useEffect(() => {
    if (username) {
      dispatch(fetchUserProfile(username));
      dispatch(fetchPublicBoards(username))
        .then(boards => setPublicBoards(boards))
        .catch(error => {
          // Handle error
          setSnackbar({ open: true, message: 'Failed to fetch public boards', severity: 'error' });
        });
    }
  }, [dispatch, username]);

  // Check if current user is following the profile user
  useEffect(() => {
    if (profileUser && currentUser) {
      setIsFollowing(profileUser.followers?.includes(currentUser.id) || false);
    }
  }, [profileUser, currentUser]);

  // Handle follow/unfollow toggle
  const handleFollowToggle = () => {
    if (profileUser) {
      const action = isFollowing ? unfollowUser : followUser;
      dispatch(action(profileUser.id))
        .then(() => {
          setIsFollowing(!isFollowing);
          // Update the follower count locally
          const newFollowerCount = isFollowing
            ? (profileUser.followers?.length || 1) - 1
            : (profileUser.followers?.length || 0) + 1;
          
          // Update the profileUser state
          dispatch({
            type: 'UPDATE_PROFILE_USER',
            payload: {
              ...profileUser,
              followers: Array(newFollowerCount).fill(currentUser.id)
            }
          });
  
          setSnackbar({
            open: true,
            message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
            severity: 'success'
          });
  
          // Re-fetch the user profile to get the updated data from the server
          dispatch(fetchUserProfile(username));
        })
        .catch(error => {
          // Handle error
          setSnackbar({
            open: true,
            message: 'Failed to update follow status',
            severity: 'error'
          });
        });
    }
  };

  // Handle snackbar close
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !profileUser) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography align="center">User not found</Typography>
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
              name={profileUser?.fullName}
              width="128px"
              height="128px"
              fontSize="3rem" 
              avatarUrl={profileUser?.avatarUrl}
            />
          </AvatarWrapper>
          <Typography variant="h4" fontWeight="bold" mt={2}>{profileUser?.fullName}</Typography>
          <Typography color="text.secondary">{profileUser?.username}</Typography>
          <AboutText>{profileUser?.about}</AboutText>
          <Box display="flex" alignItems="center" mt={2}>
            <Typography variant="body2" color="text.secondary" mr={2}>{profileUser?.followers?.length || 0} followers</Typography>
            <Typography variant="body2" color="text.secondary" mr={2}>{profileUser?.following?.length || 0} following</Typography>
            {currentUser && currentUser.id !== profileUser?.id && (
              <Button 
                variant="contained"
                style={{ 
                  backgroundColor: isFollowing ? "#889499" : "#22a4f1",
                  color: "#FFFFFF"
                }}
                onClick={handleFollowToggle}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </Box>
        </ProfileSection>

        <Typography variant="h6" gutterBottom>Public Boards</Typography>
        {publicBoards.length > 0 ? (
          <Grid container spacing={2}>
            {publicBoards.map((board) => (
              <Grid item xs={12} sm={6} md={3} key={board.id || board.boardId}>
                <Box>
                  <Link to={`/${profileUser?.username}/board/${board.boardId}`} style={{ textDecoration: 'none' }}>
                    <BoardCard background={board.background || 'default.jpg'} />
                    <CardInfo>
                      <CardTitle>{board.title}</CardTitle>
                      <CardSubtitle>{profileUser?.fullName} • {getTimeAgo(board.updatedAt)}</CardSubtitle>
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
              No public boards available
            </Typography>
            <Typography variant="body1" color="textSecondary">
              This user hasn't created any public boards yet.
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

export default UserProfile;