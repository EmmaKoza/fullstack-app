import React from 'react';
import Field from './Field';

//i should rename this to budget calculator... 
class ExpenseCalcForm extends React.Component {  
    render(){
        return(
            <form id="calcBudget"action="#" onSubmit={e => this.props.handleSubmit(e)}>
                <fieldset>
                    <Field
                        type="text"
                        name="income"
                        label="Enter your weekly income"
                        value={this.props.income}
                        onChange={this.props.handleChange}
                    />
                </fieldset>
                <fieldset>
                    <Field
                        type="text"
                        name="rent"
                        label="Enter your monthly rent"
                        value={this.props.rent}
                        onChange={this.props.handleChange}
                    />
                </fieldset>
                <fieldset>
                <Field
                        type="text"
                        name="savings"
                        label="The amount you put into savings each week"
                        value={this.props.savings}
                        onChange={this.props.handleChange}
                    />
                </fieldset>
                {/* <fieldset>
                <Field
                        type="text"
                        name="savings"
                        label="The amount you put into savings each week"
                        value={this.props.income}
                        onChange={this.props.handleChange}
                    />
                </fieldset> */}
                <fieldset>
                <Field
                        type="text"
                        name="recurring"
                        label="Total amount of any recurring weekly costs (debt payment, insurance)"
                        value={this.props.income}
                        onChange={this.props.handleChange}
                    />
                </fieldset>

                <input className="button" type="submit" value="update budget"/>
              
            </form>
        )
    }
}

export default ExpenseCalcForm;

