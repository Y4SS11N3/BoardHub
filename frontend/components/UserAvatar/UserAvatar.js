import React, { useState, useEffect } from 'react';

const UserAvatar = ({ name, width, height, fontSize, onColorGenerated = () => {}, avatarUrl }) => {
  const [color, setColor] = useState('#ccc');

  // Effect to generate or retrieve avatar color
  useEffect(() => {
    if (!avatarUrl) {
      const storedColor = localStorage.getItem(`userAvatarColor_${name}`);
      if (storedColor) {
        setColor(storedColor);
        onColorGenerated(storedColor);
      } else {
        const colors = ['#FFB900', '#F7630C', '#E74856', '#0078D7', '#0099BC', '#7A7574', '#767676', '#FF8C00', '#E81123', '#0063B1'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setColor(randomColor);
        localStorage.setItem(`userAvatarColor_${name}`, randomColor);
        onColorGenerated(randomColor);
      }
    }
  }, [name, onColorGenerated, avatarUrl]);

  // Render avatar image if URL is provided
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        style={{
          width: width || '30px',
          height: height || '30px',
          borderRadius: '50%',
          objectFit: 'cover',
        }}
      />
    );
  }

  // Render initial-based avatar if no URL is provided
  const initial = name ? name.charAt(0).toUpperCase() : '';

  return (
    <div
      style={{
        backgroundColor: color,
        width: width || '30px',
        height: height || '30px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: fontSize || '15px',
      }}
    >
      {initial}
    </div>
  );
};

export default UserAvatar;