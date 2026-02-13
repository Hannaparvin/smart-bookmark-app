📌 Smart Bookmark App <br>
A full-stack bookmark manager built with Next.js + Supabase + Google OAuth and deployed on Vercel.

🌍 Live Demo /n
🔗<a> https://smart-bookmark-app-black.vercel.app </a>

📖 Project Overview /n
This project is a secure bookmark manager where users can: /n
Sign in using Google /n
Add bookmarks (title + URL + Site logo)/n
View personal bookmarks /n
Delete bookmarks /n
Get real-time updates /n
Access their data securely from anywhere /n
Each user can only see their own bookmarks thanks to Supabase Row Level Security (RLS). /n


🛠 Tech Stack
| Layer           | Technology                            |
| --------------- | ------------------------------------- |
| Frontend        | Next.js (App Router) + Tailwind CSS   |
| Backend         | Supabase (Database + Auth + Realtime) |
| Authentication  | Google OAuth                          |
| Deployment      | Vercel                                |
| Version Control | Git + GitHub                          |


Problems Faced & How I Solved Them /n
---------------------------------------------- /n
This section explains the real learning journey while building the app.
<br>
1.Google OAuth Was Confusing /n

What happened:
Google login didn’t work at first because OAuth setup involves both Google Cloud and Supabase settings.
Things that confused me:
Creating the OAuth consent screen
Redirect URLs
Difference between JavaScript Origins and Redirect URIs
How I fixed it:
After understanding the flow, I configured:
Authorized JavaScript Origin and Authorized Redirect URI
After fixing these, Google login finally worked.

2.Bookmarks Not Saving to Database

What happened:
Clicking “Add Bookmark” didn’t show any error, but nothing was saved.
Root cause:
Supabase Row Level Security (RLS) was blocking inserts.
How i fixed it:
I created proper RLS policies to:
Allow users to read their bookmarks
Allow users to insert bookmarks
Allow users to delete bookmarks
This fixed the issue and secured the database.

3.Google Login Failed After Deployment

What happened:
Login worked locally but failed on the live site.
Root cause:
Production domain wasn’t added to OAuth settings.
How i fixed it:
Added the Vercel domain to:
Google OAuth settings
Supabase Site URL
Then i changed urls.


What I Learned
--------------------------------------
This project helped me understand:
OAuth authentication flow
Database security using RLS
Deployment to production
Managing environment variables
Debugging real production issues
