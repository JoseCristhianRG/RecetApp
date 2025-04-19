import React, { useEffect, useState, useContext } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { AuthContext } from '../../AuthContext';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function fetchUsers() {
      const snap = await getDocs(collection(db, 'users'));
      setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    await updateDoc(doc(db, 'users', userId), { role: newRole });
    setUsers(users => users.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  if (loading) return <div>Cargando usuarios...</div>;

  return (
    <div className="p-6 py-3">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Rol</th>
            <th className="p-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2">
                {u.role !== 'admin' && (
                  <button
                    onClick={() => handleRoleChange(u.id, 'admin')}
                    className="px-2 py-1 bg-pantonegreen text-white rounded mr-2"
                  >
                    Hacer admin
                  </button>
                )}
                {u.role !== 'user' && (
                  <button
                    onClick={() => handleRoleChange(u.id, 'user')}
                    className="px-2 py-1 bg-pantoneyellow text-pantoneblack rounded"
                  >
                    Hacer usuario
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersPage;
