import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useQuery } from "@tanstack/react-query";
import { auth } from "../Firebase/firebase";

export const useAuth = () => {
    const [user, setUser] = useState(null);
  
    const { data: authUser } = useQuery({
      queryKey: ["authUser"],
      queryFn: () =>
        new Promise((resolve) => {
          const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log(currentUser);
            setUser(currentUser);
            resolve(currentUser);
            unsubscribe();
          });
        }),
      staleTime: Infinity,
      cacheTime: Infinity,
      initialData: JSON.parse(localStorage.getItem('user')) || null,
    });
    return authUser;
  };


//   export default useAuth


// export const useAuth = () => {
//   const [loading, setLoading] = useState(true); // Tracks if auth state is still loading

//   const { data: authUser } = useQuery({
//     queryKey: ["authUser"],
//     queryFn: () =>
//       new Promise((resolve) => {
//         const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//           resolve(currentUser);
//         });
//       unsubscribe(); // Cleanup the subscription
//       }),
//     staleTime: Infinity,
//     cacheTime: Infinity,
//     initialData: null,
//   });

//   return { user: authUser, loading };
// };


// src/hooks/useAuth.ts
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { auth, db } from '../Firebase/firebase'
// import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
// import { doc, setDoc, getDoc } from 'firebase/firestore';

// interface User {
//   uid: string;
//   displayName: string | null;
//   email: string | null;
//   photoURL: string | null;
// }


// export function useAuth() {
//   const { data: user, isLoading } = useQuery({
//     queryKey: ['authUser'],
//     queryFn: () => {
//       return new Promise<User | null>((resolve) => {
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//           if (user) {
//             resolve({
//               uid: user.uid,
//               displayName: user.displayName,
//               email: user.email,
//               photoURL: user.photoURL,
//             });
//           } else {
//             resolve(null);
//           }
//           unsubscribe();
//         });
//       });
//     },
//   });

 

//   return {
//     user
//   };
// }