import styled from "styled-components";
import { useRecoilState } from "recoil";
import { toDoState } from "../atoms";
import DroppableBoard from "./DroppableBoard";

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

function DragDropList() {
  const [toDos, setToDos] = useRecoilState(toDoState);

  return (
    <Boards>
      {Object.keys(toDos).map((boardId) => (
        <DroppableBoard
          key={boardId}
          boardId={boardId}
          toDos={toDos[boardId]}
        />
      ))}
    </Boards>
  );
}
export default DragDropList;
