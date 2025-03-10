export const am_pm = (time) => {
    if (!time) return ''; 

    const currentTime = new Date(time);

    if (isNaN(currentTime)) return ''; 

    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes; 
    // const formattedSeconds = seconds < 10 ? '0' + seconds : seconds; 
    
    const timeString = `${hours}:${formattedMinutes} ${ampm}`;
    
    return timeString;
};
