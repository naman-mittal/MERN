import React,{useState,useEffect} from 'react'
import CircularProgress from "@material-ui/core/CircularProgress";
import * as queryString from 'query-string'
import * as actions from '../actions/user'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

export default function FacebookLogin() {

    const [open, setOpen] = useState(true)


    const history = useHistory()

    const loggedIn = useSelector(state => state.loggedIn)

    const dispatch = useDispatch()

    useEffect(() => {
        
        if(loggedIn)
        {
            history.push('/home')
        }
    }, [loggedIn])

    useEffect(() => {
        
        setOpen(true)
        console.log("facebook login")
        const urlParams = queryString.parse(window.location.search);

        dispatch(actions.facebookLogin(urlParams.code))

console.log(`The code is: ${urlParams.code}`);

    }, [])

    return (
        <div>
            
            <CircularProgress open={open}/>

        </div>
    )
}
