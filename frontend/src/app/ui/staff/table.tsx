'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog } from '../dialog';
import Button from '../button';
import fetchData from '@/app/lib/fetch';

type Staff = {
    ID: number,
    role: string,
    status: string
}

export default function StaffTable(props: {
    data: Staff[]
    total: number
    page: number
}) {

    const [d, setD] = useState<Staff[]>(props.data);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State for edit dialog
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false); // State for create dialog
    const [selectedStaff, setSelectedStaff] = useState<any>(null); // Track selected row data for viewing
    const [editStaff, setEditStaff] = useState<any>(null); // Track row data being edited
    const [newStaff, setNewStaff] = useState<any>({ role: '', status: '' }); // Track new staff data
    const [searchQuery, setSearchQuery] = useState(''); // Track search query
    const [currentPage, setCurrentPage] = useState(props.page); // Track current page
    const [totalPages, setTotalPages] = useState(1); // Track total pages
    const limit = 10; // Number of items per page
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/staff`;

    useEffect(() => {
        const totalItems = props.total;
        const t = Math.ceil(totalItems / limit);
        setTotalPages(t)
        setD(d)
    }, [d, currentPage])

    // View Dialog Handlers
    const handleOpenViewDialog = (staff: any) => {
        setSelectedStaff(staff);
        setIsViewDialogOpen(true);
    };

    const handleCloseViewDialog = () => {
        setIsViewDialogOpen(false);
        setSelectedStaff(null);
    };

    // Edit Dialog Handlers
    const handleOpenEditDialog = (staff: any) => {
        setEditStaff({ ...staff });
        setIsEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
        setEditStaff(null); // Clear the row data being edited
    };

    // Create Dialog Handlers
    const handleOpenCreateDialog = () => {
        setIsCreateDialogOpen(true); // Open the create dialog
    };

    const handleCloseCreateDialog = () => {
        setIsCreateDialogOpen(false);
        setNewStaff({ role: '', status: '' }); // Clear the new staff data
    };

    // Delete Handler
    const handleDelete = async (id: number) => {
        const response = await fetch(`${url}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Failed to delete key");
        }
        setD(d.filter((key) => key.ID !== id));
    };

    // Handle Search Input Change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value); // Update the search query
        setCurrentPage(1); // Reset to the first page when searching
    };


    const handleNextPage = async () => {
        if (currentPage < totalPages) {
            const page = currentPage + 1
            setCurrentPage(page);
            const x = await fetchData(url, page, limit, searchQuery)
            setD(x.data)
        }
    };

    const handlePreviousPage = async () => {
        if (currentPage > 1) {
            const page = currentPage - 1
            setCurrentPage(page);
            const x = await fetchData(url, page, limit, searchQuery)
            setD(x.data)
        }
    };

    // Handle Edit Form Submission
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${url}/${editStaff.ID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editStaff),
            });
            if (!response.ok) {
                throw new Error("Failed to update staff");
            }
            // Update the table data
            setD(d.map((staff) => (staff.ID === editStaff.ID ? editStaff : staff)));
            handleCloseEditDialog(); // Close the edit dialog
        } catch (error) {
            console.error("Error updating staff:", error);
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
                body: JSON.stringify(newStaff),
            });
            if (!response.ok) {
                throw new Error("Failed to create staff");
            }
            const createdStaff = await response.json();
            setD([...d, createdStaff]); // Add the new staff to the table
            handleCloseCreateDialog(); // Close the create dialog
        } catch (error) {
            console.error("Error creating staff:", error);
        }
    };

    // Handle Input Change in Edit and Create Forms
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (isEditDialogOpen) {
            setEditStaff({ ...editStaff, [name]: value }); // Update the editStaff state
        } else if (isCreateDialogOpen) {
            setNewStaff({ ...newStaff, [name]: value }); // Update the newStaff state
        }
    };

    return (
        <div className='flex flex-col gap-y-3'>
            {/* View Dialog */}
            <Dialog isOpen={isViewDialogOpen} onClose={handleCloseViewDialog}>
                {selectedStaff && (
                    <>
                        <h2>Staff Details</h2>
                        <p><strong>ID:</strong> {selectedStaff.ID}</p>
                        <p><strong>Role:</strong> {selectedStaff.role}</p>
                        <p><strong>Status:</strong> {selectedStaff.status}</p>
                        <p><strong>Created At:</strong> {selectedStaff.CreatedAt}</p>
                        <p><strong>Updated At:</strong> {selectedStaff.UpdatedAt}</p>
                    </>
                )}
                <Button onClick={handleCloseViewDialog}>Close</Button>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog isOpen={isEditDialogOpen} onClose={handleCloseEditDialog}>
                {editStaff && (
                    <form onSubmit={handleEditSubmit}>
                        <h2>Edit Staff</h2>
                        <div className='flex gap-x-3'>
                            <label>Role:</label>
                            <input
                                type="text"
                                name="role"
                                value={editStaff.role}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex gap-x-3'>
                            <label>Status:</label>
                            <input
                                type="text"
                                name="status"
                                value={editStaff.status}
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
                    <h2>Create Staff</h2>
                    <div className='flex gap-x-3'>
                        <label>Role:</label>
                        <input
                            type="text"
                            name="role"
                            value={newStaff.role}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='flex gap-x-3'>
                        <label>Status:</label>
                        <input
                            type="text"
                            name="status"
                            value={newStaff.status}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='flex gap-x-3'>
                        <button type="submit">Create</button>
                        <button type="button" onClick={handleCloseCreateDialog}>Cancel</button>
                    </div>
                </form>
            </Dialog>

            {/* Create Button and Search Input */}
            <div className='flex justify-between gap-x-6'>
                <Button onClick={handleOpenCreateDialog}>Create</Button>
                <input type="text" id="first_name"
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
                        <th className="px-4 py-5">Role</th>
                        <th className="px-4 py-5">Status</th>
                        <th className="px-4 py-5">Created At</th>
                        <th className="px-4 py-5">Updated At</th>
                        <th className="px-4 py-5">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {d && d.map((k: any) => (
                        <tr className="border-b py-3" key={k.ID}>
                            <td className="py-3 pl-4 pr-3">{k.ID}</td>
                            <td className="py-3 pl-4 pr-3">{k.role}</td>
                            <td className="py-3 pl-4 pr-3">{k.status}</td>
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