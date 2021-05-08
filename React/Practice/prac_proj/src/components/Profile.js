import React, { useEffect, useState } from 'react'
import DataGrid from './DataGrid'
import {Link,useHistory,useRouteMatch} from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import * as actions from '../actions/user'

export default function Profile(){

    // let { path, url } = useRouteMatch();

    const history = useHistory()

    const dispatch = useDispatch()

   const loggedOut = useSelector(state => state.loggedOut)

   useEffect(()=>{

    if(loggedOut)
    {
        history.push('/signin')
    }


   },[loggedOut,history])

    const logout = () =>{

        const user = JSON.parse(localStorage.getItem('user'))

        dispatch(actions.logout(user.refreshToken))

       // history.push('/signin')

    }

        return (
            <div>
                {/* {console.log("param id = " + match.params.id)} */}
                
                {/* <DataGrid viewId={match.params.id}></DataGrid> */}

                <DataGrid viewId={100}></DataGrid>
                <button onClick={logout}>Logout</button>
               
            </div>
        )
    
}
