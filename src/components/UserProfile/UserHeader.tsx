import React, { useEffect, useState } from "react";
import firebase from "firebase/compat";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

const UserHeader: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <div>
            {user ? (
                <p>Welcome, {user.displayName}</p>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};

export default UserHeader;