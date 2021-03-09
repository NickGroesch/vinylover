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
            if (response.status == 401) {
                console.log("oh no 401")
                window.location.assign(window.location.href + "?login=fail")//back to login
            }
            else {
                return response.json()
            }
        }
        );
    },
};