function dateFormatter(date) {
  let parsedDate = new Date(Date.parse(date));
  return parsedDate.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

Alpine.data("dateFormatter", dateFormatter);
