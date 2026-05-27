// utils.js

// currently contains:
// - distance formatting
// - battery formatting
// - simple validation helpers
//
// more utility functions can be added later

class Utils
{
    // rounds distance nicely
    static formatDistance(distance)
    {
        return distance.toFixed(2)
            + " km";
    }

    // rounds battery nicely
    static formatBattery(value)
    {
        return value.toFixed(2)
            + " km";
    }

    // checks if value is valid number
    static isValidNumber(value)
    {
        return (
            !isNaN(value)
            &&
            value !== null
            &&
            value !== ""
        );
    }

    // simple alert helper
    static showError(message)
    {
        alert(message);
    }

    // debug helper
    static log(title, value)
    {
        console.log(
            title + " : ",
            value
        );
    }
}