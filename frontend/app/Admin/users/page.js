'use client';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function UserManagement() {
  const { user, token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'ROLE_ADMIN') {
      router.push('/login');
    } else {
      fetchUsers();
    }
  }, [user, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:8080/users/admin', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/users/admin/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleUpdate = (id) => {
    router.push(`/admin/users/update/${id}`);
  };

  const handleCreateUser = () => {
    router.push('./createUser'); // navigate to create user page
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={handleCreateUser}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Create User
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{u.id}</td>
              <td className="py-2 px-4 border-b">{u.username}</td>
              <td className="py-2 px-4 border-b">{u.role}</td>
              <td className="py-2 px-4 border-b space-x-2">
                <button
                  onClick={() => handleUpdate(u.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
