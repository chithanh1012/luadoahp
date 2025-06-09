module.exports = (ctx) => ({
  map: ctx.options.map,
  plugins: {
    autoprefixer: true,
    'postcss-sort-media-queries': {
      sort: 'mobile-first',
    },
    cssnano: false,
  },
})
