import { useEffect, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from '../../../redux/userslice/UserSlice';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar: FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.user.user);

    const fetchUser = async (token: string) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get("https://task-tracker-1-08v5.onrender.com/api/auth/getUser", config);
            dispatch(setUser(data));
        } catch (error) {
            console.error("Error fetching user data", error);
            localStorage.removeItem("token");
            dispatch(clearUser());
            navigate("/login");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchUser(token);
        }
    }, [dispatch]);

    const doLogout = () => {
        localStorage.removeItem("token");
        dispatch(clearUser());
        navigate("/login");
    };

    const handleExportReport = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            };
            const response = await axios.get('https://task-tracker-1-08v5.onrender.com/api/tasks/report?format=csv', config);

            // Debugging: Log response to check if CSV data is correct
            console.log("CSV Data: ", response.data);

            // Handle file download for CSV
            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'tasks_report.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error exporting report:", error);
        }
    };

    return (
        <nav className="bg-purple-800 h-20 flex justify-between items-center px-8">
            <div className="logo">
                <h1 className="font-bold text-white text-xl italic">
                    <a href="/">Task Tracker</a>
                </h1>
            </div>
            <div>
                <ul className="flex space-x-6">
                    {user && (
                        <>
                            <li><Link to="/" className="text-white border-b-2 border-transparent hover:border-white">Home</Link></li>
                            <li><Link to="/create-task" className="text-white border-b-2 border-transparent hover:border-white">Create Task</Link></li>
                            <li><Link to="/view-task" className="text-white border-b-2 border-transparent hover:border-white">View Tasks</Link></li>
                        </>
                    )}
                </ul>
            </div>
            <div>
                <ul className="flex space-x-4">
                    {user ? (
                        <>
                            {user.role === "Admin" && (
                                <li>
                                    <button 
                                        onClick={handleExportReport} 
                                        className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Export Report
                                    </button>
                                </li>
                            )}
                            <li>
                                <span className="text-white hover:text-yellow-400 hover:font-extrabold font-semibold">{user?.name}</span>
                            </li>
                            <li>
                                <button onClick={doLogout} className="text-white hover:text-yellow-400 hover:font-extrabold font-semibold">LOGOUT</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><a href="/login" className="text-white hover:text-yellow-400 hover:font-extrabold font-semibold">LOGIN</a></li>
                            <li><a href="/signup" className="text-white hover:text-yellow-400 hover:font-extrabold font-semibold">SIGNUP</a></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
