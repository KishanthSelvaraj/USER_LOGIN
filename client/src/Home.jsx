import React,{useEffect, useState} from 'react'
import axios from 'axios'
function Home(){
  axios.defaults.withCredentials=true;
  return (
    <div>
      <p>you are logged in </p>
    </div>
  )
}
export default Home
