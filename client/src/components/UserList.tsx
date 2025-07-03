interface UserListProps {
  users: string[];
}

export default function UserList({ users }: UserListProps) {
  return (
    <ul className="space-y-2">
      {users.map((u) => {
        const initials = u
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase();
        return (
          <li key={u} className="flex items-center gap-2 p-3 text-[#b9bbbe] hover:bg-[#36393f] rounded-md transition-all text-base">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-[#5865f2] rounded-full font-bold text-white text-xs shadow-md">
              {initials}
            </span>
            <span className="truncate">{u}</span>
          </li>
        );
      })}
    </ul>
  );
}