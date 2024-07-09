export const formatCardData = (card) => {
    return {
      ...card,
      createdAt: new Date(card.createdAt),
      updatedAt: new Date(card.updatedAt),
      // Add any other necessary formatting here
    };
  };