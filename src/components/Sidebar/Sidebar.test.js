import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Sidebar from './Sidebar';
import { CatProvider, SearchProvider } from '../../contexts';
import { CatWindow } from '../../components/CatWindow/CatWindow';
import App from '../../App.js';


describe('<Sidebar />', () => {

  beforeEach(() =>{
    const data = require("../../data.json");

    localStorage.setItem("cats", JSON.stringify(data));
  })

  test('it should mount', () => {
    render(<App/>);

    const sidebar = screen.getByTestId('Sidebar');

    expect(sidebar).toBeInTheDocument();
  });

  test('Num of CatItems should match num in localStorage', () => {
    let cats = JSON.parse(localStorage.getItem("cats"));
    render(<Sidebar />);

    const catItems = screen.getAllByTestId('CatItem');

    expect(cats.length).toBe(catItems.length);
  });

  test('should render search element', () => {
    render(<Sidebar />)
    const searchbar = screen.getByPlaceholderText("Search Cats by Name");
    expect(searchbar).toBeInTheDocument;
  });

  test('should render searched names, should not render unsearched names', () => {
    let cats = JSON.parse(localStorage.getItem("cats"));
    render(<Sidebar />)
    let catName = cats[0].name;
    const searchbar = screen.getByPlaceholderText("Search Cats by Name");
    fireEvent.change(searchbar, { target: { value: catName } })
    fireEvent.keyPress(searchbar, { key: 'Enter', code: 'Enter', charCode: 13 })
    const catNames = screen.getAllByTestId("CatItemName");
    let hasWrongName = false;
    let hasRightName = false;
    for (let i in catNames){
      if(catNames[i]!==catName){
        hasWrongName=true;
      }
      if(catNames[i]===catName){
        hasRightName=true;
      }
    }
    expect(hasWrongName).toBeFalsy
    expect(hasRightName).toBeTruthy
  })

});