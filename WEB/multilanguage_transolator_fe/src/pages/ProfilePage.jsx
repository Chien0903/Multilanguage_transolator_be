
import Header from "../components/Header/Header";
import SideBar from "../components/Home/SideBar";
import ProfileForm from "../components/Form/ProfileForm";

const MyProfile = () => {
  return (
    <div className="flex h-screen w-full flex-col">
      <Header />
      <div className="flex flex-1 w-full">
        <SideBar />
        <ProfileForm />
      </div>
    </div>
  );
};

export default MyProfile;