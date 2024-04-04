import React from "react";
import { useRecoilState } from "recoil";
import { Post, postState } from "../state/postState";
import { deleteObject, ref } from "firebase/storage";
import { firestore, storage } from "../firebase/clientApp";
import { deleteDoc, doc } from "firebase/firestore";

const userPosts = () => {
    const [postStateVal, setPostStateVal] = useRecoilState(postState);

    const onPushPull = async () => {};

    const onSelect = () => {};

    const onDelete = async (post: Post): Promise<boolean> => {
        try {
            // Check image exist, if yes => delete
            if (post.imageURL) {
                const imgRef= ref(storage, `posts/${post.id}/image`);
                await deleteObject(imgRef);
            }

            const postDocRef = doc(firestore, "posts", post.id!);
            await deleteDoc(postDocRef);

            setPostStateVal((prev) => ({
                ...prev,
                posts: prev.postList.filter((item) => item.id !== post.id),
            }));

            return true;
        } catch (error) {
            return false;
        }
    };

    return {
        postStateVal,
        setPostStateVal,
        onPushPull,
        onSelect,
        onDelete,
    };
};

export default userPosts;