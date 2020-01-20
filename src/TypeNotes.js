import React, {Component} from "react";
import "./App.css";
import firebase from "./firebase.js"

class TypeNotes extends Component {

    constructor(){
        super();
        this.state ={
            notesList:[],
            userInput: "",
            noteId: null
        }
    }

    componentDidMount(){
        //Retrieve notes by connecting to firebase
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
    }

//Closing dialogs whenever user clicks the "x"
    closeDialog = () => {
        document.getElementById("dialog").removeAttribute("open")
        document.getElementById("dialog").classList.add("visuallyHidden")
        document.getElementById("edit").removeAttribute("open")
        document.getElementById("edit").classList.add("visuallyHidden")
//Clear user input and user id once dialog closes
        this.setState({
            userInput: "",
            noteId:null
        })
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
        //Put what we submit in a constant then push to firebase, update state, re render app
        const addNote = this.state.userInput
        //add to firebase (so that the dbRef listener will be called and it willl update state and cause the app to re-render)

        //push to firebase
        const notesRef = firebase.database().ref().child("notes")

        // Make sure no empty strings are submitted
        if(addNote !== ""){
            notesRef.push(addNote)
            //Make user input an empty string, make sure to update HTML with value attribute
            this.setState({
                userInput: ""
            })
        }else{
            alert("Sorry! Blank notes cannot be submitted.")
        }
    }

    //Edit note written by user
    editNote = (event) => {
        event.preventDefault();

        document.getElementById("edit").setAttribute("open", true)
        document.getElementById("edit").classList.remove("visuallyHidden")
//Bind inputs
        this.setState({
            userInput: event.target.value,
            noteId: event.target.id
        })

    }
//Save note editted
    saveNote = (event) =>{
        event.preventDefault();

        const addNote = this.state.userInput
        //add to firebase (so that the dbRef listener will be called and it willl update state and cause the app to re-render)

        // Make sure no empty strings are submitted
        if(addNote !== ""){
          //Make user input an empty string, make sure to update HTML with value attribute
            this.setState({
                userInput: ""
            })
          //Close dialog after saving new note
            document.getElementById("edit").removeAttribute("open")
            document.getElementById("edit").classList.add("visuallyHidden")

//update firebase, then update state by cloning notesList array and changing it
        firebase.database().ref("notes/" + this.state.noteId).set(addNote);
        //Clone notes list array to edit it because cannot edit original array in state directly
            const cloneNotesList = [...this.state.notesList]
          //Find id of notes list being edited and change it to new value
            cloneNotesList.forEach( item => {
            if (item.noteId === this.state.noteId){
                item.noteText = addNote
        //set state of newly changed array of notes list and set noteId back to null to bind inputs
                this.setState({
                    notesList: cloneNotesList,
                    noteId: null
                })
            }
        })
          //Error handling blank notes
        }else{
            alert("Sorry! Blank notes cannot be submitted.")
        }

    }

//Delete written note by user
    deleteNote = (event) => {
        event.preventDefault();
        const notesRef = firebase.database().ref().child("notes");
        notesRef.child(event.target.id).remove();
    }
//Render on page
    render(){
        return(
            <section className="notes wrapper" id="notes">
            {/* Dialog for form for writing and submitting a new note */}
            <dialog id="dialog" className="newNote visuallyHidden">
                <form>
                <div className="titleBar">
                    <button type="button" id="closeBtn" onClick={this.closeDialog} title="Close window">X</button>
                    <button type="submit" title="Submit note" onClick={this.handleSubmit}>Add Note +</button>
                </div>
                <textarea type="text" id="noteText" rows="7" cols="16" onChange={this.handleChange} value={this.state.userInput}></textarea>
                </form>
            </dialog>
            {/* Dialog for form for editing and saving a new note */}
            <dialog id="edit" className="newNote visuallyHidden">
                <form>
                <div className="titleBar">
                    <button type="button" id="closeBtn" onClick={this.closeDialog} title="Close window">X</button>
                    <button type="submit" title="Save note" onClick={this.saveNote}>Save Note +</button>
                </div>
                <textarea type="text" id="noteText" rows="7" cols="16" onChange={this.handleChange} value={this.state.userInput}></textarea>
                </form>
            </dialog>
            {/* Section to map array of notesList in state to display notes written by user */}
            <ul className="notes">
                {this.state.notesList.map((noteValue, i)=>{
                    return(
                        <li key={i}>
                            <div className="titleBar">
                            <button id={noteValue.noteId} value={noteValue.noteText} className="edit" title="Edit note" onClick={this.editNote}>
                                <span role="img" aria-label="notepad" aria-hidden="true">📝</span> 
                                Edit
                            </button>
                            <button id={noteValue.noteId} className="delete" onClick={this.deleteNote} title="Delete note" tabIndex="0">X</button>
                            </div>
                            <textarea rows="7" cols="16" value={noteValue.noteText} readOnly></textarea>
                        </li>
                    )
                })}
            </ul>
        </section>
        )
    }
}

export default TypeNotes;