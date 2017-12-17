import React from 'react';
import { PieChart, Pie, Tooltip } from 'recharts';

import Item from './item';

class History extends React.Component{
    constructor(props){
        super(props)
        this.state={
            dataReady:false
        }
        this.createChart = this.createChart.bind(this);
    }
    createChart(){
        this.setState({dataReady:true});
        console.log('create a chart');
        console.log(this.props.chartData);

    }
    render(){
        return(
            <div>
            <div className="expense-history">
                <ul className="expenseItemsList">
                {this.props.filteredItems.map((filteredItem, id)=>{

                    return (<Item key={id} item={filteredItem.item} cost={filteredItem.cost} date={filteredItem.date} notes ={filteredItem.notes} category={filteredItem.category} deleteItem={this.deleteItem} id={filteredItem._id} />);
               })}
               </ul>
               </div>
               <div className="graphs">
                <h2>See a categorized breakdown of your costs.</h2>
                <button className="button" onClick={()=>this.createChart()}>View Cost Breakdown</button>
                { this.state.dataReady === true &&
                    <PieChart width={500} height={450}>
                      <Pie dataKey="value" isAnimationActive={true} data={this.props.chartData} cx={200} cy={200} outerRadius={80} fill="#22313F" label/>
                      <Tooltip/>
                    </PieChart>
                }
                </div>
          </div> 
          
         )  
    } 
}




export default History;