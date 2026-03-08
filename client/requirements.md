## Packages
date-fns | Needed for calculating next maintenance dates and formatting dates nicely
clsx | Needed for standard Shadcn UI utility merging
tailwind-merge | Needed for standard Shadcn UI utility merging

## Notes
The backend provides a dashboard stats endpoint at /api/dashboard/stats which I'm using for the traffic lights.
I'm calculating specific "Next Maintenance" dates on the frontend using date-fns and `lastCompletedDate` + `frequencyDays`.
Stock images are not used since this is an internal industrial dashboard where clean data visualization is preferred.
