const express = require("express");
const bodyParser = require("body-parser");
const MailChimp = require("mailchimp-api-v3");
require("dotenv").config();

const app = express();

const mailchimp = new MailChimp(process.env.API_KEY);

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
});

app.post("/", (req, res) => {
    const { firstName, lastName, email } = req.body;
    
    mailchimp.post(`lists/${process.env.LIST_ID}/members`, {
        email_address: email,
        status: "subscribed",
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName
        }
    })
    .then(() => {
        res.sendFile(__dirname + "/pages/success.html");
    })
    .catch((error) => {
        console.log(error);
        if(error.title === "Member Exists") {
            res.sendFile(__dirname + "/pages/memberExists.html");
        }else {
            res.sendFile(__dirname + "/pages/failure.html");
        }
    })
});

app.post("/success", (req, res) => {
    res.redirect("/");
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.post("/memberExists", (req, res) => {
    res.redirect("/");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});