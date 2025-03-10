export default function Comment({width , color}) {
    return (<>
        <svg width={width} viewBox="0 0 26 26" >
            <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke={color?color:"black"} strokeLinejoin="round" strokeWidth="2" />
        </svg>
    </>)
}