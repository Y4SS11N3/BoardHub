import * as folderService from '../../services/folderService';

export const FETCH_FOLDERS_SUCCESS = 'FETCH_FOLDERS_SUCCESS';
export const RENAME_FOLDER_REQUEST = 'RENAME_FOLDER_REQUEST';
export const RENAME_FOLDER_SUCCESS = 'RENAME_FOLDER_SUCCESS';
export const RENAME_FOLDER_FAILURE = 'RENAME_FOLDER_FAILURE';
export const DELETE_FOLDER_REQUEST = 'DELETE_FOLDER_REQUEST';
export const DELETE_FOLDER_SUCCESS = 'DELETE_FOLDER_SUCCESS';
export const DELETE_FOLDER_FAILURE = 'DELETE_FOLDER_FAILURE';

// Async action to rename a folder
export const renameFolder = (folderId, newName) => async (dispatch) => {
  dispatch({ type: RENAME_FOLDER_REQUEST });
  try {
    const response = await folderService.renameFolder(folderId, newName);
    dispatch({
      type: RENAME_FOLDER_SUCCESS,
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: RENAME_FOLDER_FAILURE,
      payload: error.message,
    });
  }
};

// Async action to delete a folder
export const deleteFolder = (folderId) => async (dispatch) => {
  dispatch({ type: DELETE_FOLDER_REQUEST });
  try {
    const response = await folderService.deleteFolder(folderId);
    dispatch({
      type: DELETE_FOLDER_SUCCESS,
      payload: folderId,
    });
  } catch (error) {
    dispatch({
      type: DELETE_FOLDER_FAILURE,
      payload: error.message,
    });
  }
};