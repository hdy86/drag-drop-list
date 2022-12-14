import styled from "styled-components";
import { useForm } from "react-hook-form";
import { Droppable } from "react-beautiful-dnd";
import DragabbleCard from "./DragabbleCard";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 400px;
  background-color: ${(props) => props.theme.boardColor};
  padding: 20px 10px;
  border-radius: 5px;
`;
const DeleteBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background: #8ebbf6;
  font-size: 16px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
`;
const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 20px;
  font-size: 18px;
`;

const Area = styled.div<IAreaProps>`
  flex-grow: 1;
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#b2bec3"
      : props.isDraggingFromThis
      ? "#dfe6e9"
      : "transparent"};
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease-in-out;
`;

const Form = styled.form`
  width: 100%;
  margin-bottom: 10px;
`;
const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid #8ebbf6;
  border-radius: 5px;
`;

interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}
interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}
interface IForm {
  toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
    });
    setValue("toDo", "");
  };
  const onDeleteCategory = () => {
    setToDos((allBoards) => {
      const boardCopy = { ...allBoards };
      delete boardCopy[boardId];
      return boardCopy;
    });
  };

  return (
    <Wrapper>
      <DeleteBtn onClick={onDeleteCategory}>X</DeleteBtn>
      <Title>{boardId}</Title>

      <Form onSubmit={handleSubmit(onValid)}>
        <Input
          {...register("toDo", { required: true })}
          type="text"
          placeholder={`Add task on ${boardId}`}
        />
      </Form>

      <Droppable droppableId={boardId}>
        {(provided, snapshot) => (
          <Area
            isDraggingOver={snapshot.isDraggingOver}
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DragabbleCard
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDoText={toDo.text}
              />
            ))}
            {provided.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;
