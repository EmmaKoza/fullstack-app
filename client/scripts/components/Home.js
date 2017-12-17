import React from 'react';


const Home = (props)=>{
    return(
   
            <div className="home-screen">
                    <h1>Stay on budget. The easy way.</h1>
                    <h2>Track your purchases to keep tabs on how much money you're spending and what you're spending it on.</h2>
                    <a href="/sign-up">
                        <button className="button">Get started.</button>
                    </a>
                    <span>Have an account? <a href="/login">Login</a></span>
                </div>
            
         

    )
}

export default Home;