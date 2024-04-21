import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "delete any old files marked for deletion",
  { minutes: 1 }, // every minute
  internal.files.deleteALlFiles
);
crons.interval(
  "delete any old notification marked as seen",
  { minutes: 1 }, // every minute
  internal.notifications.deleteALlFiles
);



export default crons;