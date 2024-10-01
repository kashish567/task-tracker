
import { useSelector } from 'react-redux'; // Make sure this is imported

const SomeComponent = () => {
    const user = useSelector((state) => state.user); // Access user from the Redux store

    return (
        <div>
            {user ? (
                <div>
                    <h1>Welcome, {user.user.name}!</h1>
                    <p>Email: {user.user.email}</p>
                    <p>Role: {user.user.role}</p>
                </div>
            ) : (
                <h1>Please log in</h1>
            )}
        </div>
    );
};

export default SomeComponent;
