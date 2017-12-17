import React from 'react';
import Item from './item'

class ExpenseList extends React.Component{  
    constructor(props){
        super(props)
        this.deleteItem = this.deleteItem.bind(this);
    }
    deleteItem(id){
        const userId = this.props.userId
        fetch(`/api/expensesitems/${id}`,{
            method:'DELETE',
        })
        .then(()=>{
            this.props.fetchExpenses();
            this.props.fetchUserData();
        })
    }  
   render(){
       return(
            <div className="expense-list">
            <ul className="expenseItemsList">  
               {this.props.expenseItems.map((expenseItem, id)=>{
                    return (<Item key={id} item={expenseItem.item} cost={expenseItem.cost} date={expenseItem.date} notes ={expenseItem.notes} category={expenseItem.category} deleteItem={this.deleteItem} id={expenseItem._id} />);
               })}
               </ul>
            </div>
        )
   }
}

export default ExpenseList;


    