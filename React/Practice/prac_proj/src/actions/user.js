const findUser = (user) => {
  return { type: "FIND_USER", payload: { user } };
};

export const fetchUser = (id) => {
  console.log("inside fetch user... id = " + id);
  let user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + user.accessToken,
    },
  };
  return (dispatch) => {
    let code = 0;

    fetch(`http://localhost:4000/users/get/` + id, requestOptions)
      .then((res) => {
        console.log(res);
        code = res.status;

        if (code !== 200) return res.text();

        return res.json();
      })
      .then((data) => {
        console.log(data);

        if (code !== 200) return Promise.reject(data);

        dispatch(findUser(data));
      })
      .catch((error) => {
        console.log("Error:", error);
        if (code === 403) {
          dispatch(refreshToken(fetchUser, [id]));
        }
      });
  };
};

const refreshToken = (method, params) => {
  //console.log("inside fetch user... id = " + id)
  let user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  const token = { token: user.refreshToken };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + user.accessToken,
    },
    body: JSON.stringify(token),
  };
  return (dispatch) => {
    let code = 0;

    fetch(`http://localhost:4000/users/token`, requestOptions)
      .then((res) => {
        console.log(res);
        code = res.status;

        if (code !== 200) return res.text();

        return res.json();
      })
      .then((data) => {
        console.log(data);

        if (code !== 200) return Promise.reject(data);

        user["accessToken"] = data.accessToken;

        localStorage.setItem("user", JSON.stringify(user));

        //dispatch(fetchUser(user.id));

        dispatch(method(...params));
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };
};

const uploadPic = (user) => {
  return { type: "UPDATE_USER", payload: { user } };
};

export const UploadImage = (id, image) => {
  console.log("inside upload user image... id = " + id);
  let user = JSON.parse(localStorage.getItem("user"));
  console.log(image);

  var formData = new FormData();

  formData.append("image", image);

  const requestOptions = {
    method: "POST",
    //     headers: { 'Content-Type': 'application/json'

    // },
    body: formData,
  };
  return (dispatch) => {
    fetch(`http://localhost:4000/users/upload/` + id, requestOptions)
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        dispatch(uploadPic(data));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
};

export const signin = (user) => {
  return {
    type: "LOGIN_SUCCESS",
    payload: {
      user,
      alert: { type: "success", message: "Successfully logged in" },
    },
  };
};

export const login = (username, password) => {
  console.log("logging in with " + username + password);

  const loginRequest = {
    username: username,
    password: password,
  };

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginRequest),
  };
  return (dispatch) => {
    let code = 0;

    fetch(`http://localhost:4000/users/login`, requestOptions)
      .then((res) => {
        console.log(res);

        code = res.status;

       
        return res.json();
      })
      .then((res) => {
        console.log("user = " + res);

        //history.push('/')
        if (code === 200) {
          localStorage.setItem("user", JSON.stringify(res));
          dispatch(signin(res));
        } else return Promise.reject(res.msg);
      })
      .catch((error) => {
        console.error("Error:", error);
        dispatch({
          type: "LOGIN_FAILED",
          payload: { alert: { type: "error", message: code===0? error.message : error} },
        });
      });
  };
};

const signout = (type, alert) => {
  return { type, payload: { alert } };
};

export const logout = (token) => {
  const req = { token };

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  };

  return (dispatch) => {
    let code = 0;

    fetch("http://localhost:4000/users/logout", requestOptions)
      .then((res) => {
        code = res.status;

        if (code !== 200) return res.text();

        return res.json();
      })
      .then((res) => {
        if (code !== 200) return Promise.reject();

        localStorage.removeItem("user");

        dispatch(
          signout("LOGOUT_SUCCESS", { type: "success", message: res.message })
        );
      })
      .catch((error) => {
        dispatch(signout("LOGOUT_FAILED", { type: "error", message: error }));
      });
  };
};


// export const signin = (user) => {
//   return {
//     type: "LOGIN_SUCCESS",
//     payload: {
//       user,
//       alert: { type: "success", message: "Successfully logged in" },
//     },
//   };
// };

export const facebookLogin = (code) => {
 // console.log("logging in with " + username + password);

  const loginRequest = {
    code
  };

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginRequest),
  };
  return (dispatch) => {
    let code = 0;

    fetch(`http://localhost:4000/users/facebook/login`, requestOptions)
      .then((res) => {
        console.log(res);

        code = res.status;

       
        return res.json();
      })
      .then((res) => {
        console.log("user = " + res);

        //history.push('/')
        if (code === 200) {
          localStorage.setItem("user", JSON.stringify(res));
          dispatch(signin(res));
        } else return Promise.reject(res.msg);
      })
      .catch((error) => {
        console.error("Error:", error);
        dispatch({
          type: "LOGIN_FAILED",
          payload: { alert: { type: "error", message: code===0? error.message : error} },
        });
      });
  };
};

const logup = (type, alert) => {
  return { type, payload: { alert } };
};

export const signup = (signupRequest) =>{

  signupRequest['role'] = 'user'

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(signupRequest),
  };

  return (dispatch) =>{

    let code = 0

    fetch('http://localhost:4000/users/signup',requestOptions)
    .then(res=>{

      console.log(res)

        code = res.status

        return res.json()

    })
    .then(res=>{

      if(code===200)
      {
        dispatch(logup('SIGNUP_SUCCESS',{type : 'success', message : res.message}))
      }
      else
      return Promise.reject(res)

    })
    .catch(err=>{

      dispatch(logup('SIGNUP_FAILED',{type : 'error', message : err.message}))

    })

  }

}