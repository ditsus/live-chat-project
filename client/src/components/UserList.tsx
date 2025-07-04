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
          <li key={u} className="flex items-center gap-3 p-3 text-[#b9bbbe] hover:bg-gradient-to-r hover:from-[#5865f2]/10 hover:to-[#404eed]/10 rounded-xl transition-all text-base shadow-sm group">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#5865f2] to-[#404eed] rounded-full font-bold text-white text-sm shadow-md border-2 border-[#23272a] group-hover:ring-2 group-hover:ring-[#5865f2]/40 transition-all">
              {initials}
            </span>
            <span className="truncate font-medium group-hover:text-white transition-all">{u}</span>
          </li>
        );
      })}
    </ul>
  );
}