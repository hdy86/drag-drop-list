import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { toDoState } from "../atoms";

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

interface IForm {
  category: string;
}

function BoardForm() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ category }: IForm) => {
    setToDos((allBoards) => {
      return { ...allBoards, [category]: [] };
    });
    setValue("category", "");
  };

  return (
    <Form onSubmit={handleSubmit(onValid)}>
      <Input
        {...register("category", { required: true })}
        type="text"
        placeholder="Add Todo Title"
      />
      <PlusBtn>+</PlusBtn>
    </Form>
  );
}

export default BoardForm;
