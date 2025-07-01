interface UserListProps { users: string[]; }

export default function UserList({ users }: UserListProps) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1rem' }}>
      {users.map(u => <li key={u}>{u}</li>)}
    </ul>
  );
}