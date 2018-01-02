import React from 'react';
import { render } from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { Router as Router, Route, Link , NavLink,  Redirect} from 'react-router-dom';


//my components
import ExpenseCalcForm from './components/Expense-calc-form.js';
import WeeklyBudget from './components/Weekly-budget.js';
import TrackExpensesForm from './components/Expense-tracking-form.js';
import ExpenseList from './components/Expense-list.js';
import DateFilter from './components/Date-Filter.js';
import Footer from './components/Footer.js';
import Home from './components/Home.js';
import SignUp from './components/Sign-up.js';
import Login from './components/Login.js';
import Dash from './components/Dashboard.js';



const history = createBrowserHistory();

class App extends React.Component{
    constructor(props){
        super(props);
        //setting state for all the numbers the user will enter
        this.state={
            income:0,
            rent:0,
            savings:0,
            recurring:0,
            budget:0,
            expenseList:[], 
            userId:'',
            loggedIn:false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.fetchExpenses = this.fetchExpenses.bind(this);
        this.fetchUserData = this.fetchUserData.bind(this);
        this.login = this.login.bind(this);
        this.refresh = this.refresh.bind(this);
        this.saveUserInfo = this.saveUserInfo.bind(this);
        this.logout = this.logout.bind(this);
        this.toggleNav = this.toggleNav.bind(this);
    }

    handleChange(e){ 
        this.setState({[e.target.name] : e.target.value });
    }
    login(){
        console.log('you are logged in!')
        this.setState({
            loggedIn:true,
        })
        this.fetchExpenses();
    }
    logout(){
        fetch('/api/logout',{
            method:'GET',
            credentials:'include',
        })
        .then(()=>{
            this.setState({
                loggedIn:false,
                user:null,
            })  
        })
    }

    toggleNav(e){
        e.preventDefault();
        const nav = document.querySelector('.main-nav');
        const toggleBtn = document.querySelector('.menu-toggle')
        if(nav.classList.contains('active')){
            nav.classList.remove('active'); 
            toggleBtn.classList.remove('active');
        }else{
            nav.classList.add('active');
            toggleBtn.classList.add('active');
        }
    }

    saveUserInfo(){
        const id = this.state.userId;
        const userInfo = Object.assign({}, this.state);
        fetch(`/api/userprofiles/${id}`,{
            method:'PUT',
            headers:{
                'Content-Type': 'application/JSON',  
            },
            body: JSON.stringify(userInfo)

        })
        .then(res => res.json())
        .then((json)=>{
            console.log(json);
            this.setState({user:json})
        })
        
    }

    handleSubmit(e){
        e.preventDefault();
        this.saveUserInfo();
    }
    fetchExpenses(){
       const id = this.state.userId;
        fetch(`/api/expensesitems?userId=${id}`)
            .then(resp => resp.json())
            .then((json)=>{
                this.setState({expenseList:json});
            });
                      
    }
    refresh() {
        fetch('/api/me', {
            method: 'GET',
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((user) => {
            if (user._id) {
                this.setState({
                    user: user,
                    userId:user._id
                });
                const id = this.state.userId;
                console.log(id);
               this.login();
               this.fetchUserData();            
            }
        });
    }
    fetchUserData(){
        fetch(`/api/userprofiles`, {
            credentials: 'include',
        })
        .then(resp => resp.json())
        .then((json)=>{
            const user = Object.assign({}, json);
            this.setState({
                user: user,
            });           
        });
    }
    componentDidMount(){
        this.refresh();
        this.fetchUserData();
    }

    render() {
        return(
            <Router history={history}> 
                <div>
                    <header>
                        <div className="wrapper clearfix">
                                <span className="logo">Budgey</span>
                                {this.state.loggedIn &&
                                <nav>
                                    <ul className="main-nav">
                                        <li><NavLink to='/dashboard'>Home</NavLink></li>
                                        <li><NavLink to='/calculate-budget/'>Calculate Budget</NavLink></li>
                                        <li><NavLink to='/track-expenses/'>Track Expenses</NavLink></li>
                                        <li><NavLink to='/view-data/'>View Reports</NavLink></li>
                                        <li><button className="button" onClick={this.logout}>Logout</button></li>
                                    </ul>
                                    <a href="#" className="menu-toggle" onClick={this.toggleNav}>
                                        <span className="bar"></span>
                                    </a>
                                </nav>
                                }
                            
                        </div>
                    </header>
                    {/* home route */}
                    <Route exact path="/"  render={()=>
                        <Home 
        
                        />} />
                    {/* calculate budget route */}
                    <Route exact path="/calculate-budget"  
                        render={()=> (
                            this.state.loggedIn ?
                             ( <ExpenseCalcForm 
                                handleChange={this.handleChange} handleSubmit ={this.handleSubmit}fetchUserData={this.fetchUserData}/>)
                            :
                            (<Redirect push to='/'/>)
                            
                        )
                           
                        }/>
                    {/* track expenses routes */}
                    <Route exact path="/track-expenses" render={()=>(
                       this.state.loggedIn ?
                            (<WeeklyBudget remaining={this.state.user.remainingAmount} budget=  {this.state.user.budget} />)
                         :
                        (<Redirect push to='/'/>)
                        )
                    }/> 
                    <Route exact path="/track-expenses" render={()=>
                       ( this.state.loggedIn ?
                           (<ExpenseList userId ={this.state.userId} expenseItems = {this.state.expenseList} fetchExpenses={this.fetchExpenses} fetchUserData = {this.fetchUserData} />) :
                           (<Redirect push to='/'/>)
                       )}/>
                    <Route exact path="/track-expenses" render={()=>(
                        this.state.loggedIn ?
                          (<TrackExpensesForm fetchExpenses={this.fetchExpenses} userId={this.state.userId} fetchUserData = {this.fetchUserData} />) :
                          (<Redirect push to='/'/>)
                    )}/>

                    <Route exact path="/view-data"render={()=>(
                        this.state.loggedIn ?
                        (<DateFilter id={this.state.userId}/>) :
                        (<Redirect push to='/'/>)
                    )}/>
                    {/* no link to this in the menu */}
                    <Route exact path="/sign-up"render={()=>(
                        this.state.loggedIn ?
                        (<Redirect push to='/dashboard'/>) :
                        (<SignUp refresh={this.refresh} />)
                    )}/>
                    <Route exact path="/login"render={()=>(
                        this.state.loggedIn ?
                        (<Redirect push to='/dashboard'/>) :
                        (<Login refresh={this.refresh} loggedIn={this.state.loggedIn}/>)
                    )}/>
                    <Route exact path="/dashboard"render={()=>(
                        this.state.loggedIn ?     
                        (<Dash/>) :
                        (<Redirect push to='/login'/>) 
                    )}/>
        
                
               </div>
            </Router>
        )
    }
}

render(<App />, document.getElementById('app'));
