import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useState } from "react"
import SignUp from "./pages/SignUp"
import LogIn from "./pages/LogIn"
function App() {
  return (
    <Router>
      <div>
        <h1>nav</h1>
        <Switch>
          <Route exact path={["/", "/signin"]}>
            <SignUp />
          </Route>
          <Route exact path={"/login"}>
            <LogIn />
          </Route>
          <Route exact path="/books/:id">
          </Route>
          <Route>
            {/* catchall */}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
