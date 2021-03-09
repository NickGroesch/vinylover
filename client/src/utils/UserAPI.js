import { Redirect } from "react-router-dom"
export default {
    signUp: function (data) {
        return fetch("/api/user/signup", {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        }).then(response => response.json());
    },
    logIn: function (data) {
        return fetch("/api/user/login", {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        }).then(response => {
            if ([400, 401].includes(response.status)) { //401 for password problems, 400 for wrong user
                window.location.assign(window.location.href + "?fail=true")//back to /login
                //should this be Reactified?
            }
            else {
                return response.json()
            }
        },
        );
    },
    //logout: function () { }
};