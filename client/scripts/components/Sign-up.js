import React from 'react';
import Field from './Field'


class SignUp extends React.Component{
    constructor(props){
        super(props);

        this.state={
            name: '',
            email: '',
            password: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleSubmit(e){
        e.preventDefault();
        const user =Object.assign({}, this.state);
        fetch('/api/signup',{
            method:'POST',
            credentials: 'include',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        })
        .then((res)=> {
            // console.log(res)
            res.json()
        })
        .then((json)=> {
            this.setState({user: json});// need to set json to state
            // this.props.refresh();
        })
        .then(() => this.props.refresh() );
    }
    render(){
        return(
            <div className="signup-form">
            <h1>Sign up</h1>
            <form onSubmit={this.handleSubmit}>
                <Field
                    type="text"
                    name="name"
                    label="Name"
                    value={this.state.name}
                    onChange={this.handleChange}
                />
                <Field
                    type="email"
                    name="email"
                    label="Email"
                    value={this.state.email}
                    onChange={this.handleChange}
                />
                <Field
                    type="password"
                    name="password"
                    label="Password"
                    value={this.state.password}
                    onChange={this.handleChange}
                />
                <button className="button">Sign Up</button>
            </form>
        </div>
            
        )
    }
}

export default SignUp;