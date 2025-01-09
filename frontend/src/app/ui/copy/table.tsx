'use client';
import { useEffect, useState } from 'react';
import { Dialog } from '../dialog';
import Button from '../button';
import fetchData from '@/app/lib/fetch';

export default function CopiesTable(props: {
    data: any[]
    total: number
    page: number
}) {
    const [copies, setCopies] = useState<any[]>(props.data);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State for edit dialog
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false); // State for create dialog
    const [selectedCopy, setSelectedCopy] = useState<any>(null); // Track selected copy for viewing
    const [editCopy, setEditCopy] = useState<any>(null); // Track copy being edited
    const [newCopy, setNewCopy] = useState<any>({ key_id: '', staff_id: '', status: '' }); // Track new copy data
    const [searchQuery, setSearchQuery] = useState(''); // Track search query
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const [totalPages, setTotalPages] = useState(1); // Track total pages
    const limit = 10; // Number of items per page
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/copies`;

    // View Dialog Handlers
    const handleOpenViewDialog = (copy: any) => {
        setSelectedCopy(copy); // Set the selected copy
        setIsViewDialogOpen(true); // Open the view dialog
    };

    const handleCloseViewDialog = () => {
        setIsViewDialogOpen(false);
        setSelectedCopy(null); // Clear the selected copy
    };

    // Edit Dialog Handlers
    const handleOpenEditDialog = (copy: any) => {
        setEditCopy({ ...copy }); // Set the copy being edited (create a copy)
        setIsEditDialogOpen(true); // Open the edit dialog
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
        setEditCopy(null); // Clear the copy being edited
    };

    // Create Dialog Handlers
    const handleOpenCreateDialog = () => {
        setIsCreateDialogOpen(true); // Open the create dialog
    };

    const handleCloseCreateDialog = () => {
        setIsCreateDialogOpen(false);
        setNewCopy({ value: '', staff_Id: '', status: '' }); // Clear the new copy data
    };

    // Delete Handler
    const handleDelete = async (id: number) => {
        const response = await fetch(`${url}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Failed to delete copy");
        }
        setCopies(copies.filter((copy) => copy.ID !== id));
    };

    // Handle Search Input Change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value); // Update the search query
        setCurrentPage(1); // Reset to the first page when searching
    };

    useEffect(() => {
        const totalItems = props.total;
        const t = Math.ceil(totalItems / limit);
        setTotalPages(t)
        setCopies(copies)
    }, [copies, currentPage])

    const handleNextPage = async () => {
        if (currentPage < totalPages) {
            const page = currentPage + 1
            setCurrentPage(page);
            const x = await fetchData(url, page, limit, searchQuery)
            setCopies(x.data)
        }
    };

    const handlePreviousPage = async () => {
        if (currentPage > 1) {
            const page = currentPage - 1
            setCurrentPage(page);
            const x = await fetchData(url, page, limit, searchQuery)
            setCopies(x.data)
        }
    };

    // Handle Edit Form Submission
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            editCopy.staff_id = Number(editCopy.staff_id)
            editCopy.key_id = Number(editCopy.key_id)
            const response = await fetch(`${url}/${editCopy.ID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editCopy),
            });
            if (!response.ok) {
                throw new Error("Failed to update copy");
            }
            // Update the table data
            setCopies(copies.map((copy) => (copy.ID === editCopy.ID ? editCopy : copy)));
            handleCloseEditDialog(); // Close the edit dialog
        } catch (error) {
            console.error("Error updating copy:", error);
        }
    };

    // Handle Create Form Submission
    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            newCopy.staff_id = Number(newCopy.staff_id)
            newCopy.key_id = Number(newCopy.key_id)
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newCopy),
            });
            if (!response.ok) {
                throw new Error("Failed to create copy");
            }
            const createdCopy = await response.json();
            setCopies([...copies, createdCopy]); // Add the new copy to the table
            handleCloseCreateDialog(); // Close the create dialog
        } catch (error) {
            console.error("Error creating copy:", error);
        }
    };

    // Handle Input Change in Edit and Create Forms
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (isEditDialogOpen) {
            setEditCopy({ ...editCopy, [name]: value }); // Update the editCopy state
        } else if (isCreateDialogOpen) {
            setNewCopy({ ...newCopy, [name]: value }); // Update the newCopy state
        }
    };

    return (
        <div className='flex flex-col gap-y-3'>
            {/* View Dialog */}
            <Dialog isOpen={isViewDialogOpen} onClose={handleCloseViewDialog}>
                {selectedCopy && (
                    <>
                        <h2>Copy Details</h2>
                        <p><strong>ID:</strong> {selectedCopy.ID}</p>
                        <p><strong>Value:</strong> {selectedCopy.value}</p>
                        <p><strong>Room:</strong> {selectedCopy.room}</p>
                        <p><strong>Staff:</strong> {selectedCopy.staff.role}</p>
                        <p><strong>Status:</strong> {selectedCopy.status}</p>
                        <p><strong>Created At:</strong> {selectedCopy.CreatedAt}</p>
                        <p><strong>Updated At:</strong> {selectedCopy.UpdatedAt}</p>
                    </>
                )}
                <Button onClick={handleCloseViewDialog}>Close</Button>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog isOpen={isEditDialogOpen} onClose={handleCloseEditDialog}>
                {editCopy && (
                    <form onSubmit={handleEditSubmit}>
                        <h2>Edit Copy</h2>
                        <div className='flex gap-x-3'>
                            <label>Key ID:</label>
                            <input
                                disabled
                                type="text"
                                name="key_id"
                                value={editCopy.key_id}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex gap-x-3'>
                            <label>Staff ID:</label>
                            <input
                                type="text"
                                name="staff_id"
                                value={editCopy.staff_id}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex gap-x-3'>
                            <label>Status:</label>
                            <input
                                type="text"
                                name="status"
                                value={editCopy.status}
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
                    <h2>Create Copy</h2>
                    <div className='flex gap-x-3'>
                        <label>Key ID:</label>
                        <input
                            type="text"
                            name="key_id"
                            value={newCopy.key_id}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='flex gap-x-3'>
                        <label>Staff ID:</label>
                        <input
                            type="text"
                            name="staff_id"
                            value={newCopy.staff_id}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='flex gap-x-3'>
                        <label>Status:</label>
                        <input
                            type="text"
                            name="status"
                            value={newCopy.status}
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
                        <th className="px-4 py-5">Staff</th>
                        <th className="px-4 py-5">Status</th>
                        <th className="px-4 py-5">Created At</th>
                        <th className="px-4 py-5">Updated At</th>
                        <th className="px-4 py-5">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {copies && copies.map((k: any) => {
                        if (k.ID) return <tr className="border-b py-3" key={k.ID}>
                            <td className="py-3 pl-4 pr-3">{k.ID}</td>
                            <td className="py-3 pl-4 pr-3">{k.value}</td>
                            <td className="py-3 pl-4 pr-3">{k.room}</td>
                            <td className="py-3 pl-4 pr-3">{k.staff.role}</td>
                            <td className="py-3 pl-4 pr-3">{k.status}</td>
                            <td className="py-3 pl-4 pr-3">{k.CreatedAt}</td>
                            <td className="py-3 pl-4 pr-3">{k.UpdatedAt}</td>
                            <td className="py-3 pl-4 pr-3 flex gap-x-2">
                                <span className='cursor-pointer' onClick={() => handleOpenViewDialog(k)}>View</span>
                                <span className='cursor-pointer' onClick={() => handleOpenEditDialog(k)}>Edit</span>
                                <span className='cursor-pointer' onClick={() => handleDelete(k.ID)}>Delete</span>
                            </td>
                        </tr>
                    })}
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