import React from 'react';


const Dash = (props) =>{
    let moneyQuotes = [
        {quote:'Wealth consists not in having great possessions, but in having few wants.', source:'Epictetus'}, 
        {quote:'Money looks better in the bank than on your feet.', source:'Sophia Amauso'},
        {quote:'Smart women figure out what, exactly, makes them happiest. They spend generously on those things but cut out the rest', source:'Laura Vanderkam'},
        {quote:'Beware of little expenses; a small leak will sink a great ship', source:'Benjamin Franklin'},
        {quote:'You must gain control over your money or the lack of it will forever control you', source:'Dave Ramsey'},
        {quote:'A simple fact that is hard to learn is that the time to save money is when you have some.', source:'Joe Moore'},
    ]
    const random = moneyQuotes[Math.floor(Math.random() * moneyQuotes.length)];
    return(
        <div className="welcomescreen">
            <h1>Welcome Back! </h1>
                <blockquote>
                    <p><span className="left quote">&#8220;</span> {random.quote} <span className="right quote">&#8221;</span></p>
                    <p className="source">	<span className="dash">&mdash;</span> {random.source} </p>
                </blockquote>
            </div>
    )
}

export default Dash; 