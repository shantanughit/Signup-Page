const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/43cd399366";

  const options = {
    method: "POST",
    auth: "shantanu:472d1ad0091922a89eb32b5653d736c7-us21"
  };

  const request = https.request(url, options, function(response) {
    let chunks = [];

    if(response.statusCode===200){
      res.sendFile(__dirname +"/success.html");
    } else{
      res.sendFile(__dirname +"/failure.html");
    }

    response.on("data", function(chunk) {
      chunks.push(chunk);
    });

    response.on("end", function() {
      const responseData = Buffer.concat(chunks);
      const result = JSON.parse(responseData);
      console.log(result); 
    });
  });

  request.on("error", function(error) {
    console.error(error);
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT ||3000, function() {
  console.log("server is running on port 3000");
});






