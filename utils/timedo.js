export const timedo = (time) => {
    const postTime = new Date(time);
    const currentTime = new Date();
    const timeDifference = currentTime - postTime;

    const seconds = Math.floor((timeDifference / 1000) % 60);
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));

    if (years > 0) {
        return `${years} ${years === 1 ? "year" : "years"} `;
    } else if (days > 0) {
        return `${days} ${days === 1 ? "day" : "days"} `;
    } else if (hours > 0) {
        return `${hours} ${hours === 1 ? "hr" : "hrs"} `;
    } else if (minutes > 0) {
        return `${minutes} ${minutes === 1 ? "min" : "mins"} `;
    } else {
        return `${seconds} ${seconds === 1 ? "sec" : "secs"} `;
    }
};