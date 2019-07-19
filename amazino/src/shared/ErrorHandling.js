import M from 'materialize-css';
import '../App.css';
//
// Functions for handling and displaying errors
//

//
// handle error, expects message field in error
//
export const handleError = (err) => {
    M.AutoInit();

    var errorText = err.message;

    if(err.code === "auth/user-not-found") errorText = "User not found";
    else if(err.code === "auth/invalid-email") errorText = "Invalid email";
    else if(err.code === "auth/wrong-password") errorText = "Incorrect password";
    else if(err.code === "auth/invalid-email") errorText = "Invalid email";
    else if(err.code === "storage/object-not-found") errorText = "Item not found";
    else if(err.code === "storage/invalid-argument") errorText = "Invalid file";

    var options = {
        html: errorText,
        classes: 'error-toast white-text'
    }

    M.toast(options);
}

export const handleSuccess = () => {
    M.AutoInit();

    M.toast({html: "Success!", classes: "success-toast white-text"});
}

export const handleSuccessMessage = (message) => {
    M.AutoInit();

    M.toast({html: message, classes: "success-toast white-text"});
}