import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { createBoard, setActiveBoard, deleteBoard } from "@/features/boards/boardSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrashIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Sidebar() {
  const dispatch = useDispatch();
  const boards = useSelector((state: RootState) => state.boards.boards);
  const activeBoardId = useSelector(
    (state: RootState) => state.boards.activeBoardId
  );

  const [collapsed, setCollapsed] = useState(true);
  const [newBoardName, setNewBoardName] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false); // For mobile drawer

  const handleCreateBoard = () => {
    if (!newBoardName.trim()) return;
    dispatch(createBoard(newBoardName));
    setNewBoardName("");
    setCollapsed(false); // keep dropdown open
  };

  const handleDeleteBoard = (boardId: string) => {
    dispatch(deleteBoard(boardId));
  };

  return (
    <>
      {/* Mobile toggle button */}
      <div className="sm:hidden p-2">
        <button
          className="p-2 rounded bg-gray-200"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar container */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-white border-r p-4 z-50
          transform transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
          sm:translate-x-0 sm:static sm:w-64 sm:block
          w-64
        `}
      >
        {/* Boards heading */}
        <div
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => setCollapsed(!collapsed)}
        >
          <h2 className="font-semibold text-lg">Boards</h2>
          <span className="sm:hidden">{collapsed ? "+" : "-"}</span>
        </div>

        {/* Collapsible board list */}
        {!collapsed && (
          <div className="space-y-2">
            {boards.length > 0 ? (
              boards.map((board) => (
                <div
                  key={board.id}
                  className={`flex justify-between items-center p-2 rounded cursor-pointer hover:bg-muted ${
                    board.id === activeBoardId ? "bg-blue-100 font-medium" : ""
                  }`}
                >
                  <span
                    className="flex-1"
                    onClick={() => {
                      dispatch(setActiveBoard(board.id));
                      setMobileOpen(false); // close sidebar on mobile when selecting a board
                    }}
                  >
                    {board.name}
                  </span>
                  <TrashIcon
                    className="h-4 w-4 text-red-500 cursor-pointer ml-2"
                    onClick={() => handleDeleteBoard(board.id)}
                  />
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No boards yet</p>
            )}

            {/* Divider + create board */}
            <div className="pt-2 border-t mt-2 space-y-2">
              <Input
                placeholder="New Board Name"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
              />
              <Button size="sm" className="w-full" onClick={handleCreateBoard}>
                Create Board
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Optional overlay when mobile sidebar is open */}
      {mobileOpen && <div className="fixed inset-0 bg-black opacity-30 z-40 sm:hidden" onClick={() => setMobileOpen(false)} />}
    </>
  );
}
