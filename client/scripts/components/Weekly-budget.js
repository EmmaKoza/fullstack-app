import React from 'react';
import ReactDom from 'react-dom';

class WeeklyBudget extends React.Component{


    render(){
        console.log('remaining', this.props.remaining);
        console.log(this.props);
       return(
            <budget className="budget-update">
                <div className="wrapper">
                   <p>total weekly budget: {this.props.budget}</p>
                <p><span className="remaining">${this.props.remaining} </span></p>
                {/* {if props.remaining is = 0 then notify in some way} */} 
            
                </div>
                
            </budget>
        )
   }
}

export default WeeklyBudget;