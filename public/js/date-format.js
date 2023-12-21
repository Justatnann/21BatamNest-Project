function dateFormatter(dateString) {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleString("en-US");
  return date;
}

Alpine.data("dateFormatter", dateFormatter);
