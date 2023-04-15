// the starting directory for the data
// this can be used to have multiple instances of the project data
// which can somewhat prevent the issue of accidentally overriding everything
const ROOT = "beep/"

// credientials for accessing the firebase database
// email: sprintmanager3000@gmail.com
// password: qwertyuiop321
// link: https://console.firebase.google.com/u/3/project/scrummaster3000-7ba91/database/scrummaster3000-7ba91-default-rtdb/data
const firebaseConfig = {
    apiKey: "AIzaSyB8SrA7CKr6TrdcGznR3ft3i5YdOd-5BF8",
    authDomain: "scrummaster3000-7ba91.firebaseapp.com",
    databaseURL: "https://scrummaster3000-7ba91-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "scrummaster3000-7ba91",
    storageBucket: "scrummaster3000-7ba91.appspot.com",
    messagingSenderId: "913072712982",
    appId: "1:913072712982:web:4a9b70e7024d1b7c52b437",
    measurementId: "G-JL8F2L2RMC"
};

// designates the name of the branch for tasks within the database
const TASK_FOLDER = "tasks"
const TAG_FOLDER = 'tags'
const USER_FOLDER = "users"
const SPRINT_FOLDER = "sprints"
const TEAM_MEMBER_FOLDER = "teamMembers"