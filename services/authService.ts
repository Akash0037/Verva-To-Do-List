// Firebase authentication service
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    updateProfile,
    User as FirebaseUser
} from "firebase/auth";
import { auth, googleProvider } from "./firebaseConfig";
import { User } from "../types";

// Convert Firebase User to App User
const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
    id: firebaseUser.uid,
    name: firebaseUser.displayName || "User",
    email: firebaseUser.email || "",
    photoURL: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || "User")}&background=059669&color=fff`
});

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, name: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update profile with display name
    await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=059669&color=fff`
    });

    return mapFirebaseUser(userCredential.user);
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return mapFirebaseUser(userCredential.user);
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<User> => {
    const result = await signInWithPopup(auth, googleProvider);
    return mapFirebaseUser(result.user);
};

// Sign out
export const signOutUser = async (): Promise<void> => {
    await signOut(auth);
};

// Subscribe to auth state changes
export const onAuthChange = (callback: (user: User | null) => void): (() => void) => {
    return onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
            callback(mapFirebaseUser(firebaseUser));
        } else {
            callback(null);
        }
    });
};
