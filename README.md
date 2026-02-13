📌 Smart Bookmark App <br>
A full-stack bookmark manager built with Next.js + Supabase + Google OAuth and deployed on Vercel.

🌍 Live Demo <br>
🔗<a> https://smart-bookmark-app-black.vercel.app </a>

📖 Project Overview <br>
This project is a secure bookmark manager where users can: <br>
Sign in using Google <br>
Add bookmarks (title + URL + Site logo)<br>
View personal bookmarks <br>
Delete bookmarks <br>
Get real-time updates <br>
Access their data securely from anywhere <br>
Each user can only see their own bookmarks thanks to Supabase Row Level Security (RLS). <br>


🛠 Tech Stack
| Layer           | Technology                            |
| --------------- | ------------------------------------- |
| Frontend        | Next.js (App Router) + Tailwind CSS   |
| Backend         | Supabase (Database + Auth + Realtime) |
| Authentication  | Google OAuth                          |
| Deployment      | Vercel                                |
| Version Control | Git + GitHub                          |


Problems Faced & How I Solved Them 
---------------------------------------------- 
This section explains the real learning journey while building the app.<br>
<br>
1.Google OAuth Was Confusing <br>

What happened:<br>
Google login didn’t work at first because OAuth setup involves both Google Cloud and Supabase settings.<br>
Things that confused me:<br>
Creating the OAuth consent screen<br>
Redirect URLs<br>
Difference between JavaScript Origins and Redirect URIs<br>
How I fixed it:<br>
After understanding the flow, I configured:<br>
Authorized JavaScript Origin and Authorized Redirect URI<br>
After fixing these, Google login finally worked.<br>

2.Bookmarks Not Saving to Database<br>

What happened:<br>
Clicking “Add Bookmark” didn’t show any error, but nothing was saved.<br>
Root cause:<br>
Supabase Row Level Security (RLS) was blocking inserts.<br>
How i fixed it:<br>
I created proper RLS policies to:<br>
Allow users to read their bookmarks<br>
Allow users to insert bookmarks<br>
Allow users to delete bookmarks<br>
This fixed the issue and secured the database.<br>

3.Google Login Failed After Deployment<br>

What happened:<br>
Login worked locally but failed on the live site.<br>
How i fixed it:<br>
Added the Vercel domain to:<br>
Google OAuth settings<br>
Supabase Site URL<br>
Then i changed urls.<br>


What I Learned
--------------------------------------
This project helped me understand:<br>
OAuth authentication flow<br>
Database security using RLS<br>
Deployment to production<br>
Managing environment variables<br>
Debugging real production issues<br>
