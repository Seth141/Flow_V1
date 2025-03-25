import { createClient } from '@/utils/supabase/server';
import AddTaskButton from '@/components/KanbanBoard/AddTaskButton';

export default async function BoardPage({ params }) {
  const { board_id } = await params;
  const supabase = await createClient();
  // 26 14 3 3 3 2 1 1 1
  // fetch board data (boards -> columns -> cards)
  const { data: board } = await supabase
    .from('boards')
    .select('*, columns(*, cards(*))')
    .eq('id', board_id)
    .single();

  // use later when designing the board
  const {
    id: boardId,
    name: boardName,
    description: boardDescription,
  } = board || {};

  const columns = board?.columns || [];

  return (
    <div className="overflow-x-scroll overflow-y-hidden pt-8 pl-8">
      <div className="flex gap-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="bg-[rgba(41,18,68,0.61)] rounded-[15px] w-[300px] min-w-[300px] flex-none p-[10px] mr-2 
  shadow-lg shadow-[0_4px_6px_rgba(54,51,51,0.804),0_8px_12px_rgba(175,163,163,0.777),inset_0_1px_0_rgba(233,22,22,0.1)]
  flex flex-col h-fit max-h-[calc(100vh-120px)]"
          >
            <h2 className="pb-4">{column.title}</h2>
            {column.cards.map((card) => (
              <div
                key={card.id}
                className="bg-gradient-to-br from-[rgba(44,42,42,0.728)] to-[rgba(227,221,221,0)] 
  backdrop-blur-[70px] border border-[rgba(255,255,255,0.18)]
  shadow-[0_4px_6px_rgba(0,0,0,0.2),0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]
  rounded-[10px] p-[15px] mb-3 cursor-grab w-[260px] h-auto
  font-['Inter',sans-serif] text-white transition-all duration-200 ease-in-out
  hover:translate-y-[-2px] hover:bg-gradient-to-br hover:from-[rgba(54,52,52,0.728)] hover:to-[rgba(227,221,221,0)]
  hover:shadow-[0_6px_12px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.2)]
  hover:border-[rgba(255,255,255,0.25)]"
              >
                {card.title}
              </div>
            ))}
            <AddTaskButton columnId={column.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
