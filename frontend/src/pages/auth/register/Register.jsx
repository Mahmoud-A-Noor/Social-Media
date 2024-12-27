import {useState} from "react";
import {useAuth} from "../../../context/authContext.jsx";

import {ToastContainer, toast, Flip} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import notify from "../../../utils/notify.js";



export default function Register() {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const { register } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
        } catch (err) {
            const errors = err.response.data.errors
            for (const error of errors) {
                notify(error, "error");
            }
        }
    };

    return (
        <div id="register" className="w-screen h-screen flex justify-center items-center md:bg-none xs:bg-[url('/src/assets/register.jpg')] xs:bg-cover">
            <div id="register-wrapper"
                 className="2xl:w-3/5 xl:w-8/12 lg:w-9/12 md:w-11/12 xs:w-[90vw] flex justify-center items-center md:shadow-[-1px_1px_20px_0px_rgba(0,0,0,0.75)] xs:shadow-[-1px_1px_20px_10px_rgba(0,0,0,0.75)]">
                <form id="register-form" className="md:w-1/2 xs:w-full sm:p-[1em] xs:p-[1.5em] flex flex-col">
                    <h1 className="my-[1em] text-6xl uppercase md:text-black xs:text-white font-bold text-center">Register</h1>
                    <input className="form-input mb-[1em]" type="username" placeholder="Username" name="username"
                           id="register-username" value={formData.name} onChange={handleChange}/>
                    <input className="form-input mb-[1em]" type="email" placeholder="Email" name="email"
                           id="register-email" value={formData.name} onChange={handleChange}/>
                    <input className="form-input mb-[1em]" type="password" placeholder="Password" name="password"
                           id="register-password" value={formData.name} onChange={handleChange}/>
                    <a
                        href={`${import.meta.env.VITE_API_BASE_URL}/auth/google`}
                        aria-label="Sign in with Google"
                        className="flex items-center gap-3 rounded-md p-0.5 pr-3 transition-colors duration-300 bg-black text-white"
                    >
                        <div className="flex items-center justify-center bg-white w-9 h-9 rounded-l">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                                <title>Sign up with Google</title>
                                <desc>Google G Logo</desc>
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    className="fill-google-logo-blue"
                                ></path>
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    className="fill-google-logo-green"
                                ></path>
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    className="fill-google-logo-yellow"
                                ></path>
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    className="fill-google-logo-red"
                                ></path>
                            </svg>
                        </div>
                        <span className="text-sm tracking-wider">Sign up with Google</span>
                    </a>
                    <div id="register-actions" className="flex flex-col text-center">
                        <button className="form-button md:bg-none xs:bg-white" onClick={handleSubmit}>Register</button>
                        <span className="mt-1 text-sm w-full md:text-black xs:text-white">Have an account ?
                            <a className="mt-1 text-[#0f83ff] font-bold" href="/login">Login</a>
                        </span>
                    </div>
                </form>
                <div id="register-img"
                     className="md:block xs:hidden relative w-1/2 z-10 after:content-['*'] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:bg-[rgba(255, 255, 255, 0.3)] after:z-50">
                    <img src="/src/assets/register.jpg" alt=""/>
                </div>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition: Flip
            />
        </div>
    )
}

