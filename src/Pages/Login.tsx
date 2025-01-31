// import { useMutation } from "@tanstack/react-query";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../Firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, setDoc } from "firebase/firestore";


const baseUrl = process.env.REACT_APP_BASE_URL;
export default function Login() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const loginMutation = useMutation({
        mutationFn: async () => {
            const result = await signInWithPopup(auth, googleProvider);
            // const user = result.user as User;
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
                localStorage.setItem("user", JSON.stringify(data))
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
        <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-gray-50">
            <div className="flex flex-col justify-center items-center flex-1 bg-white p-10 text-center">
                <h1 className="text-3xl font-bold text-purple-700 flex items-center gap-2">
                    <span>📋</span> TaskBuddy
                </h1>
                <p className="text-gray-500 mt-2 max-w-xs">
                    Streamline your workflow and track progress effortlessly with our all-in-one task management app.
                </p>
                <button
                    className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 mt-6 shadow-lg"
                    onClick={handleLogin}
                >
                    <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 256 262"
                    >
                        <path
                            fill="#4285F4"
                            d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                        />
                        <path
                            fill="#34A853"
                            d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                        />
                        <path
                            fill="#FBBC05"
                            d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                        />
                        <path
                            fill="#EB4335"
                            d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                        />
                    </svg>
                    Continue with Google
                </button>


            </div>

            <div className="flex-1 flex items-center justify-center p-4">
                <img
                    src={`${baseUrl}/assets/taskPage.png`} // Dynamically construct the URL
                    className="w-full max-w-3xl max-h-full object-contain shadow-lg rounded-lg"
                    alt="Task Board"
                />
            </div>
        </div>


    );
}


