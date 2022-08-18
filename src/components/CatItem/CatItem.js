import React from 'react';
import './CatItem.css';
import { useCatUpdate } from '../../contexts.js'



function CatItem(props) {
  let cats = JSON.parse(localStorage.getItem("cats"));

  let index = cats.findIndex(cat => cat.id == props.id);

  //set img background to pic url
  let picStyle = { backgroundImage: `url(${props.thumbnail_url})` };
  const select = useCatUpdate();

  //passes clicked component's props to state and increases click count
  function handleClick() {
    cats[index].views_count += 1;
    let catsNew = JSON.stringify(cats);
    localStorage.setItem("cats", catsNew);
    select(props);
  }

  function isValidDate(date) {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
  }

  let formattedDate;

  //validate and format date
  if (isValidDate(props.birthdate)) {
    let d = new Date(props.birthdate);
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let day = d.getDate()
    let month = months[d.getMonth()]
    let year = d.getFullYear();
    formattedDate = day + " " + month + " " + year;
  }
  else {
    formattedDate = "Ageless...or invalid birthday";
  }

  return (

    <div onClick={handleClick} className="CatItem" data-testid="CatItem">
      <div className="catItemPicWrapper">
        <div className="catItemPic" style={picStyle}></div>
      </div>
      <div className="catName" data-testid="CatItemName">{props.name}</div>
      <div className="catBday" data-testid="CatItemDate">{formattedDate}</div>
    </div>

  )
}

export default CatItem;
