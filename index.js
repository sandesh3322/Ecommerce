// es5 
require("dotenv").config()
const http = require("http")
const app = require("./src/config/express.config")
const server= http.createServer(app)
// 0 to (2^16   -1)  = 100 ports well known port
// http https ftp sftp smtp, telnet
//127.0.0.1 self ip address, ipv6 -- ::1, localhost
const port =process.env.PORT || 9005
server.listen( port ,'127.0.0.1', (error)=>{
if(error){
    console.log("server error")
}
else{
    console.log("server is running on port :9005")
    console.log("Press ctrl +c  to discontinue server")
}

}) 
    
