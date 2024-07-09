import { format } from 'date-fns';

export const formatBoardData = (board) => {
  if (!board) return null;
  
  return {
    ...board,
    formattedCreatedAt: board.createdAt ? format(new Date(board.createdAt), 'PPP') : '',
    formattedUpdatedAt: board.updatedAt ? format(new Date(board.updatedAt), 'PPP') : '',
    slug: generateSlug(board.subject),
  };
};

export const generateSlug = (subject) => {
  if (!subject) return '';
  
  return subject
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

export const sortBoardsByDate = (boards, sortOrder = 'desc') => {
  return [...boards].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });
};