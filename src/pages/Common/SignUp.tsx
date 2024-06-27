import SignUpForm from "@/components/Form/SignUpForm";

const SignUp = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col items-center px-4">
        <h2 className="mb-8 text-2xl font-bold">회원가입</h2>
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;
