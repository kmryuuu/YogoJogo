import useAuth from "@/hooks/useAuth";
import { SubmitHandler, useForm } from "react-hook-form";

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<LoginFormInputs>();

  const { login, user, error, resetError } = useAuth();

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    login(data.email, data.password);
  };

  const handleFocus = () => {
    resetError();
    clearErrors();
  };

  return (
    <>
      {user ? "로그인됌" : "로그아웃됌"}
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col"
      >
        <label htmlFor="email" className="sr-only">
          이메일
        </label>
        <input
          id="email"
          type="email"
          placeholder="이메일을 입력해 주세요."
          className="border"
          {...register("email", {
            required: "이메일을 입력해 주세요.",
          })}
          onFocus={handleFocus}
        />
        {errors.email && <p>{errors.email.message}</p>}
        <label htmlFor="password" className="sr-only">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          placeholder="비밀번호를 입력해 주세요."
          className="border"
          {...register("password", {
            required: "비밀번호를 입력해 주세요.",
            minLength: {
              value: 8,
              message: "비밀번호는 8-16자 이내이어야 합니다.",
            },
            maxLength: {
              value: 16,
              message: "비밀번호는 8-16자 이내이어야 합니다.",
            },
          })}
          onFocus={handleFocus}
        />
        {errors.password && <p>{errors.password.message}</p>}
        {error && <p>{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-primary-foreground"
        >
          로그인
        </button>
      </form>
    </>
  );
};

export default LoginForm;
