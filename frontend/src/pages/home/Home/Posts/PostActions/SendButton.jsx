import {PiMessengerLogo} from "react-icons/pi";



export default function SendButton(){



    return (
        <div className="flex items-center justify-center flex-1 py-1 hover:bg-gray-100">
            <PiMessengerLogo className="text-lg text-gray-500"/>
            <h5 className="text-sm font-semibold text-gray-500 ms-1">Send</h5>
        </div>
    )
}