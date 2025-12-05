import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TRIPS_COLLECTION = "savedTrips";

export async function fetchSavedTrips(uid) {
  const tripsRef = collection(db, TRIPS_COLLECTION);
  const q = query(tripsRef, where("uid", "==", uid), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function deleteSavedTrip(tripId) {
  const tripRef = doc(db, TRIPS_COLLECTION, tripId);
  await deleteDoc(tripRef);
}

export async function addSavedTrip(uid, tripData) {
  const tripsRef = collection(db, TRIPS_COLLECTION);
  const now = new Date().toISOString();
  const docRef = await addDoc(tripsRef, {
    uid,
    createdAt: now,
    lastUpdated: now,
    ...tripData,
  });
  return docRef.id;
}
