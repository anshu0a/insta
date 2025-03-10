export const mention =  function(str) {
    return str.replace(/(@\S+)/, (match) => {
        const username = match.slice(1); 
        return `<a href="/Profile/${username}">${match}</a>`;
    });
}
