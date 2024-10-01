import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { setUser } from '../redux/userslice/UserSlice'; // Import the setUser action creator


const Login = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const dispatch = useDispatch(); 

    const loginFormSubmitted = async (event: any) => {
        event.preventDefault();
        try {
            const response = await axios.post("https://task-tracker-1-08v5.onrender.com/api/auth/login", {
                email: loginData.email,
                password: loginData.password,
            });

            // Assuming the response contains the token and user details
            const { token, user } = response.data; // Ensure your API returns user details

            // Store the token
            localStorage.setItem("token", token);

            localStorage.setItem("user", JSON.stringify(user)); 

            // Dispatch the user details to the Redux store
            dispatch(setUser(user));

            alert("Logged In Successfully");
            navigate("/");
            
        } catch (error: any) {
            console.error(error);
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message || "Invalid credentials");
            } else {
                alert("Server Error");
            }
        }
    };

    const resetForm = () => {
        setLoginData({
            email: "",
            password: "",
        });
    };

    return (
        <div className="grid grid-cols-12 mt-5">
            <div className="col-span-4 col-start-5">
                <div className="py-2">
                    <h1 className="text-3xl text-center font-semibold mt-10 text-white">Login Here!</h1>
                    <form className="flex flex-col items-center justify-center mt-5 mb-10" onSubmit={loginFormSubmitted}>
                        {/* Email Input */}
                        <div className='mt-3'>
                            <label htmlFor="user_email" className="block font-semibold text-center text-white">
                                Email
                            </label>
                            <input
                                type="email"
                                id="user_email"
                                className="w-full p-2 bg-purple-950 border border-black rounded-full text-center text-white font-light mb-3"
                                placeholder="Enter Email"
                                name="user_email"
                                onChange={event => {
                                    setLoginData({
                                        ...loginData,
                                        email: event.target.value,
                                    });
                                }}
                                value={loginData.email}
                            />
                        </div>

                        {/* Password Input */}
                        <div className='mt-3'>
                            <label htmlFor="user_password" className="block font-semibold text-center text-white">
                                Password
                            </label>
                            <input
                                type="password"
                                id="user_password"
                                className="w-full p-2 bg-purple-950 border border-black rounded-full text-white text-center font-light mb-3"
                                placeholder="Enter Password"
                                name="user_password"
                                onChange={event => {
                                    setLoginData({
                                        ...loginData,
                                        password: event.target.value,
                                    });
                                }}
                                value={loginData.password}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="mt-5 text-center">
                            <button
                                type="submit"
                                className="bg-green-700 py-2 px-3 ms-4 rounded-lg font-semibold hover:bg-green-900 mr-4 text-white"
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-red-700 py-2 px-3 rounded-lg font-semibold hover:bg-red-900 mr-4 text-white"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
