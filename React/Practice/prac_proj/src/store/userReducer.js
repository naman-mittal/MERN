
const initialState = {}

const reducer = (state = initialState, { type, payload }) => {

    switch (type) {
      
  
  
          case "FIND_USER":
           
            return { user: payload.user};

            case "UPDATE_USER":
           
              return { user : payload.user};
      
       
  
      default:
        return state;
    }
  };
  
  export default reducer;