# Fetch - Backend Assessment (2021)

## Introduction

The document illustrates how to setup the server and make requests to the required REST API's.

## Technology Stack

 - **Backend Server**: Node.js and Express
 - **Version Control**: GitHub
 - **API Incepter**: Postman

 ## How to Install
 - Make sure you have the latest version of Node Installed on your machine.
 - On to your Desktop open terminal
  ```
 mkdir fetch-chirag
 ```
 ```
 cd fetch-chirag
 ```

 ```
 git clone https://github.com/chiragkhandhar/Fetch-Assement-BE.git
 ```
 ```
 cd Fetch-Assement-BE
 ```
 - Open this Folder into your favorite code-editor (I've used VS Code)
 ```
 code .
 ```

 - Open Terminal in your Visual Studio and first install all the dependencies
 ```
 npm install
 ```
 - Now as all the dependencies are installed let's start our BE server
 - Our Server will start on port `5500`(I hope nothing else is running on this port on your machine)
 ```
 npm start
 ```
 - You will see this once it is started
 <img width="840" alt="image" src="https://user-images.githubusercontent.com/37962354/106684021-4193d900-658b-11eb-85eb-c8b1f7dae70e.png">


## Endpoints
---

```http
POST http://localhost:5500/api/add
```
### Request Body
```javascript
{
    "userName" : "user1",
    "partnerName" : "DANNON",
    "points" : 300,
    "timestamp" : "2/2/2021, 4:34:29 PM"
}
```

`username`: It should be a String and the assumption made is it should be unique, in-order to store multiple users. Same username will add multiple entries to same user.

`partnerName`: It should be a String and same as the username, unique partner/payer will be stored separately. 

`points`: It should be an Interger.

`timestamp`: It should be a string with this strict format `MM/DD/YYYY, HH:MM:SS [AM|PM]`

PS: You can generate this in JS: 
```
let d = new Date
d.toLocaleString();
```

### Response Codes
The response object has 1-2 fields as follows
```javascript
{
    code: "SUCCESS" | "BAD REQUEST" 
    description: [OPTIONAL] Descriptive message for BAD REQUEST
}
```

| code | description |
| :--- | :--- |
| `SUCCESS` | -  |
| `BAD REQUEST` | You need sufficient points to add this negative points transaction|

---


```http
POST http://localhost:5500/api/deduct
```
### Request Body
```javascript
{
    "userName" : "user1",
    "points" : 200
}
```

`username`: It should be a String and the one that you've already added 

`points`: It should be an Interger.The number of points you want to deduct.

### Response
The response object has 1 field called as `code` if the request fails to deduct else it returns an array of objects which represents the number of points deducted from each partner. 
```javascript
{
    code: "INSUFFICIENT POINTS" | "USER NOT FOUND"

    [{
        "DANNON": -200 // Number of Points Deducted
    }]

}
```
---


```http
GET http://localhost:5500/api/read/user1
```


### Response 
The response object has 1 field called as `code` if the request fails to find the user else it return the list of objects that represents available points for each partner.
```javascript
{
    code : 'USER NOT FOUND'

    [
        {
            "partnerName": "DANNON",
            "points": 100
        }
    ]
}

```

---



