import React from "react";
import './App.css'

const Welcome = (props) => {
    return(
    <dialog id="welcome" className="welcome" open>
        <div className="titleBar">
            <button id="closeBtn" onClick={props.close} title="Close window">X</button>
        </div>
        <h1>Welcome to QuickNotes!</h1>
        <p>QuickNotes is an application that allows you to save all your notes and photos in one convenient place.</p>
        <p>Choose one of the three buttons in the top right panel to get started:</p>
        <ul>
            <li>- Toggle the switch to change themes</li>
            <li>- Click the triangle (▲) to upload a photo</li>
            <li>- Click the plus sign (+) to create a new note</li>
            <li>- Click the "x" to delete an item and close the window</li>
        </ul>
    </dialog>
    )
}

export default Welcome