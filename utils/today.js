export const today = (date) => {
    const input = new Date(date);
    if (isNaN(input)) return "Invalid Date"; // Handle invalid dates

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1); // Start of yesterday

    if (input >= today && input < new Date(today.getTime() + 86400000)) {
        return "Today";
    } else if (input >= yesterday && input < today) {
        return "Yesterday";
    } else {
        const options = { month: "short", day: "numeric", year: "numeric" };
        return input.toLocaleDateString("en-US", options);
    }
};
