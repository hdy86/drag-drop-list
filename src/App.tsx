import styled from "styled-components";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import { toDoState } from "./atoms";
import BoardForm from "./Components/BoardForm";
import DragDropBoards from "./Components/DragDropBoards";
import BoardDelete from "./Components/BoardDelete";

const Wrapper = styled.div`
  position: relative;
  padding: 100px 20px;
  box-sizing: border-box;
  text-align: center;
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);

  const onDragEnd = (info: DropResult) => {
    const { destination, draggableId, source } = info;

    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      // same board movement.
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return { ...allBoards, [source.droppableId]: boardCopy };
      });
    }
    if (destination?.droppableId === "deleteIcon") {
      // delete todo item.
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        boardCopy.splice(source.index, 1);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    } else if (destination.droppableId !== source.droppableId) {
      // cross board movement.
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }

    /* setToDos((oldToDos) => {
      const copyToDos = [...oldToDos];
      // 1) Delete item on source.index.
      copyToDos.splice(source.index, 1);
      // 2) Put back the item on the destination.index.
      copyToDos.splice(destination?.index, 0, draggableId);
      return copyToDos;
    }); */
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <BoardForm />
        <DragDropBoards />
        <BoardDelete />
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
