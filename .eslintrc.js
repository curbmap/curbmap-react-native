module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint', // needed for class properties
  rules: {
    semi: ['error', 'never'],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
  },
}
