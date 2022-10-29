import React from "react";
import "./Register.css";
import { useForm } from "react-hook-form";
function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onFormSubmit = (userData) => {
    console.log(userData);
  };
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <React.Fragment>
      <div className="container mt-5 mb-5">
        <div className="row">
          <br />
          <h1 className="text-center text-secondary">USER REGISTRATION</h1>
          <div className="col-11 col-sm-8 col-md-6 mx-auto">
            <form onSubmit={handleSubmit(onFormSubmit)}>
              {/**username */}
              <div className="mb-3">
                <label htmlFor="un">Username</label>
                <input
                  type="text"
                  id="un"
                  className="form-control"
                  {...register("username", { required: true, minLength: 4 })}
                />
                {/**error msg */}
                {errors.username?.type === "required" && (
                  <p className="text-danger">*Username required</p>
                )}
                {errors.username?.type === "minLength" && (
                  <p className="text-danger">*minLength should be 4</p>
                )}
              </div>
              {/**email */}
              <div className="mb-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  {...register("email", { required: true })}
                />
                {/**error msg */}
                {errors.email?.type === "required" && (
                  <p className="text-danger">*Email required</p>
                )}
              </div>

              <div className="mb-3">
                <label className="label">Password</label>
                <input
                  type="password"
                  id="pwd"
                  className="form-control"
                  {...register("pwd", { required: true, minLength: 8 })}
                />
                {errors.dob?.type === "required" && (
                  <p className="text-danger">*pwd required</p>
                )}
                {errors.dob?.type === "minLength" && (
                  <p className="text-danger">
                    *minLength of password should be 8
                  </p>
                )}
              </div>

              {/**dob */}
              <div className="mb-3">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  className="form-control"
                  {...register("dob", { required: true })}
                />
                {/**error msg */}
                {errors.dob?.type === "required" && (
                  <p className="text-danger">*dob required</p>
                )}
              </div>

              {/*Gender */}
              <div className="mb-3">
                <label className="label">Gender</label>
                <br></br>
                <input type="radio" value="Male" name="gender" /> Male
                &nbsp;&nbsp;&nbsp;&nbsp;
                <input type="radio" value="Female" name="gender" />{" "}
                Female&nbsp;&nbsp;&nbsp;&nbsp;
                <input type="radio" value="Other" name="gender" /> Other
              </div>

              <div className="mb-3">
                <label className="label">Phone number</label>
                <input
                  type="number"
                  id="phn"
                  className="form-control"
                  {...register("phn", { required: true, minLength: 10 })}
                />
                {errors.phn?.type === "required" && (
                  <p className="text-danger">*phn required</p>
                )}
                {errors.phn?.type === "minLength" && (
                  <p className="text-danger">
                    *Phone number should be of length 10
                  </p>
                )}
              </div>

              <div className="mb-3">
                <label className="label">Address</label>
                <input
                  type="text"
                  id="add"
                  className="form-control"
                  {...register("add", { required: true })}
                />
              </div>

              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-success w-50">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Register;
