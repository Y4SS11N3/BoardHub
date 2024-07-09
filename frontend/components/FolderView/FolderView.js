import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Box, Grid } from '@mui/material';
import { getFolderBoards } from '../../redux/actions/boardActions';
import BoardCard from '../BoardCard/BoardCard';

const FolderView = () => {
  const { folderId } = useParams();
  const dispatch = useDispatch();
  const folderBoards = useSelector(state => state.board.folderBoards || []);
  const folder = useSelector(state => state.board.folders.find(f => f.id === folderId));

  // Fetch folder boards when component mounts or folderId changes
  useEffect(() => {
    if (folderId) {
      dispatch(getFolderBoards(folderId));
    }
  }, [dispatch, folderId]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>{folder ? folder.name : 'Folder'}</Typography>
      <Grid container spacing={2}>
        {folderBoards.map(board => (
          <Grid item xs={12} sm={6} md={4} key={board.id}>
            <BoardCard board={board} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FolderView;