import React, {Component} from "react";
import firebase, {storage} from "./firebase";

class ImageUpload extends Component {
    constructor(){
        super();
        this.state = {
            photosList: [],
            selectedFile:null
        }
    }

    componentDidMount(){
        //Retrieve file name of each photo from database and storage bucket
        firebase.database().ref().child("photos").on("value", (snapshot)=>{
            const photoName = snapshot.val();
            const newImages = [];

            for(let key in photoName){
                storage.ref().child(photoName[key]).getDownloadURL().then(url=>{
                    const singleImage = {
                        photoId: key,
                        photoName: photoName[key],
                        photoUrl: url
                    }

                    newImages.push(singleImage);
//Update the state for photos
                    this.setState({
                        photosList: newImages
                    })
                })
            }
        })
    }

    handleChange =(event) =>{
        
        //This is the object file for the image uploaded
        const image = event.target.files[0]

        //Bind input changes
        this.setState({
            selectedFile: image
        })

        //only allow upload following file types for image files
        if(image.type === "image/jpeg" || image.type === "image/jpg" || image.type === "image/png" || image.type === "image/gif"){

            //Push the file name into the database
            //Note: Ideally I would get the image url immediately after downloading image into storage bucket and push/store THIS in the database (instead of the file name), but this causes issues, must store file name into database and THEN download its url at a later time
            const photosRef = firebase.database().ref().child("photos")
            photosRef.push(image.name);

            //Upload image into storage bucket
            const uploadImage = storage.ref(image.name).put(image)
            uploadImage.on("state_changed",
            ()=>{   //update state after image is uploaded, so image displays immediately on screen
                    //Must grab a snapshot from firebase of photos file names and download url for each in order to update state
                    firebase.database().ref().child("photos").on("value", (snapshot)=>{
                        const photoName = snapshot.val();
                        const newImages = [];
            
                        for(let key in photoName){
                            storage.ref().child(photoName[key]).getDownloadURL().then(url=>{
                                const singleImage = {
                                    photoId: key,
                                    photoName: photoName[key],
                                    photoUrl: url
                                }
                            
                                newImages.push(singleImage);
            
                                this.setState({
                                    photosList: newImages
                                })
                            })
                        }
                    })
                },
                //Error handling
                (error)=> {
                    alert(`We could not upload your file at this time due to ${error.code}. Please try again later.`)
                }
            )
        
        }else{
            alert("Sorry! The file format you uploaded could not be processed. Only JPG, JPEG, PNG and GIF files are allowed.")
        }
    }

    //Remove photo name from database and storage bucket
    deletePhoto = (event) => {
        const photosRef = firebase.database().ref().child("photos");
        photosRef.child(event.target.id).remove();
    }

    render(){
        return(
            <section className="photos wrapper" id="photos">
                {/* Default file upload button hidden */}
                <input id="fileUpload" type="file" className="customUpload visuallyHidden" tabIndex="1" onChange={this.handleChange} accept="image/*"/>
                {/* Custom file upload button by styling label */}
                <label htmlFor="fileUpload" className="customUpload" title="Upload photo">
                    <span className="visuallyHidden">Click here to upload an image</span>▲ 
                </label>
                {/* Map photosList array in state to see all photos uploaded by user */}
                <ul className="gallery">
                    {this.state.photosList.map((item, i)=>{
                        return(
                        <li key={i}>
                            <div className="titleBar">
                                <button id={item.photoId} className="delete" onClick={this.deletePhoto} title="Delete photo" tabIndex="0">X</button>
                            </div>
                            <img src={item.photoUrl} alt={item.photoName}/>
                        </li>
                        )
                    })}
                </ul>
            </section>
        )
    }
}

export default ImageUpload