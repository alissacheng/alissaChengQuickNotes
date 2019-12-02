import React, {Component} from 'react';
import './App.css';
import firebase from './firebase.js'
import ImageUpload from './ImageUpload'

class App extends Component {

    constructor(){
        super();
        this.state ={
            //empty array, booksList so render is able to map over something (even if it's nothing)
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

        //for every object, we create a new object with two key values: book title and book id
        for(let key in notes){
          console.log(notes[key])

          //Find out the key of each book value in firebase, to figure out how to delete each one
          //Making an object into an array of objects
          const singleNote = {
              noteId: key,
              noteText: notes[key]
            }
//AFTER CHANGING DATA, WE PUSH BOOK ONTO NEW BOOKS ARRAY
            newNotes.push(singleNote)
        }

        //2. Update our state - taking new array and updating it
          this.setState({
              notesList:newNotes
          })
      })
      //RETREIVE THEME LAST SAVED 
      const themeRef = firebase.database().ref().child('theme')

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
            document.body.style.background = "url(./assets/cork-board-light.jpg)"
            document.getElementById("toggleTheme").checked = false;
          }else{
            document.body.style.background = "#8386de"
            document.getElementById("toggleTheme").checked = true;
          }
        }
      })
    }

    openDialog = () => {
      document.getElementById("dialog").setAttribute("open", true)
    }

    closeDialog = () => {
      document.getElementById("dialog").removeAttribute("open")
    }

    toggleTheme = (event) =>{
      const themeRef = firebase.database().ref().child("theme")
      if(event.target.checked === true){
        document.body.style.background = "#8386de"
        themeRef.push("lavender")
      }else{
        document.body.style.background = "url(./assets/cork-board-dark.jpg)"
        themeRef.push("cork")
      }
    }

    //update STATE everytime user types inside input text bar
    handleChange = (event) =>{
        this.setState({
            userInput: event.target.value
        })
    }

    //placed on the form
    handleSubmit = (event) => {
        event.preventDefault();
        //Put what we submit, the book title, in a constant
        const addNote = this.state.userInput
        //add 'booksToAdd' to firebase (so that the dbRef listener will be called and it willl update state and cause the app to re-render)

        //push to firebase
        const notesRef = firebase.database().ref().child('notes')

        // Make sure no empty strings are submitted
        if(addNote !== ""){
            notesRef.push(addNote)
            //Make user input an empty string, make sure to update HTML with value attribute
            this.setState({
                userInput: ""
            })
        }
  
    }

    deleteNote = (event) => {
        console.log(event.target.id);
        const notesRef = firebase.database().ref().child('notes');

        notesRef.child(event.target.id).remove();
    }

    render(){
        return(
            <main>
              <label className="switch" title="Change theme">
                <input type="checkbox" onChange={this.toggleTheme} id="toggleTheme"/>
                <span className="slider"></span>
              </label>
              {/* <dialog id="dialog">
                <div className="draggable">
                <button id="closeBtn" onClick={this.closeDialog} title="Close window">X</button>
                </div>
                <h1>Welcome to QuickNotes!</h1>
                <p>QuickNotes is an application that allows you to save notes and photos</p>
                <p>Click here to switch between themes</p>
                <p>Click here to create a new note</p>
                <p>Click here to upload a photo</p>
                <p>Happy posting!</p>
              </dialog> */}
              <section className="notes wrapper">
                <button type="open" onClick={this.openDialog} title="New note">+</button>
                <dialog id="dialog">
                  <form onSubmit={this.handleSubmit}>
                    <div className="draggable">
                      <button id="closeBtn" onClick={this.closeDialog} title="Close window">X</button>
                      <button type="submit" title="Submit note">Add Note +</button>
                    </div>
                    <textarea type="text" id="noteText" rows="7" cols="17" onChange={this.handleChange} value={this.state.userInput}></textarea>
                  </form>
                </dialog>
                <ul>
                    {this.state.notesList.map((noteValue, i)=>{
                        return(
                            <li key={i}>
                              <div className="draggable">
                                <span id={noteValue.noteId} className="delete" onClick={this.deleteNote} title="Delete note">X</span>
                              </div>
                              <textarea rows="7" cols="17" value={noteValue.noteText} readOnly></textarea>
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