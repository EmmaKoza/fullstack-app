import React from 'react';


const Footer=()=>{
    const d = new Date
         
    return(
        <footer>
            <div className="wrapper">
                <p><span className="copyright"><i className="fa fa-copyright"/>{d.getFullYear()}</span></p>     
            </div>
        </footer>
    )
};

export default Footer; 