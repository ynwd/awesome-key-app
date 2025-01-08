'use client';
import { useEffect, useState } from 'react';
import { Dialog } from '../dialog';
import Button from '../button';

export default function KeysTable() {
    const [keys, setKeys] = useState<any[]>([]);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State for edit dialog
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false); // State for create dialog
    const [selectedKey, setSelectedKey] = useState<any>(null); // Track selected key for viewing
    const [editKey, setEditKey] = useState<any>(null); // Track key being edited
    const [newKey, setNewKey] = useState<any>({ value: '' }); // Track new key data
    const [searchQuery, setSearchQuery] = useState(''); // Track search query
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const [totalPages, setTotalPages] = useState(1); // Track total pages
    const limit = 10; // Number of items per page
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/keys`;

    // View Dialog Handlers
    const handleOpenViewDialog = (key: any) => {
        setSelectedKey(key); // Set the selected key
        setIsViewDialogOpen(true); // Open the view dialog
    };

    const handleCloseViewDialog = () => {
        setIsViewDialogOpen(false);
        setSelectedKey(null); // Clear the selected key
    };

    // Edit Dialog Handlers
    const handleOpenEditDialog = (key: any) => {
        setEditKey({ ...key }); // Set the key being edited (create a copy)
        setIsEditDialogOpen(true); // Open the edit dialog
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
        setEditKey(null); // Clear the key being edited
    };

    // Create Dialog Handlers
    const handleOpenCreateDialog = () => {
        setIsCreateDialogOpen(true); // Open the create dialog
    };

    const handleCloseCreateDialog = () => {
        setIsCreateDialogOpen(false);
        setNewKey({ value: '' }); // Clear the new key data
    };

    // Delete Handler
    const handleDelete = async (id: number) => {
        const response = await fetch(`${url}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Failed to delete key");
        }
        setKeys(keys.filter((key) => key.id !== id));
    };

    // Fetch Keys with Search and Pagination
    const fetchKeys = async () => {
        try {
            const response = await fetch(
                `${url}?page=${currentPage}&limit=${limit}&value=${searchQuery}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch keys");
            }
            const res: any = await response.json();
            setKeys(res.data); // Set the table data

            // Calculate total pages
            const totalItems = res.total; // Total number of items
            const totalPages = Math.ceil(totalItems / limit); // Calculate total pages
            setTotalPages(totalPages); // Set the total number of pages
        } catch (error) {
            console.error("Error fetching keys:", error);
        }
    };

    // Handle Search Input Change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value); // Update the search query
        setCurrentPage(1); // Reset to the first page when searching
    };

    // Handle Pagination
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Handle Edit Form Submission
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${url}/${editKey.ID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editKey),
            });
            if (!response.ok) {
                throw new Error("Failed to update key");
            }
            // Update the table data
            setKeys(keys.map((key) => (key.ID === editKey.ID ? editKey : key)));
            handleCloseEditDialog(); // Close the edit dialog
        } catch (error) {
            console.error("Error updating key:", error);
        }
    };

    // Handle Create Form Submission
    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newKey),
            });
            if (!response.ok) {
                throw new Error("Failed to create key");
            }
            const createdKey = await response.json();
            setKeys([...keys, createdKey]); // Add the new key to the table
            handleCloseCreateDialog(); // Close the create dialog
        } catch (error) {
            console.error("Error creating key:", error);
        }
    };

    // Handle Input Change in Edit and Create Forms
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (isEditDialogOpen) {
            setEditKey({ ...editKey, [name]: value }); // Update the editKey state
        } else if (isCreateDialogOpen) {
            setNewKey({ ...newKey, [name]: value }); // Update the newKey state
        }
    };

    // Fetch data when searchQuery, currentPage, or keys change
    useEffect(() => {
        fetchKeys();
    }, [keys, searchQuery, currentPage]);

    return (
        <div className='flex flex-col gap-y-3'>
            {/* View Dialog */}
            <Dialog isOpen={isViewDialogOpen} onClose={handleCloseViewDialog}>
                {selectedKey && (
                    <>
                        <h2>Key Details</h2>
                        <p><strong>ID:</strong> {selectedKey.ID}</p>
                        <p><strong>Value:</strong> {selectedKey.value}</p>
                        <p><strong>Room:</strong> {selectedKey.room}</p>
                        <p><strong>Created At:</strong> {selectedKey.CreatedAt}</p>
                        <p><strong>Updated At:</strong> {selectedKey.UpdatedAt}</p>
                    </>
                )}
                <Button onClick={handleCloseViewDialog}>Close</Button>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog isOpen={isEditDialogOpen} onClose={handleCloseEditDialog}>
                {editKey && (
                    <form onSubmit={handleEditSubmit}>
                        <h2>Edit Key</h2>
                        <div className='flex gap-x-3'>
                            <label>Value:</label>
                            <input
                                type="text"
                                name="value"
                                value={editKey.value}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex gap-x-3'>
                            <Button type="submit">Save</Button>
                            <Button type="button" onClick={handleCloseEditDialog}>Cancel</Button>
                        </div>
                    </form>
                )}
            </Dialog>

            {/* Create Dialog */}
            <Dialog isOpen={isCreateDialogOpen} onClose={handleCloseCreateDialog}>
                <form onSubmit={handleCreateSubmit}>
                    <h2>Create Key</h2>
                    <div className='flex gap-x-3'>
                        <label>Value:</label>
                        <input
                            type="text"
                            name="value"
                            value={newKey.value}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='flex gap-x-3'>
                        <label>Room:</label>
                        <input
                            type="text"
                            name="room"
                            value={newKey.room}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='flex gap-x-3'>
                        <Button type="submit">Create</Button>
                        <Button type="button" onClick={handleCloseCreateDialog}>Cancel</Button>
                    </div>
                </form>
            </Dialog>

            {/* Create Button and Search Input */}
            <div className='flex justify-between gap-x-6'>
                <Button onClick={handleOpenCreateDialog}>Create</Button>
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="block px-4 py-2 w-full text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                />
            </div>

            {/* Table */}
            <table className="bg-gray-50">
                <thead className="rounded-lg text-left text-sm font-normal">
                    <tr>
                        <th className="px-4 py-5">ID</th>
                        <th className="px-4 py-5">Value</th>
                        <th className="px-4 py-5">Room</th>
                        <th className="px-4 py-5">Created At</th>
                        <th className="px-4 py-5">Updated At</th>
                        <th className="px-4 py-5">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {keys && keys.map((k: any) => (
                        <tr className="border-b py-3" key={k.ID}>
                            <td className="py-3 pl-4 pr-3">{k.ID}</td>
                            <td className="py-3 pl-4 pr-3">{k.value}</td>
                            <td className="py-3 pl-4 pr-3">{k.room}</td>
                            <td className="py-3 pl-4 pr-3">{k.CreatedAt}</td>
                            <td className="py-3 pl-4 pr-3">{k.UpdatedAt}</td>
                            <td className="py-3 pl-4 pr-3 flex gap-x-2">
                                <span className='cursor-pointer' onClick={() => handleOpenViewDialog(k)}>View</span>
                                <span className='cursor-pointer' onClick={() => handleOpenEditDialog(k)}>Edit</span>
                                <span className='cursor-pointer' onClick={() => handleDelete(k.ID)}>Delete</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className='flex justify-between'>
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}