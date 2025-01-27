// import { useMutation } from "@tanstack/react-query";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider,db } from "../Firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFirestore, doc, setDoc } from "firebase/firestore";


export default function Login() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const loginMutation = useMutation({
        mutationFn: async () => {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user as User;
            return result.user;
        },
        onSuccess: async (user) => {
            queryClient.setQueryData(['authUser'], user);
            navigate("/home");
            try {
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    lastLogin: new Date(),
                });
                let data = {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    lastLogin: new Date(),
                }
             localStorage.setItem("user",JSON.stringify(data))
            } catch (error) {
                console.error("Error saving user data to Firestore:", error);
            }
            navigate("/home");
        },
        onError: (error) => {
            console.error(`Error: ${error.message}`);
        },
    });

    const handleLogin = () => {
        loginMutation.mutate();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white-50">
            <h2 className="text-2xl font-bold mb-4">Welcome to Kanban</h2>
            <button
                onClick={handleLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded"
                disabled={loginMutation.isLoading}
            >
                {loginMutation.isLoading ? "Signing in..." : "Sign in with Google"}
            </button>
        </div>
    );
}
