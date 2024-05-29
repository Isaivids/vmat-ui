import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import "../../App.scss";
import { login } from "../../store/slice/userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { Toast } from "primereact/toast";
import { messages } from "../../api/constants";
const logo = require("../../assets/logo.svg").default;

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [type, setType] = useState("password")
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const toast = useRef<Toast>(null);

  const handleInputChange = (e: any) => {
    const { id, value } = e.target;
    setCredentials((prevCredentials) => ({ ...prevCredentials, [id]: value }));
  };

  const typeChange = () =>{
    if(type === 'password'){
      setType("text")
    }else{
      setType("password")
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const result: any = await dispatch(login(credentials));
      if (result.error) {
        toast.current?.show({
          severity: "error",
          summary: messages.error,
          detail: result.error.message,
          life: 3000,
        });
      } else {
        navigate("/amt");
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: messages.error,
        detail: messages.error,
        life: 3000,
      });
    }
  };

  return (
    <div className="flex h-screen">
      <Toast ref={toast} />
      <div className="flex-1 flex justify-content-center align-items-center">
        <form
          onSubmit={handleSubmit}
          className="col-8 p-4 flex flex-column gap-4"
        >
          <div className="flex-auto">
            <label htmlFor="username" className="text-pmy font-medium">
              User Name
            </label>
            <IconField className="mt-2">
              <InputIcon className="pi pi-user" />
              <InputText
                id="username"
                className="w-full"
                value={credentials.username}
                onChange={handleInputChange}
              />
            </IconField>
          </div>
          <div className="flex-auto align-items-center">
            <label htmlFor="password" className="text-pmy font-medium">
              Password
            </label>
            <IconField className="mt-2">
              <InputIcon className={type === 'text' ? "pi pi-eye-slash cursor-pointer" : "pi pi-eye cursor-pointer"} onClick={typeChange}/>
              <InputText
                id="password"
                className="w-full"
                type={type}
                value={credentials.password}
                onChange={handleInputChange}
              />
            </IconField>
          </div>
          <Button
            label="Login"
            severity="secondary"
            type="submit"
            className="bg-pmy font-semibold uppercase border-round-md"
          />
        </form>
      </div>
      <div className="flex-1 bg-pmy justify-content-center align-items-center hidden sm:flex">
        <img src={logo} alt="VMAT" className="logo-image" />
      </div>
    </div>
  );
};

export default Login;
