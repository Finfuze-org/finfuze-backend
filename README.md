# Finfuze server application
Finfuze server api handles the application logic, authentication and security of the finfuze fintech application. The api currently handles sign up and login
functionality, with further improvements and other application functionalities yet to be implemented.

## Installation
* Clone the repo 
* In your file root directory run `npm install` to install all dependencies
* create your .env file and populate it.

**local development** - *to run the app* <br>
`npm run dev` (suitable for development) or `npm run start`

# Endpoints
**Base Url**: `https://finfuze-backend-ouic.onrender.com` <br>
**Version 1**: `/api/v1/auth`

## Sign up
### Request
`POST /signup`
```
https://finfuze-backend-ouic.onrender.com/api/v1/auth/signup
```

### Response
```
status: 201 Created
{
    "success": true,
    "user_id": "<user_id>",
    "message": "User account created, authenticate your email to complete registration"
}
```

## Email verification
### Request
`POST /signup/:user_id/verification`
```
https://finfuze-backend-ouic.onrender.com/api/v1/auth/signup/:user_id/verification
```

### Response
```
status: 200 OK
body: {
    "success": true,
    "message": "Authenticated"
}
```

## Login
### Request
`POST /login`
```
https://finfuze-backend-ouic.onrender.com/api/v1/auth/login
```

### Response
```
status: 200 OK
body: {
    success: true
    token: <token>
}
```



project-root/
|-- controllers/
|-- models/
|-- routes/
|   |-- userRoutes.js
|   |-- productRoutes.js
|   |-- index.js
|-- middleware/
|   |-- authentication.js
|   |-- logging.js
|-- config/
|   |-- database.js
|   |-- environment.js
|-- public/
|   |-- styles/
|   |-- images/
|   |-- scripts/
|-- utils/
|   |-- validation.js
|   |-- helpers.js
|-- tests/
|   |-- unit/
|   |   |-- user.test.js
|   |-- integration/
|   |   |-- authentication.test.js
|-- logs/
|   |-- application.log
|   |-- error.log