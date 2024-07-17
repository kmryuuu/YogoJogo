import SignUpForm from "@/components/Form/SignUpForm";

const SignUp = () => {
  return (
    <div className="mt-20 flex items-center justify-center">
      <div className="flex w-full max-w-sm flex-col items-center px-4">
        <h1 className="mb-8 text-2xl font-bold">회원가입</h1>
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;
