'use client';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    if (user?.username && token) {
      fetch(`http://localhost:8080/users/profile/${user.username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch profile');
          }
          return res.json();
        })
        .then((data) => setProfile(data))
        .catch((err) => console.error(err));
    }
  }, [user, token, router]);

  if (!profile) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-xl font-bold mb-4">User Profile</h1>
      <div className="space-y-2">
        <p><span className="font-medium">Username:</span> {profile.username}</p>
        <p><span className="font-medium">Full Name:</span> {profile.fullName}</p>
        <p><span className="font-medium">Email:</span> {profile.email}</p>
        <p><span className="font-medium">Role:</span> {profile.role}</p>
        <p><span className="font-medium">Service Type:</span> {profile.serviceType}</p>
        <p><span className="font-medium">Address:</span> {profile.address}</p>
        <p><span className="font-medium">Phone:</span> {profile.phone}</p>
        <p><span className="font-medium">Available:</span> {profile.available ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}
