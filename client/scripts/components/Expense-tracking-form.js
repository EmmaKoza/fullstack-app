import React from 'react';
import Field from './field';


class TrackExpensesForm extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            date:'',
            item:'',
            cost:0,
            notes:'',
            category:'',
            errors: {},
            
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addExpenseItem = this.addExpenseItem.bind(this);
    }

    addExpenseItem(){
        const userId = this.props.userId;
        const expenseItem = Object.assign({date:this.state.date, item: this.state.item, cost:this.state.cost, notes:this.state.notes,category:this.state.category, userId: this.props.userId});
        fetch('/api/expensesitems',{
            method:'POST',
            //have to turn it into a string to post because fetch is weird 
            body: JSON.stringify(expenseItem), 
            headers:{
                'content-type': 'application/json',
            }
        })
        .then((res)=>{
            console.log(res);
            if(res.ok){
                this.props.fetchExpenses(); // <-- list of expenses
                this.props.fetchUserData(); 
                // this.props.fetchUserData();
                res.json().then(json=>this.setState({errors:json.errors}));
            }

        })
    }
   
    handleChange(e){
        this.setState({[e.target.name] : e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.addExpenseItem();
    }
    render(){
       
        return(
            <div className="track-expenses">
               <form id="trackExpenses" onSubmit={e => this.handleSubmit(e)}>
                   <fieldset>
                   <Field
                      type="date"
                        name="date"
                        label="Purchase Date"
                        value={this.state.date}
                        onChange={this.handleChange}
                     />
                        {/* {
                            this.state.errors.date &&
                            <span className="error">This is a required field.</span>
                        } */}
                   </fieldset>
                   <fieldset>
                   <Field
                        type="text"
                        name="cost"
                        label="Item(s) cost"
                        value={this.state.cost}
                        onChange={this.handleChange}
                     />
                        {/* {
                            this.state.errors.date &&
                            <span className="error">This is a required field.</span>
                        } */}
                   </fieldset>
                    <fieldset >
                        <Field
                            type="text"
                            name="item"
                            label="Item(s) purchased"
                            value={this.state.item}
                            onChange={this.handleChange}
                        />
                        {/* {
                            this.state.errors.item &&
                            <span className="error">This is a required field.</span>
                        } */}
                    </fieldset>
                    <fieldset>
                        <label htmlFor="notes">Additional notes:</label>
                        <textarea id="notes"name="notes" cols="30" rows="10"
                        value={ this.state.notes }
                        onChange={e => this.handleChange(e)} >
                        </textarea>
                    </fieldset>
                    <fieldset >
                        <label htmlFor="category">Category:</label>
                        <select name="category" id="category"
                         onChange={e => this.handleChange(e)} >    
                        <option value="null">please select from the options below</option>
                        <option value="groceries">Groceries</option>
                        <option value="utilities">Utilities</option>
                        <option value="transportation">Transportation</option>
                        <option value="eating out">Eating Out</option>
                        <option value="personal">Personal</option>
                        <option value="child">Child</option>
                        <option value="living">Living</option>
                        <option value="entertainment">Entertainment</option>
                    
                    </select>
                        {/* {
                            this.state.errors.category &&
                            <span className="error">This is a required field.</span>
                        } */}
                    </fieldset>
                   
                  
                   <input className="button" type="submit" value="submit item"/>
               </form>
           </div>
        )
    }
}

export default TrackExpensesForm; 