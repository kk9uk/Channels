import React, { useEffect, useState } from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    Box,
    Image,
    Icon,
    MenuButton,
    MenuList,
    MenuItem,
    MenuOptionGroup,
    MenuItemOption,
    Menu,
    IconButton,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter, useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import {auth, firestore} from '../../firebase/clientApp';
import { FaQuestionCircle } from 'react-icons/fa';
import { HamburgerIcon } from '@chakra-ui/icons';
import {useAuthState} from "react-firebase-hooks/auth";
//TODO: Add a Prop
//ignore all the red line now, it won't affect anything


const AdminHeader = () => {
    const router = useRouter();
    const [users, setUsers] = useState<string[]>([]);
    const [isEmailVisible, setIsEmailVisible] = useState(true);
    const [isEmailVerifiedVisible, setIsEmailVerifiedVisible] = useState(false);
    const [isOptionVisible, setIsOptionVisible] = useState(false);
    const [isEmailshowing, setIsEmailshowing] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState('');
    const cancelRef = React.useRef()
    const { isOpen, onOpen, onClose } = useDisclosure()
    // const [userAuthState] = useAuthState(auth);

    useEffect(() => {
        const fetchUsers = async () => {
            const querySnapshot = await getDocs(collection(firestore, 'users'));
            const userData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUsers(userData);
        };

        fetchUsers();
    }, [router.query]);

    const handleSuspend = (uid: string) => {
        // Handle suspend operation for the user with the given userId
    };


    const confirmDelete = async () => {
        try {
            await deleteDoc(doc(firestore, 'users', selectedUserId))
            router.reload()
            // User deleted successfully, update the state or show a success message
        } catch (error) {
            // Handle error while deleting user
            console.log("confirm Delete error:", error)
        } finally {
            onClose();
        }

    };

    const handleDelete = (uid: string) => {
        setSelectedUserId(uid);
        onOpen(); // Open the delete confirmation dialog
    };



    const handleButtonClick = (value) => {
        if (value === 'email') {
            setIsEmailshowing(true)
            setIsEmailVisible(!isEmailVisible);
        } else if (value === "!email"){
            setIsEmailshowing(false)
            setIsEmailVisible(!isEmailVisible);
        } else if (value === 'emailVerified') {
            setIsEmailVerifiedVisible(!isEmailVerifiedVisible);
        } else if (value === 'option') {
            setIsOptionVisible(!isOptionVisible);
        }
    };

    return (
        <>
            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef}  onClose={onClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete User
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete this user? This action cannot be undone.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            <Box mt={4}>
                <Table variant="simple" colorScheme="blue" bg="white">
                    <Thead>
                        <Tr>
                            <Th>icon</Th>
                            <Th>Name/Id</Th>
                            {isEmailVisible && <Th>Email</Th>}
                            {isEmailVerifiedVisible && <Th>Email Verified</Th>}
                            {isOptionVisible && <Th>Suspend</Th>}
                            {isOptionVisible && <Th>Delete</Th>}
                            <Th>
                                <Menu>
                                    <MenuButton
                                        as={IconButton}
                                        aria-label="Options"
                                        icon={<HamburgerIcon />}
                                        variant="outline"
                                    />
                                    <MenuList>
                                        <MenuOptionGroup type="checkbox">
                                            <MenuOptionGroup defaultValue='email' type="checkbox">
                                                {isEmailshowing && <MenuItemOption
                                                    value="!email"
                                                    onClick={() => handleButtonClick('!email')}
                                                >
                                                    Email
                                                </MenuItemOption>}
                                                {!isEmailshowing &&<MenuItemOption
                                                    value="email"
                                                    onClick={() => handleButtonClick('email')}
                                                >
                                                    Email
                                                </MenuItemOption>}
                                            </MenuOptionGroup>
                                                <MenuItemOption
                                                    value="emailVerified"
                                                    onClick={() => handleButtonClick('emailVerified')}
                                                >
                                                    Email Verified
                                                </MenuItemOption>
                                                <MenuItemOption
                                                    value="option"
                                                    onClick={() => handleButtonClick('option')}
                                                >
                                                    Option
                                                </MenuItemOption>

                                        </MenuOptionGroup>
                                    </MenuList>
                                </Menu>
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {users.map((user) => (
                            <Tr key={user.id}>
                                {user.photoURL ? (
                                    <Td>
                                        <Image src={user.photoURL} borderRadius="full" boxSize="50px" />
                                    </Td>
                                ) : (
                                    <Td>
                                        <Icon as={FaQuestionCircle} color="gray.300" boxSize="50px" />
                                    </Td>
                                )}


                                <Td>{user.displayName || user.id}</Td>
                                {isEmailVisible && <Td width="10%">{user.email}</Td>}
                                {isEmailVerifiedVisible && (
                                    <Td width="10%">{user.emailVerified ? 'Yes' : 'No'}</Td>
                                )}
                                {isOptionVisible && (
                                    <>
                                        <Td>
                                            <Button colorScheme="red" onClick={() => handleSuspend(user.id)}>
                                                Suspend
                                            </Button>
                                        </Td>
                                        <Td>
                                            <Button colorScheme="red" onClick={() => handleDelete(user.id)}>
                                                Delete
                                            </Button>
                                        </Td>
                                    </>
                                )}
                                <Td></Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </>
    );
};

export default AdminHeader;