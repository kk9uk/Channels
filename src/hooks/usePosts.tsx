import React from "react";
import { useRecoilState } from "recoil";
import { postState } from "../state/postState";

const userPosts = () => {
    const [postStateVal, setPostStateVal] = useRecoilState(postState);

    const onPushPull = async () => {};

    const onSelect = () => {};

    const onDelete = async () => {};

    return {
        postStateVal,
        setPostStateVal,
        onPushPull,
        onSelect,
        onDelete,
    };
};

export default userPosts;