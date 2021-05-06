const findUser = (user) =>{
    return {type : "FIND_USER",payload : {user}}
}

export const fetchUser = (id) => {

    console.log("inside fetch user... id = " + id)
    let user = JSON.parse(localStorage.getItem('user'));
    console.log(user)

    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'

    }
    };
    return dispatch => {
        fetch(`http://localhost:4000/users/`+id, requestOptions)
            .then(res => {
                console.log(res);
                return res.json();
            })
            .then(data => {
                console.log(data);
                dispatch(findUser(data));
            }).catch((error) => {
                console.error('Error:', error);
              });

    }

}


const uploadPic = (user) =>{
    return {type : "UPDATE_USER",payload : {user}}
}

export const UploadImage = (id,image) => {

    console.log("inside upload user image... id = " + id)
    let user = JSON.parse(localStorage.getItem('user'));
    console.log(image)

    var formData = new FormData();

    formData.append('image',image)

    const requestOptions = {
        method: 'POST',
    //     headers: { 'Content-Type': 'application/json'

    // },
    body :formData
    };
    return dispatch => {
        fetch(`http://localhost:4000/users/upload/`+id, requestOptions)
            .then(res => {
                console.log(res);
                return res.json();
            })
            .then(data => {
                console.log(data);
                dispatch(uploadPic(data));
            }).catch((error) => {
                console.error('Error:', error);
              });

    }

}

