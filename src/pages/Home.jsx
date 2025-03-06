import React from 'react';

const Home = () => {
    return (
        <div className="h-100 home">
            <div className="bg-blue-700 text-white p-4 text-center">
                Jabalpur Engineering College
            </div>
            <div className="flex flex-col md:flex-row justify-between p-4">
                <div className="w-full md:w-1/3 p-2">
                    <h2 className="text-xl font-bold">About the College</h2>
                    <p>
                        Jabalpur Engineering College, established in 1947, is one of the oldest engineering colleges in India.
                    </p>
                </div>
                <div className="w-full md:w-1/3 p-2">
                    <h2 className="text-xl font-bold">Notice Board</h2>
                    <ul>
                        <li>Notice 1</li>
                        <li>Notice 2</li>
                        <li>Notice 3</li>
                    </ul>
                </div>
                <div className="w-full md:w-1/3 p-2">
                    <h2 className="text-xl font-bold">Login</h2>
                    <form>
                        <label>
                            Select Admin:
                            <select className="block w-full mt-2 mb-4">
                                <option value="student">Student</option>
                                <option value="hod">HOD</option>
                                <option value="guide">Guide</option>
                            </select>
                        </label>
                        <label>
                            Username:
                            <input type="text" className="block w-full mt-2 mb-4" />
                        </label>
                        <label>
                            Password:
                            <input type="password" className="block w-full mt-2 mb-4" />
                        </label>
                        <button type="submit" className="bg-blue-700 text-white p-2 w-full">
                            Login
                        </button>
                        <button type="button" className="bg-gray-700 text-white p-2 w-full mt-2">
                            Signup
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Home;