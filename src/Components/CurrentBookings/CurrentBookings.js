import React from "react";
import "./CurrentBookings.css";
function CurrentBookings() {
  return (
    <div className="text-center container mt-3 mb-5">
      <p className="display-2 text-secondary">Current Bookings</p>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>ID</th>
            <th>Add</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>vineela</td>
            <td>hs</td>
            <td>sms</td>
            <td>
              <button className="btn btn-success">Add</button>
            </td>
          </tr>
          <tr>
            <td>sai priya</td>
            <td>hs</td>
            <td>sms</td>
            <td>
              <button className="btn btn-success">Add</button>
            </td>
          </tr>
          <tr>
            <td>sahithi</td>
            <td>hs</td>
            <td>sms</td>
            <td>
              <button className="btn btn-success">Add</button>
            </td>
          </tr>
          <tr>
            <td>navya</td>
            <td>hs</td>
            <td>sms</td>
            <td>
              <button className="btn btn-success">Add</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default CurrentBookings;
