import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// 🔥 Firebase Config (Fixed Storage Bucket)
const firebaseConfig = {
    apiKey: "AIzaSyDXXXXXX-FAKE-KEYXXXXXXX",
    authDomain: "dummy-project.firebaseapp.com",
    projectId: "dummy-project-id",
    storageBucket: "dummy-project.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456",
    measurementId: "G-FAKE12345"
};


// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 🔥 DOM Elements
const menuIcon = document.getElementById("menu-icon");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("close-btn");
const updateForm = document.getElementById("update-form");
const nextPeriodText = document.getElementById("next-period");
const logPeriodBtn = document.getElementById("log-period");
const userName= document.getElementById("userName");

let userId = null;

// 🔥 Auth Listener
onAuthStateChanged(auth, async (user) => {
    if (user) {
        userId = user.uid;
        console.log("User signed in:", userId); // ✅ Debugging
        userName.innerText = `Welcome ${user.displayName}`;
        await fetchCycleData();
    } else {
        console.warn("User not signed in");
    }
});

// 🔥 Toggle Sidebar
menuIcon.addEventListener("click", () => sidebar.classList.add("active"));
closeBtn.addEventListener("click", () => sidebar.classList.remove("active"));

// 🔥 Fetch and Display Next Period Date
// 🔥 Function to Calculate Days Left & Determine Phase
async function fetchCycleData() {
    if (!userId) return;
    
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const { cycleLength, lastPeriod, periodDuration } = docSnap.data();
        
        if (cycleLength && lastPeriod) {
            const lastPeriodDate = lastPeriod.toDate ? lastPeriod.toDate() : new Date(lastPeriod);
            const today = new Date();
            const nextPeriod = new Date(lastPeriodDate);
            nextPeriod.setDate(nextPeriod.getDate() + cycleLength);
            nextPeriodText.innerText = `Next Period Date: ${nextPeriod.toISOString().split('T')[0]}`;

            // ✅ Calculate Days Left
            const daysLeft = Math.ceil((nextPeriod - today) / (1000 * 60 * 60 * 24));
            document.getElementById("days-left").innerText = `${daysLeft} Days Left`;

            // ✅ Determine Phase & Symptoms
            const cycleDay = cycleLength - daysLeft;
            let phase = "";
            let symptoms = "";

            if (cycleDay >= 0 && cycleDay < periodDuration) {
                phase = "Menstrual";
                symptoms = "Cramps, fatigue, mood swings.";
            } else if (cycleDay >= periodDuration && cycleDay < 14) {
                phase = "Follicular";
                symptoms = "Increased energy, improved mood.";
            } else if (cycleDay >= 14 && cycleDay < 16) {
                phase = "Ovulation";
                symptoms = "High energy, high pregnancy chance.";
            } else {
                phase = "Luteal";
                symptoms = "Bloating, cravings, mood changes.";
            }

            document.getElementById("phase").innerText = `Phase: ${phase}`;
            document.getElementById("symptoms").innerText = `Symptoms: ${symptoms}`;

        }
    }
}


// 🔥 Update Cycle Data
updateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const cycleLength = parseInt(document.getElementById("cycle-length").value);
    const periodDuration=parseInt(document.getElementById("period-duration").value);
    const lastPeriod = new Date();

    if (!userId) return console.error("User ID is undefined, cannot update Firestore.");

    try {
        await setDoc(doc(db, "users", userId), { cycleLength, lastPeriod, periodDuration }, { merge: true });
        console.log("Cycle data updated successfully!");
        fetchCycleData();
        sidebar.classList.remove("active");
    } catch (error) {
        console.error("Error updating cycle data:", error);
    }
});

// 🔥 Log Period Manually
logPeriodBtn.addEventListener("click", async () => {
    if (!userId) return console.error("User ID is undefined, cannot update Firestore.");

    try {
        await updateDoc(doc(db, "users", userId), { lastPeriod: new Date() });
        console.log("Period logged successfully!");
        fetchCycleData();
    } catch (error) {
        console.error("Error logging period:", error);
    }
});
