import ChatListPanel from "../features/chat/components/chat-list-panel"

const Sidebar = () => {
  return (
    <div className="h-screen max-w-[384px] flex-1 bg-surface">
      <ChatListPanel />
    </div>
  )
}

export default Sidebar
