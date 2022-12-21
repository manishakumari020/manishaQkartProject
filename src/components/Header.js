import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack , Link} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {

  const history = useHistory();
      if(hasHiddenAuthButtons){
        return(
          <Box className="header">
            <Box className="header-title">
            <Avatar src="logo_light.svg" alt="QKart-icon"/>
          </Box>
          {children}
            <Stack display="flex" spacing={2}>
              <Button
              className="explore-button"
              startIcon={<ArrowBackIcon />}
              variant="text"
              onClick={() => history.push("/")}
              >
              Back to explore
            </Button>
          </Stack>
        </Box>
      )    
    }
    else{
      return(
        <Box className="header">
          <Box className="header-title">
            <Avatar src="logo_light.svg" alt="QKart-icon"/>
          </Box>
          {children}
          {localStorage.getItem('username') ? (
          <Stack direction={{xs:'column', sm:'row'}} spacing={2}>
            <Box>
              <Avatar alt={localStorage.getItem('username')} src={localStorage.getItem('username')} />
            </Box>
            <Box className="username-text">{localStorage.getItem('username')}</Box>
            <Button className="button" onClick={() => {
              localStorage.clear()
              window.location.reload()
            }}>
              logout
            </Button>
          </Stack>
          ) : (
            <Stack direction={{xs:'column', sm:'row'}} spacing={2}>
              <Button variant="contained" color="success" onClick={() => history.push('/login')}>
                Login
              </Button>
              <Button variant="contained" color="success" onClick={() => history.push('/register')}>
                Register
              </Button>
            </Stack>
          )}
        </Box>
      )

    }
    /*else{
      if(localStorage.getItem("token") !== "null"){
        return(
          <Box className="header">
            <Box className="header-title">
              <Avatar src="public/avatar.png" alt={localStorage.getItem("username")}/>
            </Box>
          <Stack direction={{xs:'column', sm:'row'}} spacing={{xs:'1', sm:'2', md:'4'}}>
            <Button variant="contained" color="success" onClick={() => history.push("/")}>
              <Link to="/logout">Logout</Link>
            </Button>
          </Stack>
          </Box>
        );
      }
      else{
        return(
          <Box className="header">
          <Stack direction={{xs:'column', sm:'row'}} spacing={{xs:'1', sm:'2', md:'4'}}>>
            <Button variant="contained" color="success">
              <Link to="/login" onClick={() => history.push('/login')}>Login</Link>
            </Button>
            <Button variant="contained" color="success" onClick={() => history.push('/register')}>
              <Link to="/register">Register</Link>
            </Button>
          </Stack>
          </Box>
        )

      }
    }*/
    /*else{
      return(
        <Box className="header">
          <Box className="header-title">
            <Avatar src="public/avatar.png" alt={localStorage.getItem('username')}/>
          </Box>
        <Stack direction={{xs:'column', sm:'row'}} spacing={2}>
          <Button variant="contained" color="success">
            <Link to="/login" onClick={() => history.push('/login')}>Login</Link>
          </Button>
          <Button variant="contained" color="success" onClick={() => history.push('/register')}>
            <Link to="/register">Register</Link>
          </Button>
        </Stack>
        </Box>
      )
    }*/
    /*else{
        return(
          <Box className="header">
            <Box className="header-title">
              <Avatar src="logo_light.svg" alt="QKart-icon"/>
            </Box>
  
          <Stack direction={{xs:'column', sm:'row'}} spacing={{xs:'1', sm:'2', md:'4'}}>
            <Button variant="contained" color="success">
              <Link to="/logout">Logout</Link>
            </Button>
          </Stack>
          </Box>
        )
      }*/
    
    
      
      
};

export default Header;
