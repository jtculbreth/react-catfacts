import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CatItem from './CatItem';

const data = require("../../data.json");
  
localStorage.setItem("cats", JSON.stringify(data));

describe('<CatItem />', () => {
  test('it should mount', () => {
    render(<CatItem />);
    
    const catItem = screen.getByTestId('CatItem');

    expect(catItem).toBeInTheDocument();
  });
});

