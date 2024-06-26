import useAuth from "@/hooks/useAuth";
import { SubmitHandler, useForm } from "react-hook-form";

interface SignUpFormInputs {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
    setError,
  } = useForm<SignUpFormInputs>({ mode: "onBlur" });

  const { signup, error } = useAuth();

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    const result = await signup(data.email, data.password);
    if (result === "duplicate email") {
      setError("email", {
        message: "이미 사용 중인 이메일입니다.",
      });
    }
  };

  const name = watch("name");
  const email = watch("email");
  const password = watch("password");
  const passwordConfirm = watch("passwordConfirm");
  const isAllFieldsFilled = name && email && password && passwordConfirm;

  const nameRegex = /^[a-zA-Z가-힣\s]{2,10}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col"
      >
        <label htmlFor="name">이름</label>
        <input
          id="name"
          type="text"
          placeholder="이름을 입력해 주세요."
          className="border"
          {...register("name", {
            required: "이름을 입력해 주세요.",
            pattern: {
              value: nameRegex,
              message: "이름은 2-10자 이내이어야 합니다.",
            },
            minLength: {
              value: 2,
              message: "이름은 최소 2자 이상이어야 합니다.",
            },
            maxLength: {
              value: 10,
              message: "이름은 최소 10자 이내이어야 합니다.",
            },
          })}
        />
        {errors.name && <p>{errors.name.message}</p>}
        <label htmlFor="email">이메일</label>
        <input
          id="email"
          type="email"
          placeholder="이메일을 입력해 주세요."
          className="border"
          {...register("email", {
            required: "이메일을 입력해 주세요.",
            pattern: {
              value: emailRegex,
              message: "이메일 형식에 맞지 않습니다.",
            },
          })}
        />
        {errors.email && <p>{errors.email.message}</p>}
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          type="password"
          placeholder="비밀번호를 입력해 주세요."
          className="border"
          {...register("password", {
            required: "비밀번호를 입력해 주세요.",
            pattern: {
              value: passwordRegex,
              message:
                "비밀번호는 8-16자 이내(대소문자, 숫자, 특수문자 포함)로 작성해 주세요.",
            },
            minLength: {
              value: 8,
              message: "비밀번호는 8-16자 이내이어야 합니다.",
            },
            maxLength: {
              value: 16,
              message: "비밀번호는 8-16자 이내이어야 합니다.",
            },
          })}
        />
        {errors.password && <p>{errors.password.message}</p>}
        <label htmlFor="">비밀번호 확인</label>
        <input
          id="passwordConfirm"
          type="password"
          placeholder="비밀번호를 한 번 더 입력해 주세요."
          className="border"
          {...register("passwordConfirm", {
            required: "비밀번호를 한 번 더 입력해 주세요.",
            minLength: {
              value: 8,
              message: "비밀번호는 8-16자 이내이어야 합니다.",
            },
            maxLength: {
              value: 16,
              message: "비밀번호는 8-16자 이내이어야 합니다.",
            },
            validate: {
              validate: (value) =>
                value === watch("password") || "비밀번호가 일치하지 않습니다.",
            },
          })}
        />
        {errors.passwordConfirm && <p>{errors.passwordConfirm.message}</p>}
        {error && <p>{error}</p>}
        <button
          type="submit"
          disabled={!isAllFieldsFilled || !isValid || isSubmitting}
          className={`bg-primary text-primary-foreground ${
            !isAllFieldsFilled || !isValid || isSubmitting
              ? "cursor-not-allowed bg-slate-300 text-white"
              : "cursor-pointer"
          }`}
        >
          회원가입 완료
        </button>
      </form>
    </>
  );
};
export default SignUpForm;
