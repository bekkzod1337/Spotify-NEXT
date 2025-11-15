// tailwind.config.js
module.exports = {
  // ...
  theme: {
    extend: {
      keyframes: {
        'glow-underline': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'border-glowunderline': 'glow-underline 2s linear infinite',
      },
    },
  },
}
