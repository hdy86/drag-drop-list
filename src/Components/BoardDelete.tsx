import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";

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

interface IDeleteProps {
  isDraggingOver: boolean;
}

function BoardDelete() {
  return (
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
  );
}

export default BoardDelete;
