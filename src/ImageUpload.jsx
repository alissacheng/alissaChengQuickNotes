import React, {Component} from 'react';
import firebase, {storage} from './firebase';

class ImageUpload extends Component {
    constructor(){
        super();
        this.state = {
            photosList: []
        }
    }

    componentDidMount(){
        //retrieve file name of each photo from database
        firebase.database().ref().child('photos').on('value', (snapshot)=>{
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
    }

    handleChange =(event) =>{
        //This is the object file for the image uploaded
        const image = event.target.files[0]

        //Push the file name into the database
        //Note: Ideally I would get the image url immediately after downloading image into storage bucket and push/store THIS in the database (instead of the file name), but this causes issues, must store file name into database and THEN download its url at a later time
        const photosRef = firebase.database().ref().child('photos')
        photosRef.push(image.name);

        //Upload image into storage bucket
        const uploadImage = storage.ref(image.name).put(image)
        uploadImage.on('state_changed', 
        ()=>{   //update state after image is uploaded, so image displays immediately on screen
                firebase.database().ref().child('photos').on('value', (snapshot)=>{
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
            }
        )
    }

    //Remove photo name from database
    deletePhoto = (event) => {
        const photosRef = firebase.database().ref().child('photos');
        photosRef.child(event.target.id).remove();
    }

    render(){
        return(
            <section className="photos wrapper">
                <label for="file-upload" className="custom-file-upload" title="Upload photo">🠉</label>
                <input id="file-upload" type="file" onChange={this.handleChange} className="visually-hidden"/>
                <ul className="gallery">
                    {this.state.photosList.map((item, i)=>{
                        return(
                        <li key={i}>
                        <div className="draggable">
                            <span id={item.photoId} className="delete" onClick={this.deletePhoto} title="Delete photo">X</span>
                        </div>
                        <img src={item.photoUrl} alt=""/>
                        </li>
                        )
                    })}
                </ul>
            </section>
        )
    }
}

export default ImageUpload