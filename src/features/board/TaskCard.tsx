import { Card } from "@/components/ui/card";
import { useDraggable } from "@dnd-kit/core";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    assignee?: string;
    deadline?: string;
    priority?: "High" | "Medium" | "Low";
  };
  onDelete?: (id: string) => void;
}

export default function TaskCard({ task, onDelete }: TaskCardProps) {
  const { setNodeRef, listeners, attributes, transform, isDragging } = useDraggable({ id: task.id });
  const [isDeleted, setIsDeleted] = useState(false);

  const priorityColor: Record<string, string> = {
    High: "bg-gradient-to-r from-red-500 to-red-700",
    Medium: "bg-gradient-to-r from-yellow-400 to-yellow-600",
    Low: "bg-gradient-to-r from-green-400 to-green-600",
  };

  const formattedDeadline = task.deadline
    ? new Date(task.deadline).toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : null;

// Delete handler
const handleDelete = () => {
  setIsDeleted(true);
  // Only call onDelete if it exists
  setTimeout(() => onDelete?.(task.id), 200); // fade animation
};

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: transform ? `translate(${transform.x}px, ${transform.y}px) scale(${isDragging ? 1.03 : 1})` : undefined,
        transition: "transform 0.15s ease, box-shadow 0.2s ease, opacity 0.2s ease",
        opacity: isDeleted ? 0 : 1,
        touchAction: "none",
      }}
      className={`p-5 mb-4 cursor-grab bg-white text-gray-900 rounded-xl shadow-md border border-gray-200
        hover:shadow-xl hover:scale-[1.02] transition-all duration-200 ease-in-out
      `}
      role="listitem"
      tabIndex={0}
    >
      <h4 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">{task.title}</h4>

      <div className="flex justify-between items-start mb-3">
        {/* Left side: assignee + deadline */}
        <div className="flex flex-col space-y-1">
          {task.assignee && (
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs">
                {task.assignee[0].toUpperCase()}
              </div>
              <span>{task.assignee}</span>
            </div>
          )}
          {formattedDeadline && (
            <p className="text-xs text-gray-400">{formattedDeadline}</p>
          )}
        </div>

        {/* Right side: priority + delete */}
        <div className="flex items-center space-x-2">
          {task.priority && (
            <span
              className={`text-xs px-3 py-1 rounded-full text-white select-none shadow-sm ${priorityColor[task.priority]}`}
              aria-label={`Priority: ${task.priority}`}
              title={`Priority: ${task.priority}`}
            >
              {task.priority}
            </span>
          )}

          {(
            <button
              onPointerDown={(e=>e.stopPropagation())}
              onClick={handleDelete}
              className="p-1 rounded transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400 relative z-10"
              title="Delete Task"
              aria-label="Delete Task"
              type="button"
            >
              <Trash2 className="h-5 w-5 text-red-600" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
