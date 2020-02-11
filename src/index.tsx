import './index.css';

import React from 'react';

import { render } from 'react-dom';
import Game from './components/Game';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

render(<Game />, document.getElementById('root'));
