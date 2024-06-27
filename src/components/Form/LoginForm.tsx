import useAuth from "@/hooks/useAuth";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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
  } = useForm<LoginFormInputs>({ mode: "onBlur" });

  const { login, error, resetError } = useAuth();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const loginSuccess = await login(data.email, data.password);
    if (loginSuccess) {
      navigate("/");
    }
  };

  const handleFocus = () => {
    resetError();
    clearErrors();
  };

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col text-sm"
      >
        <label htmlFor="email" className="sr-only">
          이메일
        </label>
        <input
          id="email"
          type="email"
          placeholder="이메일을 입력해 주세요."
          className={`form-input mb-2 border ${
            errors.email
              ? "border-red-500 placeholder:text-white"
              : "border-gray-300"
          } bg-transparent text-white placeholder:text-white`}
          {...register("email", {
            required: "이메일을 입력해 주세요.",
          })}
          onFocus={handleFocus}
        />
        {errors.email && (
          <p className="mb-4 text-red-500">{errors.email.message}</p>
        )}
        <label htmlFor="password" className="sr-only">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          placeholder="비밀번호를 입력해 주세요."
          className={`form-input border ${
            errors.password ? "border-red-500" : "border-gray-300"
          } bg-transparent text-white placeholder:text-white`}
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
        {errors.password && (
          <p className="mt-2 text-red-500">{errors.password.message}</p>
        )}
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="button-shape my-6 bg-primary font-bold text-primary-foreground"
        >
          로그인
        </button>
      </form>
    </>
  );
};

export default LoginForm;
