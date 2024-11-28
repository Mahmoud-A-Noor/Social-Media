import {useState} from "react";
import {useAuth} from "../../context/authContext.jsx";

import {ToastContainer, toast, Flip} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth(); // Get login function from context



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            login({ email, password }); // Save tokens to local storage
        } catch (err) {
            toast.error('Login failed. Please check your credentials.', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Flip,
            });
        }
    };

    return (
        <div id="login" className="w-screen h-screen flex justify-center items-center md:bg-none xs:bg-[url('/src/assets/login.jpg')] xs:bg-cover">
            <div id="login-wrapper" className="2xl:w-3/5 xl:w-8/12 lg:w-9/12 md:w-11/12 xs:w-[90vw] flex justify-center items-center md:shadow-[-1px_1px_20px_0px_rgba(0,0,0,0.75)] xs:shadow-[-1px_1px_20px_10px_rgba(0,0,0,0.75)]">
                <div id="login-img" className="md:block xs:hidden relative w-1/2 z-10 after:content-['*'] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:bg-[rgba(255, 255, 255, 0.3)] after:z-50">
                    <img src="/src/assets/login.jpg" alt=""/>
                </div>
                <form id="login-form" className="md:w-1/2 xs:w-full sm:p-[1em] xs:p-[1.5em] flex flex-col" onSubmit={handleSubmit}>
                    <h1 className="my-[1em] text-6xl uppercase md:text-black xs:text-white font-bold text-center">LogIn</h1>
                    <input className="form-input mb-[1em]" type="email" placeholder="Email" value={email} name="login_email" id="login-email" onChange={(e) => setEmail(e.target.value)}  />
                    <input className="form-input mb-[1em]" type="password" placeholder="Password" value={password} name="login_password" id="login-password" onChange={(e) => setPassword(e.target.value)} />
                    <div id="login-actions" className="flex flex-col text-center">
                        <button className="form-button md:bg-none xs:bg-white" type="submit">Login</button>
                        <span className="w-full mt-1 text-sm md:text-black xs:text-white">Don't have an account ? <a className="mt-1 text-[#0f83ff] font-bold" href="/register">Create Account</a></span>
                    </div>
                </form>
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