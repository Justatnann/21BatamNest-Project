function submitForm(selectedDate, endPoint) {
  let myEnd = `${endPoint}`;
  const existingQuery = window.location.search;
  if (!existingQuery) {
    endPoint += "/filter?date=" + selectedDate;
  } else {
    endPoint += "&date=" + selectedDate;
  }
  // You can add any necessary validation or modification here before submission
  window.location.href = myEnd;
}

document.addEventListener("DOMContentLoaded", function () {
  Alpine.data("submitForm", () => ({
    submitForm,
  }));
});
