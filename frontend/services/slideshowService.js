import api from './api';

// Get a shared slideshow using a share token
export const getSharedSlideshow = async (shareToken) => {
  try {
    const response = await api.get(`/share/slideshow/${shareToken}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get cards for a shared slideshow using a share token
export const getSharedSlideshowCards = async (shareToken) => {
  try {
    const response = await api.get(`/share/slideshow/${shareToken}/cards`);
    return response.data;
  } catch (error) {
    throw error;
  }
};