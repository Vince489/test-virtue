const now = new Date();
const isoString = now.toISOString();
console.log(isoString);

// Define the format options for the current date and time
const options = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true, // Include AM/PM
};

// Create a DateTimeFormat object with the specified options
const dateFormatter = new Intl.DateTimeFormat('en-US', options);

// Format the current date and time as a string
const formattedDateAndTime = dateFormatter.format(now);

console.log(formattedDateAndTime); // Output: "10/12/2023, 07:23:08 PM"
