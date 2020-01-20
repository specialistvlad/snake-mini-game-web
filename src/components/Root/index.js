import React, { useState, useEffect } from 'react';
import Grid from '../Grid';
import './style.css';
import { colors } from '../../types';

const size = 25;
const random = (max) => Math.floor((Math.random() * max));
const getArrayLength = (length) => [...Array(length).keys()];
const getNewArea = (n) => getArrayLength(size).map(() => getArrayLength(size));
const randomColorValue = () => Object.keys(colors)[random(Object.keys(colors).length)];
const randomizeArea = (area) => area.map((row) => row.map(randomColorValue));

export default () => {
  const [area, setArea] = useState(getNewArea());

  useEffect(() => {
    setInterval(() => {
      setArea(randomizeArea(getNewArea()));
    }, 50);
  }, []);

  return (<Grid rows={area}/>);
};
