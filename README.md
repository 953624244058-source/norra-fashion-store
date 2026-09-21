# NORRA Fashion — Online Ready

A complete NORRA fashion storefront + campaign + analytics + admin project.

## Local run
1. Install Node.js 20+.
2. Open this folder in VS Code.
3. In the VS Code terminal run:
   `npm.cmd install`
4. Run:
   `npm.cmd start`
5. Open `http://localhost:3000`
6. Admin: `http://localhost:3000/admin.html`
7. Demo admin password: `norra123`

## Online deployment
The project is prepared for Render + MongoDB Atlas.

1. Create a MongoDB Atlas database and copy its connection string.
2. Upload this project to a GitHub repository.
3. Create a Render Web Service from the GitHub repository.
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `ADMIN_PASSWORD` = your chosen admin password
7. Deploy. Render gives a public HTTPS URL that can be opened from mobile, desktop, or another computer.

Without MONGODB_URI, the app uses local JSON storage for testing. For a real public multi-device website, use MongoDB Atlas.
