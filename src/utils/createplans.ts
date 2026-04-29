export function getReadableError(err?: string): string {
  if (!err) return "Something went wrong. Please try again.";
  const e = err.toLowerCase();
  if (e.includes("title")) return "Give your plan a title.";
  if (e.includes("location") || e.includes("location_name"))
    return "Please add a location.";
  if (e.includes("datetime") || e.includes("date"))
    return "Please choose a valid date & time.";
  if (e.includes("max_people"))
    return "Invalid people limit — enter a positive number.";
  if (e.includes("cost") || e.includes("amount")) return "Invalid cost amount.";
  if (e.includes("female") || e.includes("gender"))
    return "Women-only plans can only be created by women.";
  if (e.includes("auth") || e.includes("login") || e.includes("session"))
    return "You're not logged in. Please sign in and try again.";
  if (e.includes("duplicate") || e.includes("already exists"))
    return "A plan with this title already exists.";
  if (e.includes("network") || e.includes("fetch"))
    return "Network error — check your connection and try again.";
  if (e.includes("storage") || e.includes("upload"))
    return "Image upload failed. Try a smaller image.";
  if (e.includes("permission") || e.includes("forbidden"))
    return "You don't have permission to do this.";
  return "Couldn't create plan. Please try again.";
}