import React from 'react'
import DataGrid from './DataGrid'
import {Link,useRouteMatch} from 'react-router-dom'


export default function Profile(){

    // let { path, url } = useRouteMatch();

    

        return (
            <div>
                {/* {console.log("param id = " + match.params.id)} */}
                
                {/* <DataGrid viewId={match.params.id}></DataGrid> */}

                <DataGrid viewId={100}></DataGrid>
               
            </div>
        )
    
}
