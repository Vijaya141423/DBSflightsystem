const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

module.exports.timingFormat = () => {
  var date = new Date();
  var year = date.getFullYear();
  const monthname = monthNames[date.getMonth()];
  //8 for this month...
  let day = weekday[date.getDay()];
  var month = String(date.getMonth() + 1).padStart(2, "0");
  var givenDate = String(date.getDate()).padStart(2, "0");
  var givenDateShowpage =
    day + ", " + monthname + " " + givenDate + ", " + year;
  var datePattern = year + "-" + month + "-" + givenDate;
  var dateTosave = givenDate + "-" + month + "-" + year;
  var monthandyear = month + "-" + year;
  const formats = {
    givenDateShowpage,
    datePattern,
    dateTosave,
    givenDate,
    month,
    year,
    monthandyear,
  };
  return formats;
};

module.exports.IST = () => {
  d = new Date();
  utc = d.getTime() + d.getTimezoneOffset() * 60000;
  nd = new Date(utc + 3600000 * +5.5);
  var ist = nd.toLocaleString();
  ist = ist.slice(10, ist.length - 6) + " " + ist.slice(19, 23);
  return ist;
};
