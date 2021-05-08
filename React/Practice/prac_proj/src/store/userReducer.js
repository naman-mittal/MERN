
const initialState = {}

const reducer = (state = initialState, { type, payload }) => {

    switch (type) {
      
  
  
          case "FIND_USER":
           
            return { user: payload.user};

            case "UPDATE_USER":
           
              return { user : payload.user};
      
              case "LOGIN_SUCCESS":

              return {loggedIn : true}
       
              case "LOGIN_FAILED" : 

              return {alert : payload.alert}

              case "LOGOUT_SUCCESS":

                return {loggedOut : true , alert : payload.alert}
         
                case "LOGOUT_FAILED" : 
  
                return {loggedOut : false,alert : payload.alert}
  
      default:
        return state;
    }
  };
  
  export default reducer;