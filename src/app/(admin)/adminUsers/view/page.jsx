"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, CardTitle, Table, Badge } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { blockAdminUser, getAllAdminUsers, unBlockAdminUser } from "@/utils/apiCalls/auth";
import { useNotificationContext } from "@/context/useNotificationContext";
import Link from "next/link";
import IconifyIcon from '@/components/wrappers/IconifyIcon';

// import api from "@/lib/api"; // axios instance

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotificationContext();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await getAllAdminUsers(); // ✅ API: get all admin users
            setUsers(response.data.result || []);
        } catch (error) {
            console.error("❌ Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteAdminUser = async (userGuid) => {
        // confirm first
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        try {
            // const response = await api.delete(`/users?adminGuid=${userGuid}`); // ✅ API: delete admin user
            showNotification({ variant: 'success', message: 'User deleted successfully' });
            await fetchUsers(); // refresh list
        }
        catch (error) {
            console.error("❌ Failed to delete user", error);
            showNotification({ variant: 'danger', message: 'Failed to delete user' });
        }
    };

    const toggleUserStatus = async (userGuid, isActive) => {
        if (isActive) {
            try {
                const endpoint = await blockAdminUser(userGuid);
                showNotification({
                    variant: 'danger',
                    message: endpoint.data.message || 'Admin blocked successfully'
                })

                console.log("✅ Action successful", endpoint.data);
                await fetchUsers(); // refresh list
            } catch (error) {
                console.error("❌ Action failed", error);
            }
        } else {
            try {
                const endpoint = await unBlockAdminUser(userGuid);
                showNotification({
                    variant: 'success',
                    message: endpoint.data.message || 'User Un-blocked successfully'
                })

                console.log("✅ Action successful", endpoint.data);
                await fetchUsers(); // refresh list
            } catch (error) {
                console.error("❌ Action failed", error);
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="container">
            <PageTitle title="Admin Users" subName="User Management" />

            <Card className="shadow-sm">
                <CardHeader>
                    {/* <CardTitle>Admin Users List</CardTitle> */}
                </CardHeader>
                <CardBody>
                    {loading ? (
                        <p className="text-gray-500">Loading users...</p>
                    ) : (
                        <Table bordered hover responsive className="align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th>User Name</th>
                                    <th>Email</th>
                                    <th>Contact No</th>
                                    <th>Status</th>
                                    <th>Created On</th>
                                    <th className="text-center" colSpan={2}>Actions</th>
                                    <th className="text-center">View</th>
                                    <th className="text-center text-red">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.userGuid}>
                                            <td>{user.userName}</td>
                                            <td>{user.emailId}</td>
                                            <td>{user.contactNo}</td>
                                            <td>
                                                {user.status == "Active" ? (
                                                    <Badge bg="success">Active</Badge>
                                                ) : (
                                                    <Badge bg="danger">Blocked</Badge>
                                                )}
                                            </td>
                                            <td>{new Date(user.addedOn).toLocaleDateString()}</td>
                                            <td className="text-center">
                                                {/* {user.status ? ( */}
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={() => toggleUserStatus(user.userGuid, true)}
                                                >
                                                    Block
                                                </Button>
                                                {/* ) : ( */}

                                                {/* )} */}
                                            </td>
                                            <td>
                                                <Button
                                                    size="sm"
                                                    variant="outline-success"
                                                    onClick={() => toggleUserStatus(user.userGuid, false)}
                                                >
                                                    Unblock
                                                </Button>
                                            </td>
                                            <td>
                                                <Link href={`/adminUsers/create?adminGuid=${user.userGuid}`}>
                                                    <Button>
                                                        View
                                                    </Button>
                                                </Link>
                                            </td>
                                            <td className="text-center flex justify-center items-center">
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={deleteAdminUser}
                                                    className="p-1 d-flex align-items-center justify-content-center"
                                                    title="Delete"
                                                >
                                                    <IconifyIcon icon="mdi:delete-outline" width={18} height={18} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center text-muted">
                                            No admin users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

export default AdminUsersPage;
