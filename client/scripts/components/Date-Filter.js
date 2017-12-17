import React from 'react';
import History from './History.js';
// import {Doughnut} from 'react-chartjs-2';

class DateFilter extends React.Component{
    constructor(){
        super();
        this.state={
            startDate:'',
            endDate:'',
            filteredItems:[],
            chartData:[],
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.getCategoriesArray=this.getCategoriesArray.bind(this);
        this.getChartData=this.getChartData.bind(this);
        this.countInArray=this.countInArray.bind(this);
    }
    
    handleChange(e){
        this.setState({[e.target.id] : e.target.value });
    }
    
    handleSubmit(e){
        e.preventDefault();
        const startDate = this.state.startDate
        const endDate = this.state.endDate
        const id = this.props.id;
        fetch(`/api/expensesitems?userId=${id}&startDate=${startDate}&endDate=${endDate}`)
        .then(resp => resp.json())
        .then((json)=>{
            this.setState({ filteredItems: json});
            this.getCategoriesArray();
        });
    }
    getCategoriesArray(){
        const categoriesArray = this.state.filteredItems.map((item, index)=>{
            return item.category
        })
        this.getChartData(categoriesArray);
    }
    getChartData(array){ 
        //some seriously wet code 
        const groceriesCount = this.countInArray(array, 'groceries');
        const utilitiesCount = this.countInArray(array, 'utilities');
        const eatingOutCount = this.countInArray(array, 'eating out');
        const livingCount = this.countInArray(array, 'living');
        const childCount = this.countInArray(array, 'child');
        const transportationCount = this.countInArray(array, 'transportation');
        const entertainmentCount = this.countInArray(array, 'entertainment');
        const personalCount = this.countInArray(array, 'personal');
        
        const chartDataArray=[
            {
                name: 'Groceries',
                value: groceriesCount,
            },
            {
                name: 'Utilities',
                value: groceriesCount,
            },
            {
                name: 'Eating Out',
                value: eatingOutCount,
            },
            {
                name: 'Living',
                value: livingCount,
            },
            {
                name: 'Child',
                value: childCount,
            },
            {
                name: 'Transportation',
                value: transportationCount,
            },
            {
                name: 'Entertainment',
                value: entertainmentCount,
            },
            {
                name: 'Personal',
                value: personalCount,
            },
        ];

        this.setState({chartData:chartDataArray});

    }
    countInArray(array, what) {
        return array.filter(item => item == what).length;
    }


    render(){
        return(
            <div className="filter-form">
                <form action="#" className="date-filter"
                        onSubmit={e => this.handleSubmit(e)}>
                        <input type="date" id="startDate"
                        onChange={e => this.handleChange(e)} />
                        <input type="date" id="endDate"
                        onChange={e => this.handleChange(e)} />
                        <input type="submit" className="button" value="Filter Expenses!"/>
                    </form>
                { this.state.filteredItems.length !== 0 ?
                    <div>
                        <h3>You are viewing items from {this.state.startDate} to {this.state.endDate}</h3>                  
                        <History 
                            filteredItems={this.state.filteredItems}
                            chartData={this.state.chartData}/>
                     </div> 
                : null } 
                  
            
            </div>

        );
    }
}

export default DateFilter;