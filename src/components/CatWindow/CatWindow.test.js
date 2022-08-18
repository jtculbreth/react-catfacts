import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CatWindow from './CatWindow';
import App from '../../App';

describe('<CatWindow />', () => {

  beforeEach(() =>{
    const data = require("../../data.json");

    localStorage.setItem("cats", JSON.stringify(data));
  })

  test('it should mount and welcome user', () => {
    render(<CatWindow />);
    
    const catWindow = screen.getByText('Welcome to Cat Facts');

    expect(catWindow).toBeInTheDocument();
  })
  test('should display clicked CatInfo name in CatWindow', async () => {
    render(<App/>)
    const catItems = screen.getAllByTestId("CatItem");
    const catItemNames = screen.getAllByTestId("CatItemName");

    for (let i in catItems){
      fireEvent.click(catItems[i]);
      const name = catItemNames[i];
      const windowName = screen.getByTestId("windowName");
      expect(name===windowName.textContent).toBeTruthy;
    }
  })
  test('Number of views should match times clicked', async ()=>{
    render(<App/>);
    const catItems = screen.getAllByTestId("CatItem");
    for (let i = 1; i < 5; i++){
      fireEvent.click(catItems[0]);
      const viewCount = screen.getByText("Number of views: "+i)
      expect(viewCount===i).toBeTruthy;
    }
  })
  test('Number of views should match localStorage', async ()=>{
    render(<App/>);
    const catItems = screen.getAllByTestId("CatItem");
    for (let i = 1; i < 5; i++){
      fireEvent.click(catItems[0]);
      const data = JSON.parse(localStorage.getItem("cats"));
      const ls_viewCount = data[0].view_count;
      const viewCount = screen.getByText("Number of views: "+i)
      expect(viewCount===ls_viewCount).toBeTruthy;
    }
  })
  test('edit button opens edit modal, close button closes edit modal', async ()=>{
    render(<App/>)
    const catItems = screen.getAllByTestId("CatItem");
    fireEvent.click(catItems[0]);
    const editButton = screen.getByText(/Edit/i);
    expect(editButton).toBeInTheDocument;
    fireEvent.click(editButton);
    const editForm = screen.getByText(/Edit Cat Facts/i);
    expect(editForm).toBeInTheDocument;
    const closeButton = screen.getByText(/Close/i);
    fireEvent.click(closeButton);
    expect(editForm).not.toBeInTheDocument;
  })
  test('edit modal should not save if fields are blank', async ()=>{
    render(<App/>)
    const catItems = screen.getAllByTestId("CatItem");
    fireEvent.click(catItems[0]);
    const editButton = screen.getByText(/Edit/i);
    fireEvent.click(editButton);
    const editForm = screen.getByText(/Edit Cat Facts/i);
    const saveButton = screen.getByText(/Save/i);
    fireEvent.click(saveButton);
    expect(editForm).toBeInTheDocument;
  })
  test('edit modal should render Invalid URL error if url is invalid', async ()=>{
    render(<App/>)
    const catItems = screen.getAllByTestId("CatItem");
    fireEvent.click(catItems[0]);
    const editButton = screen.getByText(/Edit/i);
    fireEvent.click(editButton);
    const editForm = screen.getByText(/Edit Cat Facts/i);
    const urlInput = screen.getByTestId(/urlInput/i);
    fireEvent.change(urlInput, { target: {value: "not a url"}})
    const saveButton = screen.getByText(/Save/i);
    fireEvent.click(saveButton);
    const urlError = screen.getByText(/Invalid URL/i);
    expect(urlError).toBeInTheDocument;
  })
  test('should prompt user to fill all fields if inputs are blank', async ()=>{
    render(<App/>)
    const catItems = screen.getAllByTestId("CatItem");
    fireEvent.click(catItems[0]);
    const editButton = screen.getByText(/Edit/i);
    fireEvent.click(editButton);
    const saveButton = screen.getByText(/Save/i);
    fireEvent.click(saveButton);
    const fieldsError = screen.getByText(/Please fill out all fields/i);
    expect(fieldsError).toBeInTheDocument;
  })
  test('should update CatWindow with validated save data, close modal', async ()=>{
    render(<App/>)
    const catItems = screen.getAllByTestId("CatItem");
    fireEvent.click(catItems[0]);
    const editButton = screen.getByText(/Edit/i);
    fireEvent.click(editButton);
    const saveButton = screen.getByText(/Save/i);
    const editName = screen.getByTestId(/editName/i);
    const urlInput = screen.getByTestId(/urlInput/i);
    const editDate = screen.getByTestId(/editDate/i);
    const editOwner = screen.getByTestId(/editOwner/i);
    //fill out all inputs with valid data
    const newURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/440px-React-icon.svg.png";
    const newName = 'Sir Robin';
    const newDate = "2022-01-02";
    fireEvent.change(urlInput, { target: {value: newURL}})
    fireEvent.change(editName, { target: {value: newName}})
    fireEvent.change(editDate, { target: {value: newDate}})
    expect(editOwner).toBeInTheDocument;
    //save and check CatWindow for update
    fireEvent.click(saveButton);
    const windowName = screen.getByTestId("windowName");
    const windowDate = screen.getByTestId("windowDate");
    expect(windowName===newName).toBeTruthy;
    expect(windowDate==='02 Jan 2022').toBeTruthy;
  })
  test('should update CatItem with saved cat name and date', async ()=>{
    render(<App/>)
    const catItems = screen.getAllByTestId("CatItem");
    const catItemNames = screen.getAllByTestId("CatItemName");
    const catItemDates = screen.getAllByTestId("CatItemDate");

    fireEvent.click(catItems[0]);
    const editButton = screen.getByText(/Edit/i);
    fireEvent.click(editButton);
    const saveButton = screen.getByText(/Save/i);
    const editName = screen.getByTestId(/editName/i);
    const urlInput = screen.getByTestId(/urlInput/i);
    const editDate = screen.getByTestId(/editDate/i);
    const editOwner = screen.getByTestId(/editOwner/i);
    //fill out all inputs with valid data
    const newURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/440px-React-icon.svg.png";
    const newName = 'Sir Robin';
    const newDate = "2022-01-02";
    fireEvent.change(urlInput, { target: {value: newURL}})
    fireEvent.change(editName, { target: {value: newName}})
    fireEvent.change(editDate, { target: {value: newDate}})
    expect(editOwner).toBeInTheDocument;
    //save and check CatItem for update
    fireEvent.click(saveButton);
    const catItemName = catItemNames[0].textContent;
    const catItemDate = catItemDates[0].textContent;
    expect(catItemName===newName).toBeTruthy;
    expect(catItemDate==='02 Jan 2022').toBeTruthy;
  })
  test('delete button opens delete modal, No! button closes delete modal', async ()=>{
    render(<App/>)
    const catItems = screen.getAllByTestId("CatItem");
    fireEvent.click(catItems[0]);
    const deleteButton = screen.getByText(/Delete/i);
    expect(deleteButton).toBeInTheDocument;
    fireEvent.click(deleteButton);
    const deleteForm = screen.getByText(/Are you sure you want to delete this adorable cat/i);
    expect(deleteForm).toBeInTheDocument;
    const closeButton = screen.getByText(/No! It's too cute./i);
    fireEvent.click(closeButton);
    expect(deleteForm).not.toBeInTheDocument;
  })
  test('delete confirmation should delete catItem from Sidebar, close modal, display welcome', async () =>{
    render(<App/>)
    const catItems = screen.getAllByTestId("CatItem");
    fireEvent.click(catItems[0]);
    const deleteButton = screen.getByText(/Delete/i);
    expect(deleteButton).toBeInTheDocument;
    fireEvent.click(deleteButton);
    const deleteConfirm = screen.getByText(/Yes, I am a merciless cat deleter/i);
    fireEvent.click(deleteConfirm);
    expect(catItems[0]).not.toBeInTheDocument;
    const welcome = screen.getByText(/Welcome to Cat Facts/i);
    expect(welcome).toBeInTheDocument;
    expect(deleteConfirm).not.toBeInTheDocument;
  })
})

