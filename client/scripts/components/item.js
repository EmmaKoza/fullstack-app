import React from 'react';
import ReactDom from 'react-dom';


//the item you track expenses for 
const Item =(props)=>{
    return(
        <li className="expense-item">
        <button id="delete item" onClick={()=>props.deleteItem(props.id)}><i className="fa fa-close"></i></button>
            <span className="purchase-date">{props.date.split('T')[0]}</span>
            <h3>{props.item}</h3>
            <p><strong>Category: </strong>{props.category}</p>
            <p><strong>Notes: </strong>{props.notes}</p>
            <p className="cost">${props.cost}</p>
        
        </li>
    )
}

export default Item;  