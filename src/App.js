import React, {Component} from "react";
import "./App.css";
import firebase from "./firebase.js"
import TypeNotes from "./TypeNotes"
import ImageUpload from "./ImageUpload"
import ButtonPanel from "./ButtonPanel"
import Welcome from "./Welcome";

class App extends Component {

    componentDidMount(){
      //Connect to firebase and retrieve theme last saved from firebase database to place on page
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

//Render on page
    render(){
        return(
            <main>
              <ButtonPanel
                toggleThemeProp={this.toggleTheme}
                openDialogProp={this.openDialog}
              />
              <Welcome
                close={this.closeDialog}
              />
              <TypeNotes/>
              <ImageUpload/>
            </main>
        )
    }
  }

export default App;