import "./App.css";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import CurrentBookings from "./Components/CurrentBookings/CurrentBookings";
function App() {
  return (<div className="App">
    <Login></Login>
    <Register></Register>
    <CurrentBookings></CurrentBookings>
  </div>)
}

export default App;
