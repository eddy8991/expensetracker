export const getLast7Days = () => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    result.push({
      day: daysOfWeek[date.getDay()],
      date: date.toISOString().split("T")[0],
      income: 0,
      expense: 0,
    });
  }
  return result.reverse();
  // returns an array of all the previous 7 days
};

export const getLast12Months = () => {
  const monthsOfYear = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const result = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    const monthName = monthsOfYear[date.getMonth()];
    const shortYear = date.getFullYear().toString().slice(-2);
    const formattedMonthYear = `${monthName} ${shortYear}`; // Jan 24, Feb 25
    const formattedDate = date.toISOString().split("T")[0];

    result.push({
      month: formattedMonthYear,
      fullDate: formattedDate,
      income: 0,
      expense: 0,
    });
  }

  // return result;
  return result.reverse();
};

export const getYearsRange = (startYear: number, endYear: number): any => {
  const result = [];
  for (let year = startYear; year <= endYear; year++) {
    result.push({
      year: year.toString(),
      fullDate: `01-01-${year}`,
      income: 0,
      expense: 0,
    });
  }
  // return result;
  return result.reverse();
};






// "firebaseApiKey": "AIzaSyB6DPrkMCuuU2om_jDGuovSuWb1ddCfxtk",
// "firebaseAuthDomain": "expensetracker-3ab7c.firebaseapp.com",
// "firebaseProjectId": "expensetracker-3ab7c",
// "firebaseStorageBucket": "expensetracker-3ab7c.firebasestorage.app",
// "firebaseMessagingSenderId": "717595371091",
// "firebaseAppId": "1:717595371091:web:7e3e73304dfdc069ae48a6",
// "firebaseMeasurementId": "G-DR7YSMFD17",
// "cloudinaryCloudName": "dcacejyme",
// "cloudinaryUploadPreset": "images",