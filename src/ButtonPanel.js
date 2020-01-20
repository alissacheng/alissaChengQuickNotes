import React from "react";
import "./App.css";

const ButtonPanel = (props) => {
    return(
        <div>
            {/* Switch to toggle background color / theme */}
            <label className="switch" title="Change theme">
            <span className="visuallyHidden">Click here to change the theme</span>
                <input type="checkbox" onChange={props.toggleThemeProp} id="toggleTheme" className="visuallyHidden"/>
                <span className="slider"></span>
            </label>
            {/* Button to open dialog to create a new note */}
            <button type="open" onClick={props.openDialogProp} title="New note">
                <span className="visuallyHidden">Click here to write a new note</span>+
            </button>
        </div>
    )
}

export default ButtonPanel