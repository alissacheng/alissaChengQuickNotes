import React, {Component} from "react";
import "./App.css";
import firebase from "./firebase.js"
import ImageUpload from "./ImageUpload"

class App extends Component {

    constructor(){
        super();
        this.state ={
            notesList:[],
            userInput: ""
        }
    }

    componentDidMount(){
    //connect to firebase
    const notesRef = firebase.database().ref().child("notes")
    notesRef.on("value", (snapshot) =>{
        const notes = snapshot.val();

        const newNotes = [];

        //for every object, we create a new object with two key values: note text and note id
        for(let key in notes){

          //Find out the key of each note value in firebase, to figure out how to delete each later
          const singleNote = {
              noteId: key,
              noteText: notes[key]
            }

            newNotes.push(singleNote)
        }

        //Update state for notes - taking new array and updating it
          this.setState({
              notesList:newNotes
          })
      })
      //Retrieve theme last saved from firebase database to place on page
      const themeRef = firebase.database().ref().child("theme")

      themeRef.on("value", (snapshot) =>{
        const theme = snapshot.val()

        let lavender = 0
        let cork = 0
        for (let key in theme){
          if(theme[key] === "lavender"){
            lavender += 1;
          }else{
            cork += 1;
          }

          if(lavender === cork){
            document.body.style.background = "url(./assets/corkBoard.jpg)"
            document.getElementById("toggleTheme").checked = false;
          }else{
            document.body.style.background = "#8386de"
            document.getElementById("toggleTheme").checked = true;
          }
        }
      })
    }
    //Open dialog form for creating a new note when user clicks the plus sign
    openDialog = () => {
      document.getElementById("dialog").setAttribute("open", true)
      document.getElementById("dialog").classList.remove("visuallyHidden")
    }
//Closing dialogs whenever user clicks the "x"
    closeDialog = () => {
      document.getElementById("dialog").removeAttribute("open")
      document.getElementById("dialog").classList.add("visuallyHidden")
      document.getElementById("welcome").removeAttribute("open")
      document.getElementById("welcome").classList.add("visuallyHidden")
    }
//Switches between two themes available whenever user toggles switch
//Pushes theme chosen to firebase to save preferred theme for later
    toggleTheme = (event) =>{
      const themeRef = firebase.database().ref().child("theme")
      if(event.target.checked === true){
        document.body.style.background = "#8386de"
        themeRef.push("lavender")
      }else{
        document.body.style.background = "url(./assets/corkBoard.jpg)"
        themeRef.push("cork")
      }
    }

    //Update state everytime user types inside input text bar
    handleChange = (event) =>{
        this.setState({
            userInput: event.target.value
        })
    }

    //Submitting form for creating a new note
    handleSubmit = (event) => {
        event.preventDefault();
        //Put what we submit, the book title, in a constant
        const addNote = this.state.userInput
        //add 'booksToAdd' to firebase (so that the dbRef listener will be called and it willl update state and cause the app to re-render)

        //push to firebase
        const notesRef = firebase.database().ref().child("notes")

        // Make sure no empty strings are submitted
        if(addNote !== ""){
            notesRef.push(addNote)
            //Make user input an empty string, make sure to update HTML with value attribute
            this.setState({
                userInput: ""
            })
        }
  
    }
//Delete written note by user
    deleteNote = (event) => {

        const notesRef = firebase.database().ref().child("notes");

        notesRef.child(event.target.id).remove();
    }
//Render on page
    render(){
        return(
            <main>
              {/* Toggle switch for two themes */}
              <label className="switch" title="Change theme">
              <span className="visuallyHidden">Click here to change the theme</span>
                <input type="checkbox" onChange={this.toggleTheme} id="toggleTheme" tabIndex="0" className="visuallyHidden"/>
                <span className="slider"></span>
              </label>
              {/* Welcome message and instructions dialog */}
              <dialog id="welcome" className="welcome" open>
                <div className="titleBar">
                  <button id="closeBtn" onClick={this.closeDialog} title="Close window">X</button>
                </div>
                <h1>Welcome to QuickNotes!</h1>
                <p>QuickNotes is an application that allows you to save all your notes and photos in one convenient place.</p>
                <p>Choose one of the three buttons in the top right corner to get started:</p>
                <ul>
                  <li>- Toggle the switch to change themes</li>
                  <li>- Click the plus sign (+) to create a new note</li>
                  <li>- Click the triangle (▲) to upload a photo</li>
                  <li>- Click the "x" to delete an item and close the window</li>
                </ul>
                <p>Happy posting!</p>
              </dialog>
              {/* Section for displaying notes */}
              <section className="notes wrapper" id="notes">
                {/* Button to open dialog to create a new note */}
                <button type="open" onClick={this.openDialog} title="New note">
                  <span className="visuallyHidden">Click here to write a new note</span>+
                </button>
                {/* Dialog for form for writing and submitting a new note */}
                <dialog id="dialog" className="newNote visuallyHidden">
                  <form onSubmit={this.handleSubmit}>
                    <div className="titleBar">
                      <button id="closeBtn" onClick={this.closeDialog} title="Close window">X</button>
                      <button type="submit" title="Submit note">Add Note +</button>
                    </div>
                    <textarea type="text" id="noteText" rows="7" cols="16" onChange={this.handleChange} value={this.state.userInput}></textarea>
                  </form>
                </dialog>
                {/* Section to map array of notesList in state to display notes written by user */}
                <ul>
                    {this.state.notesList.map((noteValue, i)=>{
                        return(
                            <li key={i}>
                              <div className="titleBar">
                                <button id={noteValue.noteId} className="delete" onClick={this.deleteNote} title="Delete note" tabIndex="0">X</button>
                              </div>
                              <textarea rows="7" cols="16" value={noteValue.noteText} readOnly></textarea>
                            </li>
                        )
                    })}
                </ul>
              </section>
              <ImageUpload/>
            </main>
        )
    }
  }

export default App;