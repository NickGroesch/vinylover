import React, { useState, useEffect } from "react";
import UserAPI from "../utils/UserAPI"
export default function SignUp() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    //useEffect to check for cookie to suggest already has account
    const handleSubmit = e => {
        e.preventDefault();
        console.log("username is " + email);
        console.log("password is " + password);
    };
    return (
        <div>
            <h1>sign up dude</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label for="exampleInputEmail1">Email address</label>
                    <input
                        type="email"
                        id="email-input"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label for="exampleInputPassword1">Password</label>
                    <input
                        type="password"
                        id="password-input"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <button className="btn btn-success" type="submit">
                    Submit
          </button>
            </form>
        </div>
    )
}
