import { useEffect } from "react";
import { auth } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUp = () => {
  useEffect(() => {
    createUserWithEmailAndPassword(auth, "test@test.com", "12341234");
  }, []);

  return <div>SignUp</div>;
};

export default SignUp;
