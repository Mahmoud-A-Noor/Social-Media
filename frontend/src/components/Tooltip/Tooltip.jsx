// eslint-disable-next-line react/prop-types
export default function Tooltip({top="0px", left="0px", bottom="0px", right="0px", fontSize="0.9rem", tip=""}) {

    // Usage
    // just add the element inside a parent element with group class

    return (
        <div id="tooltip" style={{ fontSize }} className={`absolute cursor-auto top-[${top}] left-[${left}] bottom-[${bottom}] right-[${right}] bg-[#0b0b0bcc] rounded-md shadow-[#00000080_0px_2px_4px_0px] text-[#c8ccd3] px-2 opacity-0 transition-opacity duration-300 group-hover:delay-1000 group-hover:opacity-100 delay-0 pointer-events-none group-hover:pointer-events-auto`}>
            {tip}
        </div>
    )
}