import {useState} from "react";
import {useAuth} from "../../context/authContext.jsx";

import {ToastContainer, toast, Flip} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



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
                toast.error(error.msg, {
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
        }
    };

    return (
        <div id="register" className="w-screen h-screen flex justify-center items-center md:bg-none xs:bg-[url('/src/assets/register.jpg')] xs:bg-cover">
            <div id="register-wrapper"
                 className="2xl:w-3/5 xl:w-8/12 lg:w-9/12 md:w-11/12 xs:w-[90vw] flex justify-center items-center md:shadow-[-1px_1px_20px_0px_rgba(0,0,0,0.75)] xs:shadow-[-1px_1px_20px_10px_rgba(0,0,0,0.75)]">
                <form id="register-form" className="md:w-1/2 xs:w-full sm:p-[1em] xs:p-[1.5em] flex flex-col" onSubmit={handleSubmit}>
                    <h1 className="my-[1em] text-6xl uppercase md:text-black xs:text-white font-bold text-center">Register</h1>
                    <input className="form-input mb-[1em]" type="username" placeholder="Username" name="username" id="register-username" value={formData.name} onChange={handleChange}/>
                    <input className="form-input mb-[1em]" type="email" placeholder="Email" name="email" id="register-email" value={formData.name} onChange={handleChange}/>
                    <input className="form-input mb-[1em]" type="password" placeholder="Password" name="password" id="register-password" value={formData.name} onChange={handleChange}/>
                    <div id="register-actions" className="flex flex-col text-center">
                        <button className="form-button md:bg-none xs:bg-white">Register</button>
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

