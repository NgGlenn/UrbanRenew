<p align="center">
  <img src="https://github.com/NgGlenn/UrbanRenew/blob/main/src/assets/UrbanRenew.png" alt="UrbanRenew Logo" width="300" height="300">
</p>
# Web App URL
https://wad2-urbanrenew.web.app/

# Members
| Team Members         | Student ID | Email                            |
| :------------------: | :--------: | :------------------------------: |
| Adrian Tok Jun Hao   |    | adrian.tok.2023@scis.smu.edu.sg  | 
| Joel Tan Yong Ern    |    | joel.tan.2023@scis.smu.edu.sg    | 
| Kng Eng Cheng, Moses |    | moses.kng.2023@scis.smu.edu.sg   | 
| Ng Jun Heng Glenn    |    | glenn.ng.2023@scis.smu.edu.sg    | 
| Shaun Nisal Peiris   |    | shaunnisalp.2023@scis.smu.edu.sg | 

# Project Overview
Homeowners currently face a tedious and time-consuming process when trying to find contractors for home renovations. The process of selecting a contractor is typically time-consuming and complicated, involving scattered information on pricing, quality of work, and project management. There is no centralised platform to easily identify potential contractors. Most rely on Google searches, which yield scattered and incomplete information, or visit the HDB website to browse a list of approved contractors. However, even with this resource, they are often left in the same situation—having to sift through a large pool of contractors and conduct further research to make informed decisions.

In addition to online searches, many homeowners turn to word-of-mouth recommendations from friends or relatives. While this can be helpful, it presents its own challenges. Renovation is often a one-time activity, and what works well for someone else might not suit their specific needs or preferences. This leaves homeowners with no guarantee of the same success, further complicating the process and adding to their stress.

## How would our web app solve the problem?
The application would provide greater transparency through expanding avenues of communication between the clients and the contractors, allowing for a more efficient renovation process. Consolidating contractor information also helps to facilitate homeowners in finding the relevant information that they require, and alleviates any concerns regarding the trustworthiness of the contractors. 

## Features
1. Customer and Contractor Profiles
   - Differentiated login pages for customers and contractors
2. Project Tracking Dashboard
   - Visual Dashboard for Project Progress and Task Management
3. Contractor Marketplace
   - A marketplace that list contractors and their expertise
4. Escrow Payment System
   - Holding of funds by a neutral third-party to ensures mutual commitment. Funds are released when project milestones are met

## Tech Stack
**Frontend:** Vue.js, styled with Bootstrap, and built with Vite

**Backend:** Firebase

**Database:** Firebase

<p align="left">
  <a href="https://vitejs.dev/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/github/explore/main/topics/vite/vite.png" alt="Vite" width="40" height="40"/>
  </a>
  <a href="https://vuejs.org/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/github/explore/main/topics/vue/vue.png" alt="Vue.js" width="40" height="40"/>
  </a>
  <a href="https://getbootstrap.com/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/github/explore/main/topics/bootstrap/bootstrap.png" alt="Bootstrap" width="40" height="40"/>
  </a>
  <a href="https://firebase.google.com/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/github/explore/main/topics/firebase/firebase.png" alt="Firebase" width="40" height="40"/>
  </a>
</p>


<!-- ## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
``` -->

## Installation Instructions

See [Vite Configuration Reference](https://vite.dev/config/).

Before you begin, ensure you have Node.js (v14.x or later), npm (v6.x or later), and Firebase CLI (v9.x or later) installed on your system. 

Start by cloning the repository to your local machine with:

```bash
https://github.com/NgGlenn/UrbanRenew.git

```

Once the repository is cloned, navigate to the project folder:
```bash
cd urbanrenew

```

Install dependencies
```bash
npm install
```

Set up a new Firebase project in the Firebase Console, configuring Firebase Authentication and Firestore Database. Create an `.env` file with Firebase configuration variables:


```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

Then, in the terminal, start the development server with:
```bash
npm run dev
```

You can now access UrbanRenew at http://localhost:5173.
