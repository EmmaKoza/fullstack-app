import React from 'react';
import Field from './Field'


class Login extends React.Component{
    constructor(){
        super();

        this.state={
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

      fetch('/api/login',{
          method:'POST',
          headers:{
              'Content-Type': 'application/json',
          },
          credentials:'include',
          body:JSON.stringify(user)
      })
      .then((res)=>{
        if (res.status !== 401) {
            return res.json();                
        } else {
            console.log('false')
              return window.alert('Username and password do not match');
          }
      })
      .then((json)=>{
         this.props.refresh();
      })
    }

    render(){
        return(
                <div className="login-form">              
                  <h1>Login</h1>
                    <form onSubmit={this.handleSubmit}>
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
                        <button className="button">Login</button>
                    </form>
                  </div>    
        )
    }
}

export default Login;