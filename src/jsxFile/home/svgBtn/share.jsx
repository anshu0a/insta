export default function share({width , color}) {
    return (<>
        <svg viewBox="0 -2 25 25" width={width}>
            <line fill="none" stroke={color?color:"black"} strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083" />
            <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke={color?color:"black"} strokeLinejoin="round" strokeWidth="2" />
        </svg>
    </>)
}