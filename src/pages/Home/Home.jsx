import { ChatWindow, Chats, Sidebar } from "../../Components";
import "./home.scss";

const Home = () => {
  return (
    <div className="home-page">
      <Sidebar />
      <Chats />
      <ChatWindow />
    </div>
  );
};

export default Home;
