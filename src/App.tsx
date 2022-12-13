import styled from "styled-components";
import { useForm } from "react-hook-form";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import { toDoState } from "./atoms";
import DroppableBoard from "./Components/DroppableBoard";

const Wrapper = styled.div`
  position: relative;
  padding: 100px 20px;
  box-sizing: border-box;
  text-align: center;
`;
const Form = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
`;
const Input = styled.input`
  width: 100%;
  max-width: 400px;
  height: 60px;
  padding: 0 20px;
  margin-right: 10px;
  border: 0;
  border-radius: 30px;
  background: #fff;
  box-sizing: border-box;

  @media all and (max-width: 767px) {
    max-width: 240px;
  }
`;
const PlusBtn = styled.button`
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 50%;
  background: #e1e1e1;
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
`;
const DeleteArea = styled.div<IDeleteProps>`
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 50%;
  background-color: ${(props) =>
    props.isDraggingOver ? "#ff3131" : "#e1e1e1"};
  font-size: 20px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);

  span {
    position: absolute;
  }

  @media all and (max-width: 767px) {
    bottom: 10px;
    right: 10px;
  }
`;
const Boards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0px, 1fr));
  width: 100%;
  max-width: 900px;
  gap: 10px;
  margin: 0 auto;

  @media all and (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0px, 1fr));
  }
  @media all and (max-width: 767px) {
    grid-template-columns: repeat(1, minmax(0px, 1fr));
  }
`;

interface IDeleteProps {
  isDraggingOver: boolean;
}
interface IForm {
  category: string;
}

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ category }: IForm) => {
    setToDos((allBoards) => {
      return { ...allBoards, [category]: [] };
    });
    setValue("category", "");
  };

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
        <Form onSubmit={handleSubmit(onValid)}>
          <Input
            {...register("category", { required: true })}
            type="text"
            placeholder="Add Todo Title"
          />
          <PlusBtn>+</PlusBtn>
        </Form>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <DroppableBoard
              key={boardId}
              boardId={boardId}
              toDos={toDos[boardId]}
            />
          ))}
        </Boards>
        <Droppable droppableId={"deleteIcon"}>
          {(provided, snapshot) => (
            <DeleteArea
              isDraggingOver={snapshot.isDraggingOver}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <span>🗑️</span> {provided.placeholder}
            </DeleteArea>
          )}
        </Droppable>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
