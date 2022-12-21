import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
//import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();


  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function

  const history = useHistory();
  

  const [input, setInput] = useState({
    username:"",
    password:"",
    confirmPassword:""
  });


  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   * 
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */

  
   //const url = config.endpoint + '/auth/register'

  const register = async (formData) => {
    //console.log(formData);
    // let isvalidData = validateInput(formData);

    // if(isvalidData){

    //   try{
    //     const url = config.endpoint + '/auth/register'
    //     console.log(url,formData, "hi");
    //     const response = await axios.post(url,formData);
    //     console.log(response, "bye");

    //       enqueueSnackbar("success", {variant:"success"});
    //       setInput({
    //         username:"",
    //         password:"",
    //         confirmPassword:""
    //       });
      
        

    //   }
    // catch(err){
    //   console.log("hello", err);
    //   if(err?.response && err.response.status >= 400 && err.response.status < 500){
    //     let errData = err.response.data;
    //     console.log(errData);
    //     enqueueSnackbar(errData?.message, {variant:"error"});
    //   }
    //   else{
    //     enqueueSnackbar("Something went wrong. check that the backend is running, reachable and returns valid JSON.", {variant:"error"});
    //   }
    // }

    // }

    try {
      if (validateInput(formData)) {
        delete formData.confirmPassword;
        // formData = JSON.stringify(formData);
       // setFetchResponse(true);
        await axios.post(`${config.endpoint}/auth/register`, formData);
        //setFetchResponse(false);
        enqueueSnackbar("success", { variant: "success" });
        //history.push("/");
       history.push("/login", { from: "Register" });
      }
    }
    catch (e) {
      //setFetchResponse(false);
      if (e.response.status >= 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON",
          { variant: "warning" }
        );
      }
    }

  };
  //register();

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {

    if(data.username === ""){
      enqueueSnackbar("Username is a required field", {variant:"warning"});
      return false;
    }
    if(data.username.length < 6){
      enqueueSnackbar("Username must be at least 6 characters", {variant:"warning"});
      return false;
    }
    if(data.password === ""){
      enqueueSnackbar("Password is a required field", {variant:"warning"});
      return false;
    }
    if(data.password.length < 6){
      enqueueSnackbar("Password must be at least 6 character", {variant:"warning"});
      return false;
    }
    if(data.confirmPassword !== data.password){
      enqueueSnackbar("Password do not match", {variant:"warning"});
      return false;
    }
    return true;
  };

  const handleUserName = (data) => {
    setInput({
      ...input,
      username:data.target.value
    })
  }
  const handlePassword = (data) => {
    setInput({
      ...input,
      password:data.target.value
    })
  }
  const handleConfmPasswd = (data) => {
    setInput({
      ...input,
      confirmPassword:data.target.value
    })
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={input.username}
            onChange={handleUserName}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            value={input.password}
            onChange={handlePassword}
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={input.confirmPassword}
            onChange={handleConfmPasswd}
          />
          <Button className="button" variant="contained" onClick={() => register(input)}>
            Register Now
          </Button>
          <p className="secondary-action">
            Already have an account?{" "}
             <a className="link" href="#login">
              Login here
             </a>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
