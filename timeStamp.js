// Assuming your timestamp is a string in the format "2023-10-12T23:23:08.570+00:00"
const timestampString = "2023-10-12T23:23:08.570+00:00";

// Create a JavaScript Date object from the timestamp string
const timestampDate = new Date(timestampString);

// Define the format options
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
const dateTimeFormatter = new Intl.DateTimeFormat('en-US', options);

// Format the date as a string
const formattedTimestamp = dateTimeFormatter.format(timestampDate);

console.log(formattedTimestamp); // Output: "10/12/2023, 11:23:08 AM"
