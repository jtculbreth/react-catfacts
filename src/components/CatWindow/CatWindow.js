import React, { useState } from 'react';
import './CatWindow.css';
import { useCat, useCatUpdate } from '../../contexts.js';
import { Button, Modal } from 'react-bootstrap';

//Main Display on Right
const urlRegex = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function CatWindow() {

  //get selected cat props from context
  const selected = useCat();
  const select = useCatUpdate();

  //Edit Modal state + handlers
  const [showEdit, setShowEdit] = useState(false);

  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  //Delete Modal state + handlers
  const [showDelete, setShowDelete] = useState(false)

  const handleShowDelete = () => setShowDelete(true);
  const handleCloseDelete = () => setShowDelete(false);

  //determine localStorage index for cat to be edited/deleted
  let cats = JSON.parse(localStorage.getItem("cats"));
  let index;
  if (selected != null) {
    index = cats.findIndex(cat => cat.id === selected.id);
  }
  //Upon delete confirmation, splice array, return new JSON string, and set selected to null
  function handleConfirmDelete() {
    cats.splice(index, 1);
    cats = JSON.stringify(cats);
    localStorage.setItem("cats", cats);
    select(null);
  }

  //validate URL
  function is_url(str) {
    if (urlRegex.test(str)) {
      return true;
    }
    else {
      return false;
    }
  }

  function handleSaveEdit() {
    document.getElementById("catErrors").innerHTML = "";
    let hasErrors = false;
    const errors = [];
    const newName = document.getElementById("name").value;
    const newBirthday = document.getElementById("bday").value;
    const newURL = document.getElementById("url").value;
    const newOwner = document.getElementById("owner").value;

    //validate url
    if (!is_url(newURL)) {
      hasErrors = true;
      errors.push("Invalid URL");
    }
    //validate other fields
    if (!newName || !newOwner || !newBirthday) {
      hasErrors = true;
      errors.push("Please fill out all fields");
    }
    //save changes if no errors
    if (!hasErrors && typeof index === "number") {
      cats[index].name = newName;
      cats[index].thumbnail_url = newURL;
      cats[index].owner = newOwner;
      cats[index].birthdate = newBirthday;
      cats[index].views_count -= 1;
      localStorage.setItem("cats", JSON.stringify(cats));
      select(cats[index]);
      handleCloseEdit();
    }
    //display any errors
    else {
      for (let i in errors) {
        let error_div = document.createElement('div');
        error_div.innerHTML = errors[i];
        document.getElementById("catErrors").append(error_div);
      }
    }

  }

  //check if cat props aren't in state, if not then welcome user
  if (selected == null) {
    return (
      <div>
        <h1>Welcome to Cat Facts</h1>
        <div className="pic jumbo_paw"></div>
        <h3>Click a cat to see their facts</h3>
      </div>
    )
  } else {
    //define picture div styling
    const picStyle = { backgroundImage: `url(${selected.thumbnail_url})` };

    //format birthday
    const d = new Date(selected.birthdate);
    const day = d.getDate()
    const month = months[d.getMonth()]
    const year = d.getFullYear();
    const formattedDate = day + " " + month + " " + year;


    return (
      <div className="window">
        <div className="picWrapper">
          <div className="pic" style={picStyle}></div>
        </div>
        <div className="infoWrapper">
          <div className="paw"></div>
          <div className="info">
            <div data-testid="windowName">{selected.name}</div>
            <div data-testid="windowDate">{formattedDate}</div>
            <div>{selected.owner_name}</div>
            <div>Number of views: {selected.views_count + 1}</div>
            <div className="buttons">
              <button onClick={handleShowEdit}>Edit</button> | <button onClick={handleShowDelete}>Delete</button>
            </div>
          </div>
        </div>

        {/*EditForm Modal*/}
        <Modal show={showEdit} onHide={handleCloseEdit}>
          <Modal.Header>
            <Modal.Title>Edit Cat Facts</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="row">
              <div className="col-sm-4 col-md-4 col-lg-4 form_label">
                <label >Thumbnail URL</label><br />
                <label >Name</label><br />
                <label >Birthday</label><br />
                <label > Owner</label><br />
              </div>
              <div className="col-sm-8 col-md-8 col-lg-8 form_input">
                <input type="url" name="url" id="url" data-testid="urlInput" placeholder={selected.thumbnail_url} /><br />
                <input type="text" name="name" id="name" data-testid="editName" placeholder={selected.name} /><br />
                <input type="date" name="bday" id="bday" data-testid="editDate" placeholder={selected.birthdate} /><br />
                <select id="owner" name="owner" data-testid="editOwner">
                  <option value={selected.owner_name}> {selected.owner_name}</option>
                </select>
              </div>
              <div id="catErrors"></div>
            </div>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEdit}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              Save
            </Button>
          </Modal.Footer>

        </Modal>

        {/*DeleteForm Modal*/}
        <Modal show={showDelete} onHide={handleCloseDelete}>
          <Modal.Header>
            <Modal.Title>Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this adorable cat?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDelete}>
              No! It's too cute.
            </Button>
            <Button variant="primary" onClick={handleConfirmDelete}>
              Yes, I am a merciless cat deleter
            </Button>
          </Modal.Footer>
        </Modal>

      </div>

    )
  }

};

export default CatWindow;
