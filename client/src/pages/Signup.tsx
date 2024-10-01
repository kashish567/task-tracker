import { useState } from 'react';
import axios from 'axios'; // Import axios for making API requests
import SignUpImg from "../../public/login.png";

const SignUp = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const doSignUp = async (event: any) => {
    event.preventDefault();

    // Basic validation for form inputs
    if (data.name.trim() === '') {
      alert("Name is required!");
      return;
    }
    if (data.email.trim() === '') {
      alert("Email is required!");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(data.email)) {
      alert("Enter a valid email!");
      return;
    }
    if (data.password.trim() === '') {
      alert("Password is required!");
      return;
    }
    if (data.password.length < 6) {
      alert("Password should be at least 6 characters long!");
      return;
    }

    try {
      // Make an API call to the register endpoint
      const response = await axios.post("https://task-tracker-1-08v5.onrender.com/api/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      // Assuming the response contains the token
      const { token } = response.data;

      // Store the token (you can use localStorage or a state management tool)
      localStorage.setItem("token", token);

      alert("User registered successfully!");

      // Reset the form after successful sign-up
      resetForm();
    } catch (error:any) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message || "User registration failed");
      } else {
        alert("Server Error");
      }
    }
  };

  const resetForm = () => {
    setData({
      name: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="grid grid-cols-12 mt-5">
      <div className="col-span-4 col-start-5">
        <div className="py-2 text-white">
        <div className="">
                    <center>
                    <img 
                    src={SignUpImg}
                    alt="SignUpImg"
                    style={{
                        width: '30%',
                      }}
                      />
                      </center>
                </div>
          <h1 className="text-3xl text-center font-semibold">
            Sign Up Here!
          </h1>
          <form onSubmit={doSignUp} className="flex flex-col items-center justify-center gap-5 mt-5">
            <div className="mt-2">
              {/* Name Input */}
              <label htmlFor="user_name" className="block font-semibold text-center">
                Name
              </label>
              <input type="text" id="user_name" className="w-full p-2 bg-purple-950 border border-black rounded-full text-white text-center font-light mb-3"
                placeholder="Enter Name"
                onChange={event => {
                  setData({
                    ...data,
                    name: event.target.value
                  });
                }}
                value={data.name}
              />

              {/* Email Input */}
              <label htmlFor="user_email" className="block font-semibold text-center">
                Email
              </label>
              <input type="email" id="user_email"
                className="w-full p-2 bg-purple-950 border border-black rounded-full text-center text-white font-light mb-3"
                placeholder="Enter Email"
                onChange={event => {
                  setData({
                    ...data,
                    email: event.target.value
                  });
                }}
                value={data.email}
              />

              {/* Password Input */}
              <label htmlFor="user_password" className="block font-semibold text-center">
                Password
              </label>
              <input type="password" id="user_password" className="w-full p-2 bg-purple-950 border border-black rounded-full text-white text-center font-light mb-3"
                placeholder="Enter Password"
                onChange={event => {
                  setData({
                    ...data,
                    password: event.target.value
                  });
                }}
                value={data.password}
              />
            </div>
            <div className="mt-2 text-center">
              <button type="submit"
                className="bg-green-700 py-2 px-3 rounded-lg font-semibold hover:bg-green-900 mr-4 text-white">
                Sign Up
              </button>
              <button type="button" onClick={resetForm} className="bg-red-700 py-2 px-3 rounded-lg font-semibold hover:bg-red-900 mr-4 text-white">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
