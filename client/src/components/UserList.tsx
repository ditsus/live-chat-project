interface UserListProps {
  users: string[];
}

export default function UserList({ users }: UserListProps) {
  return (
    <ul className="space-y-2">
      {users.map((u) => (
        <li key={u} className="p-2 text-gray-300 hover:bg-gray-700 rounded">
          # {u}
        </li>
      ))}
    </ul>
  );
}