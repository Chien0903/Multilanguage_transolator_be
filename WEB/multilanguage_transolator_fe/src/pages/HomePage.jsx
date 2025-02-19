
import Header from "../components/Header/Header";
import SideBar from "../components/Home/SideBar";
import TranslationPanel from "../components/Home/TranslationPanel";

const HomePage = () => {
    return (
        <div className="flex h-screen w-full flex-col">
      <Header />
      <div className="flex flex-1 w-full">
        <SideBar />
        <div className="flex-1 flex flex-col items-center justify-center bg-white p-6">
          <TranslationPanel />
        </div>
      </div>
    </div>
    );
};

export default HomePage;