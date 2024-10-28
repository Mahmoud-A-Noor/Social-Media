export default function Register() {
    return (
        <div id="register" className="w-screen h-screen flex justify-center items-center md:bg-none xs:bg-[url('/src/assets/register.jpg')] xs:bg-cover">
            <div id="register-wrapper" className="2xl:w-3/5 xl:w-8/12 lg:w-9/12 md:w-11/12 xs:w-[90vw] flex justify-center items-center md:shadow-[-1px_1px_20px_0px_rgba(0,0,0,0.75)] xs:shadow-[-1px_1px_20px_10px_rgba(0,0,0,0.75)]">
                <div id="login-img" className="md:block xs:hidden relative w-1/2 z-10 after:content-['*'] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:bg-[rgba(255, 255, 255, 0.3)] after:z-50">
                    <img src="/src/assets/register.jpg" alt=""/>
                </div>
                <div id="register-form" className="md:w-1/2 xs:w-full sm:p-[1em] xs:p-[1.5em] flex flex-col">
                    <h1 className="my-[1em] text-6xl uppercase md:text-black xs:text-white font-bold text-center">Register</h1>
                    <input className="form-input mb-[1em]" type="email" placeholder="Email" name="login_email" id="login-email" />
                    <input className="form-input mb-[1em]" type="password" placeholder="Password" name="login_password" id="login-password" />
                    <div id="register-actions" className="flex flex-col text-center">
                        <button className="form-button md:bg-none xs:bg-white">Login</button>
                        <span className="mt-1 text-sm w-full md:text-black xs:text-white">Have an account ? <a className="mt-1 text-[#0f83ff] font-bold" href="/login">Login</a></span>
                    </div>
                </div>
            </div>
        </div>
    )
}

