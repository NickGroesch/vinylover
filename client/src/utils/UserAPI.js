export default {
    signUp: function (data) {
        return fetch("/api/signup", {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        }).then(response => response.json());
    },
    logIn: function (data) {
        return fetch("/api/login", {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        }).then(response => {
            if ([400, 401].includes(response.status)) { //401 for password problems, 400 for wrong user
                console.log("oh no 401 or something")
                window.location.assign(window.location.href + "?fail=true")//back to login
            }
            else {
                return response.json()
            }
        }
        );
    },
};