import useAuth from "@/hooks/useAuth";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    const result = await signup(data.email, data.password);
    if (result === "duplicate email") {
      setError("email", {
        message: "이미 사용 중인 이메일입니다.",
      });
    } else {
      navigate("/");
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
        className="flex w-full flex-col text-sm"
      >
        <label htmlFor="name" className="text-fontColor-darkGray">
          이름
        </label>
        <input
          id="name"
          type="text"
          placeholder="이름을 입력해 주세요."
          className="form-input my-2 border placeholder:text-fontColor-lightGray"
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
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
        <label htmlFor="email" className="mt-4 text-fontColor-darkGray">
          이메일
        </label>
        <input
          id="email"
          type="email"
          placeholder="이메일을 입력해 주세요."
          className="form-input my-2 border placeholder:text-fontColor-lightGray"
          {...register("email", {
            required: "이메일을 입력해 주세요.",
            pattern: {
              value: emailRegex,
              message: "이메일 형식에 맞지 않습니다.",
            },
          })}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
        <label htmlFor="password" className="mt-4 text-fontColor-darkGray">
          비밀번호
        </label>
        <p className="my-2 text-xs text-fontColor-midGray">
          영문, 숫자, 특수문자를 포함하여 8-16자 이내로 입력해 주세요.
        </p>
        <input
          id="password"
          type="password"
          placeholder="비밀번호를 입력해 주세요."
          className="form-input my-2 border placeholder:text-fontColor-lightGray"
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
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
        <label
          htmlFor="passwordConfirm"
          className="mt-4 text-fontColor-darkGray"
        >
          비밀번호 확인
        </label>
        <input
          id="passwordConfirm"
          type="password"
          placeholder="비밀번호를 한 번 더 입력해 주세요."
          className="form-input my-2 border placeholder:text-fontColor-lightGray"
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
        {errors.passwordConfirm && (
          <p className="text-xs text-red-500">
            {errors.passwordConfirm.message}
          </p>
        )}
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={!isAllFieldsFilled || !isValid || isSubmitting}
          className={`bg-primary text-primary-foreground ${
            !isAllFieldsFilled || !isValid || isSubmitting
              ? "button-shape mt-8 cursor-not-allowed bg-slate-200 font-bold text-white"
              : "button-shape cursor-pointe mt-8 font-bold"
          }`}
        >
          회원가입 완료
        </button>
      </form>
    </>
  );
};
export default SignUpForm;
