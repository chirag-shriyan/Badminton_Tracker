import { auth, db } from "@/constants/firebase";
import Local_DB from "@/constants/Local_DB";
import { router } from "expo-router";
import {
    onAuthStateChanged,
    User as FirebaseUser,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { doc, getDoc, Unsubscribe } from "firebase/firestore";
import { create } from "zustand";

interface AuthStoreType {
    user: FirebaseUser | null;
    isAdmin: boolean | null;
    isLoggedIn: boolean | null;

    // Online mode (requires internet)
    getUser: () => Unsubscribe | void;
    checkIsAdmin: () => Promise<null>;
    login: (email: string, password: string) => void;
    signup: (username: string, email: string, password: string) => void;
    logout: () => void;

    // Offline mode
    getUserOffline: () => void;
}

const useAuthStore = create<AuthStoreType>((set, get) => ({
    user: null,
    isAdmin: null,
    isLoggedIn: null,
    getUser: () => {
        return onAuthStateChanged(auth, (user) => {
            if (user) {
                set(() => ({ user: user, isLoggedIn: true }));
                Local_DB.setItem("user", JSON.stringify(user));
            } else {
                set(() => ({ user: null, isLoggedIn: false }));
            }
        });
    },

    checkIsAdmin: async () => {
        const user = get().user;
        if (user) {
            try {
                const usersRef = doc(db, "admins", user.uid);
                const docSnap = await getDoc(usersRef);
                if (docSnap.exists()) {
                    set(() => ({ isAdmin: true }));
                    Local_DB.setItem("isAdmin", JSON.stringify(true));
                }
            } catch (error) {
                console.log(error);
            }
        }
        return null;
    },
    login: async (email: string, password: string) => {
        try {
            if (email.trim() !== "" && password.trim() !== "") {
                const user = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                if (user) {
                    set(() => ({ user: user.user, isLoggedIn: true }));
                    Local_DB.setItem("user", JSON.stringify(user));

                    router.replace("/");
                }
            } else if (email.trim() === "") {
                alert("email is required");
            } else if (password.trim() === "") {
                alert("password is required");
            }
        } catch (error) {
            alert(error);
        }
    },
    signup: async (username: string, email: string, password: string) => {
        try {
            if (
                username.trim() !== "" &&
                email.trim() !== "" &&
                password.trim() !== ""
            ) {
                let user = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                await updateProfile(user.user, { displayName: username });

                if (user) {
                    set(() => ({ user: auth.currentUser, isLoggedIn: true }));
                    Local_DB.setItem("user", JSON.stringify(auth.currentUser));

                    router.replace("/");
                }
            } else if (username.trim() === "") {
                alert("username is required");
            } else if (email.trim() === "") {
                alert("email is required");
            } else if (password.trim() === "") {
                alert("password is required");
            }
        } catch (error) {
            alert(error);
        }
    },
    logout: async () => {
        try {
            await signOut(auth);
            Local_DB.deleteItem("user");

            set(() => ({ user: null, isAdmin: false, isLoggedIn: false }));

            router.replace("/login");
        } catch (error) {
            alert(error);
        }
    },

    // Offline Mode

    getUserOffline: () => {
        let localUser: any = Local_DB.getItem("user");
        let localIsAdmin: any = Local_DB.getItem("isAdmin");
        if (localUser) {
            localUser = JSON.parse(localUser);
            localIsAdmin = localIsAdmin && JSON.parse(localIsAdmin);

            localIsAdmin && set(() => ({ isAdmin: localIsAdmin }));
            set(() => ({ user: localUser, isLoggedIn: true }));
        } else {
            set(() => ({ user: null, isLoggedIn: false }));
        }
    },
}));

export default useAuthStore;
